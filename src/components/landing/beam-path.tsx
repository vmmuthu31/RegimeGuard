"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BeamPath = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 1200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full opacity-60", className)}
    >
      <defs>
        <linearGradient
          id="beam-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#34d399" stopOpacity="0" />
          <stop offset="0.5" stopColor="#34d399" />
          <stop offset="1" stopColor="#34d399" stopOpacity="0" />
        </linearGradient>
        <mask id="path-mask">
          <motion.rect
            width="200"
            height="100%"
            fill="white"
            initial={{ x: -200 }}
            animate={{ x: 1400 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </mask>
      </defs>

      {/* Background Line (Dim) */}
      <path
        d="M0 50 Q 300 50, 400 50 T 800 50 T 1200 50"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="2"
        fill="transparent"
      />

      {/* Animated Beam (Bright) */}
      <path
        d="M0 50 Q 300 50, 400 50 T 800 50 T 1200 50"
        stroke="url(#beam-gradient)"
        strokeWidth="4"
        fill="transparent"
        mask="url(#path-mask)"
        style={{ filter: "drop-shadow(0 0 8px #34d399)" }}
      />
    </svg>
  );
};

export const BeamPathMobile = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 100 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full opacity-60", className)}
    >
      <defs>
        <linearGradient
          id="beam-gradient-mobile"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#34d399" stopOpacity="0" />
          <stop offset="0.5" stopColor="#34d399" />
          <stop offset="1" stopColor="#34d399" stopOpacity="0" />
        </linearGradient>
        <mask id="path-mask-mobile">
          <motion.rect
            width="100%"
            height="150"
            fill="white"
            initial={{ y: -150 }}
            animate={{ y: 950 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </mask>
      </defs>

      {/* Background Line */}
      <path
        d="M50 0 L 50 800"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="2"
        fill="transparent"
      />

      {/* Animated Beam */}
      <path
        d="M50 0 L 50 800"
        stroke="url(#beam-gradient-mobile)"
        strokeWidth="4"
        fill="transparent"
        mask="url(#path-mask-mobile)"
        style={{ filter: "drop-shadow(0 0 8px #34d399)" }}
      />
    </svg>
  );
};
