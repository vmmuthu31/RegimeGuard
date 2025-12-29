"use client";

import { useEffect, useState, useCallback } from "react";
import { formatPrice } from "@/src/shared/utils/formatters";

interface OrderBookProps {
  tickerData: {
    lastPrice: string;
    priceChangePercent: string;
  } | null;
  symbol: string;
}

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
  depth: number;
}

export function OrderBook({ tickerData, symbol }: OrderBookProps) {
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const lastPrice = parseFloat(tickerData?.lastPrice || "0");

  const fetchOrderBook = useCallback(async () => {
    try {
      const symbolId = `cmt_${symbol.toLowerCase().replace("/", "")}`;
      const response = await fetch(
        `/api/market?action=orderbook&symbol=${symbolId}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        const maxAskTotal = Math.max(
          ...data.data.asks.map((a: [string, string]) => parseFloat(a[1])),
          1
        );
        const maxBidTotal = Math.max(
          ...data.data.bids.map((b: [string, string]) => parseFloat(b[1])),
          1
        );

        const formattedAsks = data.data.asks
          .slice(0, 10)
          .map((ask: [string, string], i: number, arr: [string, string][]) => {
            const price = parseFloat(ask[0]);
            const amount = parseFloat(ask[1]);
            const total = arr
              .slice(i)
              .reduce(
                (sum: number, a: [string, string]) => sum + parseFloat(a[1]),
                0
              );
            return {
              price,
              amount,
              total,
              depth: (amount / maxAskTotal) * 100,
            };
          })
          .reverse();

        const formattedBids = data.data.bids
          .slice(0, 10)
          .map((bid: [string, string], i: number, arr: [string, string][]) => {
            const price = parseFloat(bid[0]);
            const amount = parseFloat(bid[1]);
            const total = arr
              .slice(0, i + 1)
              .reduce(
                (sum: number, b: [string, string]) => sum + parseFloat(b[1]),
                0
              );
            return {
              price,
              amount,
              total,
              depth: (amount / maxBidTotal) * 100,
            };
          });

        setAsks(formattedAsks);
        setBids(formattedBids);
      }
    } catch (error) {
      console.error("Failed to fetch order book:", error);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 2000);
    return () => clearInterval(interval);
  }, [fetchOrderBook]);

  const spread =
    asks.length > 0 && bids.length > 0
      ? asks[asks.length - 1]?.price - bids[0]?.price
      : 0;

  const totalAsks = asks.reduce((sum, a) => sum + a.amount, 0);
  const totalBids = bids.reduce((sum, b) => sum + b.amount, 0);
  const bidPercentage =
    totalAsks + totalBids > 0
      ? Math.round((totalBids / (totalAsks + totalBids)) * 100)
      : 50;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#050505]">
        <div className="animate-pulse text-zinc-600 text-xs">
          Loading order book...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#050505] font-mono select-none custom-scrollbar overflow-y-auto">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1 cursor-pointer">
            <div className="w-3 h-3 bg-zinc-700/50 rounded-sm border border-white/5" />
            <div className="w-3 h-3 bg-zinc-700/50 rounded-sm border border-white/5" />
          </div>
          <div
            className="w-3 h-3 bg-red-500/20 rounded-sm border border-red-500/30 cursor-pointer hover:bg-red-500/30"
            title="Asks Only"
          />
          <div
            className="w-3 h-3 bg-emerald-500/20 rounded-sm border border-emerald-500/30 cursor-pointer hover:bg-emerald-500/30"
            title="Bids Only"
          />
        </div>
        <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold bg-zinc-900/50 px-2 py-0.5 rounded border border-white/5 cursor-pointer hover:text-zinc-200">
          0.01 <span className="text-zinc-600">▼</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between px-4 py-2.5 text-[9px] text-zinc-500 font-bold uppercase tracking-wider border-b border-white/5 bg-white/[0.01] sticky top-0 z-30 backdrop-blur-md">
        <span className="text-left w-1/3">Price (USDT)</span>
        <span className="text-right w-1/3">Amount</span>
        <span className="text-right w-1/3">Sum</span>
      </div>

      {/* Asks (Sell Orders) */}
      <div className="flex flex-col justify-end py-1 shrink-0">
        {asks.map((ask, i) => (
          <div
            key={`ask-${i}`}
            className="flex justify-between items-center px-4 py-[3px] relative group hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div
              className="absolute right-0 top-0 bottom-0 bg-red-500/10 transition-all duration-300 group-hover:bg-red-500/15"
              style={{
                width: `${ask.depth}%`,
                borderLeft: "2px solid rgba(239, 68, 68, 0.15)",
              }}
            />
            <span className="text-[11px] font-bold text-red-500 relative z-10 w-1/3 text-left">
              {formatPrice(ask.price.toString())}
            </span>
            <span className="text-[11px] text-zinc-300 relative z-10 w-1/3 text-right">
              {ask.amount.toFixed(4)}
            </span>
            <span className="text-[10px] text-zinc-500 relative z-10 w-1/3 text-right">
              {ask.total.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Spread / Current Price Indicator */}
      <div className="py-4 my-1.5 bg-gradient-to-r from-zinc-950 via-zinc-900/40 to-zinc-950 border-y border-white/5 flex items-center justify-between px-6 backdrop-blur-xl shadow-inner relative overflow-hidden">
        <div
          className={`absolute inset-0 opacity-10 blur-xl transition-colors duration-700 ${
            parseFloat(tickerData?.priceChangePercent || "0") >= 0
              ? "bg-emerald-500/20"
              : "bg-red-500/20"
          }`}
        />

        <div className="flex flex-col relative z-10">
          <div
            className={`text-2xl font-bold tracking-tight ${
              parseFloat(tickerData?.priceChangePercent || "0") >= 0
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {formatPrice(lastPrice.toString())}
          </div>
          <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">
            Index Value (USD)
          </div>
        </div>

        <div className="flex flex-col items-end relative z-10">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            {spread.toFixed(2)} <span className="text-zinc-600">SPREAD</span>
          </span>
          <span
            className={`text-[10px] font-bold font-mono ${
              parseFloat(tickerData?.priceChangePercent || "0") >= 0
                ? "text-emerald-500/60"
                : "text-red-500/60"
            }`}
          >
            {parseFloat(tickerData?.priceChangePercent || "0") >= 0 ? "+" : ""}
            {(parseFloat(tickerData?.priceChangePercent || "0") * 100).toFixed(
              2
            )}
            %
          </span>
        </div>
      </div>

      {/* Bids (Buy Orders) */}
      <div className="py-1">
        {bids.map((bid, i) => (
          <div
            key={`bid-${i}`}
            className="flex justify-between items-center px-4 py-[3px] relative group hover:bg-white/5 cursor-pointer transition-colors"
          >
            <div
              className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 transition-all duration-300 group-hover:bg-emerald-500/15"
              style={{
                width: `${bid.depth}%`,
                borderLeft: "2px solid rgba(16, 185, 129, 0.15)",
              }}
            />
            <span className="text-[11px] font-bold text-emerald-500 relative z-10 w-1/3 text-left">
              {formatPrice(bid.price.toString())}
            </span>
            <span className="text-[11px] text-zinc-300 relative z-10 w-1/3 text-right">
              {bid.amount.toFixed(4)}
            </span>
            <span className="text-[10px] text-zinc-500 relative z-10 w-1/3 text-right">
              {bid.total.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Buy/Sell Ratio Bar */}
      <div className="px-4 py-2 border-t border-white/5 mt-auto">
        <div className="flex h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 transition-all duration-500"
            style={{ width: `${bidPercentage}%` }}
          />
          <div
            className="bg-red-500 transition-all duration-500"
            style={{ width: `${100 - bidPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] mt-1">
          <span className="text-emerald-400 font-bold">{bidPercentage}%</span>
          <span className="text-red-400 font-bold">{100 - bidPercentage}%</span>
        </div>
      </div>
    </div>
  );
}
