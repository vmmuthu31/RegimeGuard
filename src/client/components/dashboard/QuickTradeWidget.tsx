"use client";

import React, { useState } from "react";
import { FaWallet, FaExchangeAlt, FaBitcoin } from "react-icons/fa";

export function QuickTradeWidget() {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("buy");

  return (
    <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 h-full flex flex-col relative overflow-hidden group">
      {/* Background Gradient */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-colors duration-500 ${
          mode === "buy" ? "bg-emerald-500/10" : "bg-red-500/10"
        }`}
      />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="font-bold text-lg text-white flex items-center gap-2">
          <FaExchangeAlt className="text-zinc-500 w-4 h-4" /> Quick Trade
        </h3>
        <div className="flex bg-zinc-900/50 rounded-lg p-1 border border-white/5">
          <button
            onClick={() => setMode("buy")}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all duration-300 ${
              mode === "buy"
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setMode("sell")}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all duration-300 ${
              mode === "sell"
                ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Sell
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-4 relative z-10">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-zinc-500 px-1">
            <span>Pay</span>
            <span className="flex items-center gap-1.5 font-mono">
              <FaWallet className="w-3 h-3 text-zinc-600" /> $12,450.00
            </span>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-3 flex items-center justify-between transition-all focus-within:border-emerald-500/30 focus-within:bg-zinc-900 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.05)]">
            <input
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-xl font-bold text-white placeholder-zinc-700 outline-none w-full mr-4 font-mono"
            />
            <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg text-sm font-bold border border-white/5">
              <span className="text-zinc-300">USDT</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center -my-3 relative z-20">
          <div className="bg-[#09090b] border border-white/10 p-2 rounded-full shadow-xl">
            <FaExchangeAlt className="w-3 h-3 text-zinc-400 rotate-90" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-zinc-500 px-1">
            <span>Receive (Est.)</span>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-3 flex items-center justify-between">
            <div className="text-xl font-bold text-zinc-400 font-mono">
              {amount ? (parseFloat(amount) / 42000).toFixed(6) : "0.00"}
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 px-2 py-1 rounded-lg text-sm font-bold border border-emerald-500/20 text-emerald-400">
              <FaBitcoin className="w-4 h-4" />
              <span>BTC</span>
            </div>
          </div>
        </div>

        <button
          className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all transform active:scale-[0.98] mt-3 flex items-center justify-center gap-2 ${
            mode === "buy"
              ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 text-white"
              : "bg-red-500 hover:bg-red-600 shadow-red-500/20 text-white"
          }`}
        >
          {mode === "buy" ? "Buy Bitcoin" : "Sell Bitcoin"}
        </button>
      </div>
    </div>
  );
}
