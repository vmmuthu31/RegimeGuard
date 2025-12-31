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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <PremiumFeatureCard
            accentColor="cyan"
            variant="rotate"
            icon={<Brain className="w-6 h-6" />}
            title="Regime Awareness"
            description="Our AI doesn't trade blindly. It continuously monitors market structure to identify the current regime: Trending, Range-bound, or Volatile."
          >
            <div className="p-4 rounded-xl bg-black/40 font-mono text-[10px] text-cyan-400/80 border border-white/5 space-y-1">
              <div className="flex justify-between">
                <span>regime_state</span>
                <span className="text-white font-bold">\"TRENDING\"</span>
              </div>
              <div className="flex justify-between">
                <span>confidence</span>
                <span className="text-white font-bold">0.8284</span>
              </div>
              <div className="pt-2 text-zinc-600">// AI Recommendation: Momentum bias</div>
            </div>
          </PremiumFeatureCard>

          <PremiumFeatureCard
            accentColor="emerald"
            variant="rotate"
            icon={<Shield className="w-6 h-6" />}
            title="Dynamic Risk Engine"
            description="Exposure is fluid, not static. The engine automatically reduces position sizes and tightens stop-losses as market risk levels elevate."
          >
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <span>Live Exposure</span>
                <span className="text-emerald-400">Restricted</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-0.5">
                <div className="h-full w-[35%] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <div className="h-full w-[65%] bg-zinc-800" />
              </div>
              <p className="text-[10px] text-zinc-600 italic">Adjusted 6 times in the last hour</p>
            </div>
          </PremiumFeatureCard>

          <PremiumFeatureCard
            accentColor="red"
            variant="rotate"
            icon={<Activity className="w-6 h-6" />}
            title="Volatility Guard"
            description="A high-speed protection layer that acts as a circuit breaker during extreme market anomalies, news events, or flash crashes."
          >
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </div>
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Protection Active</span>
            </div>
          </PremiumFeatureCard>
        </div>
      </div>
    </section>
  );
};
