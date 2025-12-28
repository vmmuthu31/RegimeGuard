"use client";

import React, { useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";

interface QuickTradeWidgetProps {
  className?: string;
  currentPrice: number;
  symbol: string;
  userBalance: number;
}

export function QuickTradeWidget({
  className,
  currentPrice,
  symbol,
  userBalance,
}: QuickTradeWidgetProps) {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const isBuy = mode === "buy";

  const cryptoAmount = amount
    ? (parseFloat(amount) / currentPrice).toFixed(6)
    : "0.000000";

  const handlePercentage = (percent: number) => {
    if (!userBalance) return;
    const value = (userBalance * percent).toFixed(2);
    setAmount(value);
  };

  return (
    <div
      className={`flex flex-col h-full relative overflow-hidden bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-white/10 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-white tracking-wide">
            {symbol} Quick Trade
          </span>
        </div>
        <div className="flex bg-zinc-900/80 rounded-lg p-0.5 border border-white/5">
          <button
            onClick={() => setMode("buy")}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all duration-300 ${isBuy
              ? "bg-emerald-500 text-white shadow-lg"
              : "text-zinc-500 hover:text-white"
              }`}
          >
            Buy
          </button>
          <button
            onClick={() => setMode("sell")}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all duration-300 ${!isBuy
              ? "bg-red-500 text-white shadow-lg"
              : "text-zinc-500 hover:text-white"
              }`}
          >
            Sell
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-1 p-5 flex flex-col justify-center gap-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
              Amount (USDT)
            </label>
            <div className="text-xs font-mono text-zinc-400">
              Bal:{" "}
              <span className="text-white">
                ${userBalance.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="relative group mb-3">
            <input
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-3xl font-bold text-white placeholder-zinc-700 outline-none focus:border-white/20 transition-colors font-mono"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-500 bg-white/5 px-2 py-1 rounded">
              USDT
            </div>
          </div>

          {/* Percentage Pills */}
          <div className="grid grid-cols-4 gap-2">
            {[0.1, 0.25, 0.5, 1].map((p) => (
              <button
                key={p}
                onClick={() => handlePercentage(p)}
                className="py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] font-bold text-zinc-400 hover:text-white transition-colors border border-white/5"
              >
                {p === 1 ? "MAX" : `${p * 100}%`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center text-zinc-600">
          <FaExchangeAlt className="rotate-90" />
        </div>

        <div>
          <label className="text-xs text-zinc-500 font-mono mb-2 block uppercase tracking-wider">
            Est. Receive ({symbol.split("/")[0]})
          </label>
          <div className="w-full bg-zinc-900/30 border border-white/5 rounded-xl px-4 py-3 text-2xl font-bold text-zinc-300 font-mono flex items-center justify-between">
            <span>{cryptoAmount}</span>
            <span className="text-sm text-zinc-600">
              @ {currentPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 bg-zinc-900/50 border-t border-white/5">
        <button
          className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${isBuy
            ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20"
            : "bg-red-500 hover:bg-red-400 text-white shadow-red-500/20"
            }`}
        >
          {isBuy ? "Confirm Buy" : "Confirm Sell"}
        </button>
      </div>
    </div>
  );
}
