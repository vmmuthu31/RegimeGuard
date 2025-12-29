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
      className={`flex items-center justify-between ${
        compact ? "mb-0 py-2" : "mb-8"
      } ${className || ""}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`rounded-2xl bg-linear-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center relative overflow-hidden ${
            compact ? "w-8 h-8 rounded-lg" : "w-12 h-12"
          }`}
        >
          <Image
            src="/logo.png"
            alt="logo"
            width={compact ? 20 : 32}
            height={compact ? 20 : 32}
            className="object-contain drop-shadow-md"
          />
        </div>
        <div>
          <h1
            className={`${
              compact ? "text-lg" : "text-3xl"
            } font-bold tracking-tight text-white`}
          >
            RegimeGuard <span className="text-emerald-400">Pro</span>
          </h1>
          {!compact && (
            <p className="text-zinc-500 text-sm font-medium">
              AI-Powered Trading Dashboard
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md transition-colors duration-300 ${
            connected
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              : "border-red-500/30 bg-red-500/10 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          } ${compact ? "scale-90 origin-right" : ""}`}
        >
          <span className="relative flex h-3 w-3">
            {connected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <Radio
              className={`relative inline-flex h-3 w-3 ${
                connected ? "text-emerald-400" : "text-red-400"
              }`}
            />
          </span>
          <span className="text-sm font-semibold tracking-wide">
            {connected ? "LIVE FEED" : "OFFLINE"}
          </span>
        </div>

        {lastUpdate > 0 && (
          <div className="hidden md:flex items-center gap-2 text-zinc-500 text-xs font-mono bg-zinc-900/50 px-3 py-1.5 rounded-lg border border-white/5">
            <Clock className="w-3 h-3" />
            {new Date(lastUpdate).toLocaleTimeString()}
          </div>
        )}

        <div className="h-8 w-px bg-white/10 mx-1"></div>

        <UserDropdown account={account} />
      </div>
    </header>
  );
}
