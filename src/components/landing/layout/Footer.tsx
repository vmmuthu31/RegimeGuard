"use client";

import { Shield, Rocket, Mail, ArrowRight, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import { useState, FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";

// Custom toast styles for tactical theme
const showSuccessToast = (message: string) => {
    toast.custom((t) => (
        <div
            className={`${t.visible ? 'animate-in slide-in-from-bottom-5 fade-in duration-300' : 'animate-out slide-out-to-bottom-5 fade-out duration-200'
                } max-w-md w-full bg-zinc-900/95 backdrop-blur-xl border border-emerald-500/30 shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)] rounded-xl pointer-events-auto flex ring-1 ring-white/5 overflow-hidden`}
        >
            <div className="w-1 bg-emerald-500" />
            <div className="flex-1 p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex-1 pt-0.5">
                        <p className="text-sm text-white font-semibold">{message}</p>
                    </div>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="flex-shrink-0 text-zinc-500 hover:text-white transition-colors"
                    >
                        <XCircle className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    ), { duration: 4000 });
};

const showErrorToast = (message: string) => {
    toast.custom((t) => (
        <div
            className={`${t.visible ? 'animate-in slide-in-from-bottom-5 fade-in duration-300' : 'animate-out slide-out-to-bottom-5 fade-out duration-200'
                } max-w-md w-full bg-zinc-900/95 backdrop-blur-xl border border-red-500/30 shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)] rounded-xl pointer-events-auto flex ring-1 ring-white/5 overflow-hidden`}
        >
            <div className="w-1 bg-red-500" />
            <div className="flex-1 p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1 pt-0.5">
                        <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">System Alert</p>
                        <p className="text-sm text-white font-medium">{message}</p>
                    </div>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="flex-shrink-0 text-zinc-500 hover:text-white transition-colors"
                    >
                        <XCircle className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    ), { duration: 4000 });
};

export const Footer = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubscribe = async (e: FormEvent) => {
        e.preventDefault();

        if (!email) {
            showErrorToast("Enter your email address");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                showSuccessToast("Subscribed! Check your email.");
                setEmail("");
            } else {
                showErrorToast(data.error || "Subscription failed");
            }
        } catch (error) {
            showErrorToast("Network error. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <footer className="relative bg-[#050607] border-t border-white/5 overflow-hidden">
            <Toaster position="bottom-center" toastOptions={{ className: '', duration: 4000 }} />

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

                        {/* Newsletter Subscription Form */}
                        <div className="max-w-md">
                            <div className="flex items-center gap-2 mb-3">
                                <Mail className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Protocol Subscription</span>
                            </div>
                            <form onSubmit={handleSubscribe} className="relative group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ENTER_EMAIL_FOR_INTEL"
                                    disabled={isLoading}
                                    className="w-full bg-zinc-900/50 border border-white/10 text-xs font-mono text-white px-4 py-3 pr-24 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-zinc-700 disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-[10px] uppercase tracking-widest rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                    {isLoading ? "..." : "Join"}
                                    {!isLoading && <ArrowRight className="w-3 h-3" />}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Protocol Links */}
                    <div>
                        <h4 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] mb-6">Protocol</h4>
                        <ul className="space-y-4">
                            {['Risk Engine', 'Regime Detection', 'Volatility Guards', 'Performance'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-zinc-500 hover:text-emerald-500 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 rounded-full bg-zinc-700 group-hover:bg-emerald-500 transition-colors"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] mb-6">Legal</h4>
                        <ul className="space-y-4">
                            {['Privacy Policy', 'Terms of Service', 'Risk Disclosure', 'Documentation'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-zinc-500 hover:text-emerald-500 transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 rounded-full bg-zinc-700 group-hover:bg-emerald-500 transition-colors"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6 text-xs text-zinc-600">
                        <span>© 2025 RegimeGuard Systems</span>
                        <span className="hidden md:inline">•</span>
                        <span className="font-mono text-[10px]">v2.4.1_STABLE</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Shield className="w-4 h-4 text-emerald-500/50" />
                        <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">Secured by WEEX Protocol</span>
                    </div>
                </div>
            </div>

            {/* Background Watermark */}
            <div className="absolute bottom-10 right-10 text-[200px] font-black text-white/[0.01] select-none pointer-events-none">
                RG
            </div>

            {/* Warp to Zenith Button */}
            <button
                onClick={scrollToTop}
                className="fixed bottom-10 right-10 w-14 h-14 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center group hover:border-emerald-500/30 transition-all shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.4)] z-50 animate-bounce hover:pause-animation"
                aria-label="Scroll to top"
            >
                <Rocket className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />

                {/* Visual Hint */}
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 px-2 py-1 rounded text-[8px] font-bold text-emerald-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                    To Zenith
                </span>
            </button>
        </footer>
    );
};
