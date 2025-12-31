"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiskPanel } from "./RiskPanel";
import { LiveTradeExecution } from "./LiveTradeExecution";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12 bg-[#0B0E11]">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_20%,transparent_100%)] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-emerald-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -top-[10%] left-[10%] w-[40%] h-[40%] bg-blue-500/[0.05] rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="container max-w-6xl mx-auto relative z-10 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left Column: Staggered Institutional Typography */}
          <div className="space-y-10 text-center lg:text-left landing-tour-hero-text pt-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs font-mono font-bold uppercase tracking-[0.3em] backdrop-blur-3xl"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Secured by WEEX Protocol
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-[0.9] uppercase italic sm:not-italic">
                AI Controls <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-600">
                  The Risk.
                </span>
              </h1>
              <p className="text-sm md:text-base text-zinc-500 max-w-md mx-auto lg:mx-0 leading-relaxed font-medium uppercase tracking-wide">
                The institutional trading dashboard where <span className="text-white">artificial intelligence</span> manages exposure, drawdowns, and volatility — so you don't have to.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start"
            >
              <Link href="/dashboard">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest px-10 h-14 text-sm shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] transition-all hover:scale-105 active:scale-95">
                  Sign In
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button variant="outline" size="lg" className="border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white font-bold uppercase tracking-widest px-10 h-14 text-sm transition-all border-dashed">
                  <PlayCircle className="mr-2 w-4 h-4" />
                  View Logics
                </Button>
              </Link>
            </motion.div>

            {/* Bottom Proof Line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 2, delay: 1 }}
              className="pt-12 flex items-center justify-center lg:justify-start gap-12"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-black text-white tracking-widest uppercase">Connectivity</span>
                <span className="text-[10px] text-zinc-500 font-mono">WEEX_OPEN_API_v4</span>
              </div>
              <div className="h-8 w-[1px] bg-zinc-800" />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-black text-white tracking-widest uppercase">Execution</span>
                <span className="text-[10px] text-zinc-500 font-mono">10ms_LATENCY_MAX</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Stacked Intelligence & Execution */}
          <div className="relative flex flex-col gap-6 justify-start pt-12">
            <RiskPanel />
            <LiveTradeExecution />
          </div>

        </div>
      </div>
    </section>
  );
};
