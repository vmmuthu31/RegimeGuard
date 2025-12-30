"use client";

import { useState, useCallback, useEffect } from "react";
import type { Time } from "lightweight-charts";
import type { WeexRawOrder } from "@/src/shared/types/trading";

export interface TickerData {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  high: string;
  low: string;
  markPrice: string;
  indexPrice: string;
  trades: string;
  size: string;
  value: string;
}

export interface KlineData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface AccountData {
  balance: {
    coinName: string;
    available: number;
    equity: number;
    frozen: number;
    unrealizedPnl: number;
  };
  positions: unknown[];
}

export interface MarketData {
  regime: { regime: string; confidence: number };
  indicators: {
    rsi: number;
    ema9: number;
    ema21: number;
    atr: number;
    volatility: number;
  };
}

export const SYMBOLS = [
  { id: "cmt_btcusdt", name: "BTC/USDT", iconKey: "BTC", color: "#f7931a", stepSize: 0.0001, precision: 4 },
  { id: "cmt_ethusdt", name: "ETH/USDT", iconKey: "ETH", color: "#627eea", stepSize: 0.001, precision: 3 },
  { id: "cmt_solusdt", name: "SOL/USDT", iconKey: "SOL", color: "#00ffa3", stepSize: 0.01, precision: 2 },
  { id: "cmt_dogeusdt", name: "DOGE/USDT", iconKey: "DOGE", color: "#ba9f33", stepSize: 100, precision: 0 },
  { id: "cmt_xrpusdt", name: "XRP/USDT", iconKey: "XRP", color: "#a8a9ad", stepSize: 1, precision: 0 },
  { id: "cmt_adausdt", name: "ADA/USDT", iconKey: "ADA", color: "#0033ad", stepSize: 1, precision: 0 },
  { id: "cmt_bnbusdt", name: "BNB/USDT", iconKey: "BNB", color: "#f3ba2f", stepSize: 0.01, precision: 2 },
  { id: "cmt_ltcusdt", name: "LTC/USDT", iconKey: "LTC", color: "#345c9c", stepSize: 0.01, precision: 2 },
];

export function useDashboardData() {
  const [connected, setConnected] = useState(false);
  const [tickers, setTickers] = useState<Record<string, TickerData>>({});
  const [klines, setKlines] = useState<Record<string, KlineData[]>>({});
  const [lastUpdate, setLastUpdate] = useState(0);
  const [account, setAccount] = useState<AccountData | null>(null);
  const [market, setMarket] = useState<MarketData | null>(null);
  const [loopRunning, setLoopRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<WeexRawOrder[]>([]);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/trade?action=current");
      const data = await response.json();
      if (data.success) setOrders(data.data);
    } catch { }
  }, []);

  const connectAndSubscribe = useCallback(async () => {
    try {
      await fetch("/api/websocket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "connect" }),
      });
      setConnected(true);

      for (const sym of SYMBOLS) {
        await fetch("/api/websocket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "subscribe",
            channel: "ticker",
            symbol: sym.id,
          }),
        });
        await fetch("/api/websocket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "subscribe",
            channel: "kline",
            symbol: sym.id,
            interval: "MINUTE_1",
          }),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
    }
  }, []);

  const fetchWebSocketData = useCallback(async () => {
    if (!connected) return;
    try {
      const response = await fetch("/api/websocket?action=data");
      const data = await response.json();
      if (data.success && data.data.channels) {
        const newTickers: Record<string, TickerData> = {};
        for (const [key, value] of Object.entries(data.data.channels)) {
          if (key.startsWith("ticker.")) {
            newTickers[key.replace("ticker.", "")] = value as TickerData;
          }
        }
        if (Object.keys(newTickers).length) setTickers(newTickers);
        setLastUpdate(Date.now());
      }
    } catch { }
  }, [connected]);

  const fetchKlineData = useCallback(async (symbol: string, granularity: string = "1m") => {
    try {
      const response = await fetch(
        `/api/market/data?symbol=${symbol}&endpoint=candles&limit=100&granularity=${granularity}`
      );
      const data = await response.json();
      if (data.success && data.data) {
        const formattedKlines: KlineData[] = data.data.map(
          (c: {
            timestamp: number;
            open: number;
            high: number;
            low: number;
            close: number;
          }) => ({
            time: Math.floor(c.timestamp / 1000) as Time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
          })
        );
        setKlines((prev) => ({ ...prev, [symbol]: formattedKlines }));
      }
    } catch { }
  }, []);

  const fetchAccountData = useCallback(async () => {
    try {
      const response = await fetch("/api/account");
      const data = await response.json();
      if (data.success) setAccount(data.data);
    } catch { }
  }, []);

  const fetchMarketData = useCallback(async () => {
    try {
      const response = await fetch("/api/market?symbol=cmt_btcusdt");
      const data = await response.json();
      if (data.success) setMarket(data.data);
    } catch { }
  }, []);

  const fetchLoopStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/loop?action=status");
      const data = await response.json();
      if (data.success && data.data?.state) {
        setLoopRunning(data.data.state.isRunning);
      }
    } catch { }
  }, []);

  const toggleTradingLoop = async () => {
    try {
      const response = await fetch("/api/loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: loopRunning ? "stop" : "start" }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchLoopStatus();
      }
    } catch { }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void connectAndSubscribe();
    void fetchAccountData();
    void fetchMarketData();
    void fetchOrders();
    void fetchLoopStatus();
  }, [
    connectAndSubscribe,
    fetchAccountData,
    fetchMarketData,
    fetchOrders,
    fetchLoopStatus,
  ]);

  useEffect(() => {
    if (!connected) return;
    const interval = setInterval(() => {
      void fetchWebSocketData();
      void fetchAccountData();
      void fetchMarketData();
      void fetchOrders();
      void fetchLoopStatus();
    }, 1500);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchWebSocketData();
    return () => clearInterval(interval);
  }, [
    connected,
    fetchWebSocketData,
    fetchAccountData,
    fetchMarketData,
    fetchOrders,
    fetchLoopStatus,
  ]);

  return {
    connected,
    tickers,
    klines,
    lastUpdate,
    account,
    market,
    orders,
    loopRunning,
    error,
    fetchKlineData,
    fetchOrders,
    toggleTradingLoop,
  };
}
