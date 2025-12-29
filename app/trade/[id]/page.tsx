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
    <div className="flex flex-col min-h-screen bg-[#07080A] text-zinc-100 font-sans selection:bg-emerald-500/30 relative">
      {/* 0. Global Navigation Header (Consolidated) */}
      <header className="h-14 bg-[#0B0E11] border-b border-white/5 flex items-center px-4 justify-between select-none shrink-0 relative z-[100] sticky top-0 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <span className="text-zinc-950 font-black text-xl">R</span>
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">Regime<span className="text-emerald-500">Guard</span></span>
          </div>
          <nav className="hidden lg:flex items-center gap-6 text-[11px] font-bold text-zinc-400 uppercase tracking-wider mt-1">
            <span className="text-emerald-400 border-b-2 border-emerald-500 pb-4 mt-2 transition-all cursor-pointer">Intelligence</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terminal</span>
            <span className="hover:text-white transition-colors cursor-pointer">Vaults</span>
            <span className="hover:text-white transition-colors cursor-pointer">Governance</span>
            <div className="flex items-center gap-2 text-emerald-400 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[10px]">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Risk Shield Active
            </div>
          </nav>
        </div>
        <div className="flex items-center gap-5 text-zinc-400 text-[11px] font-bold uppercase">
          <button className="bg-emerald-500 text-zinc-950 px-5 py-2 rounded-lg text-[10px] font-black hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)]">Connect Protocol</button>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-white transition-colors">Settings</Link>
          </div>
        </div>
      </header>

      {/* 1. Market Info Bar */}
      <div className="flex items-center h-14 bg-[#0B0E11] border-b border-white/5 px-4 gap-8 text-[11px] shrink-0 sticky top-14 z-[90] backdrop-blur-sm">
        <MarketSwitcher currentSymbol={symbol.name} />
        <div className="h-4 w-px bg-white/10 hidden md:block" />
        {tickerData && (
          <div className="flex items-center gap-8 overflow-hidden">
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter mb-0.5">Mark Price</span>
              <span className={cn("text-[11px] font-mono font-bold tracking-tight", parseFloat(tickerData.priceChangePercent) >= 0 ? "text-emerald-400" : "text-red-400")}>
                {formatPrice(tickerData.lastPrice)}
              </span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter mb-0.5">24h Change</span>
              <span className={cn("text-[11px] font-mono font-bold tracking-tight", parseFloat(tickerData.priceChangePercent) >= 0 ? "text-emerald-400" : "text-red-400")}>
                {formatPercent(tickerData.priceChangePercent)}
              </span>
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter mb-0.5">24h High</span>
              <span className="text-[11px] font-mono font-bold tracking-tight text-zinc-300">
                {formatPrice(tickerData.high)}
              </span>
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter mb-0.5">24h Low</span>
              <span className="text-[11px] font-mono font-bold tracking-tight text-zinc-300">
                {formatPrice(tickerData.low)}
              </span>
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter mb-0.5">Funding / Countdown</span>
              <span className="text-[11px] font-mono font-bold tracking-tight text-zinc-500 uppercase">
                0.0100% / 06:42:12
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 w-full max-w-[1920px] mx-auto flex flex-col lg:flex-row bg-zinc-950">
        {/* LEFT & CENTER: Chart + Bottom Panel */}
        <div className="flex-1 flex flex-col border-r border-white/5">
          {/* Top Level: Chart and Order Book */}
          <div className="flex flex-col lg:flex-row border-b border-white/5 h-[550px]">
            {/* Chart Column */}
            <div className="flex-1 flex flex-col border-r border-white/5 h-full">
              <div className="flex items-center gap-6 px-4 py-2 border-b border-white/5 bg-zinc-950/20 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <div className="text-white border-b-2 border-emerald-500 pb-2 -mb-2 transition-all">Regime Analysis</div>
                <div className="hover:text-zinc-300 transition-colors">Risk Metrics</div>
                <div className="hover:text-zinc-300 transition-colors">Neural Feed</div>
                <div className="hover:text-zinc-300 transition-colors">Execution Logs</div>
              </div>
              <div className="flex-1 relative overflow-hidden">
                <CandleChart data={formattedCandles} />
              </div>
            </div>

            {/* Order Book Column - Height matched to Chart */}
            <div className="w-full lg:w-[340px] shrink-0 h-full">
              <OrderBook tickerData={tickerData} symbol={symbol.name} />
            </div>
          </div>

          {/* Bottom Panel: Positions/Orders - Grows naturally */}
          <div className="flex-1 flex flex-col min-h-[500px] bg-[#0B0E11]">
            <div className="flex items-center justify-between px-4 border-b border-white/5 bg-zinc-950/20 sticky top-0 z-10">
              <div className="flex gap-6 text-[10px] font-bold text-zinc-600 uppercase tracking-tight py-3">
                <div className="text-white border-b-2 border-emerald-500 pb-3 -mb-3 transition-all cursor-pointer">Active Vaults (0)</div>
                <div className="hover:text-zinc-400 transition-colors cursor-pointer">Signal History (0)</div>
                <div className="hover:text-zinc-400 transition-colors cursor-pointer">Risk Protections</div>
                <div className="hover:text-zinc-400 transition-colors cursor-pointer">Account Exposure</div>
              </div>
              <div className="flex items-center gap-4">
                <button className="px-3 py-1 rounded bg-zinc-900 border border-white/10 text-[10px] font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all uppercase">Emergency Close</button>
              </div>
            </div>
            <div className="flex-1">
              <ActiveOrders
                orders={currentSymbolOrders}
                onCancelOrder={handleCancelOrder}
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Order Form Sidebar */}
        <div className="w-full lg:w-[380px] shrink-0 flex flex-col bg-[#0B0E11] relative">
          <div className="sticky top-28">
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

      {/* Footer / Status Bar */}
      <div className="h-8 bg-[#0B0E11] border-t border-white/5 flex items-center justify-between px-4 text-[9px] font-bold text-zinc-600 uppercase tracking-widest relative z-50 shadow-2xl shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-500/80">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Intelligence Feed Stable
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-700">|</span>
            RegimeGuard Mainnet-1 <span className="text-emerald-500/60 font-mono">Synced</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-zinc-700">
          <Settings className="w-3.5 h-3.5 cursor-pointer hover:text-zinc-400" />
          <Maximize2 className="w-3.5 h-3.5 cursor-pointer hover:text-zinc-400" />
        </div>
      </div>
    </div>
  );
}
