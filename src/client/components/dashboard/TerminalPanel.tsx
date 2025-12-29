"use client";

import React from "react";
import { cn } from "@/src/lib/utils";

interface TerminalPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  headerAction?: React.ReactNode;
  noPadding?: boolean;
  autoHeight?: boolean;
}

export function TerminalPanel({
  children,
  className,
  title,
  headerAction,
  noPadding = false,
  autoHeight = false,
  ...props
}: TerminalPanelProps) {
  return (
    <div
      className={cn(
        "relative group bg-zinc-900/50 backdrop-blur-xl border border-white/5 shadow-lg flex flex-col transition-all duration-300 rounded-xl",
        !autoHeight && "overflow-hidden h-full",
        autoHeight && "h-auto overflow-visible",
        className
      )}
      {...props}
    >
      {/* Inner Glow/Refraction Layer */}
      <div className="absolute inset-px pointer-events-none rounded-[inherit] overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-white/[0.03] to-transparent" />
      </div>

      {title && (
        <div className="relative flex items-center justify-between px-3 py-2 border-b border-white/5 bg-white/[0.02] backdrop-blur-sm shrink-0">
          {/* Title Glow */}
          <div className="absolute inset-0 bg-linear-to-r from-emerald-500/[0.04] via-transparent to-transparent opacity-100 transition-opacity duration-500" />
          <h3 className="relative text-[10px] font-bold text-emerald-400 uppercase tracking-[0.1em] font-mono transition-colors">
            {title}
          </h3>
          <div className="relative">{headerAction}</div>
        </div>
      )}
      <div
        className={cn(
          "relative z-10 custom-scrollbar",
          !noPadding && "p-3",
          !autoHeight && "flex-1 overflow-auto",
          autoHeight && "overflow-visible"
        )}
      >
        {children}
      </div>
    </div>
  );
}
