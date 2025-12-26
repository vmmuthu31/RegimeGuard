"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  AreaSeries,
  Time,
} from "lightweight-charts";
import CountUp from "react-countup";
import { ArrowUpRight } from "lucide-react";

interface PortfolioChartProps {
  balance: number;
}

export function PortfolioChart({ balance }: PortfolioChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const [percentageChange, setPercentageChange] = useState(2.4); // Mock initial

  // Mock Data Generator
  // In a real app, this would come from historical equity snapshots
  const generateMockData = (baseValue: number) => {
    const data = [];
    let currentValue = baseValue * 0.95; // Start slightly lower
    const now = Math.floor(Date.now() / 1000);

    // Generate 50 points ending at current time
    for (let i = 50; i >= 0; i--) {
      const time = (now - i * 3600) as Time; // Hourly points
      // Random walk
      const change = (Math.random() - 0.45) * (baseValue * 0.005);
      currentValue += change;

      // Ensure the last point matches current balance roughly, or just let it flow
      if (i === 0) currentValue = baseValue;

      data.push({ time, value: currentValue });
    }
    return data;
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "transparent", // Hide axis labels for cleaner look
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      width: chartContainerRef.current.clientWidth,
      height: 160,
      rightPriceScale: {
        visible: false,
        borderVisible: false,
      },
      timeScale: {
        visible: false,
        borderVisible: false,
      },
      handleScale: false,
      handleScroll: false,
      crosshair: {
        vertLine: { visible: false, labelVisible: false },
        horzLine: { visible: false, labelVisible: false },
      },
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      topColor: "rgba(16, 185, 129, 0.2)", // Emerald/Green tint
      bottomColor: "rgba(16, 185, 129, 0.0)",
      lineColor: "#10b981",
      lineWidth: 2,
    });

    const data = generateMockData(balance);
    areaSeries.setData(data);

    // Calculate mock 24h change based on first and last
    if (data.length > 0) {
      const first = data[0].value;
      const last = data[data.length - 1].value;
      const pct = ((last - first) / first) * 100;
      setPercentageChange(pct);
    }

    chart.timeScale().fitContent();

    chartRef.current = chart;
    seriesRef.current = areaSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update chart if balance changes significantly
  useEffect(() => {
    if (seriesRef.current && balance > 0) {
      // Regenerate data to end at new balance
      const newData = generateMockData(balance);
      seriesRef.current.setData(newData);
      chartRef.current?.timeScale().fitContent();
    }
  }, [balance]);

  return (
    <div className="relative bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden group h-full min-h-[180px]">
      {/* Background Gradient Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="absolute inset-0 z-0 opacity-50">
        <div ref={chartContainerRef} className="w-full h-full" />
      </div>

      <div className="relative z-10 p-6 flex flex-col justify-between h-full pointer-events-none">
        <div>
          <h3 className="text-zinc-400 text-sm font-medium mb-1 flex items-center gap-2">
            Total Balance
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white tracking-tight">
              $
              <CountUp
                end={balance}
                separator=","
                decimals={2}
                duration={2.5}
                preserveValue={true}
              />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <div
            className={`flex items-center gap-1 text-sm font-bold ${
              percentageChange >= 0 ? "text-emerald-400" : "text-red-400"
            } bg-black/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/5`}
          >
            <ArrowUpRight className="w-4 h-4" />
            {percentageChange.toFixed(2)}%
          </div>
          <span className="text-xs text-zinc-500 font-medium">
            +$1,240.50 (24h)
          </span>
        </div>
      </div>
    </div>
  );
}
