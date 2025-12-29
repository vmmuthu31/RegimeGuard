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
          .slice(0, 8)
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
          .slice(0, 8)
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
    <div className="flex flex-col h-full bg-[#0B0E11] font-mono select-none overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/20 bg-zinc-950/60 relative">
        {/* Neon Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0 opacity-100 transition-opacity" />

        <div className="flex items-center gap-3">
          <div className="flex gap-1 cursor-pointer">
            <div className="w-3.5 h-3.5 bg-zinc-800 rounded-sm border border-white/20 shadow-lg" />
            <div className="w-3.5 h-3.5 bg-zinc-800 rounded-sm border border-white/20 shadow-lg" />
          </div>
          <div
            className="w-3.5 h-3.5 bg-red-500/30 rounded-sm border border-red-500/50 cursor-pointer hover:bg-red-500/40 shadow-lg shadow-red-500/10"
            title="Asks Only"
          />
          <div
            className="w-3.5 h-3.5 bg-emerald-500/30 rounded-sm border border-emerald-500/50 cursor-pointer hover:bg-emerald-500/40 shadow-lg shadow-emerald-500/10"
            title="Bids Only"
          />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-white font-black bg-zinc-900 px-3 py-1 rounded border border-white/20 cursor-pointer hover:bg-zinc-800 transition-colors shadow-2xl">
          0.01 <span className="text-zinc-500 text-[9px]">▼</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between px-4 py-2.5 text-[10px] text-zinc-400 font-black uppercase tracking-[0.15em] border-b border-white/20 bg-zinc-950/40 sticky top-0 z-30 backdrop-blur-md">
        <span className="text-left w-1/3">Price <span className="text-[8px] opacity-40">(USDT)</span></span>
        <span className="text-right w-1/3">Amount</span>
        <span className="text-right w-1/3">Sum</span>
      </div>

      {/* Asks (Sell Orders) */}
      <div className="flex flex-col justify-end py-1 shrink-0">
        {asks.map((ask, i) => (
          <div
            key={`ask-${i}`}
            className="flex justify-between items-center px-4 py-[4px] relative group hover:bg-white/[0.03] cursor-pointer transition-colors"
          >
            <div
              className="absolute right-0 top-0 bottom-0 bg-red-500/10 transition-all duration-300 group-hover:bg-red-500/20"
              style={{
                width: `${ask.depth}%`,
                borderLeft: "2px solid rgba(239, 68, 68, 0.3)",
              }}
            />
            <span className="text-[11px] font-black text-red-400 relative z-10 w-1/3 text-left drop-shadow-[0_0_8px_rgba(239,68,68,0.2)]">
              {formatPrice(ask.price.toString())}
            </span>
            <span className="text-[11px] text-zinc-200 font-bold relative z-10 w-1/3 text-right">
              {ask.amount.toFixed(4)}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono font-bold relative z-10 w-1/3 text-right">
              {ask.total.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Spread / Current Price Indicator */}
      <div className="py-5 my-1.5 bg-gradient-to-r from-zinc-950 via-zinc-900/60 to-zinc-950 border-y border-white/20 flex items-center justify-between px-6 backdrop-blur-xl shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div
          className={`absolute inset-0 opacity-20 blur-2xl transition-colors duration-700 ${parseFloat(tickerData?.priceChangePercent || "0") >= 0
            ? "bg-emerald-500/30"
            : "bg-red-500/30"
            }`}
        />

        <div className="flex flex-col relative z-10">
          <div
            className={`text-2xl font-black tracking-tighter ${parseFloat(tickerData?.priceChangePercent || "0") >= 0
              ? "text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]"
              : "text-red-400 drop-shadow-[0_0_12px_rgba(248,113,113,0.5)]"
              }`}
          >
            {formatPrice(lastPrice.toString())}
          </div>
          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-1 shadow-sm">
            Mark Index <span className="text-[8px] opacity-40">USD</span>
          </div>
        </div>

        <div className="flex flex-col items-end relative z-10">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            {spread.toFixed(2)} <span className="text-zinc-600">SPREAD</span>
          </span>
          <span
            className={`text-[10px] font-bold font-mono ${parseFloat(tickerData?.priceChangePercent || "0") >= 0
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
            className="flex justify-between items-center px-4 py-[4px] relative group hover:bg-white/[0.03] cursor-pointer transition-colors"
          >
            <div
              className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 transition-all duration-300 group-hover:bg-emerald-500/20"
              style={{
                width: `${bid.depth}%`,
                borderLeft: "2px solid rgba(16, 185, 129, 0.3)",
              }}
            />
            <span className="text-[11px] font-black text-emerald-400 relative z-10 w-1/3 text-left drop-shadow-[0_0_8px_rgba(52,211,153,0.2)]">
              {formatPrice(bid.price.toString())}
            </span>
            <span className="text-[11px] text-zinc-200 font-bold relative z-10 w-1/3 text-right">
              {bid.amount.toFixed(4)}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono font-bold relative z-10 w-1/3 text-right">
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
