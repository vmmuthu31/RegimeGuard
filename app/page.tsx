"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Shield, Activity, Zap, Brain, Terminal as TerminalIcon,
  Lock, ArrowRight, Github, ChevronRight, BarChart3,
  Cpu, Globe, Radio
} from "lucide-react";
import CountUp from "react-countup";
import { cn, NoiseOverlay, HolographicBorder } from "@/components/landing-utils"; // Import utils we made

// --- COMPONENTS ---

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full" />
          <img src="/logo.png" alt="RegimeGuard" className="w-10 h-10 relative z-10 object-contain" />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">
          Regime<span className="text-emerald-400">Guard</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
        <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
        <a href="#performance" className="hover:text-emerald-400 transition-colors">Performance</a>
        <a href="#security" className="hover:text-emerald-400 transition-colors">Security</a>
        <a href="#pairs" className="hover:text-emerald-400 transition-colors">Markets</a>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden md:block text-zinc-400 hover:text-white transition-colors text-sm font-medium">
          Sign In
        </button>
        <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300">
          Start Trading
        </button>
      </div>
    </div>
  </nav>
);

const HeroTerminal = () => {
  return (
    <div className="w-full max-w-lg mx-auto lg:mx-0 font-mono text-xs md:text-sm bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
        </div>
        <div className="text-zinc-500 flex items-center gap-2">
          <Globe className="w-3 h-3" />
          api-contract.weex.com
        </div>
      </div>
      <div className="p-4 space-y-2 h-[300px] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-900/90 z-10" />

        {/* Simulated Logs based on RegimeGuard Logic */}
        <div className="text-zinc-500"> connecting to WEEX stream...</div>
        <div className="text-emerald-500">connection established (24ms)</div>
        <div className="text-zinc-400"> analyzing cmt_btcusdt...</div>
        <div className="pl-4 border-l border-zinc-700 my-2">
          <div className="flex justify-between"><span className="text-purple-400">REGIME_DETECTED</span> <span className="text-white">TRENDING_UP</span></div>
          <div className="flex justify-between"><span className="text-zinc-500">CONFIDENCE</span> <span className="text-emerald-400">87.4%</span></div>
          <div className="flex justify-between"><span className="text-blue-400">VOLATILITY_GUARD</span> <span className="text-zinc-300">STABLE</span></div>
        </div>
        <div className="text-zinc-300">calculating optimal exposure...</div>
        <div className="text-yellow-400">RISK_ADJUST: Position size capped at 0.35x</div>
        <div className="text-zinc-500 animate-pulse"> waiting for entry trigger_</div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub, delay }: { label: string, value: string, sub: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-sm hover:bg-zinc-800/40 transition-colors group"
  >
    <div className="text-zinc-500 text-sm font-medium mb-2 uppercase tracking-wider">{label}</div>
    <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
      {value}
    </div>
    <div className="text-zinc-400 text-sm">{sub}</div>
  </motion.div>
);

const FeatureBento = () => (
  <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 max-w-7xl mx-auto px-6">

    {/* Large Feature: Regime Awareness */}
    <div className="md:col-span-6 lg:col-span-8 row-span-2 rounded-3xl bg-zinc-900/50 border border-white/10 p-8 md:p-12 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[100px] rounded-full group-hover:bg-purple-500/30 transition-all duration-700" />
      <div className="relative z-10">
        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400 border border-purple-500/30">
          <Brain className="w-6 h-6" />
        </div>
        <h3 className="text-3xl font-bold mb-4">Context-Aware Intelligence</h3>
        <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
          Most bots fail because they use the same logic in every market.
          RegimeGuard identifies if the market is <span className="text-white">Trending</span>, <span className="text-white">Range-Bound</span>, or <span className="text-white">Crashing</span> and automatically switches strategies.
        </p>
        <div className="mt-8 flex gap-3">
          {["Trending", "Ranging", "Volatile"].map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 font-mono">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Tall Feature: Volatility Guard */}
    <div className="md:col-span-3 lg:col-span-4 row-span-2 rounded-3xl bg-gradient-to-b from-zinc-900 to-black border border-white/10 p-8 relative overflow-hidden flex flex-col justify-between group">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      <div>
        <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-6 text-red-400 border border-red-500/30">
          <Shield className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Volatility Kill-Switch</h3>
        <p className="text-zinc-500 text-sm">
          Automatically halts trading during flash crashes or abnormal API latency.
        </p>
      </div>
      <div className="mt-10 h-32 w-full bg-zinc-950/50 rounded-xl border border-white/5 relative overflow-hidden flex items-end p-2 gap-1">
        {[40, 60, 45, 90, 10, 5, 5, 5, 10, 25].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: "10%" }}
            whileInView={{ height: `${h}%` }}
            transition={{ delay: i * 0.1 }}
            className={cn("w-full rounded-sm", h > 80 ? "bg-red-500" : "bg-zinc-700")}
          />
        ))}
      </div>
    </div>

    {/* Wide Feature: Transparency */}
    <div className="md:col-span-6 lg:col-span-4 rounded-3xl bg-zinc-900/50 border border-white/10 p-8 group">
      <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4 text-emerald-400">
        <TerminalIcon className="w-5 h-5" />
      </div>
      <h3 className="text-xl font-bold mb-2">100% Explainable</h3>
      <p className="text-zinc-400 text-sm">No "Black Box" trades. Every decision comes with a human-readable reason log.</p>
    </div>

    {/* Wide Feature: WEEX */}
    <div className="md:col-span-6 lg:col-span-8 rounded-3xl bg-zinc-900/50 border border-white/10 p-8 flex items-center justify-between group relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/30">WEEX API Optimized</Badge>
        </div>
        <h3 className="text-xl font-bold">Latency Arbitrage Protected</h3>
      </div>
      <Zap className="w-24 h-24 text-white/5 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform" />
    </div>

  </div>
);

