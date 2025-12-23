import { NextResponse } from "next/server";
import { getWeexConfig } from "@/server/config";
import {
  uploadAiLog,
  createRegimeClassificationLog,
  createRiskDecisionLog,
  createTradeExecutionLog,
  createVolatilityGuardLog,
  type AiLogRequest,
} from "@/server/services/weex-ailog";

type LogType = "regime" | "risk" | "trade" | "volatility" | "custom";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const logType = searchParams.get("type") as LogType | null;

  try {
    const config = getWeexConfig();
    const body = await request.json();

    let aiLog: AiLogRequest;

    switch (logType) {
      case "regime": {
        aiLog = createRegimeClassificationLog(
          body.orderId || null,
          {
            symbol: body.symbol,
            rsi: body.rsi,
            ema9: body.ema9,
            ema21: body.ema21,
            atr: body.atr,
            volatility: body.volatility,
            momentum: body.momentum,
          },
          {
            regime: body.regime,
            confidence: body.confidence,
            strategy: body.strategy,
          },
          body.explanation
        );
        break;
      }

      case "risk": {
        aiLog = createRiskDecisionLog(
          body.orderId || null,
          {
            symbol: body.symbol,
            regime: body.regime,
            regimeConfidence: body.regimeConfidence,
            currentVolatility: body.currentVolatility,
            recentDrawdown: body.recentDrawdown,
            dailyLossPercent: body.dailyLossPercent,
          },
          {
            positionSizeMultiplier: body.positionSizeMultiplier,
            stopLossAdjustment: body.stopLossAdjustment,
            tradeSuspended: body.tradeSuspended,
            riskLevel: body.riskLevel,
          },
          body.explanation
        );
        break;
      }

      case "trade": {
        if (!body.orderId) {
          return NextResponse.json(
            { success: false, error: "orderId required for trade logs" },
            { status: 400 }
          );
        }
        aiLog = createTradeExecutionLog(
          body.orderId,
          {
            symbol: body.symbol,
            regime: body.regime,
            strategy: body.strategy,
            entryPrice: body.entryPrice,
            indicators: {
              rsi: body.rsi,
              ema9: body.ema9,
              ema21: body.ema21,
            },
          },
          {
            side: body.side,
            size: body.size,
            stopLoss: body.stopLoss,
            takeProfit: body.takeProfit,
            confidence: body.confidence,
          },
          body.explanation
        );
        break;
      }

      case "volatility": {
        aiLog = createVolatilityGuardLog(
          {
            symbol: body.symbol,
            currentVolatility: body.currentVolatility,
            volatilityThreshold: body.volatilityThreshold,
            spikeDetected: body.spikeDetected,
            anomalyDetected: body.anomalyDetected,
          },
          {
            killSwitchActive: body.killSwitchActive,
            action: body.action || "monitor",
          },
          body.explanation
        );
        break;
      }

      case "custom": {
        if (
          !body.stage ||
          !body.model ||
          !body.input ||
          !body.output ||
          !body.explanation
        ) {
          return NextResponse.json(
            {
              success: false,
              error: "stage, model, input, output, and explanation required",
            },
            { status: 400 }
          );
        }
        aiLog = {
          orderId: body.orderId || null,
          stage: body.stage,
          model: body.model,
          input: body.input,
          output: body.output,
          explanation: body.explanation.slice(0, 1000),
        };
        break;
      }

      default: {
        return NextResponse.json({
          success: true,
          data: {
            availableTypes: ["regime", "risk", "trade", "volatility", "custom"],
            usage: "/api/ailog?type=<type>",
            examples: {
              regime: {
                symbol: "cmt_btcusdt",
                rsi: 45,
                ema9: 94500,
                ema21: 94000,
                atr: 1500,
                volatility: 0.02,
                momentum: 0.01,
                regime: "TRENDING",
                confidence: 0.75,
                strategy: "TREND_FOLLOWING",
                explanation: "Market showing strong trend characteristics...",
              },
              risk: {
                symbol: "cmt_btcusdt",
                regime: "TRENDING",
                regimeConfidence: 0.75,
                currentVolatility: 0.02,
                recentDrawdown: 0.01,
                dailyLossPercent: 0.005,
                positionSizeMultiplier: 0.8,
                stopLossAdjustment: "NORMAL",
                tradeSuspended: false,
                riskLevel: "LOW",
                explanation: "Low risk environment with strong trend...",
              },
            },
          },
        });
      }
    }

    const result = await uploadAiLog(config, aiLog);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      description: "AI Log Upload API for WEEX Competition Compliance",
      note: "All trades must include AI logs to verify AI involvement",
      types: {
        regime: "Log regime classification decisions",
        risk: "Log risk assessment decisions",
        trade: "Log trade execution decisions (requires orderId)",
        volatility: "Log volatility guard decisions",
        custom: "Log custom AI decisions",
      },
      usage: "POST /api/ailog?type=<type> with JSON body",
    },
  });
}
