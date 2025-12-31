"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef } from "react";

export const FinalCTA = () => {
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
    <section className="py-16 md:py-20 relative overflow-hidden bg-[#0B0E11]">
      {/* Background Volumetric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto relative bg-zinc-950/60 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_-20px_rgba(16,185,129,0.2)]"
        >
          {/* Animated Border Beams */}
          <div className="absolute top-0 left-0 w-full h-[2px] overflow-hidden">
            <div ref={topRef} className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
          </div>
          <div className="absolute top-0 right-0 w-[2px] h-full overflow-hidden">
            <div ref={rightRef} className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
            <div ref={bottomRef} className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
          </div>
          <div className="absolute top-0 left-0 w-[2px] h-full overflow-hidden">
            <div ref={leftRef} className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500 to-transparent" />
          </div>

          <div className="p-10 md:p-14 flex flex-col items-center text-center space-y-8 relative z-10">
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
              >
                <Lock className="w-5 h-5 text-emerald-500" />
              </motion.div>
              <span className="text-[9px] font-black text-emerald-500/60 font-mono tracking-[0.5em] uppercase">Security Confirmed</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter uppercase italic md:not-italic">
              Trade Less. <span className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-600">Protect More.</span>
            </h2>

            <p className="text-sm md:text-base text-zinc-500 max-w-xl mx-auto uppercase tracking-wide font-bold">
              Ready to experience <span className="text-white">institutional-grade</span> risk control?
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 landing-tour-cta">
              <Link href="/dashboard">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest px-8 h-12 md:h-14 text-sm shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 group">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="pt-8 border-t border-white/5 w-full">
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 opacity-30 grayscale items-center">
                <span className="text-[9px] font-black font-mono text-zinc-400">CONNECT_PROTOCOL_WEEX_v4</span>
                <span className="text-[9px] font-black font-mono text-zinc-400">SSL_ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Textured Grain Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </motion.div>
      </div>
    </section>
  );
};
