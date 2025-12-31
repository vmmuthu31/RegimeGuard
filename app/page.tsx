"use client";

import { LandingTour } from "@/src/components/landing/tour/LandingTour";
import { Hero } from "@/src/components/landing/hero/Hero";
import { ProblemSection } from "@/src/components/landing/problem/WhyBotsFail";
import { RiskEngineFeature } from "@/src/components/landing/features/RiskEngine";
import { FinalCTA } from "@/src/components/landing/cta/FinalCTA";
import { NoiseOverlay } from "@/components/landing-utils";
import { Navbar } from "@/src/components/landing/layout/Navbar";
import { Footer } from "@/src/components/landing/layout/Footer";

export default function LandingPage() {
  return (
    <main className="bg-[#0B0E11] min-h-screen text-white selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Interactive Tour Guide */}
      <LandingTour />

      {/* Premium Texture Layer */}
      <NoiseOverlay />

      <Navbar />
      <Hero />
      <ProblemSection />
      <RiskEngineFeature />
      <FinalCTA />
      <Footer />
    </main>
  );
}
