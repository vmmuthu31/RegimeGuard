"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, Volume2, Play, AlertTriangle } from "lucide-react";

import { useDashboardData, SYMBOLS } from "@/src/client/hooks/useDashboardData";
import { TerminalPanel } from "@/src/client/components/dashboard/TerminalPanel";
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
    <div className="flex flex-col min-h-screen bg-[#020202] text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-auto relative">
      {/* GLOBAL AMBIENCE LAYERS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Moving Light Beams */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[150px] rounded-full" />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        {/* Vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]" />
      </div>

      <div className="relative z-10 w-full px-4 py-4 max-w-[1920px] mx-auto">
        <div className="mb-6">
          <DashboardHeader
            connected={connected}
            lastUpdate={lastUpdate}
            account={account}
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 p-4 bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-2xl text-red-400 text-sm flex items-center gap-3 shadow-[0_0_20px_-5px_rgba(239,68,68,0.2)]"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="font-medium text-red-200">{error}</span>
          </motion.div>
        )}

        {/* Bento Grid Layout - Tight gaps like trading platforms */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-1 bg-zinc-800/10 border border-white/5 rounded-none overflow-hidden p-[1px]">

          {/* TOP SECTION: Account Hub & Portfolio Intelligence */}
          <div className="col-span-1 md:col-span-4 h-[450px]">
            <TerminalPanel title="Protocol Account Hub" className="border-0 relative">
              <div className="flex flex-col h-full justify-between pt-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Total Net Worth</span>
                    <div className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-bold text-emerald-400 animate-pulse">VAULT SECURED</div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-4xl font-bold tracking-tighter text-white font-mono">
                      ${(account?.balance.available || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h2>
                    <span className="text-zinc-500 text-sm font-mono tracking-tight font-medium">USDT</span>
                  </div>
                  <div className="flex items-center gap-4 mt-4 py-3 border-y border-white/[0.03]">
                    <div>
                      <span className="text-[8px] font-bold text-zinc-600 uppercase block mb-0.5">Holding PnL (24h)</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">+$1,240.50</span>
                    </div>
                    <div className="w-px h-6 bg-white/[0.03]" />
                    <div>
                      <span className="text-[8px] font-bold text-zinc-600 uppercase block mb-0.5">Staked Assets</span>
                      <span className="text-xs font-bold text-white font-mono">12.50 SOL</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 pb-2">
                  <div className="grid grid-cols-2 gap-1 px-1">
                    <button className="py-2.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-400 hover:bg-white/10 hover:text-white transition-all uppercase tracking-wider">Deposit</button>
                    <button className="py-2.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-400 hover:bg-white/10 hover:text-white transition-all uppercase tracking-wider">Withdraw</button>
                  </div>
                  <button className="w-full py-3 rounded-lg bg-emerald-500 text-zinc-950 text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:bg-emerald-400 transition-all">Secure Re-balance</button>
                </div>
              </div>
            </TerminalPanel>
          </div>

          <div className="col-span-1 md:col-span-8 h-[450px]">
            <TerminalPanel title="Neural Portfolio Trajectory" noPadding className="border-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.05),transparent_70%)] pointer-events-none" />
              <div className="h-full overflow-hidden">
                <PortfolioChart balance={account?.balance.available || 0} />
              </div>
            </TerminalPanel>
          </div>

          {/* AI INTELLIGENCE ROW */}
          <div className="col-span-1 md:col-span-4 h-[180px]">
            <TerminalPanel title="Regime Analysis" className="border-0">
              <StatsCard
                label="Current Market State"
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
                    ? `${(market.regime.confidence * 100).toFixed(0)}% model confidence`
                    : "Waiting for signal..."
                }
              />
            </TerminalPanel>
          </div>

          <div className="col-span-1 md:col-span-4 h-[180px]">
            <TerminalPanel title="Neural Auto-Pilot" className="border-0">
              <div className="flex flex-col justify-between h-full pt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${loopRunning ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-zinc-900 border-white/5'} border transition-all duration-300`}>
                      <Play
                        className={`w-3.5 h-3.5 ${loopRunning ? "text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "text-zinc-500"}`}
                      />
                    </div>
                    <div>
                      <span className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase block">
                        Engine Status
                      </span>
                      <span className={`text-xs font-mono font-bold ${loopRunning ? "text-emerald-400" : "text-zinc-600"}`}>
                        {loopRunning ? "SYNCHRONIZED" : "STANDBY"}
                      </span>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${loopRunning ? "bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]" : "bg-zinc-800"}`} />
                </div>
                <button
                  onClick={toggleTradingLoop}
                  className={`w-full py-3 rounded-xl text-[10px] font-bold transition-all duration-500 relative overflow-hidden flex items-center justify-center gap-2 ${loopRunning
                    ? "bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20"
                    : "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:bg-emerald-400"
                    }`}
                >
                  {loopRunning && <div className="absolute inset-0 bg-linear-to-r from-transparent via-red-500/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />}
                  <span className="relative z-10 uppercase tracking-[0.2em]">{loopRunning ? "Terminate Neural Link" : "Engage AI Engine"}</span>
                </button>
              </div>
            </TerminalPanel>
          </div>

          <div className="col-span-1 md:col-span-4 h-[180px]">
            <TerminalPanel title="Aggregated Volume" className="border-0">
              <StatsCard
                label="Global Activity (24h)"
                icon={Volume2}
                value={formatVolume(totalVolume.toString())}
                subValue="Real-time multi-exchange feed"
              />
            </TerminalPanel>
          </div>

          {/* MARKET DEPTH - BOTTOM (FULL WIDTH) */}
          <div className="col-span-1 md:col-span-12 min-h-[450px]">
            <TerminalPanel title="Inter-Market Protocol Insight" className="border-0">
              <MarketOverview
                tickers={tickers}
                market={market}
                symbols={SYMBOLS}
              />
            </TerminalPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
