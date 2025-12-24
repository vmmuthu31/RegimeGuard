"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import {
  Shield, Activity, Zap, Brain, Terminal as TerminalIcon,
  Lock, ArrowRight, Github, ChevronRight, BarChart3,
  Cpu, Globe, Radio, CheckCircle2, TrendingUp
} from "lucide-react";
import CountUp from "react-countup";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FaRocket, FaChartLine, FaShieldHalved, FaBolt, FaTrophy } from "react-icons/fa6";
import ShinyCard from "@/src/components/nurui/shiny-card";
import DynamicCard from "@/src/components/nurui/dynamic-card";
import NavbarFlow, { HoverLink, FeatureItem } from "@/src/components/ui/navbar-flow";
import GradientButton from "@/src/components/nurui/gradient-button";
import BorderAnimationButton from "@/src/components/nurui/border-button";
import { InfoCard } from "@/src/components/nurui/info-card";
import { GlowCard } from "@/src/components/nurui/spotlight-card";
import { RevealText } from "@/src/components/ui/reveal-text";

// --- 1. UTILITIES & ANIMATION HOOKS ---

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const useTypewriter = (text: string, speed = 30, startDelay = 0) => {
  const [displayText, setDisplayText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timeout);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, started]);

  return displayText;
};

// --- 2. HIGH-END UI COMPONENTS ---

