"use client";

import { Shield, Rocket } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";

export const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return (
        <footer className="relative bg-[#050607] border-t border-white/5 overflow-hidden">
            {/* Top Gradient Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

            <div className="container px-4 md:px-6 py-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-2 space-y-8">
                        {/* Logo Section */}
                        <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 flex items-center justify-center bg-zinc-900/50 rounded-xl border border-white/10 ring-1 ring-white/5">
                                <NextImage
                                    src="/logo.png"
                                    alt="RegimeGuard Logo"
                                    width={32}
                                    height={32}
                                    className="w-7 h-7 object-contain relative z-10"
                                />
                                <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">RegimeGuard</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">All Systems Operational</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-zinc-500 text-sm max-w-sm leading-relaxed font-medium">
                            The first risk-adaptive trading protocol built for institutional-grade stability on the WEEX exchange.
                        </p>

                        {/* Newsletter Input (Visual) */}
                        <div className="max-w-xs relative group">
                            <input
                                type="email"
                                placeholder="ENTER_EMAIL_FOR_INTEL"
                                className="w-full bg-zinc-900/50 border border-white/10 text-xs font-mono text-white px-4 py-3 rounded-lg focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-700"
                                disabled
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Join</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Protocol</h4>
                        <ul className="space-y-3">
                            {['Security Audit', 'Risk Engine Specs', 'Live Metrics', 'API Documentation'].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-xs text-zinc-400 hover:text-emerald-400 font-bold uppercase tracking-wider transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-zinc-700 rounded-full group-hover:bg-emerald-500 transition-colors" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Legal</h4>
                        <ul className="space-y-3">
                            {['Terms of Service', 'Privacy Policy', 'Risk Disclosure', 'Cookie Settings'].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-xs text-zinc-400 hover:text-emerald-400 font-bold uppercase tracking-wider transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-zinc-700 rounded-full group-hover:bg-emerald-500 transition-colors" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <span className="text-[10px] font-bold font-mono text-zinc-600">© 2024 REGIMEGUARD_SYSTEMS. ALL_RIGHTS_RESERVED.</span>
                    <div className="flex gap-8">
                        <span className="text-[10px] font-bold font-mono text-zinc-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            v4.0.2_STABLE
                        </span>
                        <span className="text-[10px] font-bold font-mono text-zinc-600">WEEX_PARTNER_0X_44A2</span>
                    </div>
                </div>
            </div>

            {/* Background Watermark */}
            <div className="absolute bottom-0 right-0 pointer-events-none opacity-[0.02] select-none">
                <span className="text-[200px] font-black leading-none text-white tracking-tighter">RG</span>
            </div>
        </footer>
    );
};
