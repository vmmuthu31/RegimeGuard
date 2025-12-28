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
  className,
}: StatsCardProps & { className?: string }) {
  return (
    <div className={`flex flex-col h-full justify-between p-6 ${className}`}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Icon className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-zinc-400 text-sm font-medium tracking-wide">
              {label}
            </span>
          </div>
          {action}
        </div>
        <div
          className={`text-2xl font-bold tracking-tight ${valueClassName} drop-shadow-sm font-mono`}
        >
          {value}
        </div>
      </div>
      {subValue && (
        <div className="text-[10px] text-zinc-500 font-medium mt-2 flex items-center gap-1.5 font-mono">
          {subValue}
        </div>
      )}
    </div>
  );
}
