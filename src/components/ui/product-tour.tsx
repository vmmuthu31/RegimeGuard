"use client";

import dynamic from "next/dynamic";
import type { Step, CallBackProps } from "react-joyride";

const Joyride = dynamic(() => import("react-joyride"), { ssr: false });

interface ProductTourProps {
  run: boolean;
  onFinish: () => void;
}

export default function ProductTour({ run, onFinish }: ProductTourProps) {
  const steps: Step[] = [
    {
      target: "body",
      content: (
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-white">
            Welcome to RegimeGuard! 🚀
          </h3>
          <p className="text-zinc-300">
            Let me show you how our AI-powered trading system works. This quick
            tour will explain the Neural Core, Risk Engine, and our proven
            performance metrics.
          </p>
          <p className="text-zinc-400 text-sm">
            Click &quot;Next&quot; to begin the tour.
          </p>
        </div>
      ),
      placement: "center" as const,
      disableBeacon: true,
    },
    {
      target: "#hero-section",
      content: (
        <div className="space-y-2">
          <h4 className="font-bold text-white">AI Trading Platform</h4>
          <p className="text-zinc-300 text-sm">
            RegimeGuard uses institutional-grade AI to adapt to market
            conditions in real-time, maximizing returns while protecting your
            capital.
          </p>
        </div>
      ),
      placement: "bottom" as const,
      disableBeacon: true,
    },
    {
      target: "#stats-ticker",
      content: (
        <div className="space-y-2">
          <h4 className="font-bold text-white">Live System Status</h4>
          <p className="text-zinc-300 text-sm">
            Monitor real-time metrics: current market regime, risk exposure,
            drawdown protection, and signal strength.
          </p>
        </div>
      ),
      placement: "bottom" as const,
      disableBeacon: true,
    },
    {
      target: "#neural-core",
      content: (
        <div className="space-y-2">
          <h4 className="font-bold text-white">The Neural Core 🧠</h4>
          <p className="text-zinc-300 text-sm">
            This is the heart of RegimeGuard. Watch how data flows through our
            4-stage pipeline: Data Ingestion → Regime Classification → Risk
            Validation → Smart Execution.
          </p>
          <p className="text-emerald-400 text-xs font-mono">
            💡 Hover over each step to see it in action!
          </p>
        </div>
      ),
      placement: "top" as const,
      disableBeacon: true,
    },
    {
      target: "#performance",
      content: (
        <div className="space-y-2">
          <h4 className="font-bold text-white">Proven Performance 📊</h4>
          <p className="text-zinc-300 text-sm">
            Real metrics from our live trading engine: 68.4% win rate, 8.2% max
            drawdown, 2.14 Sharpe ratio.
          </p>
        </div>
      ),
      placement: "top" as const,
      disableBeacon: true,
    },
    {
      target: "#multi-agent",
      content: (
        <div className="space-y-2">
          <h4 className="font-bold text-white">Multi-Agent System 🤖</h4>
          <p className="text-zinc-300 text-sm">
            Four specialized AI agents work together: Regime, Risk, Volatility,
            and Strategy agents. Every trade requires consensus.
          </p>
        </div>
      ),
      placement: "top" as const,
      disableBeacon: true,
    },
    {
      target: "body",
      content: (
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-white">
            You&apos;re All Set! ✨
          </h3>
          <p className="text-zinc-300">
            You now understand how RegimeGuard&apos;s AI trading system works.
          </p>
          <p className="text-emerald-400 text-sm font-semibold">
            Click &quot;Start Trading&quot; to deploy your first strategy!
          </p>
        </div>
      ),
      placement: "center" as const,
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index } = data;
    const finishedStatuses = ["finished", "skipped"];

    if (type === "step:after") {
      const nextStep = steps[index + 1];
      if (nextStep && nextStep.target !== "body") {
        const element = document.querySelector(nextStep.target as string);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }

    if (finishedStatuses.includes(status)) {
      onFinish();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      scrollOffset={100}
      disableScrolling={false}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          arrowColor: "#18181b",
          backgroundColor: "#18181b",
          overlayColor: "rgba(0, 0, 0, 0.75)",
          primaryColor: "#10b981",
          textColor: "#ffffff",
          zIndex: 10000,
        },
        spotlight: {
          borderRadius: 12,
        },
        tooltip: {
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        },
        tooltipContainer: {
          textAlign: "left" as const,
        },
        buttonNext: {
          backgroundColor: "#10b981",
          borderRadius: 10,
          padding: "12px 24px",
          fontSize: 14,
          fontWeight: 600,
        },
        buttonBack: {
          color: "#a1a1aa",
          marginRight: 12,
        },
        buttonSkip: {
          color: "#71717a",
        },
        buttonClose: {
          color: "#71717a",
        },
      }}
      locale={{
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip Tour",
      }}
    />
  );
}
