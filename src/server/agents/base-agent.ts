import type {
  AgentType,
  AgentState,
  AgentMessage,
  MessageType,
} from "@/shared/types";

let messageCounter = 0;

function generateMessageId(): string {
  messageCounter += 1;
  return `msg_${Date.now()}_${messageCounter}`;
}

function generateAgentId(type: AgentType): string {
  return `${type.toLowerCase()}_${Date.now()}`;
}

export function createAgentState(type: AgentType): AgentState {
  return {
    id: generateAgentId(type),
    type,
    status: "IDLE",
    lastAction: "Initialized",
    confidence: 0,
    timestamp: Date.now(),
  };
}

export function updateAgentState(
  state: AgentState,
  updates: Partial<Pick<AgentState, "status" | "lastAction" | "confidence">>
): AgentState {
  return {
    ...state,
    ...updates,
    timestamp: Date.now(),
  };
}

export function createMessage(
  fromAgent: AgentType,
  toAgent: AgentType | "ORCHESTRATOR",
  type: MessageType,
  payload: unknown
): AgentMessage {
  return {
    id: generateMessageId(),
    fromAgent,
    toAgent,
    type,
    payload,
    timestamp: Date.now(),
  };
}

export function formatAgentAction(
  action: string,
  details?: Record<string, unknown>
): string {
  if (!details) {
    return action;
  }

  const detailStr = Object.entries(details)
    .map(([k, v]) => `${k}: ${typeof v === "number" ? v.toFixed(2) : v}`)
    .join(", ");

  return `${action} (${detailStr})`;
}
