import {
  type TradingPair,
  StopLossAdjustment,
  RiskLevel,
  OrderSide,
  PositionSide,
  StrategyType,
  RegimeType,
} from "@/shared/constants";
import { getWeexConfig } from "@/server/config";
import { getCandles, getTicker } from "@/server/services/weex-client";
import {
  getAccountAssets,
  getAllPositions,
  type AssetBalance,
  type PositionInfo,
} from "@/server/services/weex-account";
import { runTradingPipeline } from "@/server/agents";
import { openLong, openShort } from "@/server/services/weex-trade";
import {
  uploadAiLog,
  createTradeExecutionLog,
} from "@/server/services/weex-ailog";
import {
  generateTradeExplanation,
  isGroqAvailable,
} from "@/server/services/groq-ai";
import {
  createTrade,
  logAiDecision,
  isSupabaseConfigured,
} from "@/server/services/database";
import type { TradingDecision, TradeSignal } from "@/shared/types";

interface TradingLoopConfig {
  symbols: TradingPair[];
  intervalMs: number;
  enabled: boolean;
  dryRun: boolean;
  basePositionSize: number;
  maxConcurrentTrades: number;
}

interface TradingLoopState {
  isRunning: boolean;
  lastRun: number;
  cycleCount: number;
  tradesExecuted: number;
  errors: string[];
  lastDecisions: Map<TradingPair, TradingDecision>;
}

const DEFAULT_CONFIG: TradingLoopConfig = {
  symbols: ["cmt_btcusdt", "cmt_ethusdt"],
  intervalMs: 15000, // 15s interval for "Live" feel
  enabled: false,
  dryRun: false, // LIVE TRADING ENABLED
  basePositionSize: 0.00005, // ~$5 per trade at $100k BTC
  maxConcurrentTrades: 2, // Max $10 total exposure
};

// Use globalThis to persist state across hot reloads in Next.js development
const globalForTradingLoop = globalThis as unknown as {
  _tradingLoopState: TradingLoopState | undefined;
};

if (!globalForTradingLoop._tradingLoopState) {
  globalForTradingLoop._tradingLoopState = {
    isRunning: false,
    lastRun: 0,
    cycleCount: 0,
    tradesExecuted: 0,
    errors: [],
    lastDecisions: new Map(),
  };
}

let loopState = globalForTradingLoop._tradingLoopState;

let loopConfig = { ...DEFAULT_CONFIG };
let loopInterval: NodeJS.Timeout | null = null;

export function getLoopConfig(): TradingLoopConfig {
  return { ...loopConfig };
}

export function getLoopState(): {
  isRunning: boolean;
  lastRun: number;
  cycleCount: number;
  tradesExecuted: number;
  errors: string[];
  lastDecisions: Record<string, TradingDecision>;
} {
  return {
    isRunning: loopState.isRunning,
    lastRun: loopState.lastRun,
    cycleCount: loopState.cycleCount,
    tradesExecuted: loopState.tradesExecuted,
    errors: loopState.errors,
    lastDecisions: Object.fromEntries(loopState.lastDecisions),
  };
}

export function updateLoopConfig(
  updates: Partial<TradingLoopConfig>
): TradingLoopConfig {
  loopConfig = { ...loopConfig, ...updates };
  return loopConfig;
}

