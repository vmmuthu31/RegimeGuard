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

    const containerHeight = Math.max(
      chartContainerRef.current.clientHeight,
      60
    );
    const containerWidth = chartContainerRef.current.clientWidth;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "transparent",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      width: containerWidth,
      height: containerHeight,
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
    <div className="relative h-full min-h-[180px]">
      {/* Chart fills the container */}
      <div className="absolute inset-0">
        <div ref={chartContainerRef} className="w-full h-full" />
      </div>

      {/* Minimal overlay with just the percentage change */}
      <div className="absolute bottom-4 left-4 z-10">
        <div
          className={`flex items-center gap-1.5 text-sm font-bold ${
            percentageChange >= 0 ? "text-emerald-400" : "text-red-400"
          } bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10`}
        >
          <ArrowUpRight
            className={`w-4 h-4 ${percentageChange < 0 ? "rotate-90" : ""}`}
          />
          {percentageChange >= 0 ? "+" : ""}
          {percentageChange.toFixed(2)}%
          <span className="text-zinc-500 font-normal ml-1">24h</span>
        </div>
      </div>
    </div>
  );
}
