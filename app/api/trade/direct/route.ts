import { NextResponse } from "next/server";
import { getWeexConfig } from "@/server/config";
import { TRADING_PAIRS, TradingPair } from "@/shared/constants";
import {
  openLong,
  openShort,
  closeLong,
  closeShort,
} from "@/server/services/weex-trade";

export async function POST(request: Request) {
  try {
    const config = getWeexConfig();
    const body = await request.json();

    const action = body.action;
    const symbolParam = body.symbol;
    const symbol: TradingPair = TRADING_PAIRS.includes(
      symbolParam as TradingPair
    )
      ? (symbolParam as TradingPair)
      : "cmt_btcusdt";

    const size = body.size || "0.00001"; // ~$1 at $100k BTC
    const isMarket = body.isMarket !== false;

    switch (action) {
      case "buy": {
        const result = await openLong(config, symbol, size, {
          isMarket,
          stopLossPrice: body.stopLoss,
          takeProfitPrice: body.takeProfit,
        });
        return NextResponse.json({
          success: true,
          data: {
            action: "BUY",
            symbol,
            size,
            orderId: result.orderId,
            timestamp: Date.now(),
          },
        });
      }

      case "sell": {
        const result = await openShort(config, symbol, size, {
          isMarket,
          stopLossPrice: body.stopLoss,
          takeProfitPrice: body.takeProfit,
        });
        return NextResponse.json({
          success: true,
          data: {
            action: "SELL",
            symbol,
            size,
            orderId: result.orderId,
            timestamp: Date.now(),
          },
        });
      }

      case "close_long": {
        const result = await closeLong(config, symbol, size, { isMarket });
        return NextResponse.json({
          success: true,
          data: {
            action: "CLOSE_LONG",
            symbol,
            size,
            orderId: result.orderId,
            timestamp: Date.now(),
          },
        });
      }

      case "close_short": {
        const result = await closeShort(config, symbol, size, { isMarket });
        return NextResponse.json({
          success: true,
          data: {
            action: "CLOSE_SHORT",
            symbol,
            size,
            orderId: result.orderId,
            timestamp: Date.now(),
          },
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown action: ${action}`,
            availableActions: ["buy", "sell", "close_long", "close_short"],
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

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      description: "Direct Trade API - Execute trades without AI approval",
      endpoints: {
        "POST /api/trade/direct": {
          body: {
            action: "buy | sell | close_long | close_short",
            symbol: "cmt_btcusdt (default)",
            size: "0.00001 (default) - position size in base asset",
            isMarket: "true (default)",
            stopLoss: "optional",
            takeProfit: "optional",
          },
        },
      },
      warning: "This bypasses AI safety checks. Use with caution.",
    },
  });
}
