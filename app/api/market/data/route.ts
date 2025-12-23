import { NextResponse } from "next/server";
import { TRADING_PAIRS, type TradingPair } from "@/shared/constants";
import {
  getServerTime,
  getContracts,
  getAllTickers,
  getTicker,
  getOrderBookDepth,
  getTrades,
  getCandles,
  getHistoryCandles,
  getCryptoIndex,
  getOpenInterest,
  getNextFundingTime,
  getHistoricalFundingRates,
  getCurrentFundingRate,
  type CandleGranularity,
  type PriceType,
} from "@/server/services/weex-market";

type EndpointType =
  | "time"
  | "contracts"
  | "tickers"
  | "ticker"
  | "depth"
  | "trades"
  | "candles"
  | "historyCandles"
  | "index"
  | "openInterest"
  | "fundingTime"
  | "fundingRates"
  | "currentFundingRate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint") as EndpointType | null;
  const symbolParam = searchParams.get("symbol");

  const symbol: TradingPair = TRADING_PAIRS.includes(symbolParam as TradingPair)
    ? (symbolParam as TradingPair)
    : "cmt_btcusdt";

  try {
    switch (endpoint) {
      case "time": {
        const data = await getServerTime();
        return NextResponse.json({ success: true, data });
      }

      case "contracts": {
        const symbolQuery = searchParams.get("symbol");
        const data = await getContracts(
          symbolQuery && TRADING_PAIRS.includes(symbolQuery as TradingPair)
            ? (symbolQuery as TradingPair)
            : undefined
        );
        return NextResponse.json({ success: true, data });
      }

      case "tickers": {
        const data = await getAllTickers();
        return NextResponse.json({ success: true, data });
      }

      case "ticker": {
        const data = await getTicker(symbol);
        return NextResponse.json({ success: true, data });
      }

      case "depth": {
        const limitParam = searchParams.get("limit");
        const limit = limitParam === "200" ? 200 : 15;
        const data = await getOrderBookDepth(symbol, limit);
        return NextResponse.json({ success: true, data });
      }

      case "trades": {
        const limitParam = parseInt(searchParams.get("limit") || "100");
        const data = await getTrades(symbol, limitParam);
        return NextResponse.json({ success: true, data });
      }

      case "candles": {
        const granularity = (searchParams.get("granularity") ||
          "1m") as CandleGranularity;
        const limit = parseInt(searchParams.get("limit") || "100");
        const priceType = (searchParams.get("priceType") ||
          "LAST") as PriceType;
        const data = await getCandles(symbol, granularity, limit, priceType);
        return NextResponse.json({ success: true, data });
      }

      case "historyCandles": {
        const granularity = (searchParams.get("granularity") ||
          "1m") as CandleGranularity;
        const startTime = searchParams.get("startTime");
        const endTime = searchParams.get("endTime");
        const limit = searchParams.get("limit");
        const priceType = searchParams.get("priceType") as PriceType | null;

        const data = await getHistoryCandles(symbol, granularity, {
          startTime: startTime ? parseInt(startTime) : undefined,
          endTime: endTime ? parseInt(endTime) : undefined,
          limit: limit ? parseInt(limit) : undefined,
          priceType: priceType || undefined,
        });
        return NextResponse.json({ success: true, data });
      }

      case "index": {
        const priceType = (searchParams.get("priceType") || "INDEX") as
          | "MARK"
          | "INDEX";
        const data = await getCryptoIndex(symbol, priceType);
        return NextResponse.json({ success: true, data });
      }

      case "openInterest": {
        const data = await getOpenInterest(symbol);
        return NextResponse.json({ success: true, data });
      }

      case "fundingTime": {
        const data = await getNextFundingTime(symbol);
        return NextResponse.json({ success: true, data });
      }

      case "fundingRates": {
        const limit = parseInt(searchParams.get("limit") || "10");
        const data = await getHistoricalFundingRates(symbol, limit);
        return NextResponse.json({ success: true, data });
      }

      case "currentFundingRate": {
        const symbolQuery = searchParams.get("symbol");
        const data = await getCurrentFundingRate(
          symbolQuery && TRADING_PAIRS.includes(symbolQuery as TradingPair)
            ? (symbolQuery as TradingPair)
            : undefined
        );
        return NextResponse.json({ success: true, data });
      }

      default: {
        return NextResponse.json({
          success: true,
          data: {
            availableEndpoints: [
              "time",
              "contracts",
              "tickers",
              "ticker",
              "depth",
              "trades",
              "candles",
              "historyCandles",
              "index",
              "openInterest",
              "fundingTime",
              "fundingRates",
              "currentFundingRate",
            ],
            usage: "/api/market/data?endpoint=<endpoint>&symbol=<symbol>",
          },
        });
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