export async function runSingleCycle(): Promise<{
  decisions: Map<TradingPair, TradingDecision>;
  executed: number;
  errors: string[];
}> {
  const decisions = new Map<TradingPair, TradingDecision>();
  const errors: string[] = [];
  let executed = 0;

  let config;
  try {
    config = getWeexConfig();
  } catch {
    errors.push("WEEX API credentials not configured");
    return { decisions, executed, errors };
  }

  const [balances, allPositions] = await Promise.all([
    getAccountAssets(config).catch(() => []),
    getAllPositions(config).catch(() => []),
  ]);

  const assetBalance = balances.find(
    (b: AssetBalance) => b.coinName === "USDT"
  );
  const balance = assetBalance
    ? {
        coinName: assetBalance.coinName,
        available: parseFloat(assetBalance.available),
        equity: parseFloat(assetBalance.equity),
        frozen: parseFloat(assetBalance.frozen),
        unrealizedPnl: parseFloat(assetBalance.unrealizePnl),
      }
    : null;
  const openPositionSymbols = new Set(
    allPositions.map((p: PositionInfo) => p.symbol)
  );

  for (const symbol of loopConfig.symbols) {
    try {
      if (openPositionSymbols.size >= loopConfig.maxConcurrentTrades) {
        continue;
      }

      if (openPositionSymbols.has(symbol)) {
        continue;
      }

      const [candles] = await Promise.all([
        getCandles(symbol, "1m", 100),
        getTicker(symbol),
      ]);

      const decision = runTradingPipeline(
        symbol,
        candles,
        [],
        balance,
        loopConfig.basePositionSize
      );

      decisions.set(symbol, decision);
      loopState.lastDecisions.set(symbol, decision);

      if (
        decision.action !== "HOLD" &&
        decision.signal &&
        decision.riskApproved &&
        decision.volatilityOk &&
        !loopConfig.dryRun
      ) {
        const signal = decision.signal as TradeSignal;

        const orderResult =
          signal.side === "BUY"
            ? await openLong(config, symbol, signal.size.toString(), {
                isMarket: true,
                stopLossPrice: signal.stopLoss.toString(),
                takeProfitPrice: signal.takeProfit.toString(),
              })
            : await openShort(config, symbol, signal.size.toString(), {
                isMarket: true,
                stopLossPrice: signal.stopLoss.toString(),
                takeProfitPrice: signal.takeProfit.toString(),
              });

        executed++;

        let explanation = decision.explanation;
        if (isGroqAvailable()) {
          explanation = await generateTradeExplanation({
            symbol,
            signal,
            regime: decision.regime,
            riskDecision: {
              positionSizeMultiplier: 1,
              stopLossAdjustment: StopLossAdjustment.NORMAL,
              tradeCooldownActive: false,
              tradeSuspended: false,
              riskLevel: RiskLevel.LOW,
              explanation: "",
              timestamp: Date.now(),
            },
          });
        }

        const tradeLog = createTradeExecutionLog(
          parseInt(orderResult.orderId),
          {
            symbol,
            regime: decision.regime.regime,
            strategy: signal.strategy,
            entryPrice: signal.entryPrice,
            indicators: {
              rsi: decision.indicators.rsi,
              ema9: decision.indicators.ema9,
              ema21: decision.indicators.ema21,
            },
          },
          {
            side: signal.side,
            size: signal.size,
            stopLoss: signal.stopLoss,
            takeProfit: signal.takeProfit,
            confidence: signal.confidence,
          },
          explanation
        );
        await uploadAiLog(config, tradeLog).catch(() => {});

        if (isSupabaseConfigured()) {
          await createTrade({
            userId: "system",
            symbol,
            side: signal.side === "BUY" ? OrderSide.BUY : OrderSide.SELL,
            positionSide:
              signal.side === "BUY" ? PositionSide.LONG : PositionSide.SHORT,
            strategy: signal.strategy as StrategyType,
            regime: decision.regime.regime as RegimeType,
            entryPrice: signal.entryPrice,
            size: signal.size,
            leverage: 5,
            stopLoss: signal.stopLoss,
            takeProfit: signal.takeProfit,
            confidence: signal.confidence,
            explanation,
            orderId: orderResult.orderId,
          }).catch(() => {});

          await logAiDecision({
            userId: "system",
            symbol,
            type: "TRADE",
            regime: decision.regime.regime as RegimeType,
            confidence: decision.regime.confidence,
            riskLevel: decision.riskApproved ? RiskLevel.LOW : RiskLevel.HIGH,
            decision: {
              action: decision.action,
              signal: signal,
            },
            explanation,
            indicators: decision.indicators,
          }).catch(() => {});
        }
      }
    } catch (err) {
      errors.push(
        `${symbol}: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  }

  return { decisions, executed, errors };
}

async function tradingLoopTick(): Promise<void> {
  if (!loopState.isRunning) return;

  loopState.cycleCount++;
  loopState.lastRun = Date.now();

  const result = await runSingleCycle();

  loopState.tradesExecuted += result.executed;
  loopState.errors = result.errors.slice(-10);
}

export function startTradingLoop(): boolean {
  if (loopState.isRunning) return false;
  if (!loopConfig.enabled) return false;

  loopState.isRunning = true;
  loopState.errors = [];

  tradingLoopTick();

  loopInterval = setInterval(() => {
    tradingLoopTick();
  }, loopConfig.intervalMs);

  return true;
}

export function stopTradingLoop(): boolean {
  if (!loopState.isRunning) return false;

  loopState.isRunning = false;

  if (loopInterval) {
    clearInterval(loopInterval);
    loopInterval = null;
  }

  return true;
}

export function resetLoopState(): void {
  stopTradingLoop();
  loopState = {
    isRunning: false,
    lastRun: 0,
    cycleCount: 0,
    tradesExecuted: 0,
    errors: [],
    lastDecisions: new Map(),
  };
}
