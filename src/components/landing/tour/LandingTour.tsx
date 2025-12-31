"use client";

import { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

const TOUR_STEPS: Step[] = [
  {
    target: "body",
    content: (
      <div className="space-y-2">
        <h3 className="font-bold text-lg text-emerald-500">Welcome to RegimeGuard</h3>
        <p className="text-zinc-600">The first AI trading platform that prioritizes capital protection over speculation.</p>
      </div>
    ),
    placement: "center",
  },
  {
    target: ".landing-tour-hero-text",
    content: (
      <div className="space-y-2">
        <h3 className="font-bold text-emerald-600">Institutional Logic</h3>
        <p>Our engine manages exposure and volatility automatically, ensuring your capital is protected 24/7.</p>
      </div>
    ),
  },
  {
    target: ".landing-tour-risk-panel",
    content: (
      <div className="space-y-2">
        <h3 className="font-bold text-emerald-600">The Brain</h3>
        <p>This is the Live Risk Intelligence Panel. It monitors regimes, calculates optimal exposure, and activates guards in real-time.</p>
      </div>
    ),
  },
  {
    target: ".landing-tour-cta",
    content: (
      <div className="space-y-2">
        <h3 className="font-bold text-emerald-600">Ready for Control?</h3>
        <p>Access the dashboard, connect your WEEX account, and let the AI manage the risk.</p>
      </div>
    ),
  },
];

export const LandingTour = () => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Check if user has seen tour
    const hasSeenTour = localStorage.getItem("regimeguard_tour_complete");
    if (!hasSeenTour) {
      // Small delay to let animations finish
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
      showSkipButton
      showProgress
      callback={handleJoyrideCallback}
      styles={{
        options: {
          arrowColor: "#10b981",
          backgroundColor: "#fff",
          overlayColor: "rgba(11, 14, 17, 0.8)",
          primaryColor: "#10b981",
          textColor: "#333",
          zIndex: 1000,
        },
        buttonClose: {
          display: 'none',
        },
      }}
    />
  );
};
