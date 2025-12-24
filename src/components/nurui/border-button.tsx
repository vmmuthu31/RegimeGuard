import { cn } from "@/src/lib/utils";
import React from "react";
import { FaArrowTrendUp } from "react-icons/fa6";

const BorderAnimationButton = ({ text, className, onClick }: { text: string; className?: string; onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className={cn("relative inline-flex h-12 active:scale-95 transition-all overflow-hidden rounded-full p-[1px] focus:outline-none group", className)}
    >
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#10b981_0%,#06b6d4_50%,#10b981_100%)]"></span>
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-zinc-950 px-8 text-sm font-bold text-white backdrop-blur-3xl gap-2 transition-colors group-hover:bg-zinc-900">
        <span>{text}</span>
        <FaArrowTrendUp className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </span>
    </button>
  );
};

export default BorderAnimationButton;
