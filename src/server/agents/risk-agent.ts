import type {
  AgentState,
  AgentMessage,
  RiskAgentOutput,
  RegimeClassification,
  Position,
  AccountBalance,
} from "@/shared/types";
import {
  createAgentState,
  updateAgentState,
  createMessage,
  formatAgentAction,
} from "./base-agent";
import { evaluateRisk, calculatePositionSize } from "../services/risk-engine";

const AGENT_TYPE = "RISK_CONTROLLER" as const;

interface RiskAgentContext {
  state: AgentState;
  messageLog: AgentMessage[];
  riskState: {
    recentDrawdown: number;
    lastTradeTime: number;
    dailyLossPercent: number;
    consecutiveLosses: number;
  };
}

export function initRiskAgent(): RiskAgentContext {
  return {
    state: createAgentState(AGENT_TYPE),
    messageLog: [],
    riskState: {
      recentDrawdown: 0,
      lastTradeTime: 0,
      dailyLossPercent: 0,
      consecutiveLosses: 0,
    },
  };
}

export function evaluateTradeRisk(
  context: RiskAgentContext,
  regime: RegimeClassification,
  currentVolatility: number,
  positions: Position[],
  balance: AccountBalance | null,
  basePositionSize: number,
  currentPrice: number
): { context: RiskAgentContext; output: RiskAgentOutput } {
  let state = updateAgentState(context.state, {
    status: "ANALYZING",
    lastAction: "Evaluating risk parameters",
  });

  const decision = evaluateRisk(
    regime,
    currentVolatility,
    positions,
    balance,
    context.riskState
  );

  const adjustedSize = calculatePositionSize(
    basePositionSize,
    decision,
    balance,
    currentPrice
  );

  const approved = !decision.tradeSuspended && !decision.tradeCooldownActive;

  state = updateAgentState(state, {
    status: "IDLE",
    lastAction: formatAgentAction(
      approved ? "Trade approved" : "Trade blocked",
      {
        multiplier: decision.positionSizeMultiplier,
        riskLevel: decision.riskLevel,
      }
    ),
    confidence: approved ? decision.positionSizeMultiplier : 0,
  });

  const message = createMessage(AGENT_TYPE, "ORCHESTRATOR", "DECISION", {
    approved,
    riskLevel: decision.riskLevel,
    positionSizeMultiplier: decision.positionSizeMultiplier,
    explanation: decision.explanation,
  });

  return {
    context: {
      ...context,
      state,
      messageLog: [...context.messageLog, message],
    },
    output: {
      decision,
      approved,
      adjustedSize,
    },
  };
}

export function updateRiskState(
  context: RiskAgentContext,
  updates: Partial<RiskAgentContext["riskState"]>
): RiskAgentContext {
  return {
    ...context,
    riskState: {
      ...context.riskState,
      ...updates,
    },
  };
}

export function recordTrade(
  context: RiskAgentContext,
  pnl: number
): RiskAgentContext {
  const isLoss = pnl < 0;

  return updateRiskState(context, {
    lastTradeTime: Date.now(),
    dailyLossPercent: isLoss
      ? context.riskState.dailyLossPercent + Math.abs(pnl)
      : context.riskState.dailyLossPercent,
    consecutiveLosses: isLoss ? context.riskState.consecutiveLosses + 1 : 0,
    recentDrawdown: isLoss
      ? Math.max(context.riskState.recentDrawdown, Math.abs(pnl))
      : context.riskState.recentDrawdown * 0.9,
  });
}

export function getRiskAgentState(context: RiskAgentContext): AgentState {
  return context.state;
}
