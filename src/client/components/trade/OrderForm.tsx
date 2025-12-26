"use client";

import React, { useState } from "react";
import { FaWallet } from "react-icons/fa";

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

  // Fix parsing: "BTC/USDT" -> "BTC"
  const coin = symbol.includes("/")
    ? symbol.split("/")[0]
    : symbol.replace("USDT", "").replace("cmt_", "").toUpperCase();

  const handlePercentageClick = (pct: number) => {
    // Mock logic: calculate based on balance (assuming balance is in USDT)
    const balInfo = parseFloat(balance.replace(/,/g, ""));
    const price = parseFloat(currentPrice.replace(/,/g, ""));
    if (!price) return;

    if (side === "buy") {
      // Amount in USDT
      const val = (balInfo * pct).toFixed(2);
      setAmount(val);
    } else {
      // For sell, just put a mock amount relative to "1.000" holding for demo or handle nicely
      setAmount(pct.toFixed(4));
    }
  };

  const handleSubmit = () => {
    if (!amount) return;
    // Capitalize side for display consistency
    onPlaceOrder(side === "buy" ? "Buy" : "Sell", currentPrice, amount);
    setAmount(""); // Reset after place
  };

  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 h-full flex flex-col">
      {/* Tabs */}
      <div className="flex bg-zinc-900 rounded-lg p-1 mb-6 border border-white/5">
        <button
          onClick={() => setSide("buy")}
          className={`flex-1 py-2 rounded-md text-sm font-bold transition-all duration-300 ${
            side === "buy"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Buy {coin}
        </button>
        <button
          onClick={() => setSide("sell")}
          className={`flex-1 py-2 rounded-md text-sm font-bold transition-all duration-300 ${
            side === "sell"
              ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Sell {coin}
        </button>
      </div>

      {/* Available Balance */}
      <div className="flex justify-between text-xs text-zinc-500 mb-2 px-1">
        <span>Available</span>
        <span className="flex items-center gap-1.5 font-mono text-zinc-300">
          <FaWallet className="w-3 h-3" />{" "}
          {side === "buy" ? `${balance} USDT` : `0.00 ${coin}`}
        </span>
      </div>

      {/* Inputs */}
      <div className="space-y-4 mb-6">
        <div className="space-y-1">
          <label className="text-xs text-zinc-500 ml-1">Price (USDT)</label>
          <div className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
            <input
              type="text"
              value={currentPrice}
              readOnly
              className="bg-transparent text-white font-mono w-full outline-none"
            />
            <span className="text-xs text-zinc-500 font-bold">MARKET</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-zinc-500 ml-1">
            Amount ({side === "buy" ? "USDT" : coin})
          </label>
          <div className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between focus-within:border-emerald-500/50 transition-colors">
            <input
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-white font-mono w-full outline-none text-lg font-bold"
            />
          </div>
        </div>

        {/* Percentages */}
        <div className="grid grid-cols-4 gap-2">
          {[0.25, 0.5, 0.75, 1].map((pct) => (
            <button
              key={pct}
              onClick={() => handlePercentageClick(pct)}
              className="text-xs bg-white/5 hover:bg-white/10 text-zinc-400 py-1.5 rounded-lg border border-white/5 transition-colors"
            >
              {pct * 100}%
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between text-xs text-zinc-500 mb-4 px-1 border-t border-white/5 pt-4">
          <span>Total Value</span>
          <span className="font-mono text-white">= ${amount || "0.00"}</span>
        </div>

        <button
          onClick={handleSubmit}
          className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition-transform active:scale-[0.98] ${
            side === "buy"
              ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 text-white"
              : "bg-red-500 hover:bg-red-600 shadow-red-500/20 text-white"
          }`}
        >
          {side === "buy" ? `Buy ${coin}` : `Sell ${coin}`}
        </button>
      </div>
    </div>
  );
}
