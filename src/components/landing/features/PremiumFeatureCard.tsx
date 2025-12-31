"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface PremiumFeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    children?: React.ReactNode;
    className?: string;
    accentColor?: "emerald" | "cyan" | "purple" | "red";
}

export const PremiumFeatureCard = ({
    icon,
    title,
    description,
    children,
    className,
    accentColor = "emerald",
    variant = "beam", // beam | glitch | rotate
}: PremiumFeatureCardProps & { variant?: "beam" | "glitch" | "rotate" }) => {
    const topRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);

    const colors = {
        emerald: "via-emerald-500",
        cyan: "via-cyan-500",
        purple: "via-purple-500",
        red: "via-red-500",
    };

    useEffect(() => {
        if (variant !== "beam") return; // Only run physics for beam variant

        const animateBorder = () => {
            const now = Date.now() / 1000;
            const speed = 0.5;

            const topX = Math.sin(now * speed) * 100;
            const rightY = Math.cos(now * speed) * 100;
            const bottomX = Math.sin(now * speed + Math.PI) * 100;
            const leftY = Math.cos(now * speed + Math.PI) * 100;

            if (topRef.current) topRef.current.style.transform = `translateX(${topX}%)`;
            if (rightRef.current) rightRef.current.style.transform = `translateY(${rightY}%)`;
            if (bottomRef.current) bottomRef.current.style.transform = `translateX(${bottomX}%)`;
            if (leftRef.current) leftRef.current.style.transform = `translateY(${leftY}%)`;

            requestAnimationFrame(animateBorder);
        };

        const animationId = requestAnimationFrame(animateBorder);
        return () => cancelAnimationFrame(animationId);
    }, [variant]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
                "relative bg-zinc-950/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group",
                className
            )}
        >
            {/* Variant 1: Beam (Original Liquid Light) */}
            {variant === "beam" && (
                <>
                    <div className="absolute top-0 left-0 w-full h-[1px] overflow-hidden">
                        <div ref={topRef} className={cn("absolute inset-0 bg-gradient-to-r from-transparent to-transparent", colors[accentColor])} />
                    </div>
                    <div className="absolute top-0 right-0 w-[1px] h-full overflow-hidden">
                        <div ref={rightRef} className={cn("absolute inset-0 bg-gradient-to-b from-transparent to-transparent", colors[accentColor])} />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden">
                        <div ref={bottomRef} className={cn("absolute inset-0 bg-gradient-to-r from-transparent to-transparent", colors[accentColor])} />
                    </div>
                    <div className="absolute top-0 left-0 w-[1px] h-full overflow-hidden">
                        <div ref={leftRef} className={cn("absolute inset-0 bg-gradient-to-b from-transparent to-transparent", colors[accentColor])} />
                    </div>
                </>
            )}

            {/* Variant 2: Glitch (Static Noise Stroke) */}
            {variant === "glitch" && (
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 border-dashed animate-[pulse_0.1s_infinite]",
                        accentColor === "red" ? "border-red-500/50" : "border-white/20")} />
                </div>
            )}

            {/* Variant 3: Rotate (Gradient Spin) */}
            {variant === "rotate" && (
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-2xl">
                    <div className={cn(
                        "absolute -inset-[100%] animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                        "bg-[conic-gradient(from_0deg,transparent_0_340deg,var(--tw-gradient-stops))]",
                        accentColor === "emerald" ? "from-emerald-500" :
                            accentColor === "cyan" ? "from-cyan-500" : "from-purple-500"
                    )} />
                    {/* Mask to keep content clean */}
                    <div className="absolute inset-[1px] bg-zinc-950/90 rounded-2xl" />
                </div>
            )}

            <div className="p-8 h-full flex flex-col items-start relative z-10">
                <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/5 transition-all group-hover:scale-110",
                    accentColor === "emerald" && "bg-emerald-500/10 text-emerald-400 group-hover:border-emerald-500/30",
                    accentColor === "cyan" && "bg-cyan-500/10 text-cyan-400 group-hover:border-cyan-500/30",
                    accentColor === "purple" && "bg-purple-500/10 text-purple-400 group-hover:border-purple-500/30",
                    accentColor === "red" && "bg-red-500/10 text-red-400 group-hover:border-red-500/30"
                )}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                    {title}
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm mb-6">
                    {description}
                </p>
                <div className="mt-auto w-full">
                    {children}
                </div>
            </div>

            {/* Textured Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </motion.div>
    );
};
