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
    <div className="flex flex-col h-full bg-zinc-950/20">
      {/* Search & Tabs Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-900/10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 group cursor-pointer border-b-2 border-emerald-500 pb-4 -mb-4 transition-all">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Active Exposure</span>
          </div>
          <div className="flex items-center gap-2 group cursor-pointer border-b-2 border-transparent pb-4 -mb-4 hover:border-white/10 transition-all">
            <Activity className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            <span className="text-[10px] font-bold text-zinc-600 group-hover:text-zinc-400 uppercase tracking-[0.2em] transition-colors">Yield Protocol</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="SEARCH PROTOCOL..."
              className="bg-zinc-950/50 border border-white/5 rounded-lg px-8 py-1.5 text-[9px] font-bold font-mono tracking-widest text-zinc-400 placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-all w-48"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 border border-zinc-700 rounded-sm" />
          </div>
          <button className="p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
            <div className="w-3.5 h-px bg-zinc-500 mb-1" />
            <div className="w-2 h-px bg-zinc-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1">
        {/* Main Assets Table */}
        <div className="col-span-1 lg:col-span-8 border-r border-white/5">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/[0.03]">
                <th className="text-left px-6 py-3 text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Asset Strategy</th>
                <th className="text-right px-6 py-3 text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Wallet Balance</th>
                <th className="text-right px-6 py-3 text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em]">24h Delta</th>
                <th className="text-right px-6 py-3 text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Momentum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {symbols.map((sym, i) => {
                const data = tickers[sym.id];
                if (!data) return null;

                const priceChange = parseFloat(data.priceChangePercent);
                const isPositive = priceChange >= 0;
                const width = Math.min(Math.abs(priceChange * 100) * 15, 100);

                return (
                  <tr key={sym.id} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-400 group-hover:text-emerald-400 transition-colors">
                          {sym.name.substring(0, 1)}
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-zinc-300 group-hover:text-white transition-colors">{sym.name}</div>
                          <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter">Liquid Perp</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-[11px] font-mono font-bold text-zinc-300">0.0000</div>
                      <div className="text-[8px] font-bold text-zinc-600 font-mono">$0.00</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`text-[11px] font-mono font-bold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                        {isPositive ? "+" : ""}{formatPercent(data.priceChangePercent)}
                      </div>
                    </td>
                    <td className="px-6 py-4 w-32">
                      <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden flex relative border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                          className={`h-full relative ${isPositive ? "bg-emerald-500" : "bg-red-500"}`}
                        >
                          <div className="absolute inset-0 bg-white/10 animate-pulse" />
                        </motion.div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Technical Sidebar within Overview */}
        <div className="col-span-1 lg:col-span-4 p-6 bg-zinc-950/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.3em]">Technical Engine</h3>
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-emerald-500/20" />
            </div>
          </div>

          {market ? (
            <div className="space-y-2">
              <IndicatorBox
                label="RSI Sensitivity"
                value={market.indicators.rsi.toFixed(1)}
                valueClass={market.indicators.rsi > 70 ? "text-red-400" : market.indicators.rsi < 30 ? "text-emerald-400" : "text-white"}
              />
              <IndicatorBox
                label="Volatility Index"
                value={`${(market.indicators.volatility * 100).toFixed(2)}%`}
                valueClass="text-orange-400"
              />
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="p-3 bg-zinc-900/60 border border-white/5 rounded-lg">
                  <span className="text-[8px] font-bold text-zinc-600 uppercase block mb-1">EMA 9 Strategy</span>
                  <span className="text-xs font-bold text-zinc-200 font-mono">${market.indicators.ema9.toFixed(0)}</span>
                </div>
                <div className="p-3 bg-zinc-900/60 border border-white/5 rounded-lg">
                  <span className="text-[8px] font-bold text-zinc-600 uppercase block mb-1">EMA 21 Anchor</span>
                  <span className="text-xs font-bold text-zinc-200 font-mono">${market.indicators.ema21.toFixed(0)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-zinc-700 gap-3">
              <div className="w-5 h-5 border-2 border-zinc-800 border-t-zinc-600 rounded-full animate-spin" />
              <span className="text-[9px] font-bold tracking-[0.3em] font-mono">CALIBRATING NEURAL FEED...</span>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/[0.03]">
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 mb-4">
              <p className="text-[9px] text-emerald-400/80 font-mono leading-relaxed">
                NEURAL PROTOCOL: Current market regime detected as <span className="text-emerald-400 font-bold">{market?.regime.regime || "ANALYZING"}</span>. Automated execution vectors confirmed.
              </p>
            </div>
            <button className="w-full py-2.5 rounded-lg border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase tracking-[0.2em] hover:bg-emerald-500/10 transition-all">Download Audit Report</button>
          </div>
        </div>
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
    <div className="bg-zinc-900/40 border border-white/[0.03] rounded-lg p-3 flex items-center justify-between hover:bg-zinc-800 transition-all group cursor-default">
      <div className="text-zinc-600 text-[8px] font-bold uppercase tracking-[0.15em] group-hover:text-zinc-400 transition-colors">
        {label}
      </div>
      <div className={`text-sm font-bold font-mono ${valueClass}`}>{value}</div>
    </div>
  );
}
