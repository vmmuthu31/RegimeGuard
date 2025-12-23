import { NextResponse } from "next/server";
import { getOrchestratorState, getAllAgentStates } from "@/server/agents";

export async function GET() {
  try {
    const orchestratorState = getOrchestratorState();
    const agents = getAllAgentStates();

    return NextResponse.json({
      success: true,
      data: {
        orchestrator: {
          isRunning: orchestratorState.isRunning,
          timestamp: orchestratorState.timestamp,
        },
        agents: agents.map((agent) => ({
          type: agent.type,
          status: agent.status,
          lastAction: agent.lastAction,
          confidence: agent.confidence,
          timestamp: agent.timestamp,
        })),
        lastDecision: orchestratorState.lastDecision
          ? {
              id: orchestratorState.lastDecision.id,
              symbol: orchestratorState.lastDecision.symbol,
              action: orchestratorState.lastDecision.action,
              explanation: orchestratorState.lastDecision.explanation,
              timestamp: orchestratorState.lastDecision.timestamp,
            }
          : null,
        recentMessages: orchestratorState.messageLog.slice(-10),
      },
    });
  } catch (error) {
    console.error("Agent status error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get agent status" },
      { status: 500 }
    );
  }
}
