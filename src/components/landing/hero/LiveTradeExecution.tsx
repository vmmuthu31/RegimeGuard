"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight, Zap, RefreshCw, CheckCircle2 } from "lucide-react";

export const LiveTradeExecution = () => {
    const [ticks, setTicks] = useState<number[]>([]);
    const [tradeStatus, setTradeStatus] = useState<"idle" | "executing" | "filled">("idle");

    // Simulate Order Book Data
    const asks = [42150.5, 42150.0, 42149.5, 42149.0];
    const bids = [42148.5, 42148.0, 42147.5, 42147.0];

    useEffect(() => {
        // Simulate tick updates
        const interval = setInterval(() => {
            setTicks(prev => {
                const next = Math.random() > 0.5 ? 1 : -1;
                return [...prev.slice(-15), next];
            });
        }, 800);

        // Simulate Trade Cycle every 8 seconds
        const tradeCycle = setInterval(() => {
            setTradeStatus("executing");
            setTimeout(() => setTradeStatus("filled"), 1500);
            setTimeout(() => setTradeStatus("idle"), 4000);
        }, 8000);

        return () => {
            clearInterval(interval);
            clearInterval(tradeCycle);
        };
    }, []);

    return (
        <div className="relative w-full max-w-md mx-auto h-[265px] bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col group">
            {/* Animated Stream Border (New) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[1px] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-[50%] animate-[shimmer_2s_linear_infinite]" />
                </div>
                <div className="absolute bottom-0 right-0 w-full h-[1px] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-[50%] animate-[shimmer_2s_linear_infinite_reverse]" />
                </div>
            </div>

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/20">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">Live Execution</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">WEEX_L1_STREAM</span>
            </div>

            <div className="flex-1 flex relative">
                {/* Left: Mini Order Book */}
                <div className="w-1/3 border-r border-white/5 p-3 flex flex-col gap-1 font-mono text-[9px]">
                    {asks.map((price, i) => (
                        <div key={`ask-${i}`} className="flex justify-between text-red-400/80">
                            <span>{price.toFixed(1)}</span>
                            <span className="opacity-50">{(Math.random() * 2).toFixed(3)}</span>
                        </div>
                    ))}
                    <div key="ask-extra-1" className="flex justify-between text-red-400/80">
                        <span>42148.8</span>
                        <span className="opacity-50">0.921</span>
                    </div>
                    <div className="h-px bg-white/10 my-1" />
                    <div className="text-white font-bold text-center py-1 text-xs">42,148.8</div>
                    <div className="h-px bg-white/10 my-1" />
                    {bids.map((price, i) => (
                        <div key={`bid-${i}`} className="flex justify-between text-emerald-400/80">
                            <span>{price.toFixed(1)}</span>
                            <span className="opacity-50">{(Math.random() * 2).toFixed(3)}</span>
                        </div>
                    ))}
                    <div key="bid-extra-1" className="flex justify-between text-emerald-400/80">
                        <span>42146.5</span>
                        <span className="opacity-50">1.420</span>
                    </div>
                </div>

                {/* Right: Simulated Chart Area */}
                <div className="flex-1 p-3 relative overflow-hidden">
                    {/* Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

                    {/* Candles */}
                    <div className="flex items-end justify-end h-full gap-1.5 px-2 pb-2">
                        {ticks.map((tick, i) => {
                            const height = 15 + Math.random() * 40;
                            const color = tick > 0 ? 'bg-emerald-500' : 'bg-red-500';
                            const wickColor = tick > 0 ? 'bg-emerald-500/50' : 'bg-red-500/50';
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scaleY: 0 }}
                                    animate={{ opacity: 1, scaleY: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative w-1.5 flex flex-col items-center justify-end"
                                    style={{ height: `${height}%` }}
                                >
                                    {/* Top Wick */}
                                    <div className={`w-[1px] h-3 -mt-3 absolute ${wickColor}`} />
                                    {/* Candle Body */}
                                    <div className={`w-full h-full rounded-[1px] ${color} ${(i === ticks.length - 1) ? 'animate-pulse' : ''}`} />
                                    {/* Bottom Wick */}
                                    <div className={`w-[1px] h-3 -mb-3 absolute bottom-0 ${wickColor}`} />
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Trade Execution Overlay */}
                    <AnimatePresence>
                        {tradeStatus !== "idle" && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    {tradeStatus === "executing" ? (
                                        <>
                                            <RefreshCw className="w-8 h-8 text-yellow-500 animate-spin" />
                                            <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Routing Order...</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-3 bg-zinc-900/90 rounded-xl border border-emerald-500/20 shadow-xl backdrop-blur-md">
                                                <div className="flex flex-col items-center gap-1">
                                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                                    <div className="text-center">
                                                        <span className="block text-xs font-black text-white uppercase tracking-wider">Filled</span>
                                                        <span className="text-[9px] text-zinc-500 font-mono">0.45s</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/5 bg-white/[0.02] flex justify-between items-center text-[9px] text-zinc-500">
                <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-500/50" />
                    V4_ENGINE_ACTIVE
                </span>
                <span className="font-mono">ID: 8X92_B4</span>
            </div>
        </div>
    );
};
