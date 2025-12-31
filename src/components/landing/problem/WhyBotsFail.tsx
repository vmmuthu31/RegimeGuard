"use client";

import { AlertTriangle, TrendingDown, EyeOff, ZapOff } from "lucide-react";
import { motion } from "framer-motion";
import { PremiumFeatureCard } from "../features/PremiumFeatureCard";

const problems = [
  {
    icon: <ZapOff className="w-6 h-6" />,
    title: "Toxic Leverage",
    desc: "Retail bots max out leverage during spikes, leading to forced liquidations while the market is still healthy.",
  },
  {
    icon: <EyeOff className="w-6 h-6" />,
    title: "Black-Box Engine",
    desc: "Operating without explainability. When capital is lost, you have no technical data on why the machine failed.",
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: "Regime Blindness",
    desc: "The primary cause of failure. Attempting trend-following in chopping, ranging markets is a mathmatical death sentence.",
  },
  {
    icon: <TrendingDown className="w-6 h-6" />,
    title: "Drawdown Spirals",
    desc: "No automated kill-switches. These systems trade your account to zero during black swan events.",
  },
];

export const ProblemSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0B0E11]">
      <div className="container max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-red-500 font-mono text-[10px] font-black uppercase tracking-[0.4em]"
          >
            Systemic Failure Report
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter"
          >
            Why 95% of <span className="text-red-600">Trading Bots</span> Fail
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 text-lg font-medium leading-relaxed"
          >
            Traditional algorithms are engineered for static conditions. <br className="hidden md:block" />
            When the regime shifts, they become liabilities.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((item, index) => (
            <PremiumFeatureCard
              key={item.title}
              accentColor="red"
              variant="glitch"
              icon={item.icon}
              title={item.title}
              description={item.desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
