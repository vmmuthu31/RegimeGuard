import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- VISUAL ASSETS ---
// A noise texture to give the UI a "film grain" look (removes the plastic AI feel)
export const NoiseOverlay = () => (
    <div className="pointer-events-none fixed inset-0 z-[999] opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    />
);

// A reusable "Holographic" border effect
export const HolographicBorder = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn("relative group p-[1px] overflow-hidden rounded-xl", className)}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent translate-x-[-100%] group-hover:animate-shine opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative bg-zinc-950 rounded-xl h-full w-full">
            {children}
        </div>
    </div>
);