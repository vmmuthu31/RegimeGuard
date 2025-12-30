"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Shield,
  Activity,
  TrendingUp,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";

interface AgentData {
  type: string;
  status: string;
  lastAction: string;
  confidence: number;
  timestamp: number;
}

interface DecisionData {
  id: string;
  symbol: string;
  action: string;
  explanation: string;
  timestamp: number;
}

interface AgentsResponse {
  success: boolean;
  data: {
    orchestrator: {
      isRunning: boolean;
      timestamp: number;
    };
    agents: AgentData[];
    lastDecision: DecisionData | null;
    recentMessages: Array<{
      id: string;
      fromAgent: string;
      type: string;
      timestamp: number;
    }>;
  };
}

const AGENT_ICONS: Record<string, typeof Brain> = {
  REGIME_DETECTOR: Brain,
  RISK_CONTROLLER: Shield,
  VOLATILITY_GUARD: Activity,
  STRATEGY_EXECUTOR: TrendingUp,
};

const AGENT_LABELS: Record<string, string> = {
  REGIME_DETECTOR: "Regime",
  RISK_CONTROLLER: "Risk",
  VOLATILITY_GUARD: "Volatility",
  STRATEGY_EXECUTOR: "Strategy",
};

const STATUS_COLORS: Record<string, string> = {
  IDLE: "text-zinc-500",
  ANALYZING: "text-blue-400",
  ACTING: "text-emerald-400",
  ERROR: "text-red-400",
  SUSPENDED: "text-orange-400",
};

export function AIDecisionsPanel() {
  const [data, setData] = useState<AgentsResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgentData = async () => {
    try {
      const res = await fetch("/api/agents");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setError(null);
      } else {
        setError(json.error || "Failed to fetch");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentData();
    const interval = setInterval(fetchAgentData, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ts: number) => {
    if (!ts) return "--";
    return new Date(ts).toLocaleTimeString();
  };

  return (
    <div className="bg-[#0B0E11] border border-white/20 rounded-xl overflow-hidden relative group">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0 opacity-100" />

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <Brain className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
              AI Intelligence Core
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {data?.orchestrator.isRunning ? (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-400 uppercase">
                  Active
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-800 border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                <span className="text-[9px] font-black text-zinc-500 uppercase">
                  Standby
                </span>
              </div>
            )}
            <button
              onClick={fetchAgentData}
              className="p-1 rounded hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
            >
              <RefreshCw
                className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-2 mb-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px]">
            <AlertTriangle className="w-3 h-3" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 mb-4">
          {(data?.agents || []).map((agent) => {
            const Icon = AGENT_ICONS[agent.type] || Brain;
            const label = AGENT_LABELS[agent.type] || agent.type;
            const statusColor = STATUS_COLORS[agent.status] || "text-zinc-500";

            return (
              <div
                key={agent.type}
                className="p-2 rounded-lg bg-zinc-900/50 border border-white/10 flex flex-col items-center gap-1 group/agent hover:border-emerald-500/30 transition-all"
              >
                <div
                  className={`p-1.5 rounded-lg bg-zinc-900 border border-white/10 ${statusColor}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] font-black text-zinc-300 uppercase tracking-tight">
                  {label}
                </span>
                <span
                  className={`text-[8px] font-bold uppercase ${statusColor}`}
                >
                  {agent.status}
                </span>
                <div className="w-full bg-zinc-800 rounded-full h-1 overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.confidence * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-[8px] text-zinc-600 font-mono">
                  {(agent.confidence * 100).toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>

        {data?.lastDecision && (
          <div className="p-3 rounded-lg bg-zinc-900/50 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {data.lastDecision.action === "BUY" && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                {data.lastDecision.action === "SELL" && (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                {(data.lastDecision.action === "HOLD" ||
                  data.lastDecision.action === "EXIT") && (
                  <Activity className="w-4 h-4 text-blue-400" />
                )}
                <span className="text-[10px] font-black text-white uppercase tracking-wider">
                  Latest Decision: {data.lastDecision.action}
                </span>
              </div>
              <div className="flex items-center gap-1 text-zinc-500">
                <Clock className="w-3 h-3" />
                <span className="text-[9px] font-mono">
                  {formatTime(data.lastDecision.timestamp)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-black text-emerald-400">
                {data.lastDecision.symbol.replace("cmt_", "").toUpperCase()}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed line-clamp-2">
              {data.lastDecision.explanation}
            </p>
          </div>
        )}

        {!data?.lastDecision && !loading && (
          <div className="p-4 text-center text-zinc-600 text-[10px] uppercase tracking-widest">
            <Zap className="w-5 h-5 mx-auto mb-2 opacity-50" />
            No decisions yet — Start AI Engine to see activity
          </div>
        )}

        {data?.recentMessages && data.recentMessages.length > 0 && (
          <div className="mt-3 border-t border-white/5 pt-3">
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
              Recent Agent Activity
            </div>
            <div className="space-y-1 max-h-20 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {data.recentMessages.slice(-5).map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-[9px] text-zinc-500"
                  >
                    <span className="text-zinc-700 font-mono">
                      {formatTime(msg.timestamp)}
                    </span>
                    <span className="text-emerald-500/80 font-bold">
                      {AGENT_LABELS[msg.fromAgent] || msg.fromAgent}
                    </span>
                    <span className="text-zinc-600">→</span>
                    <span className="text-zinc-400 truncate">{msg.type}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
