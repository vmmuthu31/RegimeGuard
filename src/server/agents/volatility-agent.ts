import type {
  AgentState,
  AgentMessage,
  VolatilityAgentOutput,
} from "@/shared/types";
import type { Candle } from "@/shared/types";
import {
  createAgentState,
  updateAgentState,
  createMessage,
  formatAgentAction,
} from "./base-agent";
import {
  evaluateVolatilityGuard,
  createVolatilityHistory,
  type VolatilityHistory,
} from "../services/volatility-guard";

const AGENT_TYPE = "VOLATILITY_GUARD" as const;

interface VolatilityAgentContext {
  state: AgentState;
  messageLog: AgentMessage[];
  volatilityHistory: VolatilityHistory;
}

export function initVolatilityAgent(): VolatilityAgentContext {
  return {
    state: createAgentState(AGENT_TYPE),
    messageLog: [],
    volatilityHistory: createVolatilityHistory(100),
  };
}

export function monitorVolatility(
  context: VolatilityAgentContext,
  candles: Candle[]
): { context: VolatilityAgentContext; output: VolatilityAgentOutput } {
  let state = updateAgentState(context.state, {
    status: "ANALYZING",
    lastAction: "Monitoring volatility patterns",
  });

  const { status, updatedHistory } = evaluateVolatilityGuard(
    candles,
    context.volatilityHistory
  );

  const alertLevel = determineAlertLevel(status);

  state = updateAgentState(state, {
    status: status.killSwitchActive ? "SUSPENDED" : "IDLE",
    lastAction: formatAgentAction(getStatusDescription(status), {
      volatility: status.currentVolatility,
      alertLevel,
    }),
    confidence: status.killSwitchActive ? 0 : 1 - status.currentVolatility * 10,
  });

  const messageType = status.killSwitchActive ? "ALERT" : "ANALYSIS";
  const message = createMessage(AGENT_TYPE, "ORCHESTRATOR", messageType, {
    alertLevel,
    killSwitchActive: status.killSwitchActive,
    spikeDetected: status.spikeDetected,
    anomalyDetected: status.anomalyDetected,
    currentVolatility: status.currentVolatility,
  });

  return {
    context: {
      state,
      messageLog: [...context.messageLog, message],
      volatilityHistory: updatedHistory,
    },
    output: {
      status,
      alertLevel,
    },
  };
}

function determineAlertLevel(
  status: VolatilityAgentOutput["status"]
): "NORMAL" | "ELEVATED" | "CRITICAL" {
  if (status.killSwitchActive) {
    return "CRITICAL";
  }
  if (status.spikeDetected || status.anomalyDetected) {
    return "ELEVATED";
  }
  return "NORMAL";
}

function getStatusDescription(status: VolatilityAgentOutput["status"]): string {
  if (status.killSwitchActive) {
    return "KILL SWITCH ACTIVE - Trading suspended";
  }
  if (status.spikeDetected && status.anomalyDetected) {
    return "Spike and anomaly detected";
  }
  if (status.spikeDetected) {
    return "Volatility spike detected";
  }
  if (status.anomalyDetected) {
    return "Market anomaly detected";
  }
  return "Normal conditions";
}

export function isKillSwitchActive(context: VolatilityAgentContext): boolean {
  return context.state.status === "SUSPENDED";
}

export function getVolatilityAgentState(
  context: VolatilityAgentContext
): AgentState {
  return context.state;
}
