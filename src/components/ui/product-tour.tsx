"use client";

import React from "react";
import Joyride, { Step, CallBackProps, STATUS, EVENTS } from "react-joyride";

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
                    <h3 className="text-xl font-bold text-white">Welcome to RegimeGuard! 🚀</h3>
                    <p className="text-zinc-300">
                        Let me show you how our AI-powered trading system works. This quick tour will explain the Neural Core, Risk Engine, and our proven performance metrics.
                    </p>
                    <p className="text-zinc-400 text-sm">Click "Next" to begin the tour.</p>
                </div>
            ),
            placement: "center",
            disableBeacon: true,
        },
        {
            target: "#hero-section",
            content: (
                <div className="space-y-2">
                    <h4 className="font-bold text-white">AI Trading Platform</h4>
                    <p className="text-zinc-300 text-sm">
                        RegimeGuard uses institutional-grade AI to adapt to market conditions in real-time, maximizing returns while protecting your capital.
                    </p>
                </div>
            ),
            placement: "bottom",
        },
        {
            target: "#stats-ticker",
            content: (
                <div className="space-y-2">
                    <h4 className="font-bold text-white">Live System Status</h4>
                    <p className="text-zinc-300 text-sm">
                        Monitor real-time metrics: current market regime, risk exposure, drawdown protection, and API latency. These update continuously as the system operates.
                    </p>
                </div>
            ),
            placement: "bottom",
        },
        {
            target: "#neural-core",
            content: (
                <div className="space-y-2">
                    <h4 className="font-bold text-white">The Neural Core 🧠</h4>
                    <p className="text-zinc-300 text-sm">
                        This is the heart of RegimeGuard. Watch how data flows through our 4-stage pipeline: Data Ingestion → Regime Classification → Risk Validation → Smart Execution.
                    </p>
                    <p className="text-emerald-400 text-xs font-mono">
                        💡 Hover over each step to see it in action!
                    </p>
                </div>
            ),
            placement: "top",
        },
        {
            target: "#performance",
            content: (
                <div className="space-y-2">
                    <h4 className="font-bold text-white">Proven Performance 📊</h4>
                    <p className="text-zinc-300 text-sm">
                        Real metrics from our live trading engine on WEEX: 68.4% win rate, 8.2% max drawdown, 2.14 Sharpe ratio, and +1.8% average trade.
                    </p>
                    <p className="text-zinc-400 text-xs">All verified and transparent.</p>
                </div>
            ),
            placement: "top",
        },
        {
            target: "#multi-agent",
            content: (
                <div className="space-y-2">
                    <h4 className="font-bold text-white">Multi-Agent System 🤖</h4>
                    <p className="text-zinc-300 text-sm">
                        Four specialized AI agents work together: Regime Agent classifies markets, Risk Agent controls exposure, Volatility Agent detects anomalies, and Strategy Agent generates signals.
                    </p>
                    <p className="text-purple-400 text-xs">
                        Every trade requires consensus from all agents.
                    </p>
                </div>
            ),
            placement: "top",
        },
        {
            target: "body",
            content: (
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white">You're All Set! ✨</h3>
                    <p className="text-zinc-300">
                        You now understand how RegimeGuard's AI trading system works. Ready to see it in action?
                    </p>
                    <p className="text-emerald-400 text-sm font-semibold">
                        Click "Start Trading" to deploy your first strategy!
                    </p>
                </div>
            ),
            placement: "center",
        },
    ];

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, type } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

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
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    arrowColor: "#18181b",
                    backgroundColor: "#18181b",
                    overlayColor: "rgba(0, 0, 0, 0.7)",
                    primaryColor: "#10b981",
                    textColor: "#ffffff",
                    zIndex: 10000,
                },
                tooltip: {
                    borderRadius: 12,
                    padding: 20,
                },
                tooltipContainer: {
                    textAlign: "left",
                },
                buttonNext: {
                    backgroundColor: "#10b981",
                    borderRadius: 8,
                    padding: "10px 20px",
                    fontSize: 14,
                    fontWeight: 600,
                },
                buttonBack: {
                    color: "#a1a1aa",
                    marginRight: 10,
                },
                buttonSkip: {
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
