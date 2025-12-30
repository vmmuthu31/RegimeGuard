"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Volume2,
  Play,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useDashboardData, SYMBOLS } from "@/src/client/hooks/useDashboardData";
import { DashboardHeader } from "@/src/client/components/dashboard/DashboardHeader";
import { MarketOverview } from "@/src/client/components/dashboard/MarketOverview";
import { PriceTicker } from "@/src/client/components/dashboard/PriceTicker";
import { PortfolioChart } from "@/src/client/components/dashboard/PortfolioChart";
import { AIDecisionsPanel } from "@/src/client/components/dashboard/AIDecisionsPanel";
import { formatVolume } from "@/src/shared/utils/formatters";

function SentimentGauge({ value }: { value: number }) {
  const angle = (value / 100) * 180 - 90;
  const getColor = () => {
    if (value < 25) return "#ef4444";
    if (value < 45) return "#f97316";
    if (value < 55) return "#eab308";
    if (value < 75) return "#84cc16";
    return "#10b981";
  };
  const getLabel = () => {
    if (value < 25) return "Extreme Fear";
    if (value < 45) return "Fear";
    if (value < 55) return "Neutral";
    if (value < 75) return "Greed";
    return "Extreme Greed";
  };

  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="55" viewBox="0 0 140 80">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="25%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="75%" stopColor="#84cc16" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <path
          d="M 15 70 A 55 55 0 0 1 125 70"
          fill="none"
          stroke="#27272a"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 15 70 A 55 55 0 0 1 125 70"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <line
          x1="70"
          y1="70"
          x2="70"
          y2="25"
          stroke={getColor()}
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${angle}, 70, 70)`}
        />
        <circle cx="70" cy="70" r="5" fill={getColor()} />
      </svg>
      <div className="text-center">
        <span className="text-xl font-bold text-white">{value}</span>
        <span
          className="block text-[9px] font-semibold"
          style={{ color: getColor() }}
        >
          {getLabel()}
        </span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const {
    connected,
    tickers,
    lastUpdate,
    account,
    market,
    loopRunning,
    error,
    toggleTradingLoop,
  } = useDashboardData();

  const totalVolume = Object.values(tickers).reduce(
    (sum, t) => sum + parseFloat(t.value || "0"),
    0
  );

  const rsi = market?.indicators.rsi || 50;
  const fearGreedIndex = Math.round(rsi);

  const topMovers = SYMBOLS.map((sym) => {
    const data = tickers[sym.id];
    if (!data) return null;
    return { ...sym, change: parseFloat(data.priceChangePercent), data };
  }).filter(Boolean);

  const totalChange = topMovers.reduce((sum, m) => sum + (m?.change || 0), 0);
  const avgChange = topMovers.length > 0 ? totalChange / topMovers.length : 0;

  const longRatio = Math.max(
    10,
    Math.min(90, 50 + Math.round(avgChange * 100 * 10))
  );
  const shortRatio = 100 - longRatio;

  return (
    <div className="flex flex-col min-h-screen bg-[#08090a] text-zinc-100 font-sans overflow-auto relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-emerald-500/[0.04] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/[0.03] blur-[120px] rounded-full" />
        {/* Ambient Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      </div>

      <div className="relative z-20 border-b border-white/20 bg-[#0B0E11]/80 backdrop-blur-xl">
        <PriceTicker tickers={tickers} symbols={SYMBOLS} />
      </div>

      <div className="relative z-10 w-full px-4 py-4 max-w-[1920px] mx-auto flex-1">
        <div className="mb-4">
          <DashboardHeader
            connected={connected}
            lastUpdate={lastUpdate}
            account={account}
            compact
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-3"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Account Overview + Chart */}
          <div className="bg-[#0B0E11] border border-white/20 rounded-xl overflow-hidden relative group">
            {/* Neon Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0 opacity-100" />

            <div className="p-4 relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Intelligence Overview
                </h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">
                    Live Monitor
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <span className="text-2xl font-black text-white font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  $
                  {(account?.balance.available || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-[10px] font-bold text-zinc-500 ml-1.5 uppercase">
                  USDT
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900/40 rounded-lg p-2.5 border border-white/10 shadow-inner">
                  <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-tight mb-1">
                    Unrealized PnL
                  </span>
                  <span
                    className={`text-sm font-black font-mono ${
                      (account?.balance.unrealizedPnl || 0) >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {(account?.balance.unrealizedPnl || 0) >= 0 ? "+" : ""}$
                    {Math.abs(account?.balance.unrealizedPnl || 0).toFixed(2)}
                  </span>
                </div>
                <div className="bg-zinc-900/40 rounded-lg p-2.5 border border-white/10 shadow-inner">
                  <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-tight mb-1">
                    Staked Assets
                  </span>
                  <span className="text-sm font-black text-white font-mono">
                    ${(account?.balance.frozen || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            {/* Chart - Visible Height */}
            <div className="h-24 border-t border-white/20 bg-zinc-950/80">
              <PortfolioChart balance={account?.balance.available || 0} />
            </div>
          </div>

          {/* Market Sentiment - Using RSI as Fear/Greed */}
          <div className="bg-[#0B0E11] border border-white/20 rounded-xl p-5 flex flex-col relative group">
            {/* Neon Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0 opacity-100" />
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">
              Consensus Sentiment
            </h3>
            <div className="flex-1 flex items-center justify-center -mt-2">
              <SentimentGauge value={fearGreedIndex} />
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-zinc-300 font-bold mb-2 uppercase tracking-tighter">
                <span>{longRatio}% BULLS</span>
                <span>{shortRatio}% BEARS</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden bg-zinc-900 border border-white/5 shadow-inner">
                <div
                  className="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-700"
                  style={{ width: `${longRatio}%` }}
                />
                <div
                  className="bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all duration-700"
                  style={{ width: `${shortRatio}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] mt-1.5 font-bold uppercase tracking-widest">
                <span className="text-emerald-500">Long Signals</span>
                <span className="text-red-500">Short Exposure</span>
              </div>
            </div>
          </div>

          {/* Market Data */}
          <div className="bg-[#0B0E11] border border-white/20 rounded-xl p-5 flex flex-col relative group">
            {/* Neon Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0 opacity-100" />
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">
              Regime Intelligence
            </h3>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-zinc-500 block uppercase tracking-tight mb-1">
                Detected Market Phase
              </span>
              <span
                className={`text-2xl font-black font-mono tracking-tighter ${
                  market?.regime.regime === "TRENDING"
                    ? "text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]"
                    : market?.regime.regime === "HIGH_VOLATILITY"
                    ? "text-red-400 drop-shadow-[0_0_12px_rgba(248,113,113,0.4)]"
                    : "text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.4)]"
                }`}
              >
                {market?.regime.regime?.replace("_", " ") || "ANALYZING"}
              </span>
              <span className="text-[10px] font-bold text-zinc-500 block mt-1 uppercase">
                {market
                  ? `${(market.regime.confidence * 100).toFixed(
                      0
                    )}% Confidence Score`
                  : "--"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-900/60 border border-white/10 rounded-xl mt-auto shadow-inner">
              <div>
                <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-tighter">
                  Global 24h Volume
                </span>
                <span className="text-base font-black text-white font-mono">
                  {formatVolume(totalVolume.toString())}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Volume2 className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>

          {/* AI Engine */}
          <div className="bg-[#0B0E11] border border-white/20 rounded-xl p-5 flex flex-col relative group overflow-hidden">
            {/* Neon Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0 opacity-100" />
            {/* Background Scan Animation */}
            <div className="absolute inset-0 bg-linear-to-b from-emerald-500/[0.02] to-transparent pointer-events-none" />

            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                AI Intelligence Core
              </h3>
              <div
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black ${
                  loopRunning
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    : "bg-zinc-900 text-zinc-500 border border-white/5"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    loopRunning ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"
                  }`}
                />
                {loopRunning ? "ACTIVE ENGINE" : "STANDBY"}
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-zinc-900/60 border border-white/10 rounded-xl mb-4 relative z-10 shadow-inner">
              <div
                className={`p-2.5 rounded-lg border transition-all duration-500 ${
                  loopRunning
                    ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    : "bg-zinc-800 border-white/5"
                }`}
              >
                <Play
                  className={`w-4 h-4 transition-all duration-500 ${
                    loopRunning
                      ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] fill-emerald-500/20"
                      : "text-zinc-600"
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-black text-white uppercase tracking-tight">
                  Neural Signal Feed
                </span>
                <span className="text-[9px] font-bold text-zinc-500 block uppercase tracking-tighter">
                  {loopRunning
                    ? "Processing Real-time Vectors"
                    : "Awaiting Operational Command"}
                </span>
              </div>
            </div>
            <button
              onClick={toggleTradingLoop}
              className={`py-3 rounded-xl text-[11px] font-black transition-all uppercase tracking-[0.2em] relative z-10 ${
                loopRunning
                  ? "bg-transparent text-red-500 border border-red-500/20 hover:bg-red-500/5 hover:border-red-500/50"
                  : "bg-emerald-500 text-zinc-950 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95"
              }`}
            >
              {loopRunning ? "Terminate Core" : "Initialize AI Engine"}
            </button>
            <div className="grid grid-cols-2 gap-3 mt-4 relative z-10">
              <div className="text-center p-2 bg-zinc-900 border border-white/10 rounded-lg shadow-inner">
                <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-tighter mb-1">
                  Live RSI
                </span>
                <span
                  className={`text-base font-black font-mono transition-colors duration-500 ${
                    rsi > 70
                      ? "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.3)]"
                      : rsi < 30
                      ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                      : "text-white"
                  }`}
                >
                  {rsi.toFixed(1)}
                </span>
              </div>
              <div className="text-center p-2 bg-zinc-900 border border-white/10 rounded-lg shadow-inner">
                <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-tighter mb-1">
                  Volatility
                </span>
                <span className="text-base font-black font-mono text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.3)]">
                  {market
                    ? `${(market.indicators.volatility * 100).toFixed(2)}%`
                    : "--"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Decisions Panel - Demonstrates AI Involvement */}
        <div className="mb-4">
          <AIDecisionsPanel />
        </div>

        {/* Top Movers Row */}
        <div className="bg-[#0B0E11] border border-white/20 rounded-xl p-4 mb-4 relative group">
          {/* Neon Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0 opacity-100" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
              Market Vector Analysis
            </h3>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">
              Real-time Top Movers
            </span>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 relative z-10">
            {SYMBOLS.map((sym) => {
              const data = tickers[sym.id];
              if (!data)
                return (
                  <div
                    key={sym.id}
                    className="text-center p-3 bg-zinc-900 border border-white/5 rounded-xl animate-pulse h-14"
                  />
                );
              const change = parseFloat(data.priceChangePercent);
              const isPositive = change >= 0;
              return (
                <div
                  key={sym.id}
                  className="text-center p-3 bg-zinc-900/60 border border-white/5 rounded-xl hover:bg-zinc-800/80 hover:border-white/20 hover:shadow-2xl transition-all cursor-pointer group/mover relative overflow-hidden"
                >
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-[1.5px] opacity-0 group-hover/mover:opacity-100 transition-opacity ${
                      isPositive ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-[11px] font-black text-zinc-400 group-hover/mover:text-white transition-colors uppercase tracking-tight">
                    {sym.name.split("/")[0]}
                  </span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400" />
                    )}
                    <span
                      className={`text-[12px] font-black font-mono transition-all ${
                        isPositive
                          ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                          : "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.3)]"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {(change * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Market Overview Table */}
        <div className="bg-[#0B0E11] border border-white/20 rounded-xl overflow-hidden shadow-2xl relative">
          {/* Neon Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0 opacity-100" />
          <MarketOverview tickers={tickers} symbols={SYMBOLS} />
        </div>
      </div>
    </div>
  );
}
