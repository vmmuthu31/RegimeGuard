"use client";

import { motion } from "framer-motion";
import { Shield, LayoutDashboard, ChevronRight } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
        >
            {/* Full Width Creative Deck */}
            <div className="pointer-events-auto w-full bg-[#0B0E11]/90 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-8 py-4 relative overflow-hidden shadow-[0_4px_30px_-10px_rgba(16,185,129,0.1)]">
                {/* 1. Creative Background Pattern (Grid + Noise) */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-zinc-950/80 pointer-events-none" />

                {/* Bottom Neon Line */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />

                {/* 2. Live Scanline (Bottom) */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5 z-20">
                    <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent animate-[shimmer_3s_infinite]" />
                </div>

                {/* Logo Section - Encased */}
                <Link href="/" className="flex items-center gap-4 group relative z-10 pr-8 border-r border-white/5">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        {/* Radar Pulse Effect */}
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-lg animate-ping opacity-20" />
                        <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-emerald-500/50 transition-colors">
                            <NextImage
                                src="/logo.png"
                                alt="Logo"
                                width={24}
                                height={24}
                                className="relative z-10 w-6 h-6 object-contain"
                            />
                            {/* Inner Scan */}
                            <div className="absolute inset-0 bg-linear-to-b from-transparent via-emerald-500/10 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-black text-white uppercase tracking-widest leading-none">RegimeGuard</span>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] leading-none">System Online</span>
                        </div>
                    </div>
                </Link>

                {/* Nav Links - Tech Pills */}
                {/* Nav Links - Control Cluster */}
                <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 bg-[#0B0E11]/90 border border-white/10 p-1.5 rounded-full backdrop-blur-xl shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
                    {['Protocol', 'Risk Engine', 'Security'].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase().replace(' ', '-')}`}
                            className="relative px-6 py-2.5 rounded-full text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] hover:text-white transition-all group/link overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {/* Hover Dot */}
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover/link:opacity-100 transition-opacity shadow-[0_0_8px_#10b981]" />
                                {item}
                            </span>

                            {/* Hover Highlight bg */}
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />

                            {/* Bottom Active Line on Hover */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-emerald-500/50 scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300" />
                        </Link>
                    ))}
                </nav>

                {/* Right Side: Status + Sign In */}
                <div className="flex items-center gap-8 relative z-10">
                    {/* Ticker Tape Status */}
                    <div className="hidden lg:flex flex-col items-end text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-tight border-r border-white/5 pr-8">
                        <span className="text-zinc-700">Latency</span>
                        <span className="text-emerald-500 font-bold">12ms <span className="text-zinc-600">Stable</span></span>
                    </div>

                    <Link href="/dashboard">
                        {/* ALWAYS-ON Spinner Button */}
                        <div className="relative group/btn overflow-hidden rounded-lg p-[1px]">
                            {/* Persistent Animation (Opacity 100) */}
                            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#10b981_0%,#0f172a_50%,#10b981_100%)] opacity-100" />

                            <Button className="relative bg-zinc-950 hover:bg-zinc-900 border border-transparent text-white font-black uppercase tracking-widest text-[10px] h-9 px-6 rounded-lg transition-all group-hover/btn:scale-[0.98]">
                                Sign In
                                <ChevronRight className="ml-1 w-3 h-3 text-emerald-500" />
                            </Button>
                        </div>
                    </Link>
                </div>
            </div>
        </motion.header>
    );
};
