"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, Volume2, Play, AlertTriangle } from "lucide-react";

import { useDashboardData, SYMBOLS } from "@/src/client/hooks/useDashboardData";
import { AuroraBackground } from "@/src/components/landing/aurora-background";
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
    <AuroraBackground className="min-h-screen h-auto! overflow-x-hidden selection:bg-emerald-500/30">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <DashboardHeader
          connected={connected}
          lastUpdate={lastUpdate}
          account={account}
        />

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-8 p-4 bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-2xl text-red-400 text-sm flex items-center gap-3 shadow-[0_0_20px_-5px_rgba(239,68,68,0.2)]"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="font-medium text-red-200">{error}</span>
          </motion.div>
        )}

        {/* Command Center Grid */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Row 1: Tickers (Full Width for quick glance) */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {SYMBOLS.map((sym, index) => (
              <div key={sym.id} className="h-40">
                <TickerCard symbol={sym} data={tickers[sym.id]} index={index} />
              </div>
            ))}
          </div>

          {/* Row 2: Charts & Stats Mix */}
          {/* Main Portfolio Chart */}
          <div className="col-span-12 lg:col-span-8 h-[400px]">
            <PortfolioChart balance={account?.balance.available || 0} />
          </div>

          {/* Side Panel: Quick Stats & Controls */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-6 flex-1">
              <StatsCard
                label="AI Regime"
                icon={Brain}
                value={
                  market?.regime.regime.replace("_", " ") || "Analyzing..."
                }
                subValue={
                  market
                    ? `${(market.regime.confidence * 100).toFixed(
                        0
                      )}% confidence`
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

            {/* Auto-Trade Control */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    loopRunning ? "bg-emerald-500/20" : "bg-zinc-800"
                  }`}
                >
                  <Play
                    className={`w-5 h-5 ${
                      loopRunning ? "text-emerald-400" : "text-zinc-500"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white">Auto-Pilot</h3>
                  <p className="text-xs text-zinc-500">
                    {loopRunning ? "Active Strategy" : "System Paused"}
                  </p>
                </div>
              </div>

              <button
                onClick={toggleTradingLoop}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                  loopRunning
                    ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                    : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                }`}
              >
                {loopRunning ? "STOP ENGINE" : "START ENGINE"}
              </button>
            </div>
          </div>

          {/* Row 3: Market Overview & Quick Trade */}
          <div className="col-span-12 lg:col-span-8">
            <MarketOverview
              tickers={tickers}
              market={market}
              symbols={SYMBOLS}
            />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <QuickTradeWidget />
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
