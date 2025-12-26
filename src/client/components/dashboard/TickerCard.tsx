"use client";

import React from "react";
import {
  FaBitcoin,
  FaEthereum,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaBolt,
} from "react-icons/fa";
import { SiSolana } from "react-icons/si";
import { motion } from "framer-motion";
import {
  formatPrice,
  formatPercent,
  formatVolume,
} from "@/src/shared/utils/formatters";
import type { TickerData } from "@/src/client/hooks/useDashboardData";

interface TickerCardProps {
  symbol: { id: string; name: string; iconKey?: string; color: string };
  data?: TickerData;
  index: number;
}

const IconMap: Record<string, React.ReactNode> = {
  BTC: <FaBitcoin />,
  ETH: <FaEthereum />,
  SOL: <SiSolana />,
};

export function TickerCard({ symbol, data, index }: TickerCardProps) {
  const isPositive = data && parseFloat(data.priceChangePercent) >= 0;

  const handleOpenChart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click if we had one
    // Extract generic symbol e.g., 'BTCUSDT' -> 'BTC' or use ID
    const pathId = symbol.id.replace("cmt_", "");
    window.location.href = `/trade/${pathId}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={handleOpenChart}
      className="group cursor-pointer relative"
    >
      <div className="relative bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1">
        {/* Hover Action */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
            <FaChartLine className="w-3 h-3" /> View Chart
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner transition-transform group-hover:scale-110 duration-300"
            style={{
              backgroundColor: `${symbol.color}15`,
              color: symbol.color,
            }}
          >
            {symbol.iconKey ? IconMap[symbol.iconKey] : <FaBolt />}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white/90">{symbol.name}</h3>
            <p className="text-zinc-500 text-xs font-mono tracking-wider uppercase">
              {symbol.id.replace("cmt_", "").replace("usdt", "")} / USDT
            </p>
          </div>
        </div>

        {data ? (
          <>
            <div className="flex items-end justify-between mb-4">
              <div className="text-3xl font-bold tracking-tight text-white font-mono">
                ${formatPrice(data.lastPrice)}
              </div>
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold border ${
                  isPositive
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                {isPositive ? (
                  <FaArrowUp className="w-3 h-3" />
                ) : (
                  <FaArrowDown className="w-3 h-3" />
                )}
                {formatPercent(data.priceChangePercent)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs mb-3">
              <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5 hover:bg-white/10 transition-colors">
                <div className="text-zinc-500 mb-0.5">High</div>
                <div className="text-emerald-400 font-bold">
                  ${formatPrice(data.high)}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5 hover:bg-white/10 transition-colors">
                <div className="text-zinc-500 mb-0.5">Low</div>
                <div className="text-red-400 font-bold">
                  ${formatPrice(data.low)}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5 hover:bg-white/10 transition-colors">
                <div className="text-zinc-500 mb-0.5">Vol</div>
                <div className="text-zinc-300 font-bold">
                  {formatVolume(data.value)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
              <div className="flex items-center gap-1.5">
                <FaChartLine className="w-3 h-3" />
                <span>{parseInt(data.trades).toLocaleString()} trades</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaBolt className="w-3 h-3 text-emerald-400" />
                <span className="text-zinc-400">Real-time</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-32 text-zinc-600">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              <span className="text-xs">Connecting feed...</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
