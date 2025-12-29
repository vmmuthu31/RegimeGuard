"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaBitcoin, FaEthereum } from "react-icons/fa";
import {
  SiSolana,
  SiDogecoin,
  SiXrp,
  SiCardano,
  SiBinance,
  SiLitecoin,
} from "react-icons/si";
import { TRADING_PAIRS } from "@/src/shared/constants/trading";

const IconMap: Record<string, ReactNode> = {
  BTC: <FaBitcoin className="w-4 h-4" />,
  ETH: <FaEthereum className="w-4 h-4" />,
  SOL: <SiSolana className="w-4 h-4" />,
  DOGE: <SiDogecoin className="w-4 h-4" />,
  XRP: <SiXrp className="w-4 h-4" />,
  ADA: <SiCardano className="w-4 h-4" />,
  BNB: <SiBinance className="w-4 h-4" />,
  LTC: <SiLitecoin className="w-4 h-4" />,
};

interface MarketSwitcherProps {
  currentSymbol: string;
}

export function MarketSwitcher({ currentSymbol }: MarketSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (pair: string) => {
    setIsOpen(false);
    const id = pair.replace("cmt_", "");
    router.push(`/trade/${id}`);
  };

  const getCleanName = (pair: string) => {
    return pair.replace("cmt_", "").replace("usdt", "/USDT").toUpperCase();
  };

  const currentIconKey = currentSymbol.replace("/USDT", "").toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Pill */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 cursor-pointer pl-2 pr-4 py-1.5 rounded-full border border-emerald-500/30 bg-white/[0.01] transition-all group shadow-[0_0_25px_rgba(16,185,129,0.1)] hover:border-emerald-500/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.25)] active:scale-95"
      >
        <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center text-emerald-400 shadow-inner group-hover:text-emerald-300 transition-colors">
          {IconMap[currentIconKey] || <FaBitcoin className="w-4 h-4" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight uppercase">
              {currentSymbol}
            </h1>
            <FaChevronDown
              className={`w-2 h-2 text-emerald-500/50 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 w-64 bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden"
          >
            <div className="p-2 flex flex-col gap-1">
              <div className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 mb-1">
                Select Market
              </div>
              {TRADING_PAIRS.map((pair) => {
                const cleanName = getCleanName(pair);
                const iconKey = pair
                  .replace("cmt_", "")
                  .replace("usdt", "")
                  .toUpperCase();
                const isActive = cleanName === currentSymbol;

                return (
                  <button
                    key={pair}
                    onClick={() => handleSelect(pair)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group/item ${
                      isActive
                        ? "bg-emerald-500/10 border border-emerald-500/20"
                        : "hover:bg-white/[0.05] border border-transparent hover:border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-lg bg-zinc-950 border border-white/5 shadow-inner transition-colors ${
                          isActive
                            ? "text-emerald-400"
                            : "text-zinc-500 group-hover/item:text-emerald-400"
                        }`}
                      >
                        {IconMap[iconKey] || (
                          <FaBitcoin className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span
                        className={`text-xs font-bold transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-zinc-400 group-hover/item:text-white"
                        }`}
                      >
                        {cleanName}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    )}
                  </button>
                );
              })}
            </div>
            {/* Bottom Decoration */}
            <div className="h-1 w-full bg-linear-to-r from-transparent via-emerald-500/20 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
