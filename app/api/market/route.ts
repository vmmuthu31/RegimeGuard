import { NextResponse } from "next/server";
import { TRADING_PAIRS, TradingPair } from "@/shared/constants";
import {
  getTicker,
  getCandles,
  getContractInfo,
} from "@/server/services/weex-client";
import {
  getOrderBookDepth,
  getCurrentFundingRate,
} from "@/server/services/weex-market";
import {
  classifyMarketRegime,
  computeTechnicalIndicators,
} from "@/server/services/regime-classifier";
import {
  evaluateVolatilityGuard,
  createVolatilityHistory,
} from "@/server/services/volatility-guard";
import { generateTradeSignal } from "@/server/services/strategy-executor";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbolParam = searchParams.get("symbol");
  const action = searchParams.get("action");

  const symbol: TradingPair = TRADING_PAIRS.includes(symbolParam as TradingPair)
    ? (symbolParam as TradingPair)
    : "cmt_btcusdt";

  try {
    if (action === "orderbook") {
      const depth = await getOrderBookDepth(symbol, 15);
      return NextResponse.json({
        success: true,
        data: {
          symbol,
          asks: depth.asks,
          bids: depth.bids,
          timestamp: depth.timestamp,
        },
      });
    }

    if (action === "fundingrate") {
      const rates = await getCurrentFundingRate(symbol);
      const rate = rates.find((r) => r.symbol === symbol) || rates[0];
      return NextResponse.json({
        success: true,
        data: rate,
      });
    }

    const [ticker, candles, contractInfo] = await Promise.all([
      getTicker(symbol),
      getCandles(symbol, "1m", 100),
      getContractInfo(symbol),
    ]);

    const regime = classifyMarketRegime(candles);
    const indicators = computeTechnicalIndicators(candles);
    const { status: volatilityStatus } = evaluateVolatilityGuard(
      candles,
      createVolatilityHistory()
    );
    const signal = generateTradeSignal(symbol, regime, indicators, ticker.last);

    return NextResponse.json({
      success: true,
      data: {
        symbol,
        ticker,
        regime,
        indicators,
        volatilityStatus,
        signal,
        contractInfo,
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
