"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { FaArrowLeft } from "react-icons/fa";
import { Settings, Maximize2 } from "lucide-react";

import { useDashboardData, SYMBOLS } from "@/src/client/hooks/useDashboardData";
import { CandleChart } from "@/src/client/components/trade/CandleChart";
import { OrderForm } from "@/src/client/components/trade/OrderForm";
import {
  ActiveOrders,
  Order,
} from "@/src/client/components/trade/ActiveOrders";
import { TerminalPanel } from "@/src/client/components/dashboard/TerminalPanel";
import { DashboardHeader } from "@/src/client/components/dashboard/DashboardHeader";
import { MarketSwitcher } from "@/src/client/components/trade/MarketSwitcher";
import { OrderBook } from "@/src/client/components/trade/OrderBook";
import { formatPrice, formatPercent } from "@/src/shared/utils/formatters";
import { cn } from "@/src/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TradePage({ params }: PageProps) {
  const { id } = use(params);
  const {
    connected,
    tickers,
    klines,
    account,
    fetchKlineData,
    orders,
    fetchOrders,
    lastUpdate,
  } = useDashboardData();

  const symbol =
    SYMBOLS.find(
      (s) =>
        s.id.replace("cmt_", "") === id ||
        s.id.replace("cmt_", "").replace("usdt", "") === id
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

  const normalizeSymbol = (s: string) =>
    s.toLowerCase().replace("cmt_", "").replace("/", "").replace("-", "");
  const currentSymbolOrders = mappedOrders.filter(
    (o) => normalizeSymbol(o.symbol) === normalizeSymbol(symbol.id)
  );

  const handlePlaceOrder = async (
    side: "Buy" | "Sell",
    price: string,
    amount: string
  ) => {
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
        body: JSON.stringify({
          action: "cancelOrder",
          orderId,
          clientOid: null,
        }),
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
    <div className="flex flex-col min-h-screen bg-[#020202] text-zinc-100 font-sans selection:bg-emerald-500/30 relative overflow-x-hidden">
      {/* GLOBAL AMBIENCE LAYERS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Moving Light Beams */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[150px] rounded-full" />

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]" />
      </div>

      {/* 0. Dashboard Header (Restored) */}
      <div className="px-4 shrink-0 bg-zinc-950/80 backdrop-blur-xl border-b border-white/20 relative z-[110] shadow-2xl">
        <DashboardHeader
          connected={connected}
          lastUpdate={lastUpdate}
          account={account}
          compact={true}
        />
      </div>

      <div className="flex-1 w-full max-w-[1920px] mx-auto flex flex-col lg:flex-row bg-[#0B0E11] gap-[1px] relative">
        {/* LEFT & CENTER COMBINED CONTAINER */}
        <div className="flex-1 flex flex-col gap-[1px] bg-zinc-800/20">
          {/* 1. Market Info Bar (Refined with Glow) - NOW INSIDE LEFT COL */}
          <div className="flex items-center h-14 bg-zinc-950/40 backdrop-blur-2xl border-b border-white/20 px-4 gap-8 text-[11px] shrink-0 sticky top-0 z-[90] shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            {/* Subtle Bottom Glow Line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-linear-to-r from-transparent via-emerald-500/30 to-transparent" />

            <MarketSwitcher currentSymbol={symbol.name} />
            <div className="h-4 w-px bg-white/20 hidden md:block" />
            {tickerData && (
              <div className="flex items-center gap-8 overflow-hidden">
                <div className="flex flex-col group/price">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter mb-0.5 group-hover/price:text-emerald-500/80 transition-colors">Mark Price</span>
                  <span className={cn("text-[11px] font-mono font-bold tracking-tight transition-all duration-300", parseFloat(tickerData.priceChangePercent) >= 0 ? "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]" : "text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.4)]")}>
                    {formatPrice(tickerData.lastPrice)}
                  </span>
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter mb-0.5">24h Change</span>
                  <span className={cn("text-[11px] font-mono font-bold tracking-tight", parseFloat(tickerData.priceChangePercent) >= 0 ? "text-emerald-500" : "text-red-500")}>
                    {formatPercent(tickerData.priceChangePercent)}
                  </span>
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter mb-0.5">24h High</span>
                  <span className="text-[11px] font-mono font-bold tracking-tight text-white">
                    {formatPrice(tickerData.high)}
                  </span>
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter mb-0.5">24h Low</span>
                  <span className="text-[11px] font-mono font-bold tracking-tight text-white">
                    {formatPrice(tickerData.low)}
                  </span>
                </div>
                <div className="hidden lg:flex flex-col">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter mb-0.5">Funding / Countdown</span>
                  <span className="text-[11px] font-mono font-bold tracking-tight text-zinc-300 uppercase">
                    0.0100% / 06:42:12
                  </span>
                </div>
              </div>
            )}
          </div>
          {/* Top Level: Chart and Order Book */}
          <div className="flex flex-col lg:flex-row h-[550px] gap-[1px] bg-zinc-800/40">
            {/* Chart Column */}
            <div className="flex-1 flex flex-col border-r border-white/20 h-full relative group/chart overflow-hidden">
              {/* Neon Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0 opacity-100 transition-opacity" />

              <div className="flex items-center gap-6 px-4 py-2 border-b border-white/20 bg-zinc-950/40 text-[10px] font-bold text-zinc-400 uppercase tracking-widest relative">
                <div className="text-white border-b-2 border-emerald-500 pb-2 -mb-2 transition-all shadow-[0_8px_15px_rgba(16,185,129,0.4)]">Regime Analysis</div>
                <div className="hover:text-zinc-300 transition-colors cursor-pointer">Risk Metrics</div>
                <div className="hover:text-zinc-300 transition-colors cursor-pointer">Neural Feed</div>
                <div className="hover:text-zinc-300 transition-colors cursor-pointer">Execution Logs</div>
              </div>
              <div className="flex-1 relative overflow-hidden bg-zinc-900/10">
                <CandleChart data={formattedCandles} />
              </div>
            </div>

            {/* Order Book Column - Height matched to Chart */}
            <div className="w-full lg:w-[300px] shrink-0 h-full relative group/book bg-[#0B0E11]/60 overflow-hidden">
              {/* Neon Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0 opacity-100 transition-opacity" />
              <OrderBook tickerData={tickerData} symbol={symbol.name} />
            </div>
          </div>

          {/* Bottom Panel: Positions/Orders - Grows naturally */}
          <div className="flex-1 flex flex-col min-h-[500px] bg-[#0B0E11] relative group/bottom">
            {/* Neon Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0 opacity-100 transition-opacity" />

            <div className="flex items-center justify-between px-4 border-b border-white/20 bg-zinc-950/60 sticky top-0 z-10 backdrop-blur-md">
              <div className="flex gap-6 text-[10px] font-bold text-zinc-400 uppercase tracking-tight py-3">
                <div className="text-white border-b-2 border-emerald-500 pb-3 -mb-3 transition-all cursor-pointer shadow-[0_8px_15px_rgba(16,185,129,0.4)]">Active Vaults (0)</div>
                <div className="hover:text-zinc-200 transition-colors cursor-pointer">Signal History (0)</div>
                <div className="hover:text-zinc-200 transition-colors cursor-pointer">Risk Protections</div>
                <div className="hover:text-zinc-200 transition-colors cursor-pointer">Account Exposure</div>
              </div>
              <div className="flex items-center gap-4">
                <button className="px-3 py-1 rounded bg-zinc-900 border border-white/20 text-[10px] font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all uppercase shadow-[0_0_15px_rgba(255,255,255,0.05)]">Emergency Close</button>
              </div>
            </div>
            <div className="flex-1 bg-zinc-900/5">
              <ActiveOrders
                orders={currentSymbolOrders}
                onCancelOrder={handleCancelOrder}
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Order Form Sidebar */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col bg-[#0B0E11] relative border-l border-white/20 group/sidebar overflow-hidden shadow-2xl">
          {/* Glassy Background Surface */}
          <div className="absolute inset-0 bg-zinc-950/40 pointer-events-none" />

          <div className="sticky top-0 z-40 transition-all duration-700">
            {/* Neon Glow around Form on hover */}
            <div className="absolute inset-[-20px] bg-emerald-500/5 blur-3xl opacity-0 group-hover/sidebar:opacity-100 transition-opacity pointer-events-none" />
            <OrderForm
              symbol={symbol.name}
              currentPrice={tickerData?.lastPrice ? formatPrice(tickerData.lastPrice) : "0.00"}
              balance={account?.balance.available.toLocaleString() || "0"}
              onPlaceOrder={handlePlaceOrder}
              connected={connected}
            />
          </div>
        </div>
      </div>

      {/* Footer / Status Bar (Enhanced with Glow) */}
      <div className="h-8 bg-[#0B0E11] border-t border-white/5 flex items-center justify-between px-4 text-[9px] font-bold text-zinc-600 uppercase tracking-widest relative z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-500/80 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[4px] animate-pulse opacity-50" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 relative" />
            </div>
            Intelligence Feed Stable
          </div>
          <div className="flex items-center gap-1.5 group cursor-pointer">
            <span className="text-zinc-800">|</span>
            <span className="text-zinc-500 group-hover:text-emerald-500/80 transition-colors uppercase">RegimeGuard Mainnet-1</span>
            <span className="text-emerald-500/60 font-mono">Synced</span>
          </div>
        </div>
        <div className="flex items-center gap-5 text-zinc-700">
          <div className="flex items-center gap-2 hover:text-emerald-500 transition-colors cursor-pointer">
            <div className="w-1 h-1 rounded-full bg-emerald-500" />
            Network-2 <span className="font-mono text-[8px] text-zinc-800">12ms</span>
          </div>
          <Settings className="w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors" />
          <Maximize2 className="w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
}