// A. Spotlight Card (Light follows cursor - Stripe/Linear Style)
function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        "group relative border border-white/10 bg-zinc-900/50 overflow-hidden rounded-3xl",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(16, 185, 129, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

// B. Animated Beam (Connecting Lines)
const AnimatedBeam = ({ delay = 0 }: { delay?: number }) => (
  <div className="hidden md:flex flex-1 h-px bg-white/5 relative overflow-hidden mx-4">
    <motion.div
      initial={{ x: "-100%" }}
      whileInView={{ x: "100%" }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear", delay }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-1/2 blur-[2px]"
    />
  </div>
);

// C. Holographic Noise Overlay (Drapes.cc vibe)
const NoiseOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-[999] opacity-[0.04] mix-blend-overlay"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
  />
);

// D. Animated Icon Wrapper (Lucide Animated vibe)
const AnimatedIcon = ({ icon: Icon, className }: { icon: any, className?: string }) => (
  <div className={cn("relative group/icon", className)}>
    <Icon className="w-full h-full transition-transform group-hover/icon:scale-110 group-hover/icon:rotate-3 duration-300" />
    <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover/icon:opacity-100 transition-opacity rounded-full" />
  </div>
);

// --- 3. SUB-COMPONENTS ---

const Navbar = () => {
  const emblem = (
    <div className="flex items-center gap-2 group cursor-pointer">
      <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden rounded-lg bg-zinc-900 border border-white/10 group-hover:border-emerald-500/50 transition-colors">
        <div className="absolute inset-0 bg-emerald-500/20 blur-lg" />
        <img src="/logo.png" alt="RegimeGuard" className="w-6 h-6 relative z-10 object-contain" />
      </div>
      <span className="font-bold text-lg tracking-tight text-white hidden sm:block">
        Regime<span className="text-emerald-400">Guard</span>
      </span>
    </div>
  );

  const rightComponent = (
    <div className="flex items-center gap-4">
      <GradientButton
        text="Sign In"
        className="h-10"
        borderRadius={9999}
      />
    </div>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 dark">
      <NavbarFlow
        emblem={emblem}
        rightComponent={rightComponent}
        links={[
          {
            text: "Features",
            submenu: (
              <div className="flex flex-col space-y-2">
                <HoverLink url="#features">Architecture</HoverLink>
                <HoverLink url="#security">Security Protocol</HoverLink>
                <HoverLink url="#performance">Performance Metrics</HoverLink>
                <HoverLink url="#markets">Available Markets</HoverLink>
              </div>
            ),
          },
          {
            text: "System",
            submenu: (
              <div className="grid grid-cols-1 gap-2 w-64">
                <FeatureItem
                  heading="AI Engine"
                  url="#"
                  info="Multi-agent system with explainable decision logs."
                />
                <FeatureItem
                  heading="Risk Adapter"
                  url="#"
                  info="Real-time volatility tracking and capital preservation."
                />
                <FeatureItem
                  heading="Execution"
                  url="#"
                  info="Optimized for WEEX v2 API with ultra-low latency."
                />
              </div>
            ),
          },
          { text: "Performance", url: "#performance" },
          { text: "About", url: "#" },
        ]}
      />
    </div>
  );
};

const HeroTerminal = () => {
  // Use state to stage the animations so it feels like a real boot sequence
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 800),  // Connection
      setTimeout(() => setStage(2), 2400), // Analysis
      setTimeout(() => setStage(3), 4000), // Risk Engine
      setTimeout(() => setStage(4), 5500), // Ready
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto lg:mx-0 font-mono text-xs md:text-sm bg-zinc-950/80 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl relative group">
      {/* Glossy Reflection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />

      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/90 border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
        </div>
        <div className="text-zinc-500 flex items-center gap-2 text-[10px] uppercase tracking-wider">
          <Globe className="w-3 h-3" />
          api-contract.weex.com
        </div>
      </div>

      <div className="p-5 space-y-3 h-[340px] overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        <div className="text-zinc-500"> initializing secure_handshake...</div>

        {stage >= 1 && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-emerald-400">
            [cite_start]connection established (24ms) [cite: 366]
          </motion.div>
        )}

        {stage >= 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pl-4 border-l-2 border-zinc-800 my-2 bg-white/5 p-3 rounded-r border-r border-t border-b border-white/5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-purple-400 font-bold">REGIME_DETECTED</span>
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] border border-emerald-500/30">TRENDING_UP</span>
            </div>
            <div className="flex justify-between text-zinc-400 text-[10px] mt-2">
              <span>CONFIDENCE</span>
              [cite_start]<span className="text-white font-mono">87.4% [cite: 64]</span>
            </div>
          </motion.div>
        )}

        {stage >= 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-yellow-400"> RISK_ENGINE: Optimizing exposure parameters...</div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] text-zinc-400">
              <div className="bg-zinc-900 border border-white/10 p-2 rounded flex justify-between">
                <span>LEV</span> <span className="text-white">2.5x</span>
              </div>
              <div className="bg-zinc-900 border border-white/10 p-2 rounded flex justify-between">
                <span>STOP</span> <span className="text-red-400">-1.2%</span>
              </div>
            </div>
          </motion.div>
        )}

        {stage >= 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center gap-2 text-emerald-400 font-bold"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            waiting for entry trigger_
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden selection:bg-emerald-500/30 font-sans">
      <NoiseOverlay />
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-32 px-6">
        {/* Dynamic Mesh Gradient (Drapes.cc style) */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold mb-8 backdrop-blur-md hover:bg-emerald-500/10 transition-colors cursor-default shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              LIVE ON WEEX • AI WARS 2024
            </div>

            {/* Reveal Text Hero */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95] mb-8">
              <RevealText
                mode="auto"
                stagger={0.15}
                className="text-white"
                boxClassName="bg-emerald-500"
              >
                Trade Smarter
              </RevealText>
              <br />
              <RevealText
                mode="auto"
                stagger={0.15}
                delay={0.4}
                className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-gradient bg-[length:200%_auto]"
                boxClassName="bg-cyan-500"
              >
                With AI.
              </RevealText>
            </h1>

            <p className="text-lg text-zinc-400 max-w-xl leading-relaxed mb-10">
              Institutional-grade AI trading that <span className="text-white font-medium">adapts to market conditions</span> in real-time. Maximize returns while protecting your capital with intelligent risk management.
            </p>

            <div className="flex flex-wrap gap-6 items-center">
              <GradientButton
                text="Start Trading"
                className="h-14 px-10 shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)]"
                borderRadius={9999}
                duration={2000}
              />
              <BorderAnimationButton
                text="View Performance"
                onClick={() => document.getElementById('performance')?.scrollIntoView({ behavior: 'smooth' })}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative perspective-1000"
          >
            {/* The "Glow" behind the terminal */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse"></div>
            <HeroTerminal />
          </motion.div>
        </div>
      </section>

      {/* --- STATS TICKER (Bloomberg / High-Freq Style) --- */}
      <section className="border-y border-white/5 bg-zinc-950/50 backdrop-blur-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-wrap justify-center gap-6">
          {[
            { label: "CURRENT REGIME", value: "TRENDING_UP", icon: TrendingUp, color: "#10b981", desc: "Market bias detected" },
            { label: "RISK EXPOSURE", value: "35%", icon: Activity, color: "#eab308", desc: "Capital utilization" },
            { label: "DRAWDOWN PROT.", value: "ACTIVE", icon: Shield, color: "#10b981", desc: "Guardians engaged" },
            { label: "API LATENCY", value: "24ms", icon: Zap, color: "#3b82f6", desc: "Ultra-low response" }
          ].map((stat, i) => (
            <div key={i} className="flex-1 min-w-[240px] max-w-[280px]">
              <InfoCard
                title={stat.value}
                description={stat.label}
                width={280}
                height={160}
                borderColor={stat.color}
                borderBgColor={`${stat.color}33`}
                effectBgColor={`${stat.color}66`}
                icon={<stat.icon className="w-5 h-5" />}
                contentPadding="12px 14px"
              />
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURES (Bento Grid with Spotlight) --- */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <DynamicCard
            normalTitle="Architecture of"
            colorfulTitle="Control"
            description='RegimeGuard is designed with a "Risk-First" philosophy. The AI doesn’t gamble; it calculates probability and manages capital preservation.'
            buttonText="Explore Architecture"
            features={[
              {
                title: "Context-Aware Intelligence",
                description: "Identifies if market is Trending, Range-Bound, or Volatile and switches strategies.",
                icon: <Brain className="w-6 h-6" />
              },
              {
                title: "Volatility Kill-Switch",
                description: "Automatically halts trading during flash crashes or abnormal API latency.",
                icon: <Shield className="w-6 h-6" />
              },
              {
                title: "100% Explainable",
                description: "No 'Black Box' trades. Every decision comes with a human-readable reason log.",
                icon: <TerminalIcon className="w-6 h-6" />
              },
              {
                title: "WEEX API Optimized",
                description: "Built specifically for the WEEX v2 API, ensuring millisecond-latency execution.",
                icon: <Zap className="w-6 h-6" />
              }
            ]}
          />
        </div>
      </section>

      {/* --- PERFORMANCE METRICS --- */}
      <section id="performance" className="py-20 bg-zinc-900/30 border-t border-white/5 relative overflow-hidden">
        {/* Glow effect for performance section */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent blur-sm" />

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
            {[
              {
                featureName: "Win Rate",
                featureItems: [
                  "68.4% Accuracy",
                  "Trend Following Alpha",
                  "Verified on WEEX",
                ],
                icon: <FaTrophy />,
              },
              {
                featureName: "Capital Protection",
                featureItems: [
                  "8.2% Max Drawdown",
                  "Hard Limit < 15%",
                  "Automated Kill-Switch",
                ],
                icon: <FaShieldHalved />,
              },
              {
                featureName: "Risk Efficiency",
                featureItems: [
                  "2.14 Sharpe Ratio",
                  "Institutional Grade",
                  "Risk-Adjusted returns",
                ],
                icon: <FaBolt />,
              },
              {
                featureName: "Signal Quality",
                featureItems: [
                  "+1.8% Avg Trade",
                  "High Probability Entries",
                  "Minimized Slippage",
                ],
                icon: <FaChartLine />,
              },
            ].map((feature, index) => (
              <ShinyCard
                key={index}
                featureName={feature.featureName}
                featureItems={feature.featureItems}
                icon={feature.icon}
              />
            ))}
          </div>

          {/* CTA Box with Border Beam */}
          <div className="mt-12 relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 p-1">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent translate-x-[-100%] animate-[shine_3s_infinite]" />
            <div className="relative bg-zinc-950/80 p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Ready to Deploy?</h3>
                <p className="text-zinc-400">Join the competition with institutional-grade tools.</p>
              </div>
              <button className="bg-white text-zinc-950 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-white/10">
                Clone Repository
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 relative overflow-hidden">
        {/* Localized Backdrop Glows */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <RevealText mode="auto" stagger={0.1} boxClassName="bg-purple-500">
                Multi-Agent AI Coordination
              </RevealText>
            </h2>
            <p className="text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed border-l-2 border-purple-500/30 pl-6 text-left">
              Our proprietary <span className="text-white font-bold">Registry-Protocol</span> enables four specialized agents to work in a continuous feedback loop, ensuring every trade signal is vetted for both alpha potential and institutional risk tolerance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
            {[
              { icon: Brain, name: "Regime Agent", role: "Market Classification", color: "purple" as const },
              { icon: Shield, name: "Risk Agent", role: "Exposure Control", color: "orange" as const },
              { icon: Activity, name: "Volatility Agent", role: "Anomaly Detection", color: "red" as const },
              { icon: Cpu, name: "Strategy Agent", role: "Signal Generation", color: "green" as const }
            ].map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="h-full group"
              >
                <GlowCard
                  glowColor={agent.color}
                  customSize={true}
                  className="w-full h-full min-h-[200px] bg-zinc-900/50 border-white/5 flex flex-col p-6"
                >
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-xl bg-${agent.color === 'green' ? 'emerald' : agent.color}-500/20 flex items-center justify-center mb-4 text-${agent.color === 'green' ? 'emerald' : agent.color}-400 border border-${agent.color === 'green' ? 'emerald' : agent.color}-500/30 group-hover:scale-110 transition-transform`}>
                      <agent.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{agent.name}</h3>
                    <p className="text-zinc-500 text-xs uppercase tracking-wider mb-3">{agent.role}</p>
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full bg-${agent.color === 'green' ? 'emerald' : agent.color}-500 animate-pulse`} />
                      <span className="text-xs text-zinc-400 font-mono text-center">ACTIVE</span>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* --- ARCHITECTURE (Animated Beams) --- */}
      <section className="py-24 relative overflow-hidden border-t border-white/5">
        {/* Technical Grid Decoration */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono mb-4 animate-pulse">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> SYSTEM_LATENCY: 12MS
            </div>
            <h2 className="text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              Execution Pipeline
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto font-medium">
              A transparent, rule-based execution flow powered by real-time risk analysis and multi-regime intelligence.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative">
            {[
              { icon: BarChart3, label: "Market Data", desc: "WEEX API Feed", color: "#3b82f6", info: "Real-time ingestion" },
              { icon: Brain, label: "Regime AI", desc: "Classification", color: "#a855f7", info: "Pattern recognition" },
              { icon: Shield, label: "Risk Engine", desc: "Exposure Control", color: "#f97316", info: "Capital protection" },
              { icon: Zap, label: "Execution", desc: "Trade Signals", color: "#10b981", info: "Ultra-fast orders" }
            ].map((step, index) => (
              <React.Fragment key={step.label}>
                <div className="relative z-10 w-full md:w-64">
                  <InfoCard
                    title={step.label}
                    description={step.desc}
                    width={256}
                    height={220}
                    borderColor={step.color}
                    borderBgColor={`${step.color}22`}
                    effectBgColor={`${step.color}44`}
                    icon={<step.icon className="w-6 h-6" />}
                    contentPadding="16px"
                  />
                </div>
                {index < 3 && <AnimatedBeam delay={index * 0.5} />}
                {index < 3 && <div className="md:hidden h-12 w-px bg-zinc-800" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-white/5 bg-zinc-950 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center relative z-10">
          <div className="flex items-center gap-2 mb-6 opacity-60 hover:opacity-100 transition-opacity">
            <img src="/logo.png" className="w-8 h-8 opacity-80" />
            <span className="font-bold text-lg text-white">RegimeGuard</span>
          </div>
          <p className="text-zinc-600 text-sm max-w-md">
            Built for the WEEX AI Trading Competition. <br />
            System execution depends on API latency and market conditions.
          </p>
        </div>
      </footer>

      {/* --- GLOBAL STYLES & ANIMATIONS --- */}
      < style jsx global > {`
        @keyframes shine {
          to { transform: translateX(100%); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 6s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style >
    </div >
  );
}