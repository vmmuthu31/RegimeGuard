"use client";

import React from "react";
import { X } from "lucide-react";

interface TradingChartProps {
  symbol: string;
  onClose?: () => void;
}

const SYMBOL_MAP: Record<string, string> = {
  cmt_btcusdt: "BINANCE:BTCUSDT",
  cmt_ethusdt: "BINANCE:ETHUSDT",
  cmt_solusdt: "BINANCE:SOLUSDT",
};

export default function TradingChart({ symbol, onClose }: TradingChartProps) {
  const tvSymbol = SYMBOL_MAP[symbol] || "BINANCE:BTCUSDT";

  const embedUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_${symbol}&symbol=${tvSymbol}&interval=60&hidesidetoolbar=0&hidetoptoolbar=0&theme=dark&style=1&locale=en&toolbarbg=0a0a0a&enablepublishing=false&saveimage=false&studies=%5B%5D`;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-6xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xl">
              📊
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {symbol.replace("cmt_", "").toUpperCase()}
              </h2>
              <p className="text-zinc-500 text-sm">TradingView Chart</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full" style={{ height: "600px" }}>
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            className="bg-zinc-950"
          />
        </div>

        <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500">
          <span>Powered by TradingView</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Live Chart
          </span>
        </div>
      </div>
    </div>
  );
}
