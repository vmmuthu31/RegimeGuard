import type {
  OrchestratorState,
  TradingDecision,
  AgentMessage,
  AgentState,
} from "@/shared/types";
import { type TradingPair, RegimeType } from "@/shared/constants";
import type { Candle, Position, AccountBalance } from "@/shared/types";
import { computeTechnicalIndicators } from "../services/regime-classifier";
import {
  initRegimeAgent,
  analyzeRegime,
  getRegimeAgentState,
} from "./regime-agent";
import {
  initRiskAgent,
  evaluateTradeRisk,
  getRiskAgentState,
} from "./risk-agent";
import {
  initVolatilityAgent,
  monitorVolatility,
  getVolatilityAgentState,
  isKillSwitchActive,
} from "./volatility-agent";
import {
  initStrategyAgent,
  generateStrategy,
  getStrategyAgentState,
} from "./strategy-agent";

interface OrchestratorContext {
  regimeAgent: ReturnType<typeof initRegimeAgent>;
  riskAgent: ReturnType<typeof initRiskAgent>;
  volatilityAgent: ReturnType<typeof initVolatilityAgent>;
  strategyAgent: ReturnType<typeof initStrategyAgent>;
  isRunning: boolean;
  decisionHistory: TradingDecision[];
  allMessages: AgentMessage[];
}

// Use globalThis to persist state across hot reloads in Next.js development
const globalForOrchestrator = globalThis as unknown as {
  _orchestratorContext: OrchestratorContext | undefined;
};

export function initOrchestrator(): OrchestratorContext {
  const ctx = {
    regimeAgent: initRegimeAgent(),
    riskAgent: initRiskAgent(),
    volatilityAgent: initVolatilityAgent(),
    strategyAgent: initStrategyAgent(),
    isRunning: true,
    decisionHistory: [],
    allMessages: [],
  };
  globalForOrchestrator._orchestratorContext = ctx;
  return ctx;
}

export function getOrchestrator(): OrchestratorContext {
  if (!globalForOrchestrator._orchestratorContext) {
    return initOrchestrator();
  }
  return globalForOrchestrator._orchestratorContext;
}

export function runTradingPipeline(
  symbol: TradingPair,
  candles: Candle[],
  positions: Position[],
  balance: AccountBalance | null,
  basePositionSize: number = 0.01
): TradingDecision {
  const ctx = getOrchestrator();

  const currentPrice = candles[candles.length - 1]?.close || 0;
  const indicators = computeTechnicalIndicators(candles);

  const volatilityResult = monitorVolatility(ctx.volatilityAgent, candles);
  ctx.volatilityAgent = volatilityResult.context;
  ctx.allMessages.push(...volatilityResult.context.messageLog.slice(-1));

  if (isKillSwitchActive(ctx.volatilityAgent)) {
    const decision = createHoldDecision(
      symbol,
      "KILL_SWITCH_ACTIVE",
      ctx,
      indicators
    );
    ctx.decisionHistory.push(decision);
    return decision;
  }

  const regimeResult = analyzeRegime(ctx.regimeAgent, candles);
  ctx.regimeAgent = regimeResult.context;
  ctx.allMessages.push(...regimeResult.context.messageLog.slice(-1));

  const riskResult = evaluateTradeRisk(
    ctx.riskAgent,
    regimeResult.output.classification,
    volatilityResult.output.status.currentVolatility,
    positions,
    balance,
    basePositionSize,
    currentPrice
  );
  ctx.riskAgent = riskResult.context;
  ctx.allMessages.push(...riskResult.context.messageLog.slice(-1));

  const strategyResult = generateStrategy(
    ctx.strategyAgent,
    symbol,
    regimeResult.output.classification,
    indicators,
    currentPrice,
    riskResult.output.approved,
    riskResult.output.adjustedSize
  );
  ctx.strategyAgent = strategyResult.context;
  ctx.allMessages.push(...strategyResult.context.messageLog.slice(-1));

  const decision = createTradingDecision(
    symbol,
    regimeResult,
    riskResult,
    volatilityResult,
    strategyResult,
    indicators
  );

  ctx.decisionHistory.push(decision);

  if (ctx.decisionHistory.length > 100) {
    ctx.decisionHistory = ctx.decisionHistory.slice(-100);
  }
  if (ctx.allMessages.length > 500) {
    ctx.allMessages = ctx.allMessages.slice(-500);
  }

  return decision;
}

