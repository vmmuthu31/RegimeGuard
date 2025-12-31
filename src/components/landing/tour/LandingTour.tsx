"use client";

import { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step, TooltipRenderProps } from "react-joyride";
import { Rocket, Shield, Activity, ChevronRight, X } from "lucide-react";

const CustomTooltip = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  isLastStep,
}: TooltipRenderProps) => {
  return (
    <div className="bg-[#0B0E11] border border-white/10 rounded-2xl p-6 max-w-sm shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] backdrop-blur-xl ring-1 ring-white/5 relative overflow-hidden">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-[2px] bg-emerald-500 transition-all duration-500" style={{ width: `${((index + 1) / 7) * 100}%` }} />

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">System Tour</span>
        </div>
        <button {...skipProps} className="text-[10px] font-bold text-zinc-600 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1">
          Skip <X className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3 mb-6">
        <h3 className="text-lg font-black text-white italic tracking-tight">{step.title}</h3>
        <div className="text-sm text-zinc-400 leading-relaxed">
          {step.content}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-zinc-700">STEP_0{index + 1} / 07</span>
        <div className="flex gap-3">
          {index > 0 && (
            <button
              {...backProps}
              className="px-4 py-2 rounded-lg bg-transparent border border-white/5 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors"
            >
              BACK
            </button>
          )}
          <button
            {...primaryProps}
            className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95"
          >
            {isLastStep ? "FINISH" : "NEXT"}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Tactical Scanline */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5" />
    </div>
  );
};

const TOUR_STEPS: Step[] = [
  {
    target: "body",
    title: "Zenith Command Initialized",
    content: "Welcome to RegimeGuard. You are now entering the first risk-adaptive trading environment where capital safety is the primary directive.",
    placement: "center",
  },
  {
    target: ".landing-tour-navbar",
    title: "Tactical HUD",
    content: "The command center for all operations. Monitor your security status, signal strength, and access various protocol layers in real-time.",
    placement: "bottom",
  },
  {
    target: ".landing-tour-hero-text",
    title: "AI Strategy Logic",
    content: "Our system doesn't just trade; it protects. Each execution is backed by institutional-grade AI designed to mitigate drawdowns.",
    placement: "right",
  },
  {
    target: ".landing-tour-risk-panel",
    title: "Live Risk Intelligence",
    content: "This is the system's brain. It analyzes market regimes, calculates optimal exposure, and activates physical guards to shield your equity.",
    placement: "left",
  },
  {
    target: ".landing-tour-problems",
    title: "Threat Assessment",
    content: "Identifying systemic vulnerabilities in traditional trading. We solve for flash crashes, signal fatigue, and transparency gaps.",
    placement: "top",
  },
  {
    target: ".landing-tour-risk-engine",
    title: "Unified System Chassis",
    content: "Behold the core architecture. A multi-layer defense protocol ensuring seamless execution even during peak volatility.",
    placement: "top",
  },
  {
    target: "a[href='/dashboard']",
    title: "Activate Sentinel",
    content: "Ready to deploy? Access your dashboard and connect your trading account to experience the future of risk-managed trading.",
    placement: "bottom",
  }
];

export const LandingTour = () => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("regimeguard_tour_complete");
    if (!hasSeenTour) {
      setTimeout(() => setRun(true), 1500);
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      localStorage.setItem("regimeguard_tour_complete", "true");
    }
  };

  return (
    <Joyride
      steps={TOUR_STEPS}
      run={run}
      continuous
      showSkipButton={false} // Handled by CustomTooltip skip button
      showProgress
      disableScrolling={false}
      scrollOffset={120}
      callback={handleJoyrideCallback}
      tooltipComponent={CustomTooltip}
      styles={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.9)", // Solid dark overlay, NO blur (fixes browser glitches)
        },
        spotlight: {
          borderRadius: 16,
          backgroundColor: "transparent",
        }
      }}
    />
  );
};

