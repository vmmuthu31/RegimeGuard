"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Brain,
  Volume2,
  Play,
  Square,
  AlertTriangle,
} from "lucide-react";

import { useDashboardData, SYMBOLS } from "@/src/client/hooks/useDashboardData";
import { DashboardHeader } from "@/src/client/components/dashboard/DashboardHeader";
import { StatsCard } from "@/src/client/components/dashboard/StatsCard";
import { TickerCard } from "@/src/client/components/dashboard/TickerCard";
import { MarketOverview } from "@/src/client/components/dashboard/MarketOverview";
import { QuickTradeWidget } from "@/src/client/components/dashboard/QuickTradeWidget";
import { PortfolioChart } from "@/src/client/components/dashboard/PortfolioChart";
import { formatVolume } from "@/src/shared/utils/formatters";

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

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden selection:bg-emerald-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-4000" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <DashboardHeader
          connected={connected}
          lastUpdate={lastUpdate}
          account={account}
        />

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Stats Area - 2 Columns */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <PortfolioChart balance={account?.balance.available || 0} />
            </div>

            <StatsCard
              label="AI Regime"
              icon={Brain}
              value={market?.regime.regime.replace("_", " ") || "Analyzing..."}
              subValue={
                market
                  ? `${(market.regime.confidence * 100).toFixed(0)}% confidence`
                  : "Waiting for signal..."
              }
              valueClassName={
                market?.regime.regime === "TRENDING"
                  ? "text-emerald-400"
                  : market?.regime.regime === "HIGH_VOLATILITY"
                  ? "text-red-400"
                  : "text-amber-400"
              }
            />

            <StatsCard
              label="24h Volume"
              icon={Volume2}
              value={formatVolume(totalVolume.toString())}
              subValue="Combined 3 pairs"
            />
          </div>

          {/* Quick Trade Widget - 1 Column */}
          <div className="lg:col-span-1 grid grid-cols-1 gap-6">
            {/* Moved Auto-Trade here or keep in main grid? Let's stack it under Quick Trade or keep it in main grid. 
                 The user layout had 3 columns. 
                 Left (2 cols): Balance (now full width), Regime, Volume.
                 Right (1 col): QuickTrade.
                 
                 Let's put AI Regime and Volume in one row under Balance.
                 And Auto-Trade? It was in the main grid before.
             */}

            <QuickTradeWidget />

            <StatsCard
              label="Auto-Trade"
              icon={Play}
              value={loopRunning ? "ACTIVE" : "OFF"}
              subValue={loopRunning ? "Strategy Executing" : "Strategy Paused"}
              valueClassName={
                loopRunning ? "text-emerald-400" : "text-zinc-500"
              }
              action={
                <button
                  onClick={toggleTradingLoop}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    loopRunning
                      ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  }`}
                >
                  {loopRunning ? (
                    <Square className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                </button>
              }
            />
          </div>
        </div>

        {/* Tickers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {SYMBOLS.map((sym, index) => (
            <TickerCard
              key={sym.id}
              symbol={sym}
              data={tickers[sym.id]}
              index={index}
            />
          ))}
        </div>

        {/* Market Overview */}
        <MarketOverview tickers={tickers} market={market} symbols={SYMBOLS} />
      </div>
    </div>
  );
}
