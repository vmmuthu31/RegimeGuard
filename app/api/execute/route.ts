import { NextResponse } from "next/server";
import { getWeexConfig } from "@/server/config";
import {
  TRADING_PAIRS,
  TradingPair,
  StopLossAdjustment,
  RiskLevel,
  OrderSide,
  PositionSide,
  StrategyType,
  RegimeType,
} from "@/shared/constants";
import { getCandles, getTicker } from "@/server/services/weex-client";
import {
  getAccountAssets,
  type AssetBalance,
} from "@/server/services/weex-account";
import { runTradingPipeline, getOrchestratorState } from "@/server/agents";
import { openLong, openShort } from "@/server/services/weex-trade";
import {
  uploadAiLog,
  createRegimeClassificationLog,
  createRiskDecisionLog,
  createTradeExecutionLog,
} from "@/server/services/weex-ailog";
import {
  analyzeMarketConditions,
  generateTradeExplanation,
  isGroqAvailable,
} from "@/server/services/groq-ai";
import {
  createTrade,
  logAiDecision,
  isSupabaseConfigured,
} from "@/server/services/database";
import type { TradeSignal } from "@/shared/types";

interface ExecutionResult {
  symbol: TradingPair;
  decision: ReturnType<typeof runTradingPipeline>;
  execution: {
    executed: boolean;
    orderId: string | null;
    error: string | null;
  };
  aiLogs: {
    regimeLog: boolean;
    riskLog: boolean;
    tradeLog: boolean;
  };
  aiAnalysis: Awaited<ReturnType<typeof analyzeMarketConditions>> | null;
  timestamp: number;
}

export async function POST(request: Request) {
  try {
    const config = getWeexConfig();
    const body = await request.json();

    const symbolParam = body.symbol;
    const symbol: TradingPair = TRADING_PAIRS.includes(
      symbolParam as TradingPair
    )
      ? (symbolParam as TradingPair)
      : "cmt_btcusdt";

    const dryRun = body.dryRun !== false;
    const basePositionSize = body.positionSize || 0.01;

    const [candles, ticker, balances] = await Promise.all([
      getCandles(symbol, "1m", 100),
      getTicker(symbol),
      getAccountAssets(config).catch(() => []),
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
    const currentPrice = ticker.last;

    const decision = runTradingPipeline(
      symbol,
      candles,
      [],
      balance,
      basePositionSize
    );

    let aiAnalysis = null;
    if (isGroqAvailable()) {
      aiAnalysis = await analyzeMarketConditions({
        symbol,
        currentPrice,
        regime: decision.regime,
        indicators: decision.indicators,
        volatilityStatus: {
          spikeDetected: !decision.volatilityOk,
          anomalyDetected: false,
          currentVolatility: decision.indicators.volatility,
        },
      });
    }

    const aiLogs = { regimeLog: false, riskLog: false, tradeLog: false };

    try {
      const regimeLog = createRegimeClassificationLog(
        null,
        {
          symbol,
          rsi: decision.indicators.rsi,
          ema9: decision.indicators.ema9,
          ema21: decision.indicators.ema21,
          atr: decision.indicators.atr,
          volatility: decision.indicators.volatility,
          momentum: decision.indicators.momentum,
        },
        {
          regime: decision.regime.regime,
          confidence: decision.regime.confidence,
          strategy: decision.signal?.strategy || "NO_TRADE",
        },
        decision.agentContributions.regime
      );
      await uploadAiLog(config, regimeLog);
      aiLogs.regimeLog = true;
    } catch {}

    try {
      const riskLog = createRiskDecisionLog(
        null,
        {
          symbol,
          regime: decision.regime.regime,
          regimeConfidence: decision.regime.confidence,
          currentVolatility: decision.indicators.volatility,
          recentDrawdown: 0,
          dailyLossPercent: 0,
        },
        {
          positionSizeMultiplier: 1,
          stopLossAdjustment: "NORMAL",
          tradeSuspended: !decision.riskApproved,
          riskLevel: decision.riskApproved ? "LOW" : "HIGH",
        },
        decision.agentContributions.risk
      );
      await uploadAiLog(config, riskLog);
      aiLogs.riskLog = true;
    } catch {}

    const execution = {
      executed: false,
      orderId: null as string | null,
      error: null as string | null,
    };

    if (
      decision.action !== "HOLD" &&
      decision.signal &&
      decision.riskApproved &&
      decision.volatilityOk
    ) {
      if (dryRun) {
        execution.error =
          "DRY_RUN_MODE - Trade signal generated but not executed";
      } else {
        try {
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

          execution.executed = true;
          execution.orderId = orderResult.orderId;

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

          try {
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
            await uploadAiLog(config, tradeLog);
            aiLogs.tradeLog = true;

            if (isSupabaseConfigured()) {
              const userId = body.userId || "anonymous";
              await createTrade({
                userId,
                symbol,
                side: signal.side === "BUY" ? OrderSide.BUY : OrderSide.SELL,
                positionSide:
                  signal.side === "BUY"
                    ? PositionSide.LONG
                    : PositionSide.SHORT,
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
                userId,
                symbol,
                type: "TRADE",
                regime: decision.regime.regime as RegimeType,
                confidence: decision.regime.confidence,
                riskLevel: decision.riskApproved
                  ? RiskLevel.LOW
                  : RiskLevel.HIGH,
                decision: { action: decision.action, signal },
                explanation,
                indicators: decision.indicators,
              }).catch(() => {});
            }
          } catch {}
        } catch (err) {
          execution.error =
            err instanceof Error ? err.message : "Order execution failed";
        }
      }
    }

    const result: ExecutionResult = {
      symbol,
      decision,
      execution,
      aiLogs,
      aiAnalysis,
      timestamp: Date.now(),
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  switch (action) {
    case "status": {
      const orchestratorState = getOrchestratorState();
      return NextResponse.json({
        success: true,
        data: {
          orchestrator: {
            isRunning: orchestratorState.isRunning,
            lastDecision: orchestratorState.lastDecision,
          },
          timestamp: Date.now(),
        },
      });
    }

    default: {
      return NextResponse.json({
        success: true,
        data: {
          description: "RegimeGuard Automated Trading Pipeline",
          endpoints: {
            "POST /api/execute": {
              description:
                "Run complete trading pipeline and optionally execute",
              body: {
                symbol: "cmt_btcusdt (default)",
                dryRun: "true (default) - set false to execute real trades",
                positionSize: "0.01 (default) - base position size",
              },
            },
            "GET /api/execute?action=status": "Get orchestrator status",
          },
          flow: [
            "1. Fetch market data (candles, ticker)",
            "2. Run regime classification",
            "3. Evaluate risk parameters",
            "4. Monitor volatility",
            "5. Generate trade signal",
            "6. Execute trade (if approved and dryRun=false)",
            "7. Upload AI logs to WEEX",
          ],
        },
      });
    }
  }
}
