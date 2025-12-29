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
    <div className="flex flex-col min-h-screen bg-[#0a0a0b] text-zinc-100 font-sans overflow-auto relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/3 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/2 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-20 border-b border-white/5">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {/* Account Overview + Chart */}
          <div className="bg-zinc-900/60 border border-white/5 rounded-xl overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Account Overview
                </h3>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] text-emerald-400">Live</span>
                </div>
              </div>
              <div className="mb-2">
                <span className="text-xl font-bold text-white font-mono">
                  $
                  {(account?.balance.available || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-[9px] text-zinc-500 ml-1">USDT</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-zinc-800/60 rounded-lg p-2">
                  <span className="text-[8px] text-zinc-500 block">
                    Unrealized PnL
                  </span>
                  <span
                    className={`text-[11px] font-bold font-mono ${
                      (account?.balance.unrealizedPnl || 0) >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {(account?.balance.unrealizedPnl || 0) >= 0 ? "+" : ""}$
                    {Math.abs(account?.balance.unrealizedPnl || 0).toFixed(2)}
                  </span>
                </div>
                <div className="bg-zinc-800/60 rounded-lg p-2">
                  <span className="text-[8px] text-zinc-500 block">Frozen</span>
                  <span className="text-[11px] font-bold text-white font-mono">
                    ${(account?.balance.frozen || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            {/* Chart - Visible Height */}
            <div className="h-20 border-t border-white/5 bg-zinc-950/50">
              <PortfolioChart balance={account?.balance.available || 0} />
            </div>
          </div>

          {/* Market Sentiment - Using RSI as Fear/Greed */}
          <div className="bg-zinc-900/60 border border-white/5 rounded-xl p-4 flex flex-col">
            <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Market Sentiment
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <SentimentGauge value={fearGreedIndex} />
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-[8px] text-zinc-500 mb-1">
                <span>{longRatio}%</span>
                <span>{shortRatio}%</span>
              </div>
              <div className="flex h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 transition-all duration-500"
                  style={{ width: `${longRatio}%` }}
                />
                <div
                  className="bg-red-500 transition-all duration-500"
                  style={{ width: `${shortRatio}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] mt-0.5">
                <span className="text-emerald-400">Long</span>
                <span className="text-red-400">Short</span>
              </div>
            </div>
          </div>

          {/* Market Data */}
          <div className="bg-zinc-900/60 border border-white/5 rounded-xl p-4 flex flex-col">
            <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Market Data
            </h3>
            <div className="flex-1">
              <span className="text-[8px] text-zinc-500 block">
                Current Regime
              </span>
              <span
                className={`text-lg font-bold font-mono ${
                  market?.regime.regime === "TRENDING"
                    ? "text-emerald-400"
                    : market?.regime.regime === "HIGH_VOLATILITY"
                    ? "text-red-400"
                    : "text-blue-400"
                }`}
              >
                {market?.regime.regime?.replace("_", " ") || "ANALYZING"}
              </span>
              <span className="text-[9px] text-zinc-500 block">
                {market
                  ? `${(market.regime.confidence * 100).toFixed(0)}% confidence`
                  : "--"}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-zinc-800/60 rounded-lg mt-auto">
              <div>
                <span className="text-[8px] text-zinc-500 block">
                  24h Volume
                </span>
                <span className="text-sm font-bold text-white font-mono">
                  {formatVolume(totalVolume.toString())}
                </span>
              </div>
              <Volume2 className="w-4 h-4 text-blue-400" />
            </div>
          </div>

          {/* AI Engine */}
          <div className="bg-zinc-900/60 border border-white/5 rounded-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                AI Engine
              </h3>
              <div
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold ${
                  loopRunning
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                <div
                  className={`w-1 h-1 rounded-full ${
                    loopRunning ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"
                  }`}
                />
                {loopRunning ? "LIVE" : "OFF"}
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-zinc-800/60 rounded-lg mb-2">
              <div
                className={`p-1.5 rounded ${
                  loopRunning ? "bg-emerald-500/20" : "bg-zinc-700"
                }`}
              >
                <Play
                  className={`w-3.5 h-3.5 ${
                    loopRunning ? "text-emerald-400" : "text-zinc-500"
                  }`}
                />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-white">
                  {loopRunning ? "Running" : "Stopped"}
                </span>
                <span className="text-[8px] text-zinc-500 block">
                  {loopRunning ? "Executing signals" : "Awaiting start"}
                </span>
              </div>
            </div>
            <button
              onClick={toggleTradingLoop}
              className={`py-2 rounded-lg text-[11px] font-bold transition-all ${
                loopRunning
                  ? "bg-red-500/10 text-red-400 border border-red-500/30"
                  : "bg-emerald-500 text-black"
              }`}
            >
              {loopRunning ? "Stop Engine" : "Start AI Engine"}
            </button>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-center p-1.5 bg-zinc-800/40 rounded">
                <span className="text-[8px] text-zinc-500 block">RSI</span>
                <span
                  className={`text-sm font-bold font-mono ${
                    rsi > 70
                      ? "text-red-400"
                      : rsi < 30
                      ? "text-emerald-400"
                      : "text-white"
                  }`}
                >
                  {rsi.toFixed(1)}
                </span>
              </div>
              <div className="text-center p-1.5 bg-zinc-800/40 rounded">
                <span className="text-[8px] text-zinc-500 block">
                  Volatility
                </span>
                <span className="text-sm font-bold font-mono text-orange-400">
                  {market
                    ? `${(market.indicators.volatility * 100).toFixed(2)}%`
                    : "--"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Movers Row */}
        <div className="bg-zinc-900/60 border border-white/5 rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[11px] font-semibold text-white">Top Movers</h3>
            <span className="text-[9px] text-zinc-500">24H</span>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {SYMBOLS.map((sym) => {
              const data = tickers[sym.id];
              if (!data)
                return (
                  <div
                    key={sym.id}
                    className="text-center p-2 bg-zinc-800/30 rounded animate-pulse h-12"
                  />
                );
              const change = parseFloat(data.priceChangePercent);
              const isPositive = change >= 0;
              return (
                <div
                  key={sym.id}
                  className="text-center p-2 bg-zinc-800/40 rounded-lg hover:bg-zinc-700/50 transition-all cursor-pointer group"
                >
                  <span className="text-[10px] text-zinc-400 group-hover:text-white transition-colors">
                    {sym.name.split("/")[0]}
                  </span>
                  <div className="flex items-center justify-center gap-0.5 mt-0.5">
                    {isPositive ? (
                      <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5 text-red-400" />
                    )}
                    <span
                      className={`text-[11px] font-bold font-mono ${
                        isPositive ? "text-emerald-400" : "text-red-400"
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
        <div className="bg-zinc-900/60 border border-white/5 rounded-xl overflow-hidden">
          <MarketOverview tickers={tickers} symbols={SYMBOLS} />
        </div>
      </div>
    </div>
  );
}
