"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Brain, Shield, Zap, Activity, Lock, Server, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

// --- SUB-COMPONENT: THE HOLOGRAPHIC VISUALIZER ---
// This replaces the crashing video with pure code animation
const NeuralVisualizer = ({ activeStep }: { activeStep: number }) => {
    return (
        <div className="relative w-full h-full overflow-hidden bg-zinc-950 rounded-2xl border border-white/5">
            {/* 1. The Perspective Grid (The Floor) */}
            <div
                className="absolute inset-[-50%] w-[200%] h-[200%] opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
                    animation: 'grid-move 20s linear infinite',
                }}
            />

            {/* 2. Floating Data Particles */}
            <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-emerald-400 rounded-full blur-[1px]"
                        initial={{ x: "50%", y: "50%", opacity: 0 }}
                        animate={{
                            x: [`50%`, `${Math.random() * 100}%`],
                            y: [`50%`, `${Math.random() * 100}%`],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}
            </div>

            {/* 3. Central Node (The Brain) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                    {/* Pulsing Rings */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-emerald-500/30 rounded-full blur-xl"
                    />
                    <div className="w-24 h-24 bg-zinc-900 border border-emerald-500/50 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_30px_-10px_rgba(16,185,129,0.5)]">
                        <Brain className="w-10 h-10 text-emerald-400" />
                    </div>

                    {/* Orbiting Satellite */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-20px] rounded-full border border-dashed border-emerald-500/30"
                    />
                </div>
            </div>

            {/* 4. Dynamic Content Overlay (Changes based on Step) */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono text-emerald-500/70">SYSTEM_STATUS</span>
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            ONLINE
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-mono text-zinc-500">WEEX_LATENCY</span>
                        <div className="text-sm font-mono text-white">12ms</div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeStep}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-zinc-950/80 backdrop-blur-md border border-white/10 p-4 rounded-xl self-center mb-8 max-w-xs text-center"
                    >
                        {activeStep === 0 && (
                            <div className="flex flex-col items-center">
                                <Activity className="w-8 h-8 text-blue-400 mb-2" />
                                <div className="text-xs font-mono text-blue-400 mb-1">DATA INGESTION</div>
                                <div className="text-white font-bold">Processing 14k Ticks/sec</div>
                            </div>
                        )}
                        {activeStep === 1 && (
                            <div className="flex flex-col items-center">
                                <Brain className="w-8 h-8 text-purple-400 mb-2" />
                                <div className="text-xs font-mono text-purple-400 mb-1">REGIME ANALYSIS</div>
                                <div className="text-white font-bold">State: TRENDING_UP (0.92)</div>
                            </div>
                        )}
                        {activeStep === 2 && (
                            <div className="flex flex-col items-center">
                                <Shield className="w-8 h-8 text-orange-400 mb-2" />
                                <div className="text-xs font-mono text-orange-400 mb-1">RISK VALIDATION</div>
                                <div className="text-white font-bold">Exposure Cap: 35%</div>
                            </div>
                        )}
                        {activeStep === 3 && (
                            <div className="flex flex-col items-center">
                                <Zap className="w-8 h-8 text-emerald-400 mb-2" />
                                <div className="text-xs font-mono text-emerald-400 mb-1">EXECUTION</div>
                                <div className="text-white font-bold">Order Route: WEEX v2</div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Scanning Line */}
                <motion.div
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"
                />
            </div>

            <style jsx>{`
        @keyframes grid-move {
          0% { transform: perspective(500px) rotateX(60deg) translateY(0) translateZ(-200px); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(40px) translateZ(-200px); }
        }
      `}</style>
        </div>
    );
};


// --- MAIN COMPONENT ---
export default function SystemArchitecture() {
    const [activeStep, setActiveStep] = useState(0);

    // Auto-cycle through steps if user isn't interacting
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 4);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const steps = [
        {
            id: 0,
            title: "Data Ingestion",
            subtitle: "Websocket Stream",
            desc: "Aggregates price, volume, and order book depth from WEEX v2 API in real-time.",
            icon: <Server className="w-5 h-5" />,
            color: "blue",
        },
        {
            id: 1,
            title: "Regime Classification",
            subtitle: "AI Analysis",
            desc: "Unsupervised model detects market state (Trending vs Ranging) to select strategy.",
            icon: <Brain className="w-5 h-5" />,
            color: "purple",
        },
        {
            id: 2,
            title: "Risk Engine",
            subtitle: "The Gatekeeper",
            desc: "Validates volatility thresholds and drawdown limits before allowing any trade.",
            icon: <Shield className="w-5 h-5" />,
            color: "orange",
        },
        {
            id: 3,
            title: "Smart Execution",
            subtitle: "Order Routing",
            desc: "Optimized placement logic with slippage protection and post-trade analysis.",
            icon: <Zap className="w-5 h-5" />,
            color: "emerald",
        }
    ];

    return (
        <section className="py-16 relative overflow-hidden bg-zinc-950 border-t border-white/5">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-zinc-950 to-zinc-950 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-stretch">

                    {/* LEFT COLUMN: Narrative Control */}
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold mb-3">
                                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Neural Core</span>
                            </h2>
                            <p className="text-zinc-400 text-base">
                                A fully transparent execution pipeline. Watch how data transforms into a trade decision.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {steps.map((step, index) => (
                                <div
                                    key={step.id}
                                    onMouseEnter={() => setActiveStep(index)}
                                    className={cn(
                                        "group cursor-pointer rounded-xl p-3.5 border transition-all duration-500 relative overflow-hidden",
                                        activeStep === index
                                            ? "bg-zinc-900/80 border-emerald-500/30 shadow-[0_0_20px_-10px_rgba(16,185,129,0.3)]"
                                            : "bg-transparent border-transparent hover:bg-white/5"
                                    )}
                                >
                                    <div className="flex items-start gap-3 relative z-10">
                                        {/* Icon Box */}
                                        <div className={cn(
                                            "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0",
                                            activeStep === index
                                                ? `bg-${step.color}-500/20 text-${step.color}-400 scale-110`
                                                : "bg-zinc-800/50 text-zinc-500 group-hover:bg-zinc-800 group-hover:text-zinc-300"
                                        )}>
                                            <div className="scale-90">{step.icon}</div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h3 className={cn(
                                                    "font-bold text-base transition-colors",
                                                    activeStep === index ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                                                )}>
                                                    {step.title}
                                                </h3>
                                                {activeStep === index && (
                                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded bg-${step.color}-500/10 text-${step.color}-400`}>
                                                        ACTIVE
                                                    </span>
                                                )}
                                            </div>
                                            <p className={cn(
                                                "text-xs leading-relaxed transition-colors",
                                                activeStep === index ? "text-zinc-400" : "text-zinc-600"
                                            )}>
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Animated Progress Bar at Bottom of Card */}
                                    {activeStep === index && (
                                        <motion.div
                                            layoutId="progress"
                                            className={`absolute bottom-0 left-0 h-0.5 bg-${step.color}-500`}
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 4, ease: "linear" }} // Syncs with the auto-cycle timer
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: The Visualizer */}
                    <div className="flex-1 min-h-[400px] lg:h-auto">
                        <NeuralVisualizer activeStep={activeStep} />
                    </div>
                </div>
            </div>
        </section>
    );
}
