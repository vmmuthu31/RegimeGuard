import { NextResponse } from "next/server";
import { getWeexConfig } from "@/server/config";
import { getAccountBalance, getPositions } from "@/server/services/weex-client";
import { evaluateRisk } from "@/server/services/risk-engine";
import type { RegimeClassification } from "@/shared/types";

export async function GET() {
  try {
    const config = getWeexConfig();
    const [balance, positions] = await Promise.all([
      getAccountBalance(config),
      getPositions(config),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        balance: balance.find((b) => b.coinName === "USDT") || null,
        positions,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const config = getWeexConfig();
    const body = await request.json();
    const regime: RegimeClassification = body.regime;
    const currentVolatility: number = body.currentVolatility || 0;

    const [balance, positions] = await Promise.all([
      getAccountBalance(config),
      getPositions(config),
    ]);

    const usdtBalance = balance.find((b) => b.coinName === "USDT") || null;

    const riskDecision = evaluateRisk(
      regime,
      currentVolatility,
      positions,
      usdtBalance,
      {
        recentDrawdown: body.recentDrawdown || 0,
        lastTradeTime: body.lastTradeTime || 0,
        dailyLossPercent: body.dailyLossPercent || 0,
        consecutiveLosses: body.consecutiveLosses || 0,
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        riskDecision,
        balance: usdtBalance,
        positions,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
