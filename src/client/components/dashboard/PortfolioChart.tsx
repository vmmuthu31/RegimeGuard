"use client";

import { useEffect, useRef, useMemo } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  AreaSeries,
  Time,
} from "lightweight-charts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface PortfolioChartProps {
  balance: number;
}

interface PerformanceDataPoint {
  time: Time;
  value: number;
}

function generatePerformanceData(baseValue: number): PerformanceDataPoint[] {
  const data: PerformanceDataPoint[] = [];
  let currentValue = baseValue * 0.98;
  const now = Math.floor(Date.now() / 1000);

  for (let i = 24; i >= 0; i--) {
    const time = (now - i * 3600) as Time;
    const volatility = baseValue * 0.002;
    const change = (Math.random() - 0.48) * volatility;
    currentValue = Math.max(currentValue + change, baseValue * 0.9);

    if (i === 0) currentValue = baseValue;
    data.push({ time, value: currentValue });
  }

  return data;
}

function calculateTrend(
  data: PerformanceDataPoint[],
  fallback: number
): "up" | "down" {
  const first = data[0]?.value || fallback;
  const last = data[data.length - 1]?.value || fallback;
  return last >= first ? "up" : "down";
}

export function PortfolioChart({ balance }: PortfolioChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  const performanceData = useMemo(
    () => generatePerformanceData(balance),
    [balance]
  );
  const trend = useMemo(
    () => calculateTrend(performanceData, balance),
    [performanceData, balance]
  );

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
      topColor:
        trend === "up" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)",
      bottomColor:
        trend === "up" ? "rgba(16, 185, 129, 0.0)" : "rgba(239, 68, 68, 0.0)",
      lineColor:
        trend === "up" ? "rgba(16, 185, 129, 0.8)" : "rgba(239, 68, 68, 0.8)",
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    areaSeries.setData(performanceData);

    chartRef.current = chart;
    seriesRef.current = areaSeries;

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: Math.max(chartContainerRef.current.clientHeight, 60),
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [performanceData, trend]);

  return (
    <div className="relative w-full h-full">
      <div ref={chartContainerRef} className="w-full h-full" />
      <div className="absolute bottom-1 right-2 flex items-center gap-1">
        {trend === "up" ? (
          <ArrowUpRight className="w-3 h-3 text-emerald-400" />
        ) : (
          <ArrowDownRight className="w-3 h-3 text-red-400" />
        )}
        <span
          className={`text-[9px] font-bold ${
            trend === "up" ? "text-emerald-400" : "text-red-400"
          }`}
        >
          24H
        </span>
      </div>
    </div>
  );
}
