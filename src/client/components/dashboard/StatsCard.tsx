"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | React.ReactNode;
  subValue?: string | React.ReactNode;
  icon: LucideIcon;
  valueClassName?: string;
  action?: React.ReactNode;
}

export function StatsCard({
  label,
  value,
  subValue,
  icon: Icon,
  valueClassName = "text-white",
  action,
}: StatsCardProps) {
  return (
    <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 relative overflow-hidden group h-full transition-all duration-300 hover:border-white/10 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]">
      {/* Holographic Sheen */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.03),transparent)] -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />

      {/* Border Glow */}
      <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/5 transition-colors duration-300 pointer-events-none" />

      <div className="flex flex-col h-full justify-between relative z-10">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5 shadow-inner">
                <Icon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              </div>
              <span className="text-zinc-400 text-sm font-medium tracking-wide">
                {label}
              </span>
            </div>
            {action}
          </div>
          <div
            className={`text-3xl font-bold tracking-tight ${valueClassName} drop-shadow-sm`}
          >
            {value}
          </div>
        </div>
        {subValue && (
          <div className="text-xs text-zinc-500 font-medium mt-3 flex items-center gap-1.5 font-mono">
            {subValue}
          </div>
        )}
      </div>
    </div>
  );
}
