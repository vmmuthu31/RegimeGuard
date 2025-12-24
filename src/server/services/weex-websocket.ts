import WebSocket from "ws";
import type { TradingPair } from "@/shared/constants";

const WS_PUBLIC_URL = "wss://ws-contract.weex.com/v2/ws/public";

type KlineInterval =
  | "MINUTE_1"
  | "MINUTE_5"
  | "MINUTE_15"
  | "MINUTE_30"
  | "HOUR_1"
  | "HOUR_4"
  | "DAY_1";
type PriceType = "LAST_PRICE" | "MARK_PRICE";
type DepthLevel = "15" | "200";

interface TickerData {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  trades: string;
  size: string;
  value: string;
  high: string;
  low: string;
  lastPrice: string;
  markPrice: string;
  indexPrice?: string;
}

interface KlineData {
  symbol: string;
  klineTime: string;
  size: string;
  value: string;
  high: string;
  low: string;
  open: string;
  close: string;
}

interface DepthData {
  startVersion: string;
  endVersion: string;
  level: number;
  depthType: "SNAPSHOT" | "CHANGED";
  symbol: string;
  asks: Array<{ price: string; size: string }>;
  bids: Array<{ price: string; size: string }>;
}

interface TradeData {
  time: string;
  price: string;
  size: string;
  value: string;
  buyerMaker: boolean;
}

type MessageHandler<T> = (data: T) => void;

interface WebSocketClientState {
  ws: WebSocket | null;
  isConnected: boolean;
  subscriptions: Set<string>;
  handlers: Map<string, MessageHandler<unknown>>;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
}

const clientState: WebSocketClientState = {
  ws: null,
  isConnected: false,
  subscriptions: new Set(),
  handlers: new Map(),
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,
};

function createConnection(): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(WS_PUBLIC_URL, {
      headers: { "User-Agent": "regimeguard-trading-bot/1.0" },
    });

    ws.on("open", () => {
      clientState.isConnected = true;
      clientState.reconnectAttempts = 0;
      resolve(ws);
    });

    ws.on("message", (data: Buffer) => {
      try {
        const msg = JSON.parse(data.toString());
        handleMessage(msg);
      } catch {}
    });

    ws.on("close", () => {
      clientState.isConnected = false;
      handleDisconnect();
    });

    ws.on("error", (error: Error) => {
      if (!clientState.isConnected) {
        reject(error);
      }
    });
  });
}

function handleMessage(msg: {
  event: string;
  channel?: string;
  data?: unknown[];
  time?: string;
}): void {
  if (msg.event === "ping" && msg.time) {
    clientState.ws?.send(JSON.stringify({ event: "pong", time: msg.time }));
    return;
  }

  if (msg.event === "payload" && msg.channel && msg.data) {
    const handler = clientState.handlers.get(msg.channel);
    if (handler) {
      msg.data.forEach((item) => handler(item));
    }
  }
}

function handleDisconnect(): void {
  if (clientState.reconnectAttempts < clientState.maxReconnectAttempts) {
    clientState.reconnectAttempts++;
    setTimeout(() => {
      reconnect();
    }, 1000 * clientState.reconnectAttempts);
  }
}

async function reconnect(): Promise<void> {
  try {
    clientState.ws = await createConnection();
    for (const channel of clientState.subscriptions) {
      clientState.ws.send(JSON.stringify({ event: "subscribe", channel }));
    }
  } catch {}
}

export async function initWebSocket(): Promise<boolean> {
  if (clientState.ws && clientState.isConnected) {
    return true;
  }

  try {
    clientState.ws = await createConnection();
    return true;
  } catch {
    return false;
  }
}

export function closeWebSocket(): void {
  if (clientState.ws) {
    clientState.ws.close();
    clientState.ws = null;
    clientState.isConnected = false;
    clientState.subscriptions.clear();
    clientState.handlers.clear();
  }
}

export function isWebSocketConnected(): boolean {
  return clientState.isConnected;
}

function subscribe(channel: string): boolean {
  if (!clientState.ws || !clientState.isConnected) {
    return false;
  }

  clientState.ws.send(JSON.stringify({ event: "subscribe", channel }));
  clientState.subscriptions.add(channel);
  return true;
}

function unsubscribe(channel: string): boolean {
  if (!clientState.ws || !clientState.isConnected) {
    return false;
  }

  clientState.ws.send(JSON.stringify({ event: "unsubscribe", channel }));
  clientState.subscriptions.delete(channel);
  clientState.handlers.delete(channel);
  return true;
}

export function subscribeTicker(
  symbol: TradingPair,
  handler: MessageHandler<TickerData>
): boolean {
  const channel = `ticker.${symbol}`;
  clientState.handlers.set(channel, handler as MessageHandler<unknown>);
  return subscribe(channel);
}

export function unsubscribeTicker(symbol: TradingPair): boolean {
  return unsubscribe(`ticker.${symbol}`);
}

export function subscribeKline(
  symbol: TradingPair,
  interval: KlineInterval,
  handler: MessageHandler<KlineData>,
  priceType: PriceType = "LAST_PRICE"
): boolean {
  const channel = `kline.${priceType}.${symbol}.${interval}`;
  clientState.handlers.set(channel, handler as MessageHandler<unknown>);
  return subscribe(channel);
}

export function unsubscribeKline(
  symbol: TradingPair,
  interval: KlineInterval,
  priceType: PriceType = "LAST_PRICE"
): boolean {
  return unsubscribe(`kline.${priceType}.${symbol}.${interval}`);
}

export function subscribeDepth(
  symbol: TradingPair,
  level: DepthLevel,
  handler: MessageHandler<DepthData>
): boolean {
  const channel = `depth.${symbol}.${level}`;
  clientState.handlers.set(channel, handler as MessageHandler<unknown>);
  return subscribe(channel);
}

export function unsubscribeDepth(
  symbol: TradingPair,
  level: DepthLevel
): boolean {
  return unsubscribe(`depth.${symbol}.${level}`);
}

export function subscribeTrades(
  symbol: TradingPair,
  handler: MessageHandler<TradeData>
): boolean {
  const channel = `trades.${symbol}`;
  clientState.handlers.set(channel, handler as MessageHandler<unknown>);
  return subscribe(channel);
}

export function unsubscribeTrades(symbol: TradingPair): boolean {
  return unsubscribe(`trades.${symbol}`);
}

export function getSubscriptions(): string[] {
  return Array.from(clientState.subscriptions);
}

export type {
  TickerData as WsTickerData,
  KlineData as WsKlineData,
  DepthData as WsDepthData,
  TradeData as WsTradeData,
  KlineInterval,
  DepthLevel,
  PriceType as WsPriceType,
};
