import { WEEX_BASE_URL, type TradingPair } from "@/shared/constants";

async function makePublicRequest<T>(
  requestPath: string,
  queryString: string = ""
): Promise<T> {
  const url = `${WEEX_BASE_URL}${requestPath}${queryString}`;
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WEEX API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export interface ServerTimeResponse {
  epoch: string;
  iso: string;
  timestamp: number;
}

export async function getServerTime(): Promise<ServerTimeResponse> {
  return makePublicRequest<ServerTimeResponse>("/capi/v2/market/time");
}

export interface ContractInfo {
  symbol: string;
  underlying_index: string;
  quote_currency: string;
  coin: string;
  contract_val: string;
  delivery: string[];
  size_increment: string;
  tick_size: string;
  forwardContractFlag: boolean;
  priceEndStep: number;
  minLeverage: number;
  maxLeverage: number;
  buyLimitPriceRatio: string;
  sellLimitPriceRatio: string;
  makerFeeRate: string;
  takerFeeRate: string;
  minOrderSize: string;
  maxOrderSize: string;
  maxPositionSize: string;
  marketOpenLimitSize?: string;
}

export async function getContracts(
  symbol?: TradingPair
): Promise<ContractInfo[]> {
  const query = symbol ? `?symbol=${symbol}` : "";
  return makePublicRequest<ContractInfo[]>("/capi/v2/market/contracts", query);
}

export interface OrderBookDepth {
  asks: [string, string][];
  bids: [string, string][];
  timestamp: string;
}

export async function getOrderBookDepth(
  symbol: TradingPair,
  limit: 15 | 200 = 15
): Promise<OrderBookDepth> {
  return makePublicRequest<OrderBookDepth>(
    "/capi/v2/market/depth",
    `?symbol=${symbol}&limit=${limit}`
  );
}

export interface TickerData {
  symbol: string;
  last: string;
  best_ask: string;
  best_bid: string;
  high_24h: string;
  low_24h: string;
  volume_24h: string;
  timestamp: string;
  priceChangePercent: string;
  base_volume: string;
  markPrice: string;
  indexPrice: string;
}

export async function getAllTickers(): Promise<TickerData[]> {
  return makePublicRequest<TickerData[]>("/capi/v2/market/tickers");
}

export async function getTicker(symbol: TradingPair): Promise<TickerData> {
  return makePublicRequest<TickerData>(
    "/capi/v2/market/ticker",
    `?symbol=${symbol}`
  );
}

export interface TradeData {
  ticketId: string;
  time: number;
  price: string;
  size: string;
  value: string;
  symbol: string;
  isBestMatch: boolean;
  isBuyerMaker: boolean;
  contractVal: string;
}

export async function getTrades(
  symbol: TradingPair,
  limit: number = 100
): Promise<TradeData[]> {
  const clampedLimit = Math.min(Math.max(limit, 1), 1000);
  return makePublicRequest<TradeData[]>(
    "/capi/v2/market/trades",
    `?symbol=${symbol}&limit=${clampedLimit}`
  );
}

export type CandleGranularity =
  | "1m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "4h"
  | "12h"
  | "1d"
  | "1w";
export type PriceType = "LAST" | "MARK" | "INDEX";

export type RawCandle = [
  string,
  string,
  string,
  string,
  string,
  string,
  string
];

export interface ParsedCandle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  baseVolume: number;
  quoteVolume: number;
}

function parseCandle(raw: RawCandle): ParsedCandle {
  return {
    timestamp: parseInt(raw[0]),
    open: parseFloat(raw[1]),
    high: parseFloat(raw[2]),
    low: parseFloat(raw[3]),
    close: parseFloat(raw[4]),
    baseVolume: parseFloat(raw[5]),
    quoteVolume: parseFloat(raw[6]),
  };
}

export async function getCandles(
  symbol: TradingPair,
  granularity: CandleGranularity = "1m",
  limit: number = 100,
  priceType: PriceType = "LAST"
): Promise<ParsedCandle[]> {
  const clampedLimit = Math.min(Math.max(limit, 1), 1000);
  const raw = await makePublicRequest<RawCandle[]>(
    "/capi/v2/market/candles",
    `?symbol=${symbol}&granularity=${granularity}&limit=${clampedLimit}&priceType=${priceType}`
  );
  return raw.map(parseCandle);
}

export async function getHistoryCandles(
  symbol: TradingPair,
  granularity: CandleGranularity,
  options?: {
    startTime?: number;
    endTime?: number;
    limit?: number;
    priceType?: PriceType;
  }
): Promise<ParsedCandle[]> {
  let query = `?symbol=${symbol}&granularity=${granularity}`;
  if (options?.startTime) query += `&startTime=${options.startTime}`;
  if (options?.endTime) query += `&endTime=${options.endTime}`;
  if (options?.limit)
    query += `&limit=${Math.min(Math.max(options.limit, 1), 100)}`;
  if (options?.priceType) query += `&priceType=${options.priceType}`;

  const raw = await makePublicRequest<RawCandle[]>(
    "/capi/v2/market/historyCandles",
    query
  );
  return raw.map(parseCandle);
}

export interface IndexData {
  symbol: string;
  index: string;
  timestamp: string;
}

export async function getCryptoIndex(
  symbol: TradingPair,
  priceType: "MARK" | "INDEX" = "INDEX"
): Promise<IndexData> {
  return makePublicRequest<IndexData>(
    "/capi/v2/market/index",
    `?symbol=${symbol}&priceType=${priceType}`
  );
}

export interface OpenInterestData {
  symbol: string;
  base_volume: string;
  target_volume: string;
  timestamp: string;
}

export async function getOpenInterest(
  symbol: TradingPair
): Promise<OpenInterestData[]> {
  return makePublicRequest<OpenInterestData[]>(
    "/capi/v2/market/open_interest",
    `?symbol=${symbol}`
  );
}

export interface FundingTimeData {
  symbol: string;
  fundingTime: number;
}

export async function getNextFundingTime(
  symbol: TradingPair
): Promise<FundingTimeData> {
  return makePublicRequest<FundingTimeData>(
    "/capi/v2/market/funding_time",
    `?symbol=${symbol}`
  );
}

export interface FundingRateHistory {
  symbol: string;
  fundingRate: string;
  fundingTime: number;
}

export async function getHistoricalFundingRates(
  symbol: TradingPair,
  limit: number = 10
): Promise<FundingRateHistory[]> {
  const clampedLimit = Math.min(Math.max(limit, 1), 100);
  return makePublicRequest<FundingRateHistory[]>(
    "/capi/v2/market/getHistoryFundRate",
    `?symbol=${symbol}&limit=${clampedLimit}`
  );
}

export interface CurrentFundingRate {
  symbol: string;
  fundingRate: string;
  collectCycle: number;
  timestamp: number;
}

export async function getCurrentFundingRate(
  symbol?: TradingPair
): Promise<CurrentFundingRate[]> {
  const query = symbol ? `?symbol=${symbol}` : "";
  return makePublicRequest<CurrentFundingRate[]>(
    "/capi/v2/market/currentFundRate",
    query
  );
}
