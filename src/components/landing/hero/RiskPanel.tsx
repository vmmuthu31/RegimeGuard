"use client";

import { motion } from "framer-motion";
import { Shield, Activity, TrendingUp, Cpu, Lock, AlertTriangle } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { LiveRegimeChart } from "./LiveRegimeChart";

export const RiskPanel = () => {
  const topRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animateBorder = () => {
      const now = Date.now() / 1000;
      const speed = 0.5;

      const topX = Math.sin(now * speed) * 100;
      const rightY = Math.cos(now * speed) * 100;
      const bottomX = Math.sin(now * speed + Math.PI) * 100;
      const leftY = Math.cos(now * speed + Math.PI) * 100;

      if (topRef.current) topRef.current.style.transform = `translateX(${topX}%)`;
      if (rightRef.current) rightRef.current.style.transform = `translateY(${rightY}%)`;
      if (bottomRef.current) bottomRef.current.style.transform = `translateX(${bottomX}%)`;
      if (leftRef.current) leftRef.current.style.transform = `translateY(${leftY}%)`;

      requestAnimationFrame(animateBorder);
    };

    const animationId = requestAnimationFrame(animateBorder);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto perspective-1000 landing-tour-risk-panel">
      {/* Premium Glass Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-zinc-950/60 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)]"
      >
        {/* Animated Border Beams */}
        <div className="absolute top-0 left-0 w-full h-[1px] overflow-hidden">
          <div ref={topRef} className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        </div>
        <div className="absolute top-0 right-0 w-[1px] h-full overflow-hidden">
          <div ref={rightRef} className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden">
          <div ref={bottomRef} className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        </div>
        <div className="absolute top-0 left-0 w-[1px] h-full overflow-hidden">
          <div ref={leftRef} className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
        </div>

        <div className="p-4 space-y-4 relative z-10">
          {/* Header Area Condensed */}
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-[0.2em]">
                Risk Intelligence
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold text-zinc-500">LIVE</span>
            </div>
          </div>

          {/* Regime Dashboard Section - Compact */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-black text-white uppercase tracking-tight">Trending Mode</div>
                <div className="text-[9px] text-zinc-500">Long-term bullish bias</div>
              </div>
              <div className="ml-auto text-emerald-400 font-mono text-[10px] font-bold">72% CONF</div>
            </div>
          </div>

          {/* Dynamic Exposure Visualization - Compact */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-end">
              <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Risk Exposure</span>
              <span className="text-emerald-400 font-mono text-xs font-bold">32%</span>
            </div>
            <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "32%" }}
                transition={{ duration: 2, ease: [0.33, 1, 0.68, 1], delay: 0.5 }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
          </div>


          <LiveRegimeChart />
        </div>

        {/* Textured Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </motion.div>

      {/* Atmospheric Glows */}
      <div className="absolute -top-[20%] -right-[20%] w-[100%] h-[100%] bg-emerald-500/20 rounded-full blur-[120px] opacity-30 animate-pulse pointer-events-none" />
      <div className="absolute -bottom-[20%] -left-[20%] w-[80%] h-[80%] bg-cyan-500/10 rounded-full blur-[100px] opacity-20 pointer-events-none" />
    </div>
  );
};
