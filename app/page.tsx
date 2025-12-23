"use client";

import { useSyncExternalStore } from "react";
import { useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  Shield,
  Activity,
  TrendingUp,
  Gauge,
  Zap,
  Brain,
  BarChart3,
  Lock,
  ArrowRight,
  Github,
  ChevronDown,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMarketData, useHealthCheck } from "@/client/hooks";
import {
  selectedSymbolAtom,
  currentRegimeAtom,
  volatilityStatusAtom,
  systemStatusAtom,
  marketDataAtom,
} from "@/client/state/atoms";
import {
  TRADING_PAIRS,
  REGIME_TYPES,
  type TradingPair,
} from "@/shared/constants";

function AnimatedGradientText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient ${className}`}
    >
      {children}
    </span>
  );
}

function GlowingOrb({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 animate-pulse ${className}`}
    />
  );
}

function LiveStatusIndicator() {
  const systemStatus = useAtomValue(systemStatusAtom);
  const regime = useAtomValue(currentRegimeAtom);
  const volatility = useAtomValue(volatilityStatusAtom);
  const marketData = useAtomValue(marketDataAtom);

  useMarketData();
  useHealthCheck();

  const statusColors = {
    connecting: "bg-yellow-500",
    operational: "bg-emerald-500",
    error: "bg-red-500",
    suspended: "bg-orange-500",
  };

  const regimeColors = {
    [REGIME_TYPES.TRENDING]: "from-emerald-500 to-green-600",
    [REGIME_TYPES.RANGE_BOUND]: "from-blue-500 to-cyan-600",
    [REGIME_TYPES.HIGH_VOLATILITY]: "from-red-500 to-orange-600",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mx-auto">
      <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl overflow-hidden group hover:border-zinc-700 transition-all">
        <div
          className={`h-1 w-full bg-gradient-to-r ${
            regime ? regimeColors[regime.regime] : "from-zinc-600 to-zinc-700"
          }`}
        />
        <CardHeader className="pb-2">
          <CardDescription className="text-zinc-400 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Market Regime
          </CardDescription>
          <CardTitle className="text-2xl font-bold text-white">
            {regime?.regime?.replace("_", " ") || "Analyzing..."}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm">Confidence</span>
            <Badge variant="secondary" className="bg-zinc-800 text-white">
              {regime ? `${(regime.confidence * 100).toFixed(0)}%` : "—"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl overflow-hidden group hover:border-zinc-700 transition-all">
        <div
          className={`h-1 w-full ${
            volatility?.killSwitchActive
              ? "bg-red-500"
              : "bg-gradient-to-r from-cyan-500 to-blue-600"
          }`}
        />
        <CardHeader className="pb-2">
          <CardDescription className="text-zinc-400 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Volatility Guard
          </CardDescription>
          <CardTitle className="text-2xl font-bold text-white">
            {volatility?.killSwitchActive
              ? "KILL SWITCH"
              : volatility?.spikeDetected
              ? "SPIKE DETECTED"
              : "NORMAL"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm">Current Vol</span>
            <Badge variant="secondary" className="bg-zinc-800 text-white">
              {volatility
                ? `${(volatility.currentVolatility * 100).toFixed(2)}%`
                : "—"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl overflow-hidden group hover:border-zinc-700 transition-all">
        <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-600" />
        <CardHeader className="pb-2">
          <CardDescription className="text-zinc-400 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            BTC/USDT
          </CardDescription>
          <CardTitle className="text-2xl font-bold text-white font-mono">
            ${marketData?.last?.toLocaleString() || "—"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm">24h Change</span>
            <Badge
              variant="secondary"
              className={`${
                marketData && marketData.priceChangePercent > 0
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {marketData
                ? `${(marketData.priceChangePercent * 100).toFixed(2)}%`
                : "—"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-3 flex items-center justify-center gap-2 text-sm">
        <span
          className={`w-2 h-2 rounded-full ${statusColors[systemStatus]} animate-pulse`}
        />
        <span className="text-zinc-400">System {systemStatus}</span>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-zinc-900/30 border-zinc-800 backdrop-blur-sm hover:bg-zinc-900/50 hover:border-zinc-700 transition-all group">
      <CardHeader>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-emerald-400" />
        </div>
        <CardTitle className="text-lg text-white">{title}</CardTitle>
        <CardDescription className="text-zinc-400">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function SymbolSelector() {
  const [symbol, setSymbol] = useAtom(selectedSymbolAtom);
  const [isOpen, setIsOpen] = useState(false);

  const symbolLabels: Record<TradingPair, string> = {
    cmt_btcusdt: "BTC/USDT",
    cmt_ethusdt: "ETH/USDT",
    cmt_solusdt: "SOL/USDT",
    cmt_dogeusdt: "DOGE/USDT",
    cmt_xrpusdt: "XRP/USDT",
    cmt_adausdt: "ADA/USDT",
    cmt_bnbusdt: "BNB/USDT",
    cmt_ltcusdt: "LTC/USDT",
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white hover:bg-zinc-800 transition-colors"
      >
        <span className="font-mono">{symbolLabels[symbol]}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden z-50 shadow-xl">
          {TRADING_PAIRS.map((pair) => (
            <button
              key={pair}
              onClick={() => {
                setSymbol(pair);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left font-mono text-sm hover:bg-zinc-800 transition-colors ${
                symbol === pair
                  ? "bg-zinc-800 text-emerald-400"
                  : "text-zinc-300"
              }`}
            >
              {symbolLabels[pair]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ArchitectureFlow() {
  const steps = [
    {
      icon: BarChart3,
      label: "Market Data",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Brain,
      label: "Regime Classifier",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Shield,
      label: "Risk Engine",
      color: "from-emerald-500 to-green-500",
    },
    { icon: Zap, label: "Execution", color: "from-orange-500 to-yellow-500" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center gap-4">
          <div className={`flex flex-col items-center gap-2`}>
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} p-0.5`}
            >
              <div className="w-full h-full bg-zinc-900 rounded-2xl flex items-center justify-center">
                <step.icon className="w-8 h-8 text-white" />
              </div>
            </div>
            <span className="text-sm text-zinc-400 font-medium">
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <ArrowRight className="w-6 h-6 text-zinc-600 hidden md:block" />
          )}
        </div>
      ))}
    </div>
  );
}

function AgentStatusPanel() {
  const agents = [
    {
      type: "REGIME_DETECTOR",
      name: "Regime Agent",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      description: "Classifies market conditions",
      status: "ANALYZING",
    },
    {
      type: "RISK_CONTROLLER",
      name: "Risk Agent",
      icon: Shield,
      color: "from-orange-500 to-amber-500",
      description: "Controls position sizing",
      status: "MONITORING",
    },
    {
      type: "VOLATILITY_GUARD",
      name: "Volatility Agent",
      icon: Activity,
      color: "from-red-500 to-rose-500",
      description: "Monitors for anomalies",
      status: "WATCHING",
    },
    {
      type: "STRATEGY_EXECUTOR",
      name: "Strategy Agent",
      icon: Bot,
      color: "from-emerald-500 to-green-500",
      description: "Generates trade signals",
      status: "READY",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {agents.map((agent) => (
        <Card
          key={agent.type}
          className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl overflow-hidden group hover:border-zinc-700 transition-all"
        >
          <div className={`h-1 w-full bg-gradient-to-r ${agent.color}`} />
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color} p-0.5`}
              >
                <div className="w-full h-full bg-zinc-900 rounded-xl flex items-center justify-center">
                  <agent.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-white">
                  {agent.name}
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  {agent.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-zinc-400 uppercase tracking-wide">
                {agent.status}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="lg:col-span-4 flex items-center justify-center gap-2 pt-4">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent flex-1" />
        <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
          Multi-Agent AI System
        </Badge>
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent flex-1" />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      <GlowingOrb className="w-96 h-96 bg-emerald-500 -top-48 -left-48" />
      <GlowingOrb className="w-96 h-96 bg-blue-500 top-1/2 -right-48" />
      <GlowingOrb className="w-96 h-96 bg-purple-500 -bottom-48 left-1/3" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <header className="relative z-10 border-b border-zinc-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">RegimeGuard</span>
          </div>
          <div className="flex items-center gap-4">
            <SymbolSelector />
            <a
              href="https://github.com/vmmuthu31/RegimeGuard"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
          <Badge className="mb-6 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
            WEEX AI Trading Competition
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            AI Controls <AnimatedGradientText>Risk</AnimatedGradientText>,
            <br />
            Not Greed
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12">
            An explainable AI-powered trading engine that prioritizes capital
            protection and risk-adjusted performance. Trade smarter, not harder.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold px-8"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Trading
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-zinc-700 hover:bg-zinc-800"
            >
              View Documentation
            </Button>
          </div>

          <LiveStatusIndicator />
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-zinc-400">
              AI-driven decision pipeline with full transparency
            </p>
          </div>
          <ArchitectureFlow />
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <AnimatedGradientText>AI Agents</AnimatedGradientText>
            </h2>
            <p className="text-zinc-400">
              Specialized agents collaborate to make intelligent trading
              decisions
            </p>
          </div>
          <AgentStatusPanel />
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Core Features</h2>
            <p className="text-zinc-400">
              Built for professional risk management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Brain}
              title="Market Regime Classification"
              description="AI identifies Trending, Range-Bound, or High Volatility conditions in real-time."
            />
            <FeatureCard
              icon={Shield}
              title="Dynamic Risk Control"
              description="Position sizing, stop-loss, and exposure automatically adapt to market conditions."
            />
            <FeatureCard
              icon={Activity}
              title="Volatility Guard"
              description="Kill-switch protection during flash crashes and abnormal market behavior."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Strategy Execution"
              description="Trend-following and mean-reversion strategies selected based on regime."
            />
            <FeatureCard
              icon={Gauge}
              title="Drawdown Protection"
              description="Automatic trade suspension when daily loss limits are approached."
            />
            <FeatureCard
              icon={Lock}
              title="Full Transparency"
              description="Every trade decision is explainable with AI reasoning and confidence scores."
            />
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20">
          <Card className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/20 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Trade Smarter?
              </h2>
              <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
                Join the WEEX AI Trading Competition with a system designed for
                sustainable, risk-adjusted returns.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-white text-zinc-900 hover:bg-zinc-200 font-semibold px-8"
                >
                  Get Started
                </Button>
                <a
                  href="https://github.com/vmmuthu31/RegimeGuard"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    View on GitHub
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="relative z-10 border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">RegimeGuard</span>
            </div>
            <p className="text-zinc-500 text-sm">
              Built for WEEX AI Trading Competition 2024
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
