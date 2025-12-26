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
    <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex flex-col h-full justify-between relative z-10">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
              <Icon className="w-4 h-4 text-zinc-500" /> {label}
            </div>
            {action}
          </div>
          <div
            className={`text-2xl font-bold tracking-tight ${valueClassName}`}
          >
            {value}
          </div>
        </div>
        {subValue && (
          <div className="text-xs text-zinc-500 font-medium mt-2">
            {subValue}
          </div>
        )}
      </div>
    </div>
  );
}
