"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Server,
  Wallet,
  Brain,
  Upload,
  Activity,
  Shield,
} from "lucide-react";

interface TestResult {
  status: "pending" | "running" | "pass" | "fail";
  message: string;
  details?: string;
}

interface TestResults {
  health: TestResult;
  account: TestResult;
  market: TestResult;
  agents: TestResult;
  ailog: TestResult;
}

const initialResults: TestResults = {
  health: { status: "pending", message: "Health check" },
  account: { status: "pending", message: "Account balance" },
  market: { status: "pending", message: "Market data" },
  agents: { status: "pending", message: "AI agents status" },
  ailog: { status: "pending", message: "AI log capability" },
};

export default function VerifyPage() {
  const [results, setResults] = useState<TestResults>(initialResults);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const updateResult = (
    key: keyof TestResults,
    update: Partial<TestResult>
  ) => {
    setResults((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...update },
    }));
  };

  const runTests = async () => {
    setRunning(true);
    setCompleted(false);
    setResults(initialResults);

    updateResult("health", { status: "running" });
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      if (data.success) {
        updateResult("health", {
          status: "pass",
          details: `Server time: ${data.data.serverTime}`,
        });
      } else {
        updateResult("health", { status: "fail", details: data.error });
      }
    } catch (e) {
      updateResult("health", {
        status: "fail",
        details: e instanceof Error ? e.message : "Network error",
      });
    }

    await new Promise((r) => setTimeout(r, 500));

    updateResult("account", { status: "running" });
    try {
      const res = await fetch("/api/account");
      const data = await res.json();
      if (data.success && data.data?.balance) {
        updateResult("account", {
          status: "pass",
          details: `Balance: $${
            data.data.balance.available?.toFixed(2) || "0.00"
          } USDT`,
        });
      } else {
        updateResult("account", {
          status: "fail",
          details: data.error || "No balance data",
        });
      }
    } catch (e) {
      updateResult("account", {
        status: "fail",
        details: e instanceof Error ? e.message : "Network error",
      });
    }

    await new Promise((r) => setTimeout(r, 500));

    updateResult("market", { status: "running" });
    try {
      const res = await fetch("/api/market?symbol=cmt_btcusdt");
      const data = await res.json();
      if (data.success && data.data?.ticker) {
        updateResult("market", {
          status: "pass",
          details: `BTC Price: $${parseFloat(
            data.data.ticker.lastPrice
          ).toLocaleString()}`,
        });
      } else {
        updateResult("market", {
          status: "fail",
          details: data.error || "No market data",
        });
      }
    } catch (e) {
      updateResult("market", {
        status: "fail",
        details: e instanceof Error ? e.message : "Network error",
      });
    }

    await new Promise((r) => setTimeout(r, 500));

    updateResult("agents", { status: "running" });
    try {
      const res = await fetch("/api/agents");
      const data = await res.json();
      if (data.success && data.data?.agents) {
        const agentCount = data.data.agents.length;
        updateResult("agents", {
          status: "pass",
          details: `${agentCount} AI agents initialized`,
        });
      } else {
        updateResult("agents", {
          status: "fail",
          details: data.error || "No agent data",
        });
      }
    } catch (e) {
      updateResult("agents", {
        status: "fail",
        details: e instanceof Error ? e.message : "Network error",
      });
    }

    await new Promise((r) => setTimeout(r, 500));

    updateResult("ailog", { status: "running" });
    try {
      const res = await fetch("/api/ailog");
      const data = await res.json();
      if (data.success) {
        updateResult("ailog", {
          status: "pass",
          details: "AI logging endpoint ready",
        });
      } else {
        updateResult("ailog", {
          status: "fail",
          details: data.error || "AI log not available",
        });
      }
    } catch (e) {
      updateResult("ailog", {
        status: "fail",
        details: e instanceof Error ? e.message : "Network error",
      });
    }

    setRunning(false);
    setCompleted(true);
  };

  useEffect(() => {
    let mounted = true;

    const runInitialTests = async () => {
      if (!mounted) return;

      setRunning(true);
      setCompleted(false);
      setResults(initialResults);

      const testHealth = async () => {
        updateResult("health", { status: "running" });
        try {
          const res = await fetch("/api/health");
          const data = await res.json();
          if (data.success) {
            updateResult("health", {
              status: "pass",
              details: `Server time: ${data.data.serverTime}`,
            });
          } else {
            updateResult("health", { status: "fail", details: data.error });
          }
        } catch (e) {
          updateResult("health", {
            status: "fail",
            details: e instanceof Error ? e.message : "Network error",
          });
        }
      };

      const testAccount = async () => {
        updateResult("account", { status: "running" });
        try {
          const res = await fetch("/api/account");
          const data = await res.json();
          if (data.success && data.data?.balance) {
            updateResult("account", {
              status: "pass",
              details: `Balance: $${
                data.data.balance.available?.toFixed(2) || "0.00"
              } USDT`,
            });
          } else {
            updateResult("account", {
              status: "fail",
              details: data.error || "No balance data",
            });
          }
        } catch (e) {
          updateResult("account", {
            status: "fail",
            details: e instanceof Error ? e.message : "Network error",
          });
        }
      };

      const testMarket = async () => {
        updateResult("market", { status: "running" });
        try {
          const res = await fetch("/api/market?symbol=cmt_btcusdt");
          const data = await res.json();
          if (data.success && data.data?.ticker) {
            updateResult("market", {
              status: "pass",
              details: `BTC Price: $${parseFloat(
                data.data.ticker.lastPrice
              ).toLocaleString()}`,
            });
          } else {
            updateResult("market", {
              status: "fail",
              details: data.error || "No market data",
            });
          }
        } catch (e) {
          updateResult("market", {
            status: "fail",
            details: e instanceof Error ? e.message : "Network error",
          });
        }
      };

      const testAgents = async () => {
        updateResult("agents", { status: "running" });
        try {
          const res = await fetch("/api/agents");
          const data = await res.json();
          if (data.success && data.data?.agents) {
            const agentCount = data.data.agents.length;
            updateResult("agents", {
              status: "pass",
              details: `${agentCount} AI agents initialized`,
            });
          } else {
            updateResult("agents", {
              status: "fail",
              details: data.error || "No agent data",
            });
          }
        } catch (e) {
          updateResult("agents", {
            status: "fail",
            details: e instanceof Error ? e.message : "Network error",
          });
        }
      };

      const testAilog = async () => {
        updateResult("ailog", { status: "running" });
        try {
          const res = await fetch("/api/ailog");
          const data = await res.json();
          if (data.success) {
            updateResult("ailog", {
              status: "pass",
              details: "AI logging endpoint ready",
            });
          } else {
            updateResult("ailog", {
              status: "fail",
              details: data.error || "AI log not available",
            });
          }
        } catch (e) {
          updateResult("ailog", {
            status: "fail",
            details: e instanceof Error ? e.message : "Network error",
          });
        }
      };

      await testHealth();
      await new Promise((r) => setTimeout(r, 500));
      await testAccount();
      await new Promise((r) => setTimeout(r, 500));
      await testMarket();
      await new Promise((r) => setTimeout(r, 500));
      await testAgents();
      await new Promise((r) => setTimeout(r, 500));
      await testAilog();

      if (mounted) {
        setRunning(false);
        setCompleted(true);
      }
    };

    runInitialTests();

    return () => {
      mounted = false;
    };
  }, []);

  const passCount = Object.values(results).filter(
    (r) => r.status === "pass"
  ).length;
  const totalCount = Object.keys(results).length;
  const allPassed = passCount === totalCount;

  const icons: Record<keyof TestResults, typeof Server> = {
    health: Server,
    account: Wallet,
    market: Activity,
    agents: Brain,
    ailog: Upload,
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-white font-sans">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-emerald-500/[0.04] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/[0.03] blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0B0E11] border border-white/20 flex items-center justify-center">
              <Image src="/logo.png" alt="logo" width={24} height={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white uppercase tracking-tight">
                API Verification
              </h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                WEEX Hackathon Connectivity Check
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#0B0E11] border border-white/20 rounded-xl overflow-hidden mb-6 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0" />

          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-black text-white uppercase tracking-widest">
                  Connectivity Tests
                </span>
              </div>
              {completed && (
                <div
                  className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    allPassed
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                  }`}
                >
                  {passCount}/{totalCount} Passed
                </div>
              )}
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {(Object.keys(results) as Array<keyof TestResults>).map((key) => {
              const result = results[key];
              const Icon = icons[key];

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg border ${
                        result.status === "pass"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : result.status === "fail"
                          ? "bg-red-500/10 border-red-500/30 text-red-400"
                          : "bg-zinc-900 border-white/10 text-zinc-500"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-white block">
                        {result.message}
                      </span>
                      {result.details && (
                        <span className="text-[10px] text-zinc-500">
                          {result.details}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    {result.status === "pending" && (
                      <div className="w-5 h-5 rounded-full border-2 border-zinc-700" />
                    )}
                    {result.status === "running" && (
                      <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    )}
                    {result.status === "pass" && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                    {result.status === "fail" && (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <button
          onClick={runTests}
          disabled={running}
          className="w-full py-3 rounded-xl bg-emerald-500 text-zinc-950 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]"
        >
          {running ? "Running Tests..." : "Re-run All Tests"}
        </button>

        {completed && allPassed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">
                All Systems Operational
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              API connectivity verified. WEEX integration is fully functional.
              All endpoints responding correctly.
            </p>
          </motion.div>
        )}

        <div className="mt-8 p-4 bg-zinc-900/50 border border-white/10 rounded-xl">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">
            What This Verifies
          </h3>
          <ul className="space-y-2 text-[10px] text-zinc-500">
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              <span>
                <strong className="text-zinc-300">Health:</strong> Server is
                running and responsive
              </span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              <span>
                <strong className="text-zinc-300">Account:</strong> WEEX API
                credentials are valid
              </span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              <span>
                <strong className="text-zinc-300">Market:</strong> Can fetch
                real-time market data
              </span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              <span>
                <strong className="text-zinc-300">Agents:</strong> Multi-agent
                AI system is initialized
              </span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              <span>
                <strong className="text-zinc-300">AI Log:</strong> Can upload AI
                decisions to WEEX
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