function createTradingDecision(
  symbol: TradingPair,
  regimeResult: ReturnType<typeof analyzeRegime>,
  riskResult: ReturnType<typeof evaluateTradeRisk>,
  volatilityResult: ReturnType<typeof monitorVolatility>,
  strategyResult: ReturnType<typeof generateStrategy>,
  indicators: ReturnType<typeof computeTechnicalIndicators>
): TradingDecision {
  const signal = strategyResult.output.signal;

  let action: TradingDecision["action"] = "HOLD";
  if (signal) {
    action = signal.side === "BUY" ? "BUY" : "SELL";
  }

  return {
    id: `decision_${Date.now()}`,
    symbol,
    action,
    signal,
    regime: regimeResult.output.classification,
    riskApproved: riskResult.output.approved,
    volatilityOk: volatilityResult.output.alertLevel === "NORMAL",
    explanation: generateExplanation(
      regimeResult,
      riskResult,
      volatilityResult,
      strategyResult
    ),
    agentContributions: {
      regime: regimeResult.output.recommendation,
      risk: riskResult.output.decision.explanation,
      volatility: `Alert level: ${volatilityResult.output.alertLevel}`,
      strategy: strategyResult.output.reasoning,
    },
    indicators: {
      atr: indicators.atr,
      ema9: indicators.ema9,
      ema21: indicators.ema21,
      rsi: indicators.rsi,
      volatility: indicators.volatility,
      momentum: indicators.momentum,
      trendStrength: indicators.trendStrength,
    },
    timestamp: Date.now(),
  };
}

function createHoldDecision(
  symbol: TradingPair,
  reason: string,
  ctx: OrchestratorContext,
  indicators: ReturnType<typeof computeTechnicalIndicators>
): TradingDecision {
  const regimeState = getRegimeAgentState(ctx.regimeAgent);

  return {
    id: `decision_${Date.now()}`,
    symbol,
    action: "HOLD",
    signal: null,
    regime: {
      regime: RegimeType.HIGH_VOLATILITY,
      confidence: 0,
      features: { momentum: 0, volatility: 1, trendStrength: 0 },
      timestamp: Date.now(),
    },
    riskApproved: false,
    volatilityOk: false,
    explanation: `Trading suspended: ${reason}. Volatility Guard has activated the kill switch to protect capital.`,
    agentContributions: {
      regime: regimeState.lastAction,
      risk: "Trading suspended",
      volatility: "KILL SWITCH ACTIVE",
      strategy: "No signals generated during suspension",
    },
    indicators: {
      atr: indicators.atr,
      ema9: indicators.ema9,
      ema21: indicators.ema21,
      rsi: indicators.rsi,
      volatility: indicators.volatility,
      momentum: indicators.momentum,
      trendStrength: indicators.trendStrength,
    },
    timestamp: Date.now(),
  };
}

function generateExplanation(
  regimeResult: ReturnType<typeof analyzeRegime>,
  riskResult: ReturnType<typeof evaluateTradeRisk>,
  volatilityResult: ReturnType<typeof monitorVolatility>,
  strategyResult: ReturnType<typeof generateStrategy>
): string {
  const parts: string[] = [];

  parts.push(
    `Market regime: ${regimeResult.output.classification.regime} (${(
      regimeResult.output.classification.confidence * 100
    ).toFixed(0)}% confidence).`
  );

  if (volatilityResult.output.alertLevel !== "NORMAL") {
    parts.push(`Volatility alert: ${volatilityResult.output.alertLevel}.`);
  }

  if (riskResult.output.approved) {
    parts.push(
      `Risk approved with ${(
        riskResult.output.decision.positionSizeMultiplier * 100
      ).toFixed(0)}% position sizing.`
    );
  } else {
    parts.push(
      `Risk agent blocked trade: ${riskResult.output.decision.explanation}`
    );
  }

  if (strategyResult.output.signal) {
    parts.push(
      `Strategy: ${strategyResult.output.signal.strategy} ${strategyResult.output.signal.side} signal generated.`
    );
  } else {
    parts.push("No trading signal generated.");
  }

  return parts.join(" ");
}

export function getOrchestratorState(): OrchestratorState {
  const ctx = getOrchestrator();

  return {
    isRunning: ctx.isRunning,
    agents: [
      getRegimeAgentState(ctx.regimeAgent),
      getRiskAgentState(ctx.riskAgent),
      getVolatilityAgentState(ctx.volatilityAgent),
      getStrategyAgentState(ctx.strategyAgent),
    ],
    lastDecision: ctx.decisionHistory[ctx.decisionHistory.length - 1] || null,
    messageLog: ctx.allMessages.slice(-20),
    timestamp: Date.now(),
  };
}

export function getAllAgentStates(): AgentState[] {
  const ctx = getOrchestrator();
  return [
    getRegimeAgentState(ctx.regimeAgent),
    getRiskAgentState(ctx.riskAgent),
    getVolatilityAgentState(ctx.volatilityAgent),
    getStrategyAgentState(ctx.strategyAgent),
  ];
}

export function stopOrchestrator(): void {
  if (globalForOrchestrator._orchestratorContext) {
    globalForOrchestrator._orchestratorContext.isRunning = false;
  }
}

export function resetOrchestrator(): OrchestratorContext {
  return initOrchestrator();
}
