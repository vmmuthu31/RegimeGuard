"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaBitcoin, FaEthereum, FaBolt, FaCoins } from "react-icons/fa";
import {
  SiSolana,
  SiDogecoin,
  SiXrp,
  SiCardano,
  SiBinance,
  SiLitecoin,
} from "react-icons/si";
import { TickerData } from "@/src/client/hooks/useDashboardData";
import { formatPrice, formatPercent } from "@/src/shared/utils/formatters";

// Map for all 8 competition symbols
const IconMap: Record<string, React.ReactNode> = {
  BTC: <FaBitcoin />,
  ETH: <FaEthereum />,
  SOL: <SiSolana />,
  DOGE: <SiDogecoin />, // Requires react-icons/si
  XRP: <SiXrp />,
  ADA: <SiCardano />,
  BNB: <SiBinance />,
  LTC: <SiLitecoin />,
};

interface MarketTableProps {
  tickers: Record<string, TickerData>;
  symbols: Array<{ id: string; name: string; iconKey?: string; color: string }>;
}

export function MarketTable({ tickers, symbols }: MarketTableProps) {
  const router = useRouter();

  const handleRowClick = (symbolId: string) => {
    // Navigate to trade page, stripping prefix for cleaner URL if desired,
    // or just relying on the logic we fixed in TradePage to handle 'ethusdt' or 'cmt_ethusdt'
    // Let's use the clean short ID for the URL: cmt_ethusdt -> ethusdt
    const shortId = symbolId.replace("cmt_", "").replace("usdt", "") + "usdt";
    router.push(`/trade/${shortId}`);
  };

  return (
    <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Header Tabs (Cosmetic for now) */}
      <div className="flex items-center gap-6 px-6 py-4 border-b border-white/5 bg-zinc-900/30">
        <button className="text-white font-bold text-sm border-b-2 border-emerald-500 pb-4 -mb-4.5">
          Hot
        </button>
        <button className="text-zinc-500 font-medium text-sm hover:text-zinc-300 transition-colors">
          Gainers
        </button>
        <button className="text-zinc-500 font-medium text-sm hover:text-zinc-300 transition-colors">
          24h Volume
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-left text-xs text-zinc-500 bg-zinc-900/20">
            <tr>
              <th className="px-6 py-4 font-medium">Pair</th>
              <th className="px-6 py-4 font-medium text-right">Price</th>
              <th className="px-6 py-4 font-medium text-right hidden md:table-cell">
                24h Volume
              </th>
              <th className="px-6 py-4 font-medium text-right">24h Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {symbols.map((sym) => {
              const ticker = tickers[sym.id];
              const priceChange = ticker
                ? parseFloat(ticker.priceChangePercent)
                : 0;
              const isPositive = priceChange >= 0;

              return (
                <tr
                  key={sym.id}
                  onClick={() => handleRowClick(sym.id)}
                  className="hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  {/* Pair Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform"
                        style={{
                          color: sym.color,
                          backgroundColor: `${sym.color}15`,
                        }}
                      >
                        {sym.iconKey && IconMap[sym.iconKey] ? (
                          IconMap[sym.iconKey]
                        ) : (
                          <FaCoins />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-sm flex items-center gap-1">
                          {sym.name.split("/")[0]}
                          <span className="text-zinc-600 font-normal text-xs">
                            /USDT
                          </span>
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 text-right">
                    <div className="text-white font-mono font-medium">
                      {ticker ? formatPrice(ticker.lastPrice) : "--"}
                    </div>
                  </td>

                  {/* Volume */}
                  <td className="px-6 py-4 text-right hidden md:table-cell">
                    <div className="text-zinc-400 font-mono text-sm">
                      {ticker
                        ? `${parseFloat(ticker.value).toLocaleString(
                            undefined,
                            { maximumFractionDigits: 0 }
                          )} USDT`
                        : "--"}
                    </div>
                  </td>

                  {/* Change */}
                  <td className="px-6 py-4 text-right">
                    <div
                      className={`font-medium ${
                        isPositive ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {ticker ? formatPercent(ticker.priceChangePercent) : "--"}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
