"use client";

import Image from "next/image";
import { Radio, Clock } from "lucide-react";
import { UserDropdown } from "./UserDropdown";
import { AccountData } from "../../hooks/useDashboardData";

interface DashboardHeaderProps {
  connected: boolean;
  lastUpdate: number;
  account: AccountData | null;
  className?: string;
  compact?: boolean;
}

export function DashboardHeader({
  connected,
  lastUpdate,
  account,
  className,
  compact = false,
}: DashboardHeaderProps) {
  return (
    <header
      className={`flex items-center justify-between ${compact ? "mb-0 py-2" : "mb-8"
        } ${className || ""}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`rounded-xl bg-[#0B0E11] border border-white/20 shadow-2xl flex items-center justify-center relative overflow-hidden group/logo ${compact ? "w-9 h-9" : "w-14 h-14"
            }`}
        >
          {/* Subtle Glow Background */}
          <div className="absolute inset-0 bg-emerald-500/5 group-hover/logo:bg-emerald-500/10 transition-colors" />
          <Image
            src="/logo.png"
            alt="logo"
            width={compact ? 24 : 36}
            height={compact ? 24 : 36}
            className="object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] relative z-10"
          />
        </div>
        <div>
          <h1
            className={`${compact ? "text-xl" : "text-3xl"
              } font-black tracking-tighter text-white uppercase`}
          >
            RegimeGuard <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">Pro</span>
          </h1>
          {!compact && (
            <p className="text-zinc-400 text-[11px] font-black uppercase tracking-[0.2em] mt-0.5 opacity-60">
              Intelligence-Led Risk Management
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-2.5 px-4 py-2 rounded-lg border backdrop-blur-3xl transition-all duration-500 ${connected
              ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:border-emerald-500/60"
              : "border-red-500/40 bg-red-500/5 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:border-red-500/60"
            } ${compact ? "scale-90 origin-right" : ""}`}
        >
          <span className="relative flex h-2.5 w-2.5">
            {connected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40"></span>
            )}
            <div
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${connected ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                }`}
            />
          </span>
          <span className="text-[10px] font-black tracking-[0.15em] uppercase">
            {connected ? "Tactical Feed Active" : "Operational Standby"}
          </span>
        </div>

        {lastUpdate > 0 && (
          <div className="hidden md:flex items-center gap-2.5 text-zinc-300 text-[10px] font-black font-mono bg-zinc-950/60 px-4 py-2 rounded-lg border border-white/20 shadow-xl uppercase tracking-tighter">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            {new Date(lastUpdate).toLocaleTimeString()}
          </div>
        )}

        <div className="h-8 w-px bg-white/20 mx-1"></div>

        <UserDropdown account={account} />
      </div>
    </header>
  );
}
