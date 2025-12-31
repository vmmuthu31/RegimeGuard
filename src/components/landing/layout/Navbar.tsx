"use client";

import { motion } from "framer-motion";
import { Shield, LayoutDashboard, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none"
        >
            <div className="container max-w-6xl mx-auto flex items-center justify-between p-2 pl-4 pr-2 bg-zinc-950/40 backdrop-blur-3xl border border-white/10 rounded-2xl pointer-events-auto shadow-2xl">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-all">
                        <Shield className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="flex flex-col -gap-1">
                        <span className="text-sm font-black text-white uppercase tracking-tighter italic">RegimeGuard</span>
                        <span className="text-[8px] font-mono text-emerald-500/60 uppercase tracking-widest font-black leading-none">Intelligence_v4</span>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {['Markets', 'Logic', 'Compliance'].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] hover:text-white transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                </nav>

                {/* Action */}
                <Link href="/dashboard">
                    <Button className="bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl group shadow-lg">
                        Sign In
                        <ChevronRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>
        </motion.header>
    );
};
