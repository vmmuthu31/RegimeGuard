"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Square,
  AlertTriangle,
  DollarSign,
  Zap,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface LoopConfig {
  symbols: string[];
  intervalMs: number;
  enabled: boolean;
  dryRun: boolean;
  basePositionSize: number;
  maxConcurrentTrades: number;
}

interface LoopState {
  isRunning: boolean;
  lastRun: number;
  cycleCount: number;
  tradesExecuted: number;
  errors: string[];
}

interface Position {
  symbol: string;
  side: string;
  size: number;
  entryPrice: number;
  markPrice: number;
  unrealizedPnl: number;
  leverage: number;
}

export function TradingControls() {
  const [config, setConfig] = useState<LoopConfig | null>(null);
  const [state, setState] = useState<LoopState | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/loop?action=status");
      const data = await res.json();
      if (data.success) {
        setConfig(data.data.config);
        setState(data.data.state);
      }
    } catch {
      setError("Failed to fetch status");
    }
  }, []);

  const fetchPositions = useCallback(async () => {
    try {
      const res = await fetch("/api/account?action=positions");
      const data = await res.json();
      if (data.success && data.data?.positions) {
        setPositions(data.data.positions);
      }
    } catch {
      console.log("Failed to fetch positions");
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchStatus();
      await fetchPositions();
    };
    init();

    const interval = setInterval(() => {
      fetchStatus();
      fetchPositions();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchStatus, fetchPositions]);

  const toggleLoop = async () => {
    if (!config) return;
    setLoading(true);
    try {
      const action = state?.isRunning ? "stop" : "start";
      await fetch("/api/loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      await fetchStatus();
    } catch {
      setError("Failed to toggle loop");
    }
    setLoading(false);
  };

  const toggleDryRun = async () => {
    if (!config) return;
    setLoading(true);
    try {
      await fetch("/api/loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "configure",
          dryRun: !config.dryRun,
        }),
      });
      await fetchStatus();
    } catch {
      setError("Failed to toggle dry-run");
    }
    setLoading(false);
  };

  const runSingleCycle = async () => {
    setLoading(true);
    try {
      await fetch("/api/loop?action=cycle");
      await fetchStatus();
      await fetchPositions();
    } catch {
      setError("Failed to run cycle");
    }
    setLoading(false);
  };

  const totalPnl = positions.reduce(
    (sum, p) => sum + (p.unrealizedPnl || 0),
    0
  );

  return (
    <div className="space-y-4">
      <div className="bg-[#0B0E11] border border-white/20 rounded-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-orange-500/0 via-orange-500/60 to-orange-500/0" />

        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30">
                <Zap className="w-4 h-4 text-orange-400" />
              </div>
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
                Live Trading Controls
              </h3>
            </div>
            <button
              onClick={fetchStatus}
              className="p-1 rounded hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
            >
              <RefreshCw
                className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2 mb-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px]">
              <AlertTriangle className="w-3 h-3" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-zinc-900/50 border border-white/10">
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                Mode
              </div>
              <button
                onClick={toggleDryRun}
                disabled={loading || state?.isRunning}
                className={`w-full py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  config?.dryRun
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                    : "bg-red-500/10 text-red-400 border border-red-500/30 animate-pulse"
                }`}
              >
                {config?.dryRun ? "DRY RUN (Safe)" : "🔴 LIVE TRADING"}
              </button>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/50 border border-white/10">
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                Position Size
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-lg font-black text-white font-mono">
                  ~$5
                </span>
                <span className="text-[9px] text-zinc-500">/trade</span>
              </div>
              <div className="text-[9px] text-zinc-600 mt-1">
                Max: $10 total (2 trades)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div className="p-2 rounded-lg bg-zinc-900 border border-white/10">
              <div className="text-[9px] text-zinc-500 uppercase">Cycles</div>
              <div className="text-sm font-black text-white font-mono">
                {state?.cycleCount || 0}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-zinc-900 border border-white/10">
              <div className="text-[9px] text-zinc-500 uppercase">Trades</div>
              <div className="text-sm font-black text-emerald-400 font-mono">
                {state?.tradesExecuted || 0}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-zinc-900 border border-white/10">
              <div className="text-[9px] text-zinc-500 uppercase">Interval</div>
              <div className="text-sm font-black text-white font-mono">
                {((config?.intervalMs || 60000) / 1000).toFixed(0)}s
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleLoop}
              disabled={loading}
              className={`flex-1 py-3 rounded-xl text-[11px] font-black transition-all uppercase tracking-[0.15em] flex items-center justify-center gap-2 ${
                state?.isRunning
                  ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                  : "bg-emerald-500 text-zinc-950 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02]"
              }`}
            >
              {state?.isRunning ? (
                <>
                  <Square className="w-4 h-4" />
                  Stop Loop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Loop
                </>
              )}
            </button>
            <button
              onClick={runSingleCycle}
              disabled={loading || state?.isRunning}
              className="px-4 py-3 rounded-xl text-[11px] font-black text-zinc-400 border border-white/10 hover:bg-white/5 transition-all uppercase tracking-wider disabled:opacity-50"
            >
              Test 1x
            </button>
          </div>
        </div>
      </div>

      {positions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0B0E11] border border-white/20 rounded-xl overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0" />

          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
                Active Positions
              </h3>
              <div
                className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                  totalPnl >= 0
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "bg-red-500/10 text-red-400 border border-red-500/30"
                }`}
              >
                {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)} PnL
              </div>
            </div>

            <div className="space-y-2">
              {positions.map((pos, idx) => {
                const pnl = pos.unrealizedPnl || 0;
                const isLong = pos.side === "LONG";
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/50 border border-white/10"
                  >
                    <div className="flex items-center gap-2">
                      {isLong ? (
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                      <div>
                        <span className="text-[11px] font-black text-white uppercase">
                          {pos.symbol.replace("cmt_", "").replace("usdt", "")}
                        </span>
                        <span
                          className={`ml-2 text-[9px] font-bold ${
                            isLong ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {pos.side}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-[11px] font-black font-mono ${
                          pnl >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                      </div>
                      <div className="text-[9px] text-zinc-500">
                        Entry: ${pos.entryPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
