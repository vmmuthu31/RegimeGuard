"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaBitcoin, FaEthereum, FaBolt } from "react-icons/fa";
import { SiSolana, SiDogecoin, SiRipple, SiLitecoin } from "react-icons/si";
import { formatPrice, formatPercent } from "@/src/shared/utils/formatters";
import type { TickerData } from "@/src/client/hooks/useDashboardData";

interface PriceTickerProps {
  tickers: Record<string, TickerData>;
  symbols: Array<{ id: string; name: string }>;
}

const IconMap: Record<string, React.ReactNode> = {
  BTC: <FaBitcoin className="text-orange-400" />,
  ETH: <FaEthereum className="text-blue-400" />,
  SOL: <SiSolana className="text-purple-400" />,
  DOGE: <SiDogecoin className="text-yellow-400" />,
  XRP: <SiRipple className="text-gray-300" />,
  ADA: <FaBolt className="text-blue-300" />,
  BNB: <FaBolt className="text-yellow-500" />,
  LTC: <SiLitecoin className="text-gray-400" />,
};

function getSymbolIcon(name: string) {
  return IconMap[name] || <FaBolt className="text-zinc-400" />;
}

export function PriceTicker({ tickers, symbols }: PriceTickerProps) {
  const duplicatedSymbols = [...symbols, ...symbols];

  return (
    <div className="w-full bg-zinc-950/80 border-b border-white/5 overflow-hidden backdrop-blur-sm">
      <motion.div
        className="flex gap-0"
        animate={{ x: [0, -50 * symbols.length] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {duplicatedSymbols.map((sym, idx) => {
          const data = tickers[sym.id];
          if (!data) return null;

          const isPositive = parseFloat(data.priceChangePercent) >= 0;

          return (
            <div
              key={`${sym.id}-${idx}`}
              className="flex items-center gap-3 px-6 py-2.5 border-r border-white/5 hover:bg-white/2 transition-colors cursor-pointer shrink-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{getSymbolIcon(sym.name)}</span>
                <span className="text-xs font-semibold text-zinc-300">
                  {sym.name}/USDT
                </span>
              </div>
              <span className="text-sm font-bold text-white font-mono">
                ${formatPrice(data.lastPrice)}
              </span>
              <span
                className={`text-xs font-semibold font-mono ${
                  isPositive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {isPositive ? "+" : ""}
                {formatPercent(data.priceChangePercent)}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
