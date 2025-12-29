"use client";

import { useState, useMemo, MouseEvent, ElementType } from "react";
import {
  TrendingUp,
  TrendingDown,
  Flame,
  Clock,
  BarChart3,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatPercent, formatVolume } from "@/src/shared/utils/formatters";
import type { TickerData } from "@/src/client/hooks/useDashboardData";

interface MarketOverviewProps {
  tickers: Record<string, TickerData>;
  symbols: Array<{ id: string; name: string }>;
}

type TabType = "hot" | "gainers" | "losers" | "volume";

export function MarketOverview({ tickers, symbols }: MarketOverviewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("hot");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const sortedSymbols = useMemo(() => {
    const symbolsWithData = symbols
      .map((sym) => ({ ...sym, data: tickers[sym.id] }))
      .filter((sym) => sym.data);

    switch (activeTab) {
      case "gainers":
        return [...symbolsWithData].sort(
          (a, b) =>
            parseFloat(b.data!.priceChangePercent) -
            parseFloat(a.data!.priceChangePercent)
        );
      case "losers":
        return [...symbolsWithData].sort(
          (a, b) =>
            parseFloat(a.data!.priceChangePercent) -
            parseFloat(b.data!.priceChangePercent)
        );
      case "volume":
        return [...symbolsWithData].sort(
          (a, b) => parseFloat(b.data!.value) - parseFloat(a.data!.value)
        );
      case "hot":
      default:
        return symbolsWithData;
    }
  }, [symbols, tickers, activeTab]);

  const tabs: { id: TabType; label: string; icon: ElementType }[] = [
    { id: "hot", label: "Hot", icon: Flame },
    { id: "gainers", label: "Gainers", icon: TrendingUp },
    { id: "losers", label: "Losers", icon: TrendingDown },
    { id: "volume", label: "Volume", icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tab Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/20 bg-zinc-950/60 transition-colors">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent"
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" : ""}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 text-zinc-400 font-bold bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-white/10 shadow-inner">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-black tracking-widest">24H PERFORMANCE</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20 bg-zinc-950/40">
              <th className="text-left px-4 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] w-8"></th>
              <th className="text-left px-4 py-3 text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">
                Asset Intelligence
              </th>
              <th className="text-right px-4 py-3 text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">
                Mark Price
              </th>
              <th className="text-right px-4 py-3 text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">
                24h Vector
              </th>
              <th className="text-right px-4 py-3 text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">
                High Peak
              </th>
              <th className="text-right px-4 py-3 text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">
                Low Peak
              </th>
              <th className="text-right px-4 py-3 text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">
                24h Volume
              </th>
              <th className="text-right px-4 py-3 text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] w-24">
                Trend Analysis
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedSymbols.map((sym, i) => {
              const data = sym.data!;
              const priceChange = parseFloat(data.priceChangePercent);
              const isPositive = priceChange >= 0;
              const width = Math.min(Math.abs(priceChange * 100) * 20, 100);
              const isFavorite = favorites.has(sym.id);

              return (
                <motion.tr
                  key={sym.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group hover:bg-white/[0.03] transition-all cursor-pointer border-b border-white/[0.05]"
                  onClick={() => {
                    const pathId = sym.id.replace("cmt_", "");
                    window.location.href = `/trade/${pathId}`;
                  }}
                >
                  <td className="px-4 py-4">
                    <button
                      onClick={(e) => toggleFavorite(sym.id, e)}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    >
                      <Star
                        className={`w-3.5 h-3.5 transition-colors ${isFavorite
                            ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
                            : "text-zinc-700 hover:text-zinc-500"
                          }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-white/10 flex items-center justify-center text-[10px] font-black text-zinc-500 group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition-all shadow-inner">
                        {sym.name.substring(0, 2)}
                      </div>
                      <div>
                        <span className="text-xs font-black text-zinc-200 group-hover:text-white transition-colors tracking-tight">
                          {sym.name}
                        </span>
                        <span className="text-zinc-600 text-[10px] font-bold block -mt-0.5 tracking-tighter">USDT PERSISTENT</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-bold text-white font-mono">
                      $
                      {parseFloat(data.lastPrice).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold font-mono ${isPositive
                          ? "text-emerald-400 bg-emerald-500/10"
                          : "text-red-400 bg-red-500/10"
                        }`}
                    >
                      {isPositive ? "+" : ""}
                      {formatPercent(data.priceChangePercent)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs text-zinc-400 font-mono">
                      $
                      {parseFloat(data.high).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs text-zinc-400 font-mono">
                      $
                      {parseFloat(data.low).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs text-zinc-300 font-mono">
                      {formatVolume(data.value)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{
                          duration: 0.8,
                          delay: i * 0.05,
                          ease: "easeOut",
                        }}
                        className={`h-full rounded-full ${isPositive ? "bg-emerald-500" : "bg-red-500"
                          }`}
                      />
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
