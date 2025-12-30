"use client";
import React, { FC, useEffect, useRef } from "react";
import "./styles/dynamic-card.css";

interface IFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface IProps {
  normalTitle: string;
  colorfulTitle: string;
  description: string;
  buttonText: string;
  features?: IFeature[];
}

const DynamicCard: FC<IProps> = ({
  normalTitle,
  colorfulTitle,
  description,
  buttonText,
  features = [],
}) => {
  const topRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animateBorder = () => {
      const now = Date.now() / 1000;
      const speed = 0.5;

      const topX = Math.sin(now * speed) * 100;
      const rightY = Math.cos(now * speed) * 100;
      const bottomX = Math.sin(now * speed + Math.PI) * 100;
      const leftY = Math.cos(now * speed + Math.PI) * 100;

      if (topRef.current)
        topRef.current.style.transform = `translateX(${topX}%)`;
      if (rightRef.current)
        rightRef.current.style.transform = `translateY(${rightY}%)`;
      if (bottomRef.current)
        bottomRef.current.style.transform = `translateX(${bottomX}%)`;
      if (leftRef.current)
        leftRef.current.style.transform = `translateY(${leftY}%)`;

      requestAnimationFrame(animateBorder);
    };

    const animationId = requestAnimationFrame(animateBorder);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="relative w-full bg-zinc-950/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 overflow-hidden shadow-2xl">
      {/* Animated border elements */}
      <div className="absolute top-0 left-0 w-full h-0.5 overflow-hidden">
        <div
          ref={topRef}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"
        ></div>
      </div>

      <div className="absolute top-0 right-0 w-0.5 h-full overflow-hidden">
        <div
          ref={rightRef}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent"
        ></div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-0.5 overflow-hidden">
        <div
          ref={bottomRef}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"
        ></div>
      </div>

      <div className="absolute top-0 left-0 w-0.5 h-full overflow-hidden">
        <div
          ref={leftRef}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent"
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          <span className="text-white">{normalTitle}</span>{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-transparent bg-clip-text">
            {colorfulTitle}
          </span>
        </h1>

        <p className="text-zinc-400 max-w-xl mx-auto mb-10">{description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.length > 0
            ? features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-5 border border-white/5 hover:border-emerald-500/30 transition-all text-left group"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 flex items-center justify-center mr-4 border border-white/5 group-hover:border-emerald-500/30">
                      <div className="text-emerald-400">{feature.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-zinc-500 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            : [1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-4 border border-white/5 hover:border-emerald-500/30 transition-all text-left"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mr-3">
                      <span className="text-emerald-400">{item}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Feature {item}</h3>
                      <p className="text-sm text-zinc-500">
                        Description of feature
                      </p>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        <button className="mt-10 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold py-3.5 px-10 rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] hover:shadow-emerald-500/40">
          {buttonText}
        </button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-emerald-500/5 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-cyan-500/5 blur-3xl"></div>
    </div>
  );
};

export default DynamicCard;
