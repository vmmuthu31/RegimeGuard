import type {
  AgentState,
  AgentMessage,
  RegimeAgentOutput,
} from "@/shared/types";
import type { Candle } from "@/shared/types";
import {
  createAgentState,
  updateAgentState,
  createMessage,
  formatAgentAction,
} from "./base-agent";
import { classifyMarketRegime } from "../services/regime-classifier";

const AGENT_TYPE = "REGIME_DETECTOR" as const;

interface RegimeAgentContext {
  state: AgentState;
  messageLog: AgentMessage[];
}

export function initRegimeAgent(): RegimeAgentContext {
  return {
    state: createAgentState(AGENT_TYPE),
    messageLog: [],
  };
}

export function analyzeRegime(
  context: RegimeAgentContext,
  candles: Candle[]
): { context: RegimeAgentContext; output: RegimeAgentOutput } {
  let state = updateAgentState(context.state, {
    status: "ANALYZING",
    lastAction: "Processing market data",
  });

  const classification = classifyMarketRegime(candles);

  const recommendation = generateRecommendation(
    classification.regime,
    classification.confidence
  );

  state = updateAgentState(state, {
    status: "IDLE",
    lastAction: formatAgentAction(`Classified ${classification.regime}`, {
      confidence: classification.confidence,
    }),
    confidence: classification.confidence,
  });

  const message = createMessage(AGENT_TYPE, "ORCHESTRATOR", "ANALYSIS", {
    regime: classification.regime,
    confidence: classification.confidence,
    features: classification.features,
  });

  return {
    context: {
      state,
      messageLog: [...context.messageLog, message],
    },
    output: {
      classification,
      recommendation,
    },
  };
}

function generateRecommendation(regime: string, confidence: number): string {
  if (confidence < 0.5) {
    return "Low confidence in regime detection. Recommend reduced exposure.";
  }

  switch (regime) {
    case "TRENDING":
      return "Trending market detected. Trend-following strategies recommended.";
    case "RANGE_BOUND":
      return "Range-bound market detected. Mean-reversion strategies recommended.";
    case "HIGH_VOLATILITY":
      return "High volatility detected. Capital preservation mode recommended.";
    default:
      return "Unable to determine optimal strategy. Recommend caution.";
  }
}

export function getRegimeAgentState(context: RegimeAgentContext): AgentState {
  return context.state;
}
