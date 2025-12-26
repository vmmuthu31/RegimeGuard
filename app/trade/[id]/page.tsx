"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { FaArrowLeft, FaBitcoin, FaEthereum, FaBolt } from "react-icons/fa";
import { SiSolana } from "react-icons/si";
import { useDashboardData, SYMBOLS } from "@/src/client/hooks/useDashboardData";
import { CandleChart } from "@/src/client/components/trade/CandleChart";
import { OrderForm } from "@/src/client/components/trade/OrderForm";
import {
  ActiveOrders,
  Order,
} from "@/src/client/components/trade/ActiveOrders";
import { DashboardHeader } from "@/src/client/components/dashboard/DashboardHeader";
import { formatPrice, formatPercent } from "@/src/shared/utils/formatters";

const IconMap: Record<string, React.ReactNode> = {
  BTC: <FaBitcoin />,
  ETH: <FaEthereum />,
  SOL: <SiSolana />,
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TradePage({ params }: PageProps) {
  // Unwrap params
  const { id } = use(params);

  const { connected, tickers, klines, lastUpdate, account, fetchKlineData } =
    useDashboardData();

  const [orders, setOrders] = useState<Order[]>([]);

  // Map generic ID (btc) or full ID (btcusdt) to full symbol object
  const symbol =
    SYMBOLS.find(
      (s) =>
        s.id.replace("cmt_", "") === id ||
        s.id.replace("cmt_", "").replace("usdt", "") === id
    ) || SYMBOLS[0];

  const tickerData = tickers[symbol.id];
  const candleData = klines[symbol.id] || [];

  // Format candle data for chart
  const formattedCandles = candleData.map((c) => ({
    time: Number(c.time),
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
  }));

  // Ensure we fetch initial klines if empty
  useEffect(() => {
    if (connected && candleData.length === 0) {
      void fetchKlineData(symbol.id);
    }
  }, [connected, symbol.id, fetchKlineData, candleData.length]);

  const handlePlaceOrder = (
    side: "Buy" | "Sell",
    price: string,
    amount: string
  ) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString(),
      symbol: symbol.name,
      type: "Market",
      side,
      price: price || "Market",
      amount,
      filled: "0%",
      status: "Open",
    };

    setOrders((prev) => [newOrder, ...prev]);
    toast.success(`${side} Order Placed for ${amount} ${symbol.name}`);
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    toast.info("Order Cancelled");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden selection:bg-emerald-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-4000" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6 relative z-10">
        <DashboardHeader
          connected={connected}
          lastUpdate={lastUpdate}
          account={account}
        />

        {/* Breadcrumb / Back */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 py-1.5 px-3 rounded-lg"
          >
            <FaArrowLeft className="w-3 h-3" />
            Back to Dashboard
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-sm">Trade</span>
            <span className="text-zinc-700 text-sm">/</span>
            <span className="text-white font-bold text-sm tracking-wide">
              {symbol.name}
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6 pb-20">
          {/* Left Column: Chart & Info (8/12) */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* Ticker Header */}
            <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-inner"
                  style={{
                    backgroundColor: `${symbol.color}15`,
                    color: symbol.color,
                  }}
                >
                  {symbol.iconKey ? IconMap[symbol.iconKey] : <FaBolt />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {symbol.name}
                    </h2>
                    <span className="text-xs bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-white/5">
                      PERP
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs font-mono mt-0.5">
                    {symbol.id}
                  </p>
                </div>
              </div>

              {tickerData && (
                <div className="flex items-center gap-8 text-right">
                  <div>
                    <div className="text-2xl font-bold text-white font-mono">
                      ${formatPrice(tickerData.lastPrice)}
                    </div>
                    <div
                      className={`text-xs font-bold ${
                        parseFloat(tickerData.priceChangePercent) >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {parseFloat(tickerData.priceChangePercent) >= 0
                        ? "+"
                        : ""}
                      {formatPercent(tickerData.priceChangePercent)}
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-zinc-500 text-xs mb-0.5">24h High</div>
                    <div className="font-mono text-sm text-zinc-300">
                      {formatPrice(tickerData.high)}
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-zinc-500 text-xs mb-0.5">24h Low</div>
                    <div className="font-mono text-sm text-zinc-300">
                      {formatPrice(tickerData.low)}
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-zinc-500 text-xs mb-0.5">
                      24h Volume
                    </div>
                    <div className="font-mono text-sm text-zinc-300">
                      {parseFloat(tickerData.value).toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chart Area */}
            <div className="bg-[#121214] border border-white/5 rounded-2xl p-1 overflow-hidden h-[500px]">
              <CandleChart data={formattedCandles} />
            </div>

            {/* Active Orders */}
            <ActiveOrders orders={orders} onCancelOrder={handleCancelOrder} />
          </div>

          {/* Right Column: Order Form (4/12) */}
          <div className="col-span-12 lg:col-span-3">
            <div className="sticky top-6 h-[calc(100vh-100px)]">
              <OrderForm
                symbol={symbol.name}
                currentPrice={
                  tickerData?.lastPrice
                    ? formatPrice(tickerData.lastPrice)
                    : "0.00"
                }
                balance={account?.balance.available.toLocaleString() || "0.00"}
                onPlaceOrder={handlePlaceOrder}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
