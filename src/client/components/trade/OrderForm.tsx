"use client";

import { useState } from "react";
import { FaWallet } from "react-icons/fa";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface OrderFormProps {
  symbol: string;
  currentPrice: string;
  balance: string;
  onPlaceOrder: (side: "Buy" | "Sell", price: string, amount: string, leverage: number) => void;
  connected?: boolean;
}

const LEVERAGE_OPTIONS = [1, 5, 10, 20] as const;

export function OrderForm({
  symbol,
  currentPrice,
  balance,
  onPlaceOrder,
  connected = true,
}: OrderFormProps) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState<number>(1); // Default 1x (spot-like)
  const [focused, setFocused] = useState<"price" | "amount" | null>(null);

  const coin = symbol.includes("/")
    ? symbol.split("/")[0]
    : symbol.replace("USDT", "").replace("cmt_", "").toUpperCase();

  const handlePercentageClick = (pct: number) => {
    const balInfo = parseFloat(balance.replace(/,/g, ""));
    const price = parseFloat(currentPrice.replace(/,/g, ""));
    if (!price) return;

    if (side === "buy") {
      // Calculate amount in USDT based on percentage of balance
      const val = (balInfo * pct).toFixed(2);
      setAmount(val);
    } else {
      setAmount(pct.toFixed(4));
    }
  };

  const handleSubmit = () => {
    if (!amount) return;
    onPlaceOrder(side === "buy" ? "Buy" : "Sell", currentPrice, amount, leverage);
    setAmount("");
  };

  // Calculate estimated position value
  const estimatedValue = parseFloat(amount || "0") * leverage;
  const estimatedCoins = estimatedValue / parseFloat(currentPrice.replace(/,/g, "") || "1");

  return (
    <div className="bg-[#0B0E11] flex flex-col h-full relative overflow-hidden group">
      {/* Top Level Neon Accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0 opacity-100 transition-opacity" />

      {/* 1. Master Header - Matches MarketBar Height */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-white/20 bg-zinc-950/60 relative z-20">
        <div className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
          Quick Order
        </div>
        <div
          className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.6)]"
          title="Regime Shield Active"
        />
      </div>

      <div className="p-3 relative z-10 flex flex-col gap-4">
        {/* 2. Tactical Tabs (Open/Close) */}
        <div className="flex gap-1 p-1 bg-zinc-900/80 rounded-xl border border-white/20 shadow-2xl">
          <button
            onClick={() => setSide("buy")}
            className={`flex-1 py-2.5 rounded-lg text-[12px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${side === "buy"
              ? "bg-emerald-500 text-zinc-950 shadow-[0_0_30px_rgba(16,185,129,0.4)] ring-1 ring-emerald-400/50"
              : "text-zinc-500 hover:text-zinc-300"
              }`}
          >
            Open
          </button>
          <button
            onClick={() => setSide("sell")}
            className={`flex-1 py-2.5 rounded-lg text-[12px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${side === "sell"
              ? "bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)] ring-1 ring-red-400/50"
              : "text-zinc-500 hover:text-zinc-300"
              }`}
          >
            Close
          </button>
        </div>

        {/* 3. Execution Type Tabs */}
        <div className="flex items-center gap-6 px-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-white/10 pb-2">
          <div className="text-white border-b-2 border-emerald-500 pb-2 -mb-2.5 transition-all cursor-pointer">
            Limit
          </div>
          <div className="hover:text-white transition-colors cursor-pointer">
            Market
          </div>
          <div className="hover:text-white transition-colors cursor-pointer">
            Trigger <span className="text-[8px] opacity-60">▼</span>
          </div>
        </div>

        {/* 4. Leverage Slider */}
        <div className="space-y-3 py-1">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-[0.15em]">
              Leverage
            </span>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border 
              ${leverage === 1
                ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                : leverage >= 10
                  ? 'border-red-500/30 bg-red-500/5 text-red-400'
                  : 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400'}`}
            >
              <span className="text-[11px] font-black font-mono">
                {leverage}x
              </span>
              <span className="text-[9px] font-bold uppercase tracking-tighter opacity-70">
                {leverage === 1 ? 'Spot-like' : leverage >= 10 ? 'High Risk' : 'Leveraged'}
              </span>
            </div>
          </div>

          <div className="relative px-2 h-4 flex items-center">
            {/* The Track Background */}
            <div className="absolute left-2 right-2 h-0.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${((leverage - 1) / 19) * 100}%` }}
                className={`h-full transition-colors duration-500 ${leverage === 1 ? 'bg-emerald-500' : leverage >= 10 ? 'bg-red-500' : 'bg-yellow-500'
                  }`}
              />
            </div>

            {/* Markers (Diamonds) */}
            <div className="absolute left-2 right-2 flex justify-between items-center pointer-events-none">
              {LEVERAGE_OPTIONS.map((lev) => {
                const pos = ((lev - 1) / 19) * 100;
                const isActive = leverage >= lev;
                return (
                  <div
                    key={lev}
                    className="relative flex flex-col items-center group/marker"
                    style={{ left: `calc(${pos}% - 4px)`, position: 'absolute' }}
                  >
                    <div
                      className={`w-2.5 h-2.5 rotate-45 transform border transition-all duration-300 pointer-events-auto cursor-pointer
                        ${isActive
                          ? leverage === 1 ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-yellow-500 border-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.5)]'
                          : 'bg-zinc-950 border-white/20 hover:border-white/40'
                        }`}
                      onClick={() => setLeverage(lev)}
                    />
                    <span className={`absolute -top-5 text-[8px] font-black transition-colors ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                      {lev}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* The Hidden Range Input for Free Adjustment */}
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={leverage}
              onChange={(e) => setLeverage(parseInt(e.target.value))}
              onFocus={() => setFocused(null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 accent-transparent"
            />
          </div>

          {leverage > 1 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[8px] text-yellow-500/70 font-medium px-1 flex items-start gap-1"
            >
              <Zap className="w-2 h-2 shrink-0 mt-0.5" />
              <span>Capital efficiency increased by {leverage}x.</span>
            </motion.div>
          )}
        </div>

        {/* Inputs */}
        <div className="space-y-2 mb-2">
          {/* Price Label (Small) */}
          <div className="flex justify-between items-end px-1">
            <span className="text-[10px] uppercase font-bold text-zinc-300 tracking-[0.1em]">
              Entry Price (USDT)
            </span>
            <span className="text-[9px] font-bold text-white bg-zinc-900 px-1.5 py-0.5 rounded border border-white/20 font-mono shadow-xl">
              FIXED MARKET
            </span>
          </div>

          {/* Price View */}
          <div
            className={`relative group/input rounded-xl border transition-all duration-300 ${focused === "price"
              ? "bg-zinc-900 border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
              : "bg-zinc-900/50 border-white/20"
              }`}
          >
            <input
              type="text"
              value={currentPrice}
              readOnly
              className="w-full bg-transparent py-2.5 px-4 text-lg font-mono font-bold text-white outline-none text-right"
            />
            {/* Progress bar accent */}
            <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-linear-to-r from-transparent via-white/20 to-transparent" />
          </div>

          {/* Amount Label */}
          <div className="flex justify-between items-end px-1 pt-1">
            <span className="text-[10px] uppercase font-bold text-zinc-300 tracking-[0.1em]">
              Execution Amount
            </span>
            <span className="text-[10px] font-bold text-zinc-200 font-mono tracking-wider">
              {side === "buy" ? "USDT" : coin}
            </span>
          </div>

          {/* Amount Input */}
          <div
            className={`relative group/input rounded-xl border transition-all duration-500 ${focused === "amount"
              ? side === "buy"
                ? "bg-zinc-950 border-emerald-500/60 shadow-[0_0_40px_rgba(16,185,129,0.1)]"
                : "bg-zinc-950 border-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.1)]"
              : "bg-zinc-900/50 border-white/20 shadow-inner"
              }`}
          >
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onFocus={() => setFocused("amount")}
              onBlur={() => setFocused(null)}
              placeholder="0.00"
              className="w-full bg-transparent py-3 px-4 text-xl font-mono font-bold text-white outline-none text-right placeholder:text-zinc-800"
            />
            {/* Focal Glow */}
            <div
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px transition-all duration-500 bg-linear-to-r from-transparent via-emerald-500/40 to-transparent ${focused === "amount" && side === "buy"
                ? "opacity-100"
                : "opacity-0"
                }`}
            />
            <div
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px transition-all duration-500 bg-linear-to-r from-transparent via-red-500/40 to-transparent ${focused === "amount" && side === "sell"
                ? "opacity-100"
                : "opacity-0"
                }`}
            />
          </div>

          {/* Percentage Pills - More Modern */}
          <div className="flex gap-1.5">
            {[0.1, 0.25, 0.5, 0.75, 1].map((pct) => (
              <button
                key={pct}
                onClick={() => handlePercentageClick(pct)}
                className="flex-1 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.03] hover:border-white/10 text-[9px] font-bold text-zinc-500 hover:text-zinc-300 transition-all active:scale-95 tracking-tighter"
              >
                {pct * 100}%
              </button>
            ))}
          </div>
        </div>

        {/* Action Section / Guest View */}
        <div className="mt-auto pt-4 border-t border-white/[0.03]">
          {!connected ? (
            <div className="flex flex-col gap-3">
              <button className="w-full py-3 rounded-xl bg-emerald-500 text-zinc-950 font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95">
                Sign Up to Protocol
              </button>
              <button className="w-full py-3 rounded-xl bg-zinc-900 border border-white/10 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-[0_0_15px_rgba(0,0,0,0.4)] active:scale-95">
                Log In
              </button>
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Zap className="w-3 h-3 fill-emerald-500/20" />
                  Futures Info
                </h4>
                <div className="space-y-2">
                  <InfoRow label="Trading Fee" value="0.02% / 0.05%" />
                  <InfoRow label="Leverage" value="Up to 100x" />
                  <InfoRow label="Max Position" value="50,000 USDT" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">
                    Available Margin
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 rounded bg-zinc-900 border border-white/10">
                      <FaWallet className="w-2.5 h-2.5 text-emerald-500" />
                    </div>
                    <span className="text-xs font-mono font-black text-white">
                      {balance}{" "}
                      <span className="text-[9px] text-zinc-500">USDT</span>
                    </span>
                  </div>
                </div>

                {/* Dynamic Indicator */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500 ${side === "buy"
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500"
                    : "bg-red-500/5 border-red-500/20 text-red-500"
                    }`}
                >
                  <Zap
                    className={`w-3 h-3 ${side === "buy" ? "fill-emerald-500/20" : "fill-red-500/20"
                      }`}
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className={`group/submit w-full py-3 rounded-xl font-bold text-[11px] tracking-[0.2em] transition-all duration-500 relative overflow-hidden shadow-2xl ${side === "buy"
                  ? "bg-emerald-500 text-black hover:bg-emerald-400"
                  : "bg-red-500 text-white hover:bg-red-400"
                  }`}
              >
                {/* Shiny Overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/submit:translate-x-full transition-transform duration-1000" />

                <span className="relative z-10 uppercase">
                  {side === "buy" ? `Execute Buy` : `Execute Sell`}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-[10px]">
      <span className="text-zinc-500 font-bold uppercase tracking-tighter">
        {label}
      </span>
      <span className="text-zinc-300 font-mono font-bold">{value}</span>
    </div>
  );
}
