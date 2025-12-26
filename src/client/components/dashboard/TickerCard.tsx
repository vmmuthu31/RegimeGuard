"use client";

import React from "react";
import {
  FaBitcoin,
  FaEthereum,
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
    e.stopPropagation();
    const pathId = symbol.id.replace("cmt_", "");
    window.location.href = `/trade/${pathId}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={handleOpenChart}
      className="group cursor-pointer relative h-full"
    >
      <div className="relative h-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.1)] hover:-translate-y-1 overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 p-20 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,var(--tw-gradient-from),transparent_70%)] from-emerald-500 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-inner border border-white/5"
                style={{
                  backgroundColor: `${symbol.color}10`,
                  color: symbol.color,
                  borderColor: `${symbol.color}20`,
                }}
              >
                {symbol.iconKey ? IconMap[symbol.iconKey] : <FaBolt />}
              </div>
              <div>
                <h3 className="font-bold text-base text-white leading-tight">
                  {symbol.name}
                </h3>
                <p className="text-zinc-500 text-[10px] font-mono tracking-wider uppercase">
                  PERPETUAL
                </p>
              </div>
            </div>
            {data && (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border ${
                  isPositive
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                {isPositive ? (
                  <FaArrowUp className="w-2.5 h-2.5" />
                ) : (
                  <FaArrowDown className="w-2.5 h-2.5" />
                )}
                {formatPercent(data.priceChangePercent)}
              </div>
            )}
          </div>

          {data ? (
            <>
              <div className="mb-4">
                <div className="text-2xl font-bold tracking-tight text-white font-mono">
                  ${formatPrice(data.lastPrice)}
                </div>
                <div className="text-xs text-zinc-500 font-mono mt-1">
                  Vol: {formatVolume(data.value)}
                </div>
              </div>

              {/* Mini Sparkline Visualization (CSS only for now) */}
              <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden mb-4 flex">
                <div
                  className={`h-full ${
                    isPositive ? "bg-emerald-500" : "bg-red-500"
                  }`}
                  style={{ width: "60%", opacity: 0.8 }}
                />
                <div
                  className={`h-full ${
                    isPositive ? "bg-emerald-500" : "bg-red-500"
                  }`}
                  style={{ width: "20%", opacity: 0.4 }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono border-t border-white/5 pt-3">
                <div>
                  L:{" "}
                  <span className="text-zinc-300">
                    ${formatPrice(data.low)}
                  </span>
                </div>
                <div>
                  H:{" "}
                  <span className="text-zinc-300">
                    ${formatPrice(data.high)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 gap-2 text-zinc-600 my-4">
              <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              <span className="text-xs">Syncing...</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
