"use client";

import React, { use, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { FaArrowLeft, FaBitcoin, FaEthereum, FaBolt, FaChevronDown } from "react-icons/fa";
import { SiSolana } from "react-icons/si";
import { Settings, Maximize2 } from "lucide-react";

import { useDashboardData, SYMBOLS } from "@/src/client/hooks/useDashboardData";
import { CandleChart } from "@/src/client/components/trade/CandleChart";
import { OrderForm } from "@/src/client/components/trade/OrderForm";
import { ActiveOrders, Order } from "@/src/client/components/trade/ActiveOrders";
import { TerminalPanel } from "@/src/client/components/dashboard/TerminalPanel";
import { DashboardHeader } from "@/src/client/components/dashboard/DashboardHeader";
import { OrderBook } from "@/src/client/components/trade/OrderBook";
import { formatPrice, formatPercent, formatVolume } from "@/src/shared/utils/formatters";

const IconMap: Record<string, React.ReactNode> = {
  BTC: <FaBitcoin />,
  ETH: <FaEthereum />,
  SOL: <SiSolana />,
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TradePage({ params }: PageProps) {
  const { id } = use(params);
  const { connected, tickers, klines, account, fetchKlineData, orders, fetchOrders, lastUpdate } = useDashboardData();

  const symbol = SYMBOLS.find(
    (s) => s.id.replace("cmt_", "") === id || s.id.replace("cmt_", "").replace("usdt", "") === id
  ) || SYMBOLS[0];

  const tickerData = tickers[symbol.id];
  const candleData = klines[symbol.id] || [];
  const formattedCandles = candleData.map((c) => ({
    time: Number(c.time),
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
  }));

  useEffect(() => {
    if (connected && candleData.length === 0) {
      void fetchKlineData(symbol.id);
    }
  }, [connected, symbol.id, fetchKlineData, candleData.length]);

  const mappedOrders: Order[] = orders.map((o) => ({
    id: o.orderId,
    time: new Date(parseInt(o.cTime)).toLocaleTimeString(),
    symbol: o.symbol,
    type: o.orderType?.toLowerCase() === "market" ? "Market" : "Limit",
    side: o.side === "buy" ? "Buy" : "Sell",
    price: o.price,
    amount: o.size,
    filled: o.filledQty || "0",
    status: "Open",
  }));

  const normalizeSymbol = (s: string) => s.toLowerCase().replace("cmt_", "").replace("/", "").replace("-", "");
  const currentSymbolOrders = mappedOrders.filter((o) => normalizeSymbol(o.symbol) === normalizeSymbol(symbol.id));

  const handlePlaceOrder = async (side: "Buy" | "Sell", price: string, amount: string) => {
    try {
      const response = await fetch("/api/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "placeOrder",
          symbol: symbol.id,
          size: amount,
          side: side.toLowerCase(),
          type: "market",
          price: "0",
        }),
      });
      if ((await response.json()).success) {
        toast.success(`${side} Order Placed for ${amount} ${symbol.name}`);
        setTimeout(() => fetchOrders(), 500);
      } else {
        toast.error("Order failed");
      }
    } catch {
      toast.error("Failed to place order");
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await fetch("/api/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancelOrder", orderId, clientOid: null }),
      });
      if ((await response.json()).success) {
        toast.info("Order Cancelled");
        setTimeout(() => fetchOrders(), 500);
      } else {
        toast.error("Cancel failed");
      }
    } catch {
      toast.error("Failed to cancel");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020202] text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-auto relative">
      {/* GLOBAL AMBIENCE LAYERS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Moving Light Beams */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[150px] rounded-full" />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        {/* Vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]" />
      </div>

      {/* 1. Common Dashboard Header (Compact) */}
      <div className="px-4 shrink-0 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 relative z-10">
        <DashboardHeader
          connected={connected}
          lastUpdate={lastUpdate}
          account={account}
          compact={true}
        />
      </div>

      {/* 2. Market Info Bar (New) */}
      <div className="h-14 border-b border-white/10 bg-zinc-950/90 backdrop-blur-xl flex items-center px-4 shrink-0 justify-between relative overflow-hidden sticky top-0 z-50 shadow-2xl">
        {/* Subtle Bottom Glow for Header */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-500/20 to-transparent" />

        <div className="flex items-center gap-6">
          {/* Symbol Selector Pill */}
          <div className="flex items-center gap-3 cursor-pointer hover:bg-white/[0.03] pl-2 pr-4 py-1.5 rounded-full border border-white/[0.05] bg-white/[0.01] transition-all group hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] active:scale-95">
            <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center text-emerald-500 shadow-inner group-hover:text-emerald-400 transition-colors">
              {IconMap[symbol.iconKey || "BTC"]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight uppercase">{symbol.name}</h1>
                <FaChevronDown className="w-2 h-2 text-zinc-600 group-hover:text-emerald-500/50 transition-colors" />
              </div>
            </div>
          </div>

          <div className="h-4 w-px bg-white/5 mx-1" />

          {/* Ticker Stats */}
          {tickerData && (
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <div className={`text-base font-bold font-mono leading-none tracking-tight ${parseFloat(tickerData.priceChangePercent) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  ${formatPrice(tickerData.lastPrice)}
                </div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-700 font-bold mt-1">Price Index</div>
              </div>
              <div className="flex flex-col">
                <div className={`text-xs font-bold font-mono leading-none ${parseFloat(tickerData.priceChangePercent) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {parseFloat(tickerData.priceChangePercent) >= 0 ? "+" : ""}{formatPercent(tickerData.priceChangePercent)}
                </div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-700 font-bold mt-1">24h Volatility</div>
              </div>
              <div className="hidden md:flex flex-col">
                <div className="text-xs font-mono text-zinc-400 leading-none">{formatPrice(tickerData.high)}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-800 font-bold mt-1">Daily High</div>
              </div>
              <div className="hidden md:flex flex-col">
                <div className="text-xs font-mono text-zinc-400 leading-none">{formatPrice(tickerData.low)}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-800 font-bold mt-1">Daily Low</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 relative z-10">
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-white/[0.05] text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all active:scale-95 group">
            <FaArrowLeft className="w-2.5 h-2.5 transition-transform group-hover:-translate-x-0.5" /> Back
          </Link>
          <div className="flex bg-zinc-900/80 rounded-lg p-0.5 border border-white/5 shadow-inner">
            <button className="p-1.5 hover:bg-white/5 rounded-md text-zinc-500 hover:text-zinc-200 transition-colors">
              <Settings className="w-3.5 h-3.5" />
            </button>
            <div className="w-px bg-white/5 my-1.5" />
            <button className="p-1.5 hover:bg-white/5 rounded-md text-zinc-500 hover:text-zinc-200 transition-colors">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[1920px] mx-auto p-0 gap-[1px] flex flex-col lg:flex-row font-sans bg-zinc-800/80">
        {/* LEFT & CENTER COMBINED CONTAINER (For Active Orders spanning both) */}
        <div className="flex-1 flex flex-col gap-[1px] min-w-0 bg-zinc-900/10">

          {/* TOP SECTION: Chart and Order Book side by side */}
          <div className="flex flex-col lg:flex-row gap-0 bg-[#050505] border-b border-white/10">
            {/* COLUMN 1: Chart Area */}
            <div className="flex-1 flex flex-col bg-[#050505] min-w-0 border-r border-white/10 relative group/chart">
              {/* Vertical Neon Divider */}
              <div className="absolute right-[-1px] top-0 bottom-0 w-px bg-linear-to-b from-transparent via-emerald-500/30 to-transparent z-20 group-hover/chart:via-emerald-500/60 transition-all duration-700" />

              <TerminalPanel
                className="h-[400px] border-0 rounded-none bg-zinc-900/5 backdrop-blur-xl relative overflow-hidden group"
                title="Global Liquidity Graph"
                headerAction={<div className="flex gap-2"><div className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></div><span className="text-[10px] text-emerald-400 font-bold tracking-wider">REALTIME</span></div>}
                noPadding
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.05),transparent_70%)] pointer-events-none" />
                <div className="absolute inset-0 pb-8 overflow-hidden">
                  <CandleChart data={formattedCandles} />
                </div>
              </TerminalPanel>
            </div>

            {/* COLUMN 2: Order Book */}
            <div className="w-full lg:w-[340px] flex flex-col bg-[#050505] shrink-0 relative group/book">
              <TerminalPanel
                className="h-[400px] border-0 rounded-none bg-zinc-900/5 backdrop-blur-xl relative overflow-hidden group"
                title="Order Depth"
                noPadding
                autoHeight={false}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(249,115,22,0.03),transparent_50%)] pointer-events-none" />
                <div className="h-full">
                  <OrderBook tickerData={tickerData} symbol={symbol.name} />
                </div>
              </TerminalPanel>
            </div>
          </div>

          {/* SHARED BOTTOM SECTION: Active Execution Pipeline (Spans both columns) */}
          <div className="relative z-0 min-h-[400px] bg-[#020202]">
            {/* Horizontal Neon Divider */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-500/20 to-transparent z-20" />

            <TerminalPanel
              className="min-h-[400px] border-0 rounded-none bg-zinc-900/[0.02] backdrop-blur-md relative overflow-visible group"
              title="Active Execution Pipeline"
              noPadding
              autoHeight={true}
            >
              <div className="h-full overflow-visible">
                <ActiveOrders orders={currentSymbolOrders} onCancelOrder={handleCancelOrder} />
              </div>
            </TerminalPanel>
          </div>
        </div>

        {/* COLUMN 3: Quick Order (Right Hand Sidebar) */}
        <div className="w-full lg:w-[380px] flex flex-col gap-0 shrink-0 bg-[#050505] border-l border-white/10">
          {/* Order Form - Sticky */}
          <div className="sticky top-14 z-40 bg-[#050505] h-fit">
            <div className="bg-[#050505] neon-highlight-emerald transition-all duration-500">
              <OrderForm
                symbol={symbol.name}
                currentPrice={tickerData?.lastPrice ? formatPrice(tickerData.lastPrice) : "0.00"}
                balance={account?.balance.available.toLocaleString() || "0"}
                onPlaceOrder={handlePlaceOrder}
              />
            </div>

            {/* Auxiliary Info / Stats under Form */}
            <div className="p-4 bg-[#050505] border-t border-white/10">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Network Status</span>
                  <span className="text-[10px] text-emerald-500 font-mono font-bold">OPTIMAL</span>
                </div>
                <div className="h-[2px] w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-emerald-500/40" />
                </div>
              </div>
            </div>
          </div>
          {/* Fill the remaining column space with the same background */}
          <div className="flex-1 bg-[#050505]" />
        </div>
      </div>

    </div>
  );
}
