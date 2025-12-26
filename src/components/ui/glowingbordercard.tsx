import React from "react";
import { cn } from "@/lib/utils";

type GlowingBorderCardProps = {
  children: React.ReactNode;
  gradientClassName: string;
  className?: string;
};

export default function GlowingBorderCard({
  children,
  gradientClassName,
  className,
}: GlowingBorderCardProps) {
  return (
    <div className={cn("relative group", className)}>
      <div
        className={cn(
          "absolute -inset-[1px] rounded-lg blur-sm opacity-50 group-hover:opacity-80 transition duration-500 animate-tilt",
          gradientClassName
        )}
      />
      <div className="relative flex items-center justify-center h-full bg-zinc-950 rounded-lg p-6">
        {children}
      </div>
    </div>
  );
}