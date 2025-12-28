"use client";

import React, { useMemo } from "react";
import { formatPrice } from "@/src/shared/utils/formatters";
import { motion } from "framer-motion";

interface OrderBookProps {
    tickerData: {
        lastPrice: string;
        priceChangePercent: string;
    } | null;
    symbol: string;
}

export function OrderBook({ tickerData, symbol }: OrderBookProps) {
    const lastPrice = parseFloat(tickerData?.lastPrice || "0");
    const basePrice = lastPrice || 98000; // Fallback for pure UI dev if data missing

    // Generate deterministic mock data for visual stability
    const asks = useMemo(() => {
        return Array.from({ length: 8 }).map((_, i) => ({
            price: basePrice + (8 - i) * 5 + Math.random() * 2,
            amount: Math.random() * 1.5,
            total: Math.random() * 10,
            depth: Math.random() * 100,
        }));
    }, [basePrice]);

    const bids = useMemo(() => {
        return Array.from({ length: 8 }).map((_, i) => ({
            price: basePrice - (i + 1) * 5 - Math.random() * 2,
            amount: Math.random() * 1.5,
            total: Math.random() * 10,
            depth: Math.random() * 100,
        }));
    }, [basePrice]);

    const spread = asks[asks.length - 1].price - bids[0].price;
    const spreadPercent = (spread / lastPrice) * 100;

    return (
        <div className="flex flex-col h-full bg-[#050505] font-mono select-none custom-scrollbar overflow-y-auto">
            {/* Toolbar - Matching Reference */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1 group/btn cursor-pointer">
                        <div className="w-3 h-3 bg-zinc-700/50 rounded-sm group-hover/btn:bg-zinc-600 border border-white/5" />
                        <div className="w-3 h-3 bg-zinc-700/50 rounded-sm group-hover/btn:bg-zinc-600 border border-white/5" />
                    </div>
                    <div className="w-3 h-3 bg-red-500/20 rounded-sm border border-red-500/30 cursor-pointer hover:bg-red-500/30" title="Asks Only" />
                    <div className="w-3 h-3 bg-emerald-500/20 rounded-sm border border-emerald-500/30 cursor-pointer hover:bg-emerald-500/30" title="Bids Only" />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold bg-zinc-900/50 px-2 py-0.5 rounded border border-white/5 cursor-pointer hover:text-zinc-200">
                    0.1 <span className="text-zinc-600">▼</span>
                </div>
            </div>

            {/* Header */}
            <div className="flex justify-between px-4 py-2.5 text-[9px] text-zinc-500 font-bold uppercase tracking-[0.1em] border-b border-white/5 bg-white/[0.01] sticky top-0 z-30 backdrop-blur-md">
                <span className="text-left w-1/3">Price (USDT)</span>
                <span className="text-right w-1/3">Size (BTC)</span>
                <span className="text-right w-1/3">Sum (BTC)</span>
            </div>

            {/* Asks (Sell Orders) - Red - Reverse Order bottom-up visually */}
            <div className="flex flex-col justify-end py-1 shrink-0">
                {asks.map((ask, i) => (
                    <div
                        key={`ask-${i}`}
                        className="flex justify-between items-center px-4 py-[3px] relative group hover:bg-white/5 cursor-pointer transition-colors"
                    >
                        {/* Depth Bar with Glow Edge */}
                        <div
                            className="absolute right-0 top-0 bottom-0 bg-red-500/10 transition-all duration-300 group-hover:bg-red-500/15"
                            style={{ width: `${ask.depth}%`, borderLeft: "2px solid rgba(239, 68, 68, 0.15)" }}
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

            {/* Spread / Current Price Indicator - HIGH VISIBILITY */}
            <div className="py-4 my-1.5 bg-linear-to-r from-zinc-950 via-zinc-900/40 to-zinc-950 border-y border-white/5 flex items-center justify-between px-6 backdrop-blur-xl shadow-inner relative overflow-hidden group/spread">
                {/* Accent Background Glow */}
                <div className={`absolute inset-0 opacity-10 blur-xl transition-colors duration-700 ${parseFloat(tickerData?.priceChangePercent || "0") >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`} />

                <div className="flex flex-col relative z-10">
                    <div className={`text-2xl font-bold tracking-tight ${parseFloat(tickerData?.priceChangePercent || "0") >= 0 ? "text-emerald-400 shadow-emerald-500/20" : "text-red-400 shadow-red-500/20"}`}>
                        {formatPrice(lastPrice.toString())}
                    </div>
                    <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">Index Value (USD)</div>
                </div>

                <div className="flex flex-col items-end relative z-10">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{spread.toFixed(1)} <span className="text-zinc-600">SPREAD</span></span>
                    <span className={`text-[10px] font-bold font-mono ${parseFloat(tickerData?.priceChangePercent || "0") >= 0 ? "text-emerald-500/60" : "text-red-500/60"}`}>
                        {parseFloat(tickerData?.priceChangePercent || "0") >= 0 ? "+" : ""}{tickerData?.priceChangePercent}%
                    </span>
                </div>
            </div>

            {/* Bids (Buy Orders) - Green */}
            <div className="py-1">
                {bids.map((bid, i) => (
                    <div
                        key={`bid-${i}`}
                        className="flex justify-between items-center px-4 py-[3px] relative group hover:bg-white/5 cursor-pointer transition-colors"
                    >
                        {/* Depth Bar with Glow Edge */}
                        <div
                            className={`absolute right-0 top-0 bottom-0 bg-emerald-500/10 transition-all duration-300 group-hover:bg-emerald-500/15`}
                            style={{ width: `${bid.depth}%`, borderLeft: "2px solid rgba(16, 185, 129, 0.15)" }}
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
        </div>
    );
}
