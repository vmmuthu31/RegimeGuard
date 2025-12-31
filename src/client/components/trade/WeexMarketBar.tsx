"use client";

import { cn } from "@/src/lib/utils";
import { formatPercent, formatPrice } from "@/src/shared/utils/formatters";
import { Zap } from "lucide-react";

interface TickerData {
    lastPrice: string;
    priceChangePercent: string;
    high: string;
    low: string;
    volume?: string;
}

interface WeexMarketBarProps {
    tickerData: TickerData | null;
    symbol: string;
}

export function WeexMarketBar({ tickerData, symbol }: WeexMarketBarProps) {
    if (!tickerData) return null;

    const isPositive = parseFloat(tickerData.priceChangePercent) >= 0;

    return (
        <div className="flex items-center gap-8 overflow-hidden h-full">
            {/* Price Block */}
            <div className="flex flex-col group/price">
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter mb-0.5 group-hover/price:text-emerald-500/80 transition-colors flex items-center gap-1">
                    Mark Price
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                </span>
                <span
                    className={cn(
                        "text-[13px] font-mono font-black tracking-tight transition-all duration-300",
                        isPositive
                            ? "text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]"
                            : "text-red-400 drop-shadow-[0_0_12px_rgba(248,113,113,0.4)]"
                    )}
                >
                    {formatPrice(tickerData.lastPrice)}
                </span>
            </div>

            {/* 24h Change */}
            <div className="hidden sm:flex flex-col">
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter mb-0.5">
                    24h Change
                </span>
                <span
                    className={cn(
                        "text-[11px] font-mono font-bold tracking-tight",
                        isPositive ? "text-emerald-500" : "text-red-500"
                    )}
                >
                    {formatPercent(tickerData.priceChangePercent)}
                </span>
            </div>

            {/* 24h High */}
            <div className="hidden md:flex flex-col">
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter mb-0.5">
                    24h High
                </span>
                <span className="text-[11px] font-mono font-bold tracking-tight text-white">
                    {formatPrice(tickerData.high)}
                </span>
            </div>

            {/* 24h Low */}
            <div className="hidden md:flex flex-col">
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter mb-0.5">
                    24h Low
                </span>
                <span className="text-[11px] font-mono font-bold tracking-tight text-white">
                    {formatPrice(tickerData.low)}
                </span>
            </div>

            {/* Volume */}
            <div className="hidden lg:flex flex-col">
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter mb-0.5">
                    24h Volume
                </span>
                <span className="text-[11px] font-mono font-bold tracking-tight text-white">
                    {tickerData.volume ? parseFloat(tickerData.volume).toLocaleString() : "--"}
                </span>
            </div>

            {/* Funding & Countdown (Simulated for Demo) */}
            <div className="hidden xl:flex flex-col pl-4 border-l border-white/10">
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter mb-0.5 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-yellow-500" />
                    Funding / Countdown
                </span>
                <span className="text-[11px] font-mono font-bold tracking-tight text-yellow-500/80 uppercase">
                    0.0100% / 06:42:12
                </span>
            </div>
        </div>
    );
}
