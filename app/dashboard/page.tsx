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

import { SpotlightCard } from "@/src/components/landing/spotlight-card";

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

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          {/* 1. Main Chart Area (Top Left) */}
          <SpotlightCard className="col-span-1 md:col-span-8 row-span-2 h-[560px] border-zinc-800 bg-zinc-900/50">
            <PortfolioChart balance={account?.balance.available || 0} />
          </SpotlightCard>

          {/* 2. Quick Execution Terminal (Top Right - PROMOTED) */}
          <SpotlightCard className="col-span-1 md:col-span-4 row-span-2 h-[560px] border-zinc-800 bg-zinc-900/50 p-2 relative overflow-visible">
            <div className="absolute -top-3 -right-3 z-20 bg-emerald-500 text-zinc-950 text-[10px] font-bold px-2 py-1 rounded-sm shadow-lg rotate-12">
              LIVE
            </div>
            <QuickTradeWidget
              symbol="BTC/USDT"
              currentPrice={parseFloat(
                tickers["cmt_btcusdt"]?.lastPrice || "0"
              )}
              userBalance={account?.balance.available || 0}
            />
          </SpotlightCard>

          {/* 3. Intelligence Row (Regime, AutoPilot, Volume) */}
          {/* Heroic Regime Card */}
          <SpotlightCard
            className="col-span-1 md:col-span-4 h-[220px] border-blue-500/20 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-violet-900/20 via-zinc-900/50 to-zinc-900/50"
            spotlightColor="rgba(139, 92, 246, 0.3)"
          >
            <StatsCard
              label="AI Regime Analysis"
              icon={Brain}
              value={
                <span
                  className={
                    market?.regime.regime === "TRENDING"
                      ? "text-emerald-400"
                      : market?.regime.regime === "HIGH_VOLATILITY"
                      ? "text-red-400"
                      : "text-blue-400"
                  }
                >
                  {market?.regime.regime.replace("_", " ") || "Analyzing..."}
                </span>
              }
              subValue={
                market
                  ? `${(market.regime.confidence * 100).toFixed(
                      0
                    )}% confidence model output`
                  : "Waiting for signal..."
              }
            />
          </SpotlightCard>

          {/* Technical AutoPilot Card */}
          <SpotlightCard
            className="col-span-1 md:col-span-4 h-[220px] border-zinc-800 bg-[linear-gradient(45deg,#18181b_25%,#09090b_25%,#09090b_50%,#18181b_50%,#18181b_75%,#09090b_75%,#09090b_100%)] bg-size-[20px_20px] border-dashed"
            spotlightColor="rgba(16, 185, 129, 0.1)"
          >
            <div className="flex flex-col justify-between p-6 bg-zinc-900/80 backdrop-blur-sm h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Play
                      className={`w-4 h-4 ${
                        loopRunning ? "text-emerald-400" : "text-zinc-500"
                      }`}
                    />
                  </div>
                  <span className="text-zinc-400 text-sm font-medium tracking-wide">
                    Auto-Pilot
                  </span>
                </div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    loopRunning
                      ? "bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"
                      : "bg-zinc-600"
                  }`}
                />
              </div>
              <div className="flex-1 flex flex-col justify-center py-2">
                <div className="text-2xl font-bold text-white font-mono tracking-tighter">
                  {loopRunning ? "SYSTEM_ACTIVE" : "STANDBY_MODE"}
                </div>
              </div>
              <button
                onClick={toggleTradingLoop}
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all duration-300 border ${
                  loopRunning
                    ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                    : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:text-white"
                }`}
              >
                {loopRunning ? "TERMINATE" : "ENGAGE SYSTEM"}
              </button>
            </div>
          </SpotlightCard>

          <SpotlightCard className="col-span-1 md:col-span-4 h-[220px] border-zinc-800 bg-zinc-900/50">
            <StatsCard
              label="24h Volume"
              icon={Volume2}
              value={formatVolume(totalVolume.toString())}
              subValue="3 Pairs Aggr."
            />
          </SpotlightCard>

          {/* 4. Ticker Tape */}
          {SYMBOLS.map((sym, index) => (
            <SpotlightCard
              key={sym.id}
              className="col-span-1 md:col-span-4 h-40 border-zinc-800 bg-zinc-950"
              spotlightColor={sym.color + "40"}
            >
              <TickerCard symbol={sym} data={tickers[sym.id]} index={index} />
            </SpotlightCard>
          ))}

          {/* 5. Market Depth */}
          <SpotlightCard className="col-span-1 md:col-span-12 min-h-[400px] border-zinc-800 bg-zinc-900/50 p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-emerald-500 rounded-full" />
              Market Overview
            </h3>
            <MarketOverview
              tickers={tickers}
              market={market}
              symbols={SYMBOLS}
            />
          </SpotlightCard>
        </div>
      </div>
    </AuroraBackground>
  );
}
