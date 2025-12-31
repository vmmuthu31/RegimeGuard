"use client";

import { motion } from "framer-motion";
import { Shield, Brain, Activity } from "lucide-react";
import { PremiumFeatureCard } from "./PremiumFeatureCard";

export const RiskEngineFeature = () => {
  return (
    <section className="py-24 bg-[#0B0E11] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono uppercase tracking-[0.3em] border border-emerald-500/20"
          >
            The Intelligence Layers
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 uppercase tracking-tighter"
          >
            Dynamic Risk Architecture
          </motion.h2>
        </div>


        <div className="relative">
          {/* Unified System Chassis */}
          <div className="w-full bg-zinc-900/60 backdrop-blur-md border border-emerald-500/30 ring-1 ring-emerald-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-[0_0_100px_-40px_rgba(16,185,129,0.2)]">
            {/* Clean Background - Grid Removed */}
            <div className="absolute inset-0 bg-radial-gradient(circle_at_center,transparent_0%,#000000_100%) pointer-events-none" />

            {/* Modules Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative z-10 items-stretch">

              {/* Module 1: Awareness */}
              <div className="relative group p-3 rounded-2xl bg-zinc-950/50 border border-white/5 hover:border-cyan-500/30 transition-all duration-500 hover:shadow-[0_0_50px_-20px_rgba(6,182,212,0.3)] flex flex-col justify-center">
                <PremiumFeatureCard
                  accentColor="cyan"
                  variant="glitch"
                  icon={<Brain className="w-5 h-5" />}
                  title="Regime Awareness"
                  description="Deep-learning analysis identifies market structure to select optimal strategy logic."
                >
                  <div className="p-3 rounded-lg bg-black/80 font-mono text-[9px] text-cyan-400/80 border border-white/5 space-y-1 mt-2">
                    <div className="flex justify-between">
                      <span>regime_state</span>
                      <span className="text-white font-bold">\"TRENDING\"</span>
                    </div>
                    <div className="flex justify-between">
                      <span>confidence</span>
                      <span className="text-white font-bold">0.8284</span>
                    </div>
                  </div>
                </PremiumFeatureCard>
              </div>

              {/* Module 2: Risk Engine (Center) */}
              <div className="relative group p-3 rounded-2xl bg-zinc-950/60 border border-emerald-500/20 shadow-[0_0_40px_-20px_rgba(16,185,129,0.2)] lg:scale-105 lg:z-20 border-t-emerald-500/50 flex flex-col justify-center">
                {/* Input Connector (From Awareness) - Pipe moved here for Z-index visibility */}
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-2 bg-zinc-800 z-0 hidden md:block">
                  <div className="h-full w-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-cyan-500/20 animate-pulse" />
                    <div className="absolute top-0 bottom-0 left-0 w-2 bg-cyan-400 blur-sm animate-[slide_1s_linear_infinite]" />
                  </div>
                </div>
                {/* Input Connector Joint (Dot) */}
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-zinc-900 border-2 border-cyan-500/50 hidden md:block z-10" />

                {/* Output Connector (To Guard) */}
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-2 bg-zinc-800 z-0 hidden md:block">
                  <div className="h-full w-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-emerald-500/20 animate-pulse" />
                    <div className="absolute top-0 bottom-0 left-0 w-2 bg-emerald-400 blur-sm animate-[slide_1s_linear_infinite]" />
                  </div>
                </div>
                {/* Output Joint (Dot) */}
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-zinc-900 border-2 border-emerald-500/50 hidden md:block z-10" />

                <PremiumFeatureCard
                  accentColor="emerald"
                  variant="beam"
                  icon={<Shield className="w-5 h-5" />}
                  title="Dynamic Risk Engine"
                  description="Active throttling of exposure, leverage, and stop-losses based on real-time volatility."
                >
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                      <span>Live Exposure</span>
                      <span className="text-emerald-400">Restricted</span>
                    </div>
                    <div className="h-1 lg:h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-0.5">
                      <div className="h-full w-[35%] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      <div className="h-full w-[65%] bg-zinc-800" />
                    </div>
                  </div>
                </PremiumFeatureCard>
              </div>

              {/* Module 3: Volatility Guard */}
              <div className="relative group p-3 rounded-2xl bg-zinc-950/20 border border-white/5 hover:border-red-500/30 transition-all duration-500 hover:shadow-[0_0_50px_-20px_rgba(239,68,68,0.3)] flex flex-col justify-center">
                {/* Connector removed - now handled by Module 2 for Z-Index layering */}

                <PremiumFeatureCard
                  accentColor="red"
                  variant="glitch"
                  icon={<Activity className="w-5 h-5" />}
                  title="Volatility Guard"
                  description="Final defense layer acting as a circuit breaker for flash crashes and extreme market anomalies."
                >
                  <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 mt-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Status</span>
                      <div className="flex items-center gap-1.5">
                        <div className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                        </div>
                        <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Active</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Circuit</span>
                      <span className="text-[9px] text-zinc-400 font-mono">READY</span>
                    </div>
                  </div>
                </PremiumFeatureCard>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
