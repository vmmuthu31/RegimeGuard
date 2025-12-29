"use client";

import { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | ReactNode;
  subValue?: string | ReactNode;
  icon: LucideIcon;
  valueClassName?: string;
  action?: ReactNode;
}

export function StatsCard({
  label,
  value,
  subValue,
  icon: Icon,
  valueClassName = "text-white",
  action,
  className,
}: StatsCardProps & { className?: string }) {
  return (
    <div className={`flex flex-col h-full justify-between p-6 ${className}`}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <Icon className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.2em]">
              {label}
            </span>
          </div>
          {action}
        </div>
        <div
          className={`text-2xl font-bold tracking-tight ${valueClassName} drop-shadow-[0_0_10px_rgba(255,255,255,0.05)] font-mono`}
        >
          {value}
        </div>
      </div>
      {subValue && (
        <div className="text-[10px] text-zinc-600 font-bold mt-2 flex items-center gap-1.5 font-mono uppercase tracking-wider">
          <div className="w-1 h-1 rounded-full bg-emerald-500/40" />
          {subValue}
        </div>
      )}
    </div>
  );
}
