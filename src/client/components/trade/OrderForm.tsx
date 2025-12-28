"use client";

import React, { useState } from "react";
import { FaWallet } from "react-icons/fa";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface OrderFormProps {
  symbol: string;
  currentPrice: string;
  balance: string;
  onPlaceOrder: (side: "Buy" | "Sell", price: string, amount: string) => void;
}

export function OrderForm({
  symbol,
  currentPrice,
  balance,
  onPlaceOrder,
}: OrderFormProps) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [focused, setFocused] = useState<"price" | "amount" | null>(null);

  // Fix parsing: "BTC/USDT" -> "BTC"
  const coin = symbol.includes("/")
    ? symbol.split("/")[0]
    : symbol.replace("USDT", "").replace("cmt_", "").toUpperCase();

  const handlePercentageClick = (pct: number) => {
    const balInfo = parseFloat(balance.replace(/,/g, ""));
    const price = parseFloat(currentPrice.replace(/,/g, ""));
    if (!price) return;

    if (side === "buy") {
      const val = (balInfo * pct).toFixed(2);
      setAmount(val);
    } else {
      setAmount(pct.toFixed(4));
    }
  };

  const handleSubmit = () => {
    if (!amount) return;
    onPlaceOrder(side === "buy" ? "Buy" : "Sell", currentPrice, amount);
    setAmount("");
  };

  return (
    <div className="bg-[#050505] flex flex-col h-full relative overflow-hidden group border border-white/10">
      {/* Dynamic Background Glow */}
      <div className={`absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[120px] opacity-20 pointer-events-none transition-all duration-700 ease-in-out ${side === 'buy' ? 'bg-emerald-500/30' : 'bg-red-500/30'}`} />

      {/* Top Refraction Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="p-4 relative z-10 flex flex-col h-full">
        {/* Header / Tabs */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h2 className="text-white text-base font-bold flex items-center gap-2 tracking-tight">
              <span className={`w-1 h-1 rounded-full animate-pulse ${side === 'buy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`} />
              Quick Order
            </h2>
          </div>

          <div className="flex bg-zinc-900/40 rounded-full p-0.5 border border-white/5 backdrop-blur-xl shadow-inner">
            {(['buy', 'sell'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSide(s)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all duration-300 relative ${side === s
                  ? (side === 'buy' ? 'text-emerald-400' : 'text-red-400')
                  : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                {side === s && (
                  <motion.div
                    layoutId="activeTabOutline"
                    className={`absolute inset-0 rounded-full bg-white/[0.03] border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.02)]`}
                  />
                )}
                <span className="relative z-10 uppercase tracking-widest">{s}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-3 mb-4">
          {/* Price Label (Small) */}
          <div className="flex justify-between items-end px-1">
            <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-[0.15em]">Entry Price (USDT)</span>
            <span className="text-[9px] font-bold text-zinc-700 bg-zinc-900/50 px-1.5 py-0.5 rounded border border-white/5 font-mono">FIXED MARKET</span>
          </div>

          {/* Price View */}
          <div className={`relative group/input rounded-xl border transition-all duration-300 ${focused === 'price' ? 'bg-zinc-900/90 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.02)]' : 'bg-zinc-900/30 border-white/[0.03] hover:border-white/10'}`}>
            <input
              type="text"
              value={currentPrice}
              readOnly
              className="w-full bg-transparent py-3 px-3 text-lg font-mono font-bold text-zinc-300 outline-none text-right"
            />
            {/* Progress bar accent */}
            <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-linear-to-r from-transparent via-zinc-800 to-transparent" />
          </div>

          {/* Amount Label */}
          <div className="flex justify-between items-end px-1">
            <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-[0.15em]">Execution Amount</span>
            <span className="text-[10px] font-bold text-zinc-400 font-mono tracking-wider">{side === 'buy' ? 'USDT' : coin}</span>
          </div>

          {/* Amount Input */}
          <div className={`relative group/input rounded-xl border transition-all duration-500 ${focused === 'amount' ? (side === 'buy' ? 'bg-zinc-900/90 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.05)]' : 'bg-zinc-900/90 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.05)]') : 'bg-zinc-900/30 border-white/[0.03] hover:border-white/10'}`}>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onFocus={() => setFocused('amount')}
              onBlur={() => setFocused(null)}
              placeholder="0.00"
              className="w-full bg-transparent py-4 px-3 text-xl font-mono font-bold text-white outline-none text-right placeholder:text-zinc-800"
            />
            {/* Focal Glow */}
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px transition-all duration-500 bg-linear-to-r from-transparent via-emerald-500/40 to-transparent ${focused === 'amount' && side === 'buy' ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px transition-all duration-500 bg-linear-to-r from-transparent via-red-500/40 to-transparent ${focused === 'amount' && side === 'sell' ? 'opacity-100' : 'opacity-0'}`} />
          </div>

          {/* Percentage Pills - More Modern */}
          <div className="flex gap-2">
            {[0.10, 0.25, 0.50, 0.75, 1].map((pct) => (
              <button
                key={pct}
                onClick={() => handlePercentageClick(pct)}
                className="flex-1 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.03] hover:border-white/10 text-[9px] font-bold text-zinc-500 hover:text-zinc-300 transition-all active:scale-95 tracking-tighter"
              >
                {pct * 100}%
              </button>
            ))}
          </div>
        </div>

        {/* Action Section */}
        <div className="mt-auto pt-4 border-t border-white/[0.03]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Available Margin</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="p-1 rounded bg-zinc-900/50 border border-white/5">
                  <FaWallet className="w-2.5 h-2.5 text-zinc-500" />
                </div>
                <span className="text-xs font-mono font-bold text-zinc-300">{balance} <span className="text-[9px] text-zinc-600">USDT</span></span>
              </div>
            </div>

            {/* Dynamic Indicator */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-500 ${side === 'buy' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-red-500/5 border-red-500/20 text-red-500'}`}>
              <Zap className={`w-3.5 h-3.5 ${side === 'buy' ? 'fill-emerald-500/20' : 'fill-red-500/20'}`} />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className={`group/submit w-full py-4 rounded-xl font-bold text-xs tracking-[0.2em] transition-all duration-500 relative overflow-hidden shadow-2xl ${side === 'buy'
              ? 'bg-emerald-500 text-black hover:bg-emerald-400'
              : 'bg-red-500 text-white hover:bg-red-400'
              }`}
          >
            {/* Shiny Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/submit:translate-x-full transition-transform duration-1000" />

            <span className="relative z-10 uppercase">{side === 'buy' ? `Execute Buy` : `Execute Sell`}</span>
          </button>
        </div>
      </div>
    </div >
  );
}