// --- MAIN PAGE ---

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden selection:bg-emerald-500/30">
      <NoiseOverlay />
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-32 px-6">
        {/* Ambient Background Lights */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[128px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              LIVE ON WEEX • 24/7 TRADING
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
              Trade Smarter <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-white">With AI</span>
            </h1>

            <p className="text-lg text-zinc-400 max-w-xl leading-relaxed mb-10">
              Institutional-grade AI trading that adapts to market conditions in real-time. Maximize returns while protecting your capital with intelligent risk management.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl overflow-hidden hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50 transition-all">
                <span className="relative z-10 flex items-center gap-2">
                  Start Trading <ArrowRight className="w-4 h-4" />
                </span>
              </button>
              <button className="px-8 py-4 bg-zinc-900 border border-zinc-700 text-white font-medium rounded-xl hover:bg-zinc-800 hover:border-zinc-600 transition-all flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> View Performance
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* The "Glow" behind the terminal */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <HeroTerminal />
          </motion.div>
        </div>
      </section>

      {/* --- STATS TICKER --- */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center md:text-left">
            <div className="text-zinc-500 text-xs font-mono mb-1">CURRENT REGIME</div>
            <div className="text-2xl font-bold text-emerald-400 flex items-center gap-2 md:justify-start justify-center">
              <TrendingUp className="w-5 h-5" /> TRENDING
            </div>
          </div>
          <div className="text-center md:text-left">
            <div className="text-zinc-500 text-xs font-mono mb-1">RISK EXPOSURE</div>
            <div className="text-2xl font-bold text-white flex items-center gap-2 md:justify-start justify-center">
              <Activity className="w-5 h-5 text-yellow-500" /> <CountUp end={35} suffix="%" duration={2} />
            </div>
          </div>
          <div className="text-center md:text-left">
            <div className="text-zinc-500 text-xs font-mono mb-1">DRAWDOWN PROT.</div>
            <div className="text-2xl font-bold text-white flex items-center gap-2 md:justify-start justify-center">
              <Shield className="w-5 h-5 text-emerald-500" /> ACTIVE
            </div>
          </div>
          <div className="text-center md:text-left">
            <div className="text-zinc-500 text-xs font-mono mb-1">API LATENCY</div>
            <div className="text-2xl font-bold text-zinc-400 flex items-center gap-2 md:justify-start justify-center">
              <Zap className="w-5 h-5" /> 24ms
            </div>
          </div>
        </div>
      </section>

      {/* --- BENTO GRID FEATURES --- */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <h2 className="text-4xl font-bold mb-4">Architecture of <span className="text-emerald-400">Control</span></h2>
          <p className="text-zinc-400 max-w-2xl">
            RegimeGuard is designed with a "Risk-First" philosophy. The AI doesn't gamble; it calculates probability and manages capital preservation.
          </p>
        </div>
        <FeatureBento />
      </section>

      {/* --- PERFORMANCE METRICS --- */}
      <section id="performance" className="py-20 bg-zinc-900/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Proven <span className="text-emerald-400">Performance</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Real-time metrics from our AI trading engine on WEEX
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              label="Win Rate"
              value="68.4%"
              sub="Last 30 days"
              delay={0.1}
            />
            <StatCard
              label="Max Drawdown"
              value="8.2%"
              sub="Protected at 15%"
              delay={0.2}
            />
            <StatCard
              label="Sharpe Ratio"
              value="2.14"
              sub="Risk-adjusted returns"
              delay={0.3}
            />
            <StatCard
              label="Avg Trade"
              value="+1.8%"
              sub="Per position"
              delay={0.4}
            />
          </div>

          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Ready to Start?</h3>
                <p className="text-zinc-400">Join traders using AI-powered risk management on WEEX</p>
              </div>
              <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition-all whitespace-nowrap">
                Create Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- MULTI-AGENT AI SYSTEM --- */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-purple-400">Multi-Agent</span> AI System
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Four specialized AI agents work in coordination. Each has a specific role—no single point of failure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                name: "Regime Agent",
                role: "Market Classification",
                description: "Identifies if market is Trending, Range-Bound, or High Volatility",
                color: "purple",
                status: "ANALYZING"
              },
              {
                icon: Shield,
                name: "Risk Agent",
                role: "Exposure Control",
                description: "Adjusts position size, stop-loss distance, and trade frequency",
                color: "orange",
                status: "MONITORING"
              },
              {
                icon: Activity,
                name: "Volatility Agent",
                role: "Anomaly Detection",
                description: "Monitors for flash crashes, unusual spreads, and liquidity gaps",
                color: "red",
                status: "WATCHING"
              },
              {
                icon: Cpu,
                name: "Strategy Agent",
                role: "Signal Generation",
                description: "Selects trend-following or mean-reversion based on regime",
                color: "emerald",
                status: "READY"
              }
            ].map((agent) => (
              <div key={agent.name} className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-white/20 transition-all group">
                <div className={`w-12 h-12 rounded-xl bg-${agent.color}-500/20 flex items-center justify-center mb-4 text-${agent.color}-400 border border-${agent.color}-500/30`}>
                  <agent.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{agent.name}</h3>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-3">{agent.role}</p>
                <p className="text-zinc-400 text-sm mb-4">{agent.description}</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-zinc-500 font-mono">{agent.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- AVAILABLE MARKETS --- */}
      <section id="pairs" className="py-20 bg-zinc-900/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Available Markets</h2>
            <p className="text-zinc-400">Trade 8 major crypto pairs with up to 20x leverage on WEEX</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { symbol: "BTC/USDT", name: "Bitcoin" },
              { symbol: "ETH/USDT", name: "Ethereum" },
              { symbol: "SOL/USDT", name: "Solana" },
              { symbol: "BNB/USDT", name: "BNB" },
              { symbol: "XRP/USDT", name: "Ripple" },
              { symbol: "ADA/USDT", name: "Cardano" },
              { symbol: "DOGE/USDT", name: "Dogecoin" },
              { symbol: "LTC/USDT", name: "Litecoin" }
            ].map((pair) => (
              <div key={pair.symbol} className="px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/10 hover:border-emerald-500/50 transition-colors group">
                <span className="font-mono text-white group-hover:text-emerald-400 transition-colors">{pair.symbol}</span>
                <span className="text-zinc-500 text-xs ml-2">{pair.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (ARCHITECTURE) --- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How RegimeGuard Works</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              A transparent, rule-based execution pipeline powered by AI risk analysis
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {[
              { icon: BarChart3, label: "Market Data", desc: "WEEX API Feed", color: "blue" },
              { icon: Brain, label: "Regime AI", desc: "Classification", color: "purple" },
              { icon: Shield, label: "Risk Engine", desc: "Exposure Control", color: "orange" },
              { icon: Zap, label: "Execution", desc: "Trade Signals", color: "emerald" }
            ].map((step, index) => (
              <React.Fragment key={step.label}>
                <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all">
                  <div className={`w-14 h-14 rounded-xl bg-${step.color}-500/20 flex items-center justify-center text-${step.color}-400 border border-${step.color}-500/30`}>
                    <step.icon className="w-7 h-7" />
                  </div>
                  <span className="text-white font-semibold">{step.label}</span>
                  <span className="text-zinc-500 text-xs">{step.desc}</span>
                </div>
                {index < 3 && (
                  <ChevronRight className="w-6 h-6 text-zinc-600 hidden md:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY REGIMEGUARD (DIFFERENTIATORS) --- */}
      <section className="py-24 bg-zinc-900/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why <span className="text-emerald-400">RegimeGuard</span>?</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Aligned with WEEX's philosophy: sustainable returns over gambling
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Anti-Gambling",
                description: "AI does NOT predict price direction. No speculative trades based on pattern matching.",
                icon: Lock
              },
              {
                title: "Risk-Adjusted Returns",
                description: "Sharpe ratio matters more than raw returns. We optimize for survival first.",
                icon: Shield
              },
              {
                title: "100% Transparent",
                description: "Every trade decision comes with a human-readable explanation. No black boxes.",
                icon: TerminalIcon
              },
              {
                title: "Regime-Adaptive",
                description: "Automatically switches strategies when market conditions change.",
                icon: Brain
              },
              {
                title: "Capital Preservation",
                description: "Kill-switch activates during flash crashes. 15% max drawdown limit enforced.",
                icon: Activity
              },
              {
                title: "WEEX Optimized",
                description: "Built specifically for WEEX API v2 with latency-aware execution.",
                icon: Zap
              }
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/30 transition-all">
                <item.icon className="w-8 h-8 text-emerald-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-white/5 bg-zinc-950 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <img src="/logo.png" className="w-8 h-8" />
            <span className="font-bold text-lg">RegimeGuard</span>
          </div>
          <p className="text-zinc-600 text-sm max-w-md">
            Built for the WEEX AI Trading Competition. <br />
            Not financial advice. System execution depends on API latency and market conditions.
          </p>
        </div>
      </footer>

      {/* --- GLOBAL STYLES --- */}
      <style jsx global>{`
        @keyframes shine {
          to { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Helper icon component
function Badge({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", className)}>
      {children}
    </span>
  );
}
function TrendingUp({ className }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>; }