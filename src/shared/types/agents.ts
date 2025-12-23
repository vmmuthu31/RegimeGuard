import type {
  RegimeClassification,
  RiskDecision,
  VolatilityGuardStatus,
  TradeSignal,
} from "./trading";

export type AgentType =
  | "REGIME_DETECTOR"
  | "RISK_CONTROLLER"
  | "VOLATILITY_GUARD"
  | "STRATEGY_EXECUTOR";

export type AgentStatus =
  | "IDLE"
  | "ANALYZING"
  | "ACTING"
  | "ERROR"
  | "SUSPENDED";

export type MessageType =
  | "ANALYSIS"
  | "DECISION"
  | "ALERT"
  | "RECOMMENDATION"
  | "COMMAND";

export interface AgentMessage {
  id: string;
  fromAgent: AgentType;
  toAgent: AgentType | "ORCHESTRATOR";
  type: MessageType;
  payload: unknown;
  timestamp: number;
}

export interface AgentState {
  id: string;
  type: AgentType;
  status: AgentStatus;
  lastAction: string;
  confidence: number;
  timestamp: number;
}

export interface RegimeAgentOutput {
  classification: RegimeClassification;
  recommendation: string;
}

export interface RiskAgentOutput {
  decision: RiskDecision;
  approved: boolean;
  adjustedSize: number;
}

export interface VolatilityAgentOutput {
  status: VolatilityGuardStatus;
  alertLevel: "NORMAL" | "ELEVATED" | "CRITICAL";
}

export interface StrategyAgentOutput {
  signal: TradeSignal | null;
  reasoning: string;
}

export interface OrchestratorState {
  isRunning: boolean;
  agents: AgentState[];
  lastDecision: TradingDecision | null;
  messageLog: AgentMessage[];
  timestamp: number;
}

export interface TradingDecision {
  id: string;
  symbol: string;
  action: "BUY" | "SELL" | "HOLD" | "EXIT";
  signal: TradeSignal | null;
  regime: RegimeClassification;
  riskApproved: boolean;
  volatilityOk: boolean;
  explanation: string;
  agentContributions: {
    regime: string;
    risk: string;
    volatility: string;
    strategy: string;
  };
  timestamp: number;
}
