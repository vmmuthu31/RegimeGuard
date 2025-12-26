"use client";

import React, { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  Time,
  CandlestickSeries,
} from "lightweight-charts";

interface CandleData {
  time: string | number; // Time or Unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandleChartProps {
  data: CandleData[];
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
  };
}

export function CandleChart({ data, colors }: CandleChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  // Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: colors?.backgroundColor || "transparent",
        },
        textColor: colors?.textColor || "#d4d4d8",
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.05)" },
        horzLines: { color: "rgba(255, 255, 255, 0.05)" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Valid v5 API usage: addSeries(CandlestickSeries, options)
    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981", // Emerald 500
      downColor: "#ef4444", // Red 500
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update Data
  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      const sortedData: CandlestickData<Time>[] = [...data]
        .sort((a, b) => Number(a.time) - Number(b.time))
        .map((d) => ({
          time: Number(d.time) as Time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }));

      seriesRef.current.setData(sortedData);
    }
  }, [data]);

  // Update Options (Colors)
  useEffect(() => {
    if (chartRef.current && colors) {
      chartRef.current.applyOptions({
        layout: {
          background: {
            type: ColorType.Solid,
            color: colors.backgroundColor || "transparent",
          },
          textColor: colors.textColor || "#d4d4d8",
        },
      });
    }
  }, [colors]);

  return (
    <div className="w-full h-[400px] relative">
      <div ref={chartContainerRef} className="w-full h-full" />
      {data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-500 bg-zinc-900/50 backdrop-blur-sm z-10">
          <span className="animate-pulse">Loading Market Data...</span>
        </div>
      )}
    </div>
  );
}
