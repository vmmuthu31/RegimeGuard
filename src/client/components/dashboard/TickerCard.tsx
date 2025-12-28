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
  className?: string; // Add className here
}

const IconMap: Record<string, React.ReactNode> = {
  BTC: <FaBitcoin />,
  ETH: <FaEthereum />,
  SOL: <SiSolana />,
};

export function TickerCard({ symbol, data, className }: TickerCardProps) {
  const isPositive = data && parseFloat(data.priceChangePercent) >= 0;

  const handleOpenChart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const pathId = symbol.id.replace("cmt_", "");
    window.location.href = `/trade/${pathId}`;
  };

  return (
    <div
      onClick={handleOpenChart}
      className={`group cursor-pointer relative h-full flex flex-col justify-between ${className}`}
    >
      {/* Visual Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shadow-[0_0_15px_rgba(255,255,255,0.03)] border"
            style={{
              backgroundColor: `${symbol.color}05`,
              color: symbol.color,
              borderColor: `${symbol.color}20`,
            }}
          >
            {symbol.iconKey ? IconMap[symbol.iconKey] : <FaBolt />}
          </div>
          <div>
            <h3 className="font-bold text-[11px] text-white leading-tight uppercase tracking-tight">
              {symbol.name}
            </h3>
            <p className="text-zinc-500 text-[9px] font-mono tracking-wider uppercase">
              PERP
            </p>
          </div>
        </div>
        {data && (
          <div
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${isPositive
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}
          >
            {isPositive ? (
              <FaArrowUp className="w-2 h-2" />
            ) : (
              <FaArrowDown className="w-2 h-2" />
            )}
            {formatPercent(data.priceChangePercent)}
          </div>
        )}
      </div>

      {data ? (
        <div className="flex items-end justify-between">
          <div>
            <div className="text-lg font-bold tracking-tight text-white font-mono drop-shadow-[0_0_10px_rgba(255,255,255,0.05)]">
              ${formatPrice(data.lastPrice)}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">
              Vol: {formatVolume(data.value)}
            </div>
          </div>
          <div className="text-[9px] text-zinc-600 font-mono text-right">
            <div>H: ${formatPrice(data.high)}</div>
            <div>L: ${formatPrice(data.low)}</div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 gap-2 text-zinc-600 my-4">
          <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-xs">Syncing...</span>
        </div>
      )}
    </div>
  );
}
