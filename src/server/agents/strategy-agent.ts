import type {
  AgentState,
  AgentMessage,
  StrategyAgentOutput,
  RegimeClassification,
  TechnicalIndicators,
  TradeSignal,
} from "@/shared/types";
import type { TradingPair } from "@/shared/constants";
import {
  createAgentState,
  updateAgentState,
  createMessage,
  formatAgentAction,
} from "./base-agent";
import {
  generateTradeSignal,
  selectStrategy,
} from "../services/strategy-executor";

const AGENT_TYPE = "STRATEGY_EXECUTOR" as const;

interface StrategyAgentContext {
  state: AgentState;
  messageLog: AgentMessage[];
  lastSignal: TradeSignal | null;
}

export function initStrategyAgent(): StrategyAgentContext {
  return {
    state: createAgentState(AGENT_TYPE),
    messageLog: [],
    lastSignal: null,
  };
}

export function generateStrategy(
  context: StrategyAgentContext,
  symbol: TradingPair,
  regime: RegimeClassification,
  indicators: TechnicalIndicators,
  currentPrice: number,
  riskApproved: boolean,
  adjustedSize: number
): { context: StrategyAgentContext; output: StrategyAgentOutput } {
  let state = updateAgentState(context.state, {
    status: "ANALYZING",
    lastAction: "Evaluating trading strategies",
  });

  const selectedStrategy = selectStrategy(regime);

  if (!riskApproved) {
    state = updateAgentState(state, {
      status: "IDLE",
      lastAction: "No signal - Risk agent blocked trade",
      confidence: 0,
    });

    const message = createMessage(AGENT_TYPE, "ORCHESTRATOR", "DECISION", {
      signal: null,
      reason: "Risk agent did not approve trade",
    });

    return {
      context: {
        ...context,
        state,
        messageLog: [...context.messageLog, message],
      },
      output: {
        signal: null,
        reasoning: "Trade blocked by Risk Control Agent. No action taken.",
      },
    };
  }

  const baseSignal = generateTradeSignal(
    symbol,
    regime,
    indicators,
    currentPrice
  );

  const signal = baseSignal ? { ...baseSignal, size: adjustedSize } : null;
  const reasoning = generateReasoning(regime, selectedStrategy, signal);

  state = updateAgentState(state, {
    status: "IDLE",
    lastAction: signal
      ? formatAgentAction(`Generated ${signal.side} signal`, {
          strategy: signal.strategy,
          confidence: signal.confidence,
        })
      : "No signal generated",
    confidence: signal?.confidence || 0,
  });

  const message = createMessage(AGENT_TYPE, "ORCHESTRATOR", "DECISION", {
    signal,
    strategy: selectedStrategy,
    reasoning,
  });

  return {
    context: {
      ...context,
      state,
      messageLog: [...context.messageLog, message],
      lastSignal: signal,
    },
    output: {
      signal,
      reasoning,
    },
  };
}

function generateReasoning(
  regime: RegimeClassification,
  strategy: string,
  signal: TradeSignal | null
): string {
  if (!signal) {
    return `No trading opportunity identified. Market regime: ${
      regime.regime
    } (${(regime.confidence * 100).toFixed(
      0
    )}% confidence). Strategy: ${strategy}. Conditions not met for entry.`;
  }

  return `${
    signal.side
  } signal generated using ${strategy} strategy. Market regime: ${
    regime.regime
  } with ${(regime.confidence * 100).toFixed(
    0
  )}% confidence. Entry: $${signal.entryPrice.toFixed(
    2
  )}, Stop: $${signal.stopLoss.toFixed(
    2
  )}, Target: $${signal.takeProfit.toFixed(2)}. Signal confidence: ${(
    signal.confidence * 100
  ).toFixed(0)}%.`;
}

export function getStrategyAgentState(
  context: StrategyAgentContext
): AgentState {
  return context.state;
}

export function getLastSignal(
  context: StrategyAgentContext
): TradeSignal | null {
  return context.lastSignal;
}
