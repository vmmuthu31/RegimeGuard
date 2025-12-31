"use client";

import { Shield } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="py-20 bg-[#0B0E11] border-t border-white/5">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <Shield className="w-6 h-6 text-emerald-500" />
                            <span className="text-xl font-black text-white uppercase tracking-tighter italic">RegimeGuard</span>
                        </div>
                        <p className="text-zinc-500 text-sm max-w-sm leading-relaxed uppercase tracking-wide font-medium">
                            The first risk-adaptive trading protocol built for institutional-grade stability on the WEEX exchange.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Protocol</h4>
                        <ul className="space-y-2">
                            {['Security', 'Risk engine', 'API Docs'].map(item => (
                                <li key={item}><Link href="#" className="text-xs text-zinc-500 hover:text-emerald-400 font-bold uppercase tracking-wider">{item}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Legal</h4>
                        <ul className="space-y-2">
                            {['Term of use', 'Privacy Policy'].map(item => (
                                <li key={item}><Link href="#" className="text-xs text-zinc-500 hover:text-emerald-400 font-bold uppercase tracking-wider">{item}</Link></li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-20 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
                    <span className="text-[10px] font-bold font-mono text-zinc-500">© 2024 REGIMEGUARD_SYSTEMS. ALL_RIGHTS_RESERVED.</span>
                    <div className="flex gap-8">
                        <span className="text-[10px] font-bold font-mono text-zinc-500">v4.0.2_STABLE</span>
                        <span className="text-[10px] font-bold font-mono text-zinc-500">WEEX_PARTNER_0X_44A2</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
