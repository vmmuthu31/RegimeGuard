"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  Zap,
  TrendingUp,
  BarChart2,
  Shield,
} from "lucide-react";
import { useAuth } from "@/src/client/hooks/use-auth";

import { useDashboardData } from "@/src/client/hooks/useDashboardData";
import { formatPrice } from "@/src/shared/utils/formatters";

function Navbar() {
  const { login, authenticated, walletAddress, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Image
              src="/logo.png"
              alt="Logo"
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">
            RegimeGuard
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#stats" className="hover:text-white transition-colors">
            Performance
          </Link>
          <Link href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {authenticated && walletAddress ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 font-mono hidden sm:block">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
              <button
                onClick={logout}
                className="text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors"
              >
                Sign Out
              </button>
              <Link href="/dashboard">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                  Dashboard
                </button>
              </Link>
            </div>
          ) : (
            <button
              onClick={login}
              className="bg-white text-zinc-950 hover:bg-zinc-200 text-sm font-bold px-4 py-2 rounded-lg transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const { tickers } = useDashboardData();
  const btcTicker = tickers["cmt_btcusdt"];
  const btcPrice = btcTicker ? formatPrice(btcTicker.lastPrice) : "---";

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800/60 backdrop-blur-md text-zinc-300 text-sm font-medium mb-10 shadow-lg shadow-emerald-500/5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="tracking-wide">
            System Status:{" "}
            <span className="text-emerald-400">Regime Detection Active</span>
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-[1.1]">
          Master Market Regimes with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            AI-Driven Precision
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          Stop guessing. RegimeGuard identifies bull, bear, and crab markets
          instantly, automatically adjusting your strategy&apos;s risk profile
          for maximum alpha generation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20">
          <Link href="/dashboard">
            <button className="h-14 px-8 rounded-full bg-white text-zinc-950 font-bold text-lg hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/10">
              Launch Terminal <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <button className="h-14 px-8 rounded-full bg-zinc-900/50 hover:bg-zinc-900 text-white font-medium text-lg border border-zinc-700/50 transition-all backdrop-blur-sm">
            Explore Documentation
          </button>
        </div>

        {/* CSS-only Dashboard Preview */}
        <div className="relative mx-auto max-w-4xl rounded-xl border border-white/10 bg-zinc-950/80 backdrop-blur shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] flex flex-col group">
          <div className="h-8 border-b border-white/5 bg-zinc-900/50 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
          </div>
          <div className="flex-1 p-6 grid grid-cols-3 gap-6 font-mono text-xs opacity-80 group-hover:opacity-100 transition-opacity duration-700">
            <div className="col-span-2 space-y-4">
              <div className="h-32 rounded bg-zinc-900/50 border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 flex items-end justify-around px-2 pb-2">
                  {[40, 60, 45, 70, 85, 65, 55, 75, 90, 60].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="w-1.5 bg-emerald-500/30 rounded-t-sm"
                    />
                  ))}
                </div>
                <div className="absolute top-2 left-3 text-emerald-500">
                  BTC/USDT <span className="text-white ml-2">${btcPrice}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 rounded bg-zinc-900/50 border border-white/5 p-3">
                  <div className="text-zinc-500 mb-1">Current Regime</div>
                  <div className="text-emerald-400 font-bold text-lg">
                    BULLISH_VOLATILE
                  </div>
                </div>
                <div className="h-20 rounded bg-zinc-900/50 border border-white/5 p-3">
                  <div className="text-zinc-500 mb-1">Risk Budget</div>
                  <div className="text-white font-bold text-lg">
                    12.5%{" "}
                    <span className="text-xs font-normal text-zinc-500">
                      Allocated
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-8 w-full rounded bg-white/5 flex items-center px-3 justify-between"
                >
                  <span className="text-zinc-500">Log_00{i}</span>
                  <span className="text-emerald-500">EXECUTED</span>
                </div>
              ))}
            </div>
          </div>
          {/* Scanline */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-[10px] w-full animate-scan" />
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section id="stats" className="border-y border-white/5 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: "24h Volume", value: "$42.5M+", color: "text-white" },
          { label: "Active Traders", value: "1,200+", color: "text-white" },
          {
            label: "Execution Speed",
            value: "< 24ms",
            color: "text-emerald-400",
          },
          { label: "Uptime", value: "99.99%", color: "text-white" },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div className={`text-3xl font-bold mb-1 ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section
      id="features"
      className="py-32 px-6 bg-zinc-950 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Engineered for{" "}
            <span className="text-emerald-500">Institutional Performance</span>
          </h2>
          <p className="text-xl text-zinc-400 leading-relaxed">
            Our platform combines proprietary HMM (Hidden Markov Models) with
            robust execution protocols to deliver a superior trading experience
            in any market condition.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          {/* Main Feature - Large */}
          <div className="md:col-span-2 row-span-2 p-10 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:opacity-40 transition-opacity">
              <BarChart2 className="w-64 h-64 text-emerald-500" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                  <BarChart2 className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Multi-Regime Analysis
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                  Our core engine doesn&apos;t just look at price. It analyzes
                  volatility, volume, and order flow to classify the market into
                  distinct regimes: Trending, Mean Reverting, or Volatile.
                </p>
              </div>
              <div className="mt-8 flex gap-3">
                {["Bull", "Bear", "Crab", "Volatile"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-zinc-800 border border-white/5 text-xs font-mono text-emerald-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-6 px-1">
              <Shield className="w-6 h-6 text-zinc-300 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Volatility Kill-Switch
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Hard-coded risk limits automatically halt trading when volatility
              exceeds your personalized threshold.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-zinc-300 group-hover:text-yellow-400 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              24ms Execution
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Direct DMA connection to WEEX v2 API ensures your orders front-run
              the crowd.
            </p>
          </div>

          {/* Wide Feature */}
          <div className="md:col-span-3 p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-zinc-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Alpha Generation Models
              </h3>
              <p className="text-zinc-400 leading-relaxed text-lg">
                Proprietary ML models trained on 10 years of tick-level data to
                identify asymmetric risk/reward setups.
              </p>
            </div>
            <div className="flex-1 w-full h-32 bg-zinc-950/50 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center">
              <div className="text-zinc-600 font-mono text-sm">
                Model Architecture Visualization
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="py-24 px-6 border-t border-white/5 relative">
      <div className="absolute inset-0 bg-zinc-950" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Architecture of Alpha
          </h2>
          <p className="text-zinc-400">
            From raw data to execution in under 24 milliseconds.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 items-center">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 text-center relative group hover:border-emerald-500/20 transition-all">
            <div className="w-12 h-12 mx-auto bg-zinc-800 rounded-xl flex items-center justify-center mb-4 text-emerald-500 font-mono font-bold group-hover:bg-emerald-500/10 group-hover:scale-110 transition-all">
              01
            </div>
            <h3 className="text-white font-bold mb-2">Ingestion</h3>
            <p className="text-xs text-zinc-500">
              Tick-level data from 40+ exchanges normalized in real-time.
            </p>
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 -right-6 w-8 h-[2px] bg-gradient-to-r from-zinc-800 to-transparent" />
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 text-center relative group hover:border-emerald-500/20 transition-all">
            <div className="w-12 h-12 mx-auto bg-zinc-800 rounded-xl flex items-center justify-center mb-4 text-emerald-500 font-mono font-bold group-hover:bg-emerald-500/10 group-hover:scale-110 transition-all">
              02
            </div>
            <h3 className="text-white font-bold mb-2">Regime Class</h3>
            <p className="text-xs text-zinc-500">
              HMM models classify market state (Bull/Bear/Volatile).
            </p>
            <div className="hidden md:block absolute top-1/2 -right-6 w-8 h-[2px] bg-gradient-to-r from-zinc-800 to-transparent" />
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 text-center relative group hover:border-emerald-500/20 transition-all">
            <div className="w-12 h-12 mx-auto bg-zinc-800 rounded-xl flex items-center justify-center mb-4 text-emerald-500 font-mono font-bold group-hover:bg-emerald-500/10 group-hover:scale-110 transition-all">
              03
            </div>
            <h3 className="text-white font-bold mb-2">Signal Gen</h3>
            <p className="text-xs text-zinc-500">
              Strategy logic applies regime-specific parameters.
            </p>
            <div className="hidden md:block absolute top-1/2 -right-6 w-8 h-[2px] bg-gradient-to-r from-zinc-800 to-transparent" />
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 text-center relative group hover:border-emerald-500/20 transition-all">
            <div className="w-12 h-12 mx-auto bg-zinc-800 rounded-xl flex items-center justify-center mb-4 text-emerald-500 font-mono font-bold group-hover:bg-emerald-500/10 group-hover:scale-110 transition-all">
              04
            </div>
            <h3 className="text-white font-bold mb-2">Execution</h3>
            <p className="text-xs text-zinc-500">
              Smart routing enables fill at best bid/ask.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-12 text-center relative overflow-hidden">
        <BarChart3 className="absolute top-4 right-4 text-emerald-500 w-6 h-6 animate-pulse" />

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">
          Ready to elevate your trading?
        </h2>
        <p className="text-lg text-zinc-400 mb-8 max-w-xl mx-auto relative z-10">
          Join professional traders using RegimeGuard to automate their
          strategies and manage risk.
        </p>
        <div className="relative z-10">
          <Link href="/dashboard">
            <button className="bg-white text-zinc-950 px-8 py-3.5 rounded-xl font-bold hover:bg-zinc-200 transition-colors">
              Launch Dashboard
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5 bg-zinc-950">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
            </div>
            <span className="font-bold text-white">RegimeGuard</span>
          </div>
          <p className="text-zinc-500 text-sm">
            Advanced trading infrastructure for the modern era.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4">Platform</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="hover:text-white cursor-pointer">Markets</li>
            <li className="hover:text-white cursor-pointer">Execution</li>
            <li className="hover:text-white cursor-pointer">Pricing</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="hover:text-white cursor-pointer">Documentation</li>
            <li className="hover:text-white cursor-pointer">API Reference</li>
            <li className="hover:text-white cursor-pointer">Status</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">
              Terms of Service
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center text-xs text-zinc-600">
        © 2026 RegimeGuard Inc. All rights reserved.
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30 font-sans">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
