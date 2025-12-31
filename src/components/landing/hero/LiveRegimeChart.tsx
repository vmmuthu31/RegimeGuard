"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Configuration for the "Institutional" feel
const CONFIG = {
    points: 20, // Number of visible points
    height: 90, // Reduced height to fit better in the card
    width: 400, // Width of the SVG
    updateInterval: 1500, // Slightly slower update for smoother perception
};

// Helper to generate smooth SVG paths
const generatePath = (data: number[]) => {
    if (data.length === 0) return "";

    const stepX = CONFIG.width / (CONFIG.points - 1);
    let d = `M 0 ${CONFIG.height - data[0]}`;

    for (let i = 1; i < data.length; i++) {
        const x = i * stepX;
        const y = CONFIG.height - data[i];

        const prevX = (i - 1) * stepX;
        const prevY = CONFIG.height - data[i - 1];

        const cp1x = prevX + (x - prevX) * 0.5;
        const cp1y = prevY;
        const cp2x = prevX + (x - prevX) * 0.5;
        const cp2y = y;

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
    }
    return d;
};

export const LiveRegimeChart = () => {
    const [data, setData] = useState(() =>
        Array.from({ length: CONFIG.points }, () => 20 + Math.random() * 60)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setData((prev) => {
                const nextVal = 20 + Math.random() * 60;
                return [...prev.slice(1), nextVal];
            });
        }, CONFIG.updateInterval);

        return () => clearInterval(interval);
    }, []);

    const pathDefinition = generatePath(data);

    return (
        <div className="relative w-full h-[70px] overflow-hidden rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm group/chart">
            {/* Header Overlay */}
            <div className="absolute top-1.5 left-4 z-10 flex flex-col">
                <span className="text-[10px] font-mono text-emerald-500/80 mb-0.5 flex items-center gap-2 font-black tracking-widest uppercase">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    AI Regime Monitoring
                </span>
                <span className="text-xl font-black text-white tracking-tighter">
                    $96,284.42 <span className="text-[10px] text-emerald-400 font-mono ml-1 font-bold">+1.24%</span>
                </span>
            </div>

            {/* The Chart SVG */}
            <div className="absolute bottom-0 left-0 right-0 h-[22px]">
                <svg
                    viewBox={`0 0 ${CONFIG.width} ${CONFIG.height}`}
                    className="w-full h-full"
                    preserveAspectRatio="none"
                    style={{ overflow: "visible" }}
                >
                    <defs>
                        <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* 1. The Filled Area (Gradient) */}
                    <motion.path
                        d={`${pathDefinition} L ${CONFIG.width} ${CONFIG.height} L 0 ${CONFIG.height} Z`}
                        fill="url(#gradientArea)"
                        initial={false}
                        animate={{ d: `${pathDefinition} L ${CONFIG.width} ${CONFIG.height} L 0 ${CONFIG.height} Z` }}
                        transition={{ duration: 1.5, ease: "linear" }}
                    />

                    {/* 2. The Stroke Line (Bright) */}
                    <motion.path
                        d={pathDefinition}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={false}
                        animate={{ d: pathDefinition }}
                        transition={{ duration: 1.5, ease: "linear" }}
                        filter="drop-shadow(0 0 4px rgba(16, 185, 129, 0.5))"
                    />

                    {/* 3. The "Head" Dot (Pulse) */}
                    {data.length > 0 && (
                        <motion.circle
                            animate={{
                                cy: CONFIG.height - data[data.length - 1],
                            }}
                            transition={{ duration: 1.5, ease: "linear" }}
                            cx={CONFIG.width}
                            cy={CONFIG.height - data[data.length - 1]}
                            r="3"
                            fill="#fff"
                            filter="drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))"
                        />
                    )}
                </svg>
            </div>

            {/* Grid Lines Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
        </div>
    );
};
