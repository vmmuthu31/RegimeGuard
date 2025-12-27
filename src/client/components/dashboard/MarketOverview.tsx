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
      <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 h-full hover:border-white/10 transition-colors duration-300">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2.5 text-white/90">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span>Market Momentum</span>
        </h3>
        <div className="space-y-6">
          {symbols.map((sym, i) => {
            const data = tickers[sym.id];
            if (!data) return null;

            const priceChange = parseFloat(data.priceChangePercent);
            const isPositive = priceChange >= 0;
            const width = Math.min(Math.abs(priceChange * 100) * 15, 100);

            return (
              <div key={sym.id} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-zinc-300 group-hover:text-white transition-colors flex items-center gap-2">
                    {sym.name}{" "}
                    <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">
                      PERP
                    </span>
                  </div>
                  <div
                    className={`font-mono font-bold ${
                      isPositive ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {formatPercent(data.priceChangePercent)}
                  </div>
                </div>

                {/* Energy Bar */}
                <div className="h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden flex relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{
                      duration: 1,
                      delay: i * 0.2,
                      ease: "easeOut",
                    }}
                    className={`h-full relative ${
                      isPositive ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Indicators */}
      <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 h-full hover:border-white/10 transition-colors duration-300">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2.5 text-white/90">
          <Activity className="w-5 h-5 text-purple-400" />
          <span>Technical Signals</span>
        </h3>
        {market ? (
          <div className="grid grid-cols-2 gap-4">
            <IndicatorBox
              label="RSI (14)"
              value={market.indicators.rsi.toFixed(1)}
              valueClass={
                market.indicators.rsi > 70
                  ? "text-red-400"
                  : market.indicators.rsi < 30
                  ? "text-emerald-400"
                  : "text-white"
              }
            />
            <IndicatorBox
              label="Volatility"
              value={`${(market.indicators.volatility * 100).toFixed(2)}%`}
              valueClass="text-orange-400"
            />
            <IndicatorBox
              label="EMA 9"
              value={`$${market.indicators.ema9.toFixed(0)}`}
              valueClass="text-zinc-200"
            />
            <IndicatorBox
              label="EMA 21"
              value={`$${market.indicators.ema21.toFixed(0)}`}
              valueClass="text-zinc-200"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-zinc-500 gap-3">
            <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin" />
            <span className="text-sm font-mono">ANALYZING SIGNAL...</span>
          </div>
        )}
      </div>
    </div>
  );
}

function IndicatorBox({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass: string;
}) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:bg-white/10 transition-colors group">
      <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1 group-hover:text-zinc-400 transition-colors">
        {label}
      </div>
      <div className={`text-xl font-bold font-mono ${valueClass}`}>{value}</div>
    </div>
  );
}
