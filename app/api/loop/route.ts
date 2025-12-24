import { NextResponse } from "next/server";
import {
  getLoopConfig,
  getLoopState,
  updateLoopConfig,
  startTradingLoop,
  stopTradingLoop,
  runSingleCycle,
  resetLoopState,
} from "@/server/services/trading-loop";
import { TRADING_PAIRS, TradingPair } from "@/shared/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  switch (action) {
    case "status": {
      return NextResponse.json({
        success: true,
        data: {
          config: getLoopConfig(),
          state: getLoopState(),
          timestamp: Date.now(),
        },
      });
    }

    case "cycle": {
      const result = await runSingleCycle();
      return NextResponse.json({
        success: true,
        data: {
          decisions: Object.fromEntries(result.decisions),
          executed: result.executed,
          errors: result.errors,
          timestamp: Date.now(),
        },
      });
    }

    default: {
      return NextResponse.json({
        success: true,
        data: {
          description: "RegimeGuard Automated Trading Loop",
          endpoints: {
            "GET /api/loop?action=status": "Get loop configuration and state",
            "GET /api/loop?action=cycle": "Run single trading cycle manually",
            "POST /api/loop (action=start)": "Start automated trading loop",
            "POST /api/loop (action=stop)": "Stop automated trading loop",
            "POST /api/loop (action=configure)": "Update loop configuration",
            "POST /api/loop (action=reset)": "Reset loop state",
          },
          config: getLoopConfig(),
          state: getLoopState(),
        },
      });
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action;

    switch (action) {
      case "start": {
        if (body.config) {
          updateLoopConfig(body.config);
        }

        updateLoopConfig({ enabled: true });
        const started = startTradingLoop();

        return NextResponse.json({
          success: started,
          data: {
            message: started
              ? "Trading loop started"
              : "Loop already running or disabled",
            config: getLoopConfig(),
            state: getLoopState(),
          },
        });
      }

      case "stop": {
        const stopped = stopTradingLoop();
        updateLoopConfig({ enabled: false });

        return NextResponse.json({
          success: stopped,
          data: {
            message: stopped ? "Trading loop stopped" : "Loop was not running",
            state: getLoopState(),
          },
        });
      }

      case "configure": {
        const updates: Record<string, unknown> = {};

        if (body.symbols && Array.isArray(body.symbols)) {
          updates.symbols = body.symbols.filter((s: string) =>
            TRADING_PAIRS.includes(s as TradingPair)
          );
        }
        if (typeof body.intervalMs === "number") {
          updates.intervalMs = Math.max(10000, body.intervalMs);
        }
        if (typeof body.dryRun === "boolean") {
          updates.dryRun = body.dryRun;
        }
        if (typeof body.basePositionSize === "number") {
          updates.basePositionSize = body.basePositionSize;
        }
        if (typeof body.maxConcurrentTrades === "number") {
          updates.maxConcurrentTrades = Math.max(
            1,
            Math.min(5, body.maxConcurrentTrades)
          );
        }

        const newConfig = updateLoopConfig(updates);

        return NextResponse.json({
          success: true,
          data: {
            message: "Configuration updated",
            config: newConfig,
          },
        });
      }

      case "reset": {
        resetLoopState();
        return NextResponse.json({
          success: true,
          data: {
            message: "Loop state reset",
            state: getLoopState(),
          },
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown action: ${action}`,
            availableActions: ["start", "stop", "configure", "reset"],
          },
          { status: 400 }
        );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
