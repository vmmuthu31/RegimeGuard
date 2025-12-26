"use client";

import React from "react";
import { TrendingUp, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { formatPercent } from "@/src/shared/utils/formatters";
import type {
  TickerData,
  MarketData,
} from "@/src/client/hooks/useDashboardData";

interface MarketOverviewProps {
  tickers: Record<string, TickerData>;
  market: MarketData | null;
  symbols: Array<{ id: string; name: string }>;
}

export function MarketOverview({
  tickers,
  market,
  symbols,
}: MarketOverviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Market Performance */}
      <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 h-full">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2.5 text-white/90">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span>Market Performance</span>
        </h3>
        <div className="space-y-5">
          {symbols.map((sym, i) => {
            const data = tickers[sym.id];
            if (!data) return null;

            const priceChange = parseFloat(data.priceChangePercent);
            const isPositive = priceChange >= 0;
            // Cap width at 100%, scale factor slightly adjusted for visual balance
            const width = Math.min(Math.abs(priceChange * 100) * 15, 100);

            return (
              <div key={sym.id} className="flex items-center gap-4 group">
                <div className="w-20 text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">
                  {sym.name}
                </div>
                <div className="flex-1 h-2.5 bg-zinc-800/50 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{
                      duration: 1,
                      delay: i * 0.2,
                      ease: "easeOut",
                    }}
                    className={`h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.3)] ${
                      isPositive ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                </div>
                <div
                  className={`w-20 text-right text-sm font-bold tabular-nums ${
                    isPositive ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {formatPercent(data.priceChangePercent)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Indicators */}
      <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 h-full">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2.5 text-white/90">
          <Activity className="w-5 h-5 text-purple-400" />
          <span>Technical Indicators</span>
        </h3>
        {market ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:bg-white/10 transition-colors">
              <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">
                RSI (14)
              </div>
              <div
                className={`text-2xl font-bold ${
                  market.indicators.rsi > 70
                    ? "text-red-400"
                    : market.indicators.rsi < 30
                    ? "text-emerald-400"
                    : "text-white"
                }`}
              >
                {market.indicators.rsi.toFixed(1)}
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:bg-white/10 transition-colors">
              <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">
                Volatility
              </div>
              <div className="text-2xl font-bold text-orange-400">
                {(market.indicators.volatility * 100).toFixed(2)}%
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:bg-white/10 transition-colors">
              <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">
                EMA 9
              </div>
              <div className="text-2xl font-bold text-zinc-200">
                ${market.indicators.ema9.toFixed(0)}
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:bg-white/10 transition-colors">
              <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">
                EMA 21
              </div>
              <div className="text-2xl font-bold text-zinc-200">
                ${market.indicators.ema21.toFixed(0)}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-zinc-500 gap-3">
            <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin" />
            <span className="text-sm">Analyzing market data...</span>
          </div>
        )}
      </div>
    </div>
  );
}
