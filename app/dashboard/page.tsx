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
      <div className="relative z-10 w-full px-4 py-4">
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

        {/* Bento Grid Layout - Tight gaps like trading platforms */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          {/* 1. Main Chart Area (Top Left) - 75% width */}
          <SpotlightCard className="col-span-1 md:col-span-9 row-span-2 h-[600px] border-zinc-800 bg-zinc-900/50 p-0">
            <PortfolioChart balance={account?.balance.available || 0} />
          </SpotlightCard>

          {/* 2. Quick Execution Terminal (Top Right - AI Showcase) */}
          <SpotlightCard className="col-span-1 md:col-span-3 row-span-2 h-[600px] border-emerald-500/20 bg-zinc-900/50 p-0 relative overflow-visible">
            <div className="absolute -top-2 -right-2 z-20 bg-emerald-500 text-zinc-950 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-lg shadow-emerald-500/30">
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

          {/* 3. AI Intelligence Row - Main Showcase */}
          {/* AI Regime Analysis Card - HERO */}
          <SpotlightCard
            className="col-span-1 md:col-span-4 h-[160px] border-violet-500/30 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-violet-900/30 via-zinc-900/50 to-zinc-900/50"
            spotlightColor="rgba(139, 92, 246, 0.4)"
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

          {/* AI AutoPilot Card - MAIN SHOWCASE */}
          <SpotlightCard
            className="col-span-1 md:col-span-4 h-[160px] border-emerald-500/30 bg-zinc-900/50"
            spotlightColor="rgba(16, 185, 129, 0.2)"
          >
            <div className="flex flex-col justify-between p-6 h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${loopRunning ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-zinc-800/50 border-zinc-700'} border transition-all duration-300`}>
                    <Play
                      className={`w-4 h-4 ${loopRunning ? "text-emerald-400" : "text-zinc-500"}`}
                    />
                  </div>
                  <div>
                    <span className="text-white text-sm font-bold tracking-wide block">
                      AI Auto-Pilot
                    </span>
                    <span className="text-zinc-500 text-[10px] font-mono">
                      Neural Trading Engine
                    </span>
                  </div>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${loopRunning
                    ? "bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]"
                    : "bg-zinc-600"
                    }`}
                />
              </div>
              <button
                onClick={toggleTradingLoop}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all duration-300 border ${loopRunning
                  ? "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                  }`}
              >
                {loopRunning ? "⏹ TERMINATE SYSTEM" : "▶ ENGAGE AI SYSTEM"}
              </button>
            </div>
          </SpotlightCard>

          <SpotlightCard className="col-span-1 md:col-span-4 h-[160px] border-zinc-800 bg-zinc-900/50">
            <StatsCard
              label="24h Volume"
              icon={Volume2}
              value={formatVolume(totalVolume.toString())}
              subValue="Aggregated from all pairs"
            />
          </SpotlightCard>

          {/* 4. Ticker Tape - Compact Row */}
          {SYMBOLS.map((sym, index) => (
            <SpotlightCard
              key={sym.id}
              className="col-span-1 md:col-span-3 h-32 border-zinc-800/50 bg-zinc-950 p-0"
              spotlightColor={sym.color + "30"}
            >
              <TickerCard symbol={sym} data={tickers[sym.id]} index={index} className="p-4" />
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
