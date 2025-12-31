"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  History,
  RefreshCw,
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Balance {
  coinName: string;
  available: number;
  equity: number;
  frozen: number;
  unrealizedPnl: number;
}

interface Position {
  symbol: string;
  side: string;
  size: number;
  entryPrice: number;
  unrealizedPnl: number;
  leverage: number;
}

interface TradeHistory {
  tradeId: string;
  orderId: string;
  symbol: string;
  side: string;
  fillSize: string;
  fillPrice: string;
  fillValue: string;
  fillFee: string;
  realizePnl: string;
  positionSide: string;
  createdTime: number;
}

export default function AccountPage() {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<TradeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchData = useCallback(async () => {
    try {
      const [accountRes, tradesRes] = await Promise.all([
        fetch("/api/account"),
        fetch("/api/account/data?endpoint=trades"),
      ]);

      const accountData = await accountRes.json();
      if (accountData.success && accountData.data) {
        setBalance(accountData.data.balance);
        setPositions(accountData.data.positions || []);
      }

      const tradesData = await tradesRes.json();
      if (tradesData.success && tradesData.data?.trades) {
        setTrades(tradesData.data.trades);
      }
    } catch (err) {
      console.error("Failed to fetch account data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const totalRealizedPnl = trades.reduce(
    (sum, t) => sum + parseFloat(t.realizePnl || "0"),
    0
  );
  const totalUnrealizedPnl = positions.reduce(
    (sum, p) => sum + (p.unrealizedPnl || 0),
    0
  );
  const totalFees = trades.reduce(
    (sum, t) => sum + parseFloat(t.fillFee || "0"),
    0
  );
  const buyTrades = trades.filter(
    (t) => t.side === "BUY" || t.positionSide === "LONG"
  ).length;
  const sellTrades = trades.filter(
    (t) => t.side === "SELL" || t.positionSide === "SHORT"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-[11px] font-bold uppercase tracking-widest">
            Loading Account...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090a] text-white font-sans">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-emerald-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/3 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0B0E11] border border-white/20 flex items-center justify-center">
              <Image src="/logo.png" alt="logo" width={24} height={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white uppercase tracking-tight">
                My Account
              </h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                Trading History & PnL
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="ml-auto p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-all"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0B0E11] border border-white/20 rounded-xl p-4 relative"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0" />
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                Equity
              </span>
            </div>
            <div className="text-2xl font-black text-white font-mono">
              ${balance?.equity?.toFixed(2) || "0.00"}
            </div>
            <div className="text-[10px] text-zinc-500">
              Available: ${balance?.available?.toFixed(2) || "0.00"}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0B0E11] border border-white/20 rounded-xl p-4 relative"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-blue-500/0 via-blue-500/60 to-blue-500/0" />
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                Unrealized PnL
              </span>
            </div>
            <div
              className={`text-2xl font-black font-mono ${totalUnrealizedPnl >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
            >
              {totalUnrealizedPnl >= 0 ? "+" : ""}$
              {totalUnrealizedPnl.toFixed(2)}
            </div>
            <div className="text-[10px] text-zinc-500">
              {positions.length} open position
              {positions.length !== 1 ? "s" : ""}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0B0E11] border border-white/20 rounded-xl p-4 relative"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-purple-500/0 via-purple-500/60 to-purple-500/0" />
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                Realized PnL
              </span>
            </div>
            <div
              className={`text-2xl font-black font-mono ${totalRealizedPnl >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
            >
              {totalRealizedPnl >= 0 ? "+" : ""}${totalRealizedPnl.toFixed(2)}
            </div>
            <div className="text-[10px] text-zinc-500">
              Fees: -${totalFees.toFixed(4)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0B0E11] border border-white/20 rounded-xl p-4 relative"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-orange-500/0 via-orange-500/60 to-orange-500/0" />
            <div className="flex items-center gap-2 mb-2">
              <History className="w-4 h-4 text-orange-400" />
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                Trades
              </span>
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {trades.length}
            </div>
            <div className="text-[10px] text-zinc-500">
              <span className="text-emerald-400">{buyTrades} buys</span> /{" "}
              <span className="text-red-400">{sellTrades} sells</span>
            </div>
          </motion.div>
        </div>

        {/* Active Positions */}
        {positions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0B0E11] border border-white/20 rounded-xl overflow-hidden mb-6 relative"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0" />
            <div className="p-4 border-b border-white/10">
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
                Open Positions
              </h3>
            </div>
            <div className="divide-y divide-white/5">
              {positions.map((pos, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    {pos.side === "LONG" ? (
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    )}
                    <div>
                      <span className="text-[12px] font-black text-white uppercase">
                        {pos.symbol
                          .replace("cmt_", "")
                          .replace("usdt", "/USDT")}
                      </span>
                      <span
                        className={`ml-2 text-[10px] font-bold ${pos.side === "LONG"
                            ? "text-emerald-400"
                            : "text-red-400"
                          }`}
                      >
                        {pos.side}
                      </span>
                      <div className="text-[10px] text-zinc-500">
                        Size: {pos.size} | Leverage: {pos.leverage}x
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-[14px] font-black font-mono ${pos.unrealizedPnl >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                        }`}
                    >
                      {pos.unrealizedPnl >= 0 ? "+" : ""}$
                      {pos.unrealizedPnl.toFixed(4)}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Entry: ${pos.entryPrice.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Trade History */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0B0E11] border border-white/20 rounded-xl overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-blue-500/0 via-blue-500/60 to-blue-500/0" />
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
              Trade History
            </h3>
            <span className="text-[10px] text-zinc-500">
              {trades.length} trades
            </span>
          </div>

          {trades.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-[11px] font-bold uppercase tracking-widest">
                No trades yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">
                    <th className="p-3 text-left">Time</th>
                    <th className="p-3 text-left">Symbol</th>
                    <th className="p-3 text-left">Side</th>
                    <th className="p-3 text-right">Size</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Value</th>
                    <th className="p-3 text-right">Fee</th>
                    <th className="p-3 text-right">PnL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {trades
                    .slice(
                      (currentPage - 1) * ITEMS_PER_PAGE,
                      currentPage * ITEMS_PER_PAGE
                    )
                    .map((trade, idx) => {
                      const pnl = parseFloat(trade.realizePnl || "0");
                      const isLong =
                        trade.positionSide === "LONG" || trade.side === "BUY";
                      return (
                        <tr
                          key={idx}
                          className="text-[11px] hover:bg-white/5 transition-colors text-zinc-300"
                        >
                          <td className="p-3 text-zinc-400 font-mono">
                            {new Date(trade.createdTime).toLocaleTimeString()}
                          </td>
                          <td className="p-3 text-white font-bold uppercase">
                            {trade.symbol.replace("cmt_", "").replace("usdt", "")}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-black ${isLong
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-red-500/10 text-red-400"
                                }`}
                            >
                              {trade.positionSide || trade.side}
                            </span>
                          </td>
                          <td className="p-3 text-right text-white font-mono">
                            {trade.fillSize}
                          </td>
                          <td className="p-3 text-right text-white font-mono">
                            ${parseFloat(trade.fillPrice || "0").toLocaleString()}
                          </td>
                          <td className="p-3 text-right text-zinc-400 font-mono">
                            ${parseFloat(trade.fillValue || "0").toFixed(2)}
                          </td>
                          <td className="p-3 text-right text-orange-400 font-mono">
                            -${parseFloat(trade.fillFee || "0").toFixed(4)}
                          </td>
                          <td
                            className={`p-3 text-right font-mono font-bold ${pnl >= 0 ? "text-emerald-400" : "text-red-400"
                              }`}
                          >
                            {pnl >= 0 ? "+" : ""}${pnl.toFixed(4)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {trades.length > ITEMS_PER_PAGE && (
            <div className="p-4 border-t border-white/5 bg-zinc-950/20 flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                Page {currentPage} of {Math.ceil(trades.length / ITEMS_PER_PAGE)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-1">
                  {Array.from({
                    length: Math.min(5, Math.ceil(trades.length / ITEMS_PER_PAGE)),
                  }).map((_, i) => {
                    const pageNum = i + 1;
                    // Simple logic to show a few page numbers around current page could be added here for better UX
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg border text-[10px] font-black transition-all ${currentPage === pageNum
                            ? "bg-emerald-500 border-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                            : "bg-zinc-900 border-white/10 text-zinc-500 hover:text-white"
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(Math.ceil(trades.length / ITEMS_PER_PAGE), p + 1)
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(trades.length / ITEMS_PER_PAGE)
                  }
                  className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
