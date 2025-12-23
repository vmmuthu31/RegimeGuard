import { createHmac } from "crypto";
import {
  WEEX_BASE_URL,
  TradingPair,
  ORDER_SIDES,
  ORDER_TYPES,
} from "@/shared/constants";
import type {
  MarketData,
  AccountBalance,
  Position,
  Candle,
} from "@/shared/types";

interface WeexConfig {
  apiKey: string;
  secretKey: string;
  passphrase: string;
}

function generateSignature(
  secretKey: string,
  timestamp: string,
  method: string,
  requestPath: string,
  queryString: string,
  body: string
): string {
  const message =
    timestamp + method.toUpperCase() + requestPath + queryString + body;
  const signature = createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");
  return signature;
}

async function makeRequest<T>(
  config: WeexConfig,
  method: "GET" | "POST",
  requestPath: string,
  queryString: string = "",
  body: object | null = null
): Promise<T> {
  const timestamp = Date.now().toString();
  const bodyString = body ? JSON.stringify(body) : "";
  const signature = generateSignature(
    config.secretKey,
    timestamp,
    method,
    requestPath,
    queryString,
    bodyString
  );

  const headers: Record<string, string> = {
    "ACCESS-KEY": config.apiKey,
    "ACCESS-SIGN": signature,
    "ACCESS-TIMESTAMP": timestamp,
    "ACCESS-PASSPHRASE": config.passphrase,
    "Content-Type": "application/json",
    locale: "en-US",
  };

  const url = `${WEEX_BASE_URL}${requestPath}${queryString}`;
  const response = await fetch(url, {
    method,
    headers,
    body: method === "POST" ? bodyString : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WEEX API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

async function makePublicRequest<T>(
  requestPath: string,
  queryString: string = ""
): Promise<T> {
  const url = `${WEEX_BASE_URL}${requestPath}${queryString}`;
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WEEX API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export async function getServerTime(): Promise<{ timestamp: number }> {
  const data = await makePublicRequest<{ timestamp: number }>(
    "/capi/v2/market/time"
  );
  return data;
}

export async function getTicker(symbol: TradingPair): Promise<MarketData> {
  const data = await makePublicRequest<{
    symbol: string;
    last: string;
    best_ask: string;
    best_bid: string;
    high_24h: string;
    low_24h: string;
    volume_24h: string;
    timestamp: string;
    priceChangePercent: string;
    markPrice: string;
    indexPrice: string;
  }>("/capi/v2/market/ticker", `?symbol=${symbol}`);

  return {
    symbol: symbol,
    last: parseFloat(data.last),
    bestAsk: parseFloat(data.best_ask),
    bestBid: parseFloat(data.best_bid),
    high24h: parseFloat(data.high_24h),
    low24h: parseFloat(data.low_24h),
    volume24h: parseFloat(data.volume_24h),
    timestamp: parseInt(data.timestamp),
    priceChangePercent: parseFloat(data.priceChangePercent),
    markPrice: parseFloat(data.markPrice),
    indexPrice: parseFloat(data.indexPrice),
  };
}

export async function getCandles(
  symbol: TradingPair,
  granularity: string = "1m",
  limit: number = 100
): Promise<Candle[]> {
  const data = await makePublicRequest<
    Array<[string, string, string, string, string, string]>
  >(
    "/capi/v2/market/candles",
    `?symbol=${symbol}&granularity=${granularity}&limit=${limit}`
  );

  return data.map(([timestamp, open, high, low, close, volume]) => ({
    timestamp: parseInt(timestamp),
    open: parseFloat(open),
    high: parseFloat(high),
    low: parseFloat(low),
    close: parseFloat(close),
    volume: parseFloat(volume),
  }));
}

export async function getContractInfo(symbol: TradingPair): Promise<{
  minOrderSize: number;
  maxOrderSize: number;
  maxLeverage: number;
  tickSize: number;
  contractVal: number;
}> {
  const data = await makePublicRequest<
    Array<{
      symbol: string;
      minOrderSize: string;
      maxOrderSize: string;
      maxLeverage: number;
      tick_size: string;
      contract_val: string;
    }>
  >("/capi/v2/market/contracts", `?symbol=${symbol}`);

  const contract = data[0];
  return {
    minOrderSize: parseFloat(contract.minOrderSize),
    maxOrderSize: parseFloat(contract.maxOrderSize),
    maxLeverage: contract.maxLeverage,
    tickSize: parseFloat(contract.tick_size),
    contractVal: parseFloat(contract.contract_val),
  };
}

export async function getAccountBalance(
  config: WeexConfig
): Promise<AccountBalance[]> {
  const data = await makeRequest<
    Array<{
      coinName: string;
      available: string;
      equity: string;
      frozen: string;
      unrealizePnl: string;
    }>
  >(config, "GET", "/capi/v2/account/assets", "");

  return data.map((item) => ({
    coinName: item.coinName,
    available: parseFloat(item.available),
    equity: parseFloat(item.equity),
    frozen: parseFloat(item.frozen),
    unrealizedPnl: parseFloat(item.unrealizePnl),
  }));
}

export async function getPositions(
  config: WeexConfig,
  symbol?: TradingPair
): Promise<Position[]> {
  const queryString = symbol ? `?symbol=${symbol}` : "";
  const data = await makeRequest<
    Array<{
      symbol: string;
      positionSide: string;
      positionAmt: string;
      avgEntryPrice: string;
      markPrice: string;
      unrealizePnl: string;
      leverage: string;
      marginMode: string;
      liquidationPrice: string;
      timestamp: string;
    }>
  >(config, "GET", "/capi/v2/account/position/allPosition", queryString);

  return data.map((item) => ({
    symbol: item.symbol as TradingPair,
    side: item.positionSide as "LONG" | "SHORT",
    size: parseFloat(item.positionAmt),
    entryPrice: parseFloat(item.avgEntryPrice),
    markPrice: parseFloat(item.markPrice),
    unrealizedPnl: parseFloat(item.unrealizePnl),
    leverage: parseFloat(item.leverage),
    marginMode: item.marginMode as "CROSS" | "ISOLATED",
    liquidationPrice: parseFloat(item.liquidationPrice),
    timestamp: parseInt(item.timestamp),
  }));
}

export async function setLeverage(
  config: WeexConfig,
  symbol: TradingPair,
  leverage: number
): Promise<void> {
  await makeRequest(config, "POST", "/capi/v2/account/leverage", "", {
    symbol,
    marginMode: 1,
    longLeverage: leverage.toString(),
    shortLeverage: leverage.toString(),
  });
}

export async function placeOrder(
  config: WeexConfig,
  params: {
    symbol: TradingPair;
    side: "BUY" | "SELL";
    size: number;
    price?: number;
    orderType: "LIMIT" | "MARKET";
    clientOid?: string;
  }
): Promise<{ orderId: string; clientOid: string | null }> {
  const body = {
    symbol: params.symbol,
    client_oid: params.clientOid || `rg_${Date.now()}`,
    size: params.size.toString(),
    type: params.side === "BUY" ? ORDER_SIDES.BUY : ORDER_SIDES.SELL,
    order_type:
      params.orderType === "LIMIT" ? ORDER_TYPES.LIMIT : ORDER_TYPES.MARKET,
    match_price: params.orderType === "MARKET" ? "1" : "0",
    price: params.price?.toString() || "0",
  };

  const data = await makeRequest<{
    order_id: string;
    client_oid: string | null;
  }>(config, "POST", "/capi/v2/order/placeOrder", "", body);

  return { orderId: data.order_id, clientOid: data.client_oid };
}

export async function cancelOrder(
  config: WeexConfig,
  symbol: TradingPair,
  orderId: string
): Promise<void> {
  await makeRequest(config, "POST", "/capi/v2/order/cancelOrder", "", {
    symbol,
    orderId,
  });
}

export async function getOrderFills(
  config: WeexConfig,
  symbol: TradingPair,
  orderId: string
): Promise<
  Array<{
    tradeId: number;
    orderId: number;
    fillSize: string;
    fillValue: string;
    fillFee: string;
    realizePnl: string;
    createdTime: number;
  }>
> {
  const data = await makeRequest<{
    list: Array<{
      tradeId: number;
      orderId: number;
      fillSize: string;
      fillValue: string;
      fillFee: string;
      realizePnl: string;
      createdTime: number;
    }>;
  }>(
    config,
    "GET",
    "/capi/v2/order/fills",
    `?symbol=${symbol}&orderId=${orderId}`
  );

  return data.list;
}
