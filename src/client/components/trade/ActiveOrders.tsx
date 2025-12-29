"use client";

import { FaTimes } from "react-icons/fa";

export interface Order {
  id: string;
  time: string;
  symbol: string;
  type: "Limit" | "Market";
  side: "Buy" | "Sell";
  price: string;
  amount: string;
  filled: string;
  status: "Open" | "Table";
}

interface ActiveOrdersProps {
  orders: Order[];
  onCancelOrder: (id: string) => void;
}

export function ActiveOrders({ orders, onCancelOrder }: ActiveOrdersProps) {
  return (
    <div className="bg-[#0B0E11] flex flex-col font-mono select-none">
      <div className="flex-1">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead className="sticky top-0 z-20 bg-[#0B0E11]">
            <tr>
              {[
                { label: "Execution Time", width: "w-[120px]" },
                { label: "Instrument", width: "w-[120px]" },
                { label: "Type", width: "w-[80px]" },
                { label: "Side", width: "w-[80px]" },
                { label: "Price", width: "w-auto" },
                { label: "Quantity", width: "w-auto" },
                { label: "Filled", width: "w-[80px]" },
                { label: "Action", width: "w-[100px]", align: "text-right" },
              ].map((head, i) => (
                <th
                  key={i}
                  className={`px-4 py-3 text-[9px] text-zinc-600 font-bold uppercase tracking-[0.15em] border-b border-white/[0.03] ${head.width
                    } ${head.align || "text-left"}`}
                >
                  {head.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="group hover:bg-white/[0.015] transition-all duration-300 relative border-b border-white/[0.01]"
              >
                {/* Visual Accent - Permanent */}
                <td className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/20 transition-all duration-500 shadow-[2px_0_10px_rgba(16,185,129,0.1)]" />

                <td className="px-4 py-3 text-[11px] text-zinc-500 group-hover:text-zinc-400 transition-colors uppercase">
                  {order.time}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20 ring-1 ring-blue-500/40" />
                    <span className="text-[11px] font-bold text-white tracking-tight">
                      {order.symbol}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-950 border border-white/5 text-zinc-500 uppercase font-bold tracking-tighter">
                    {order.type}
                  </span>
                </td>
                <td
                  className={`px-4 py-3 text-[11px] font-bold transition-all ${order.side === "Buy" ? "text-emerald-400" : "text-red-400"
                    }`}
                >
                  <span className="flex items-center gap-1.5">
                    {order.side === "Buy" ? "↑" : "↓"}
                    {order.side}
                  </span>
                </td>
                <td className="px-4 py-3 text-[11px] font-medium text-zinc-300 font-mono">
                  {order.price}
                </td>
                <td className="px-4 py-3 text-[11px] font-medium text-zinc-300 font-mono">
                  {order.amount}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 overflow-hidden rounded bg-zinc-950/50 p-0.5 w-fit border border-white/[0.02]">
                    <div
                      className="h-1 bg-emerald-500/50 rounded-full"
                      style={{
                        width: `${(parseFloat(order.filled) /
                            parseFloat(order.amount)) *
                          100
                          }%`,
                      }}
                    />
                    <span className="text-[9px] text-zinc-600 font-bold">
                      {order.filled}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onCancelOrder(order.id)}
                    className="relative px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest text-zinc-500 border border-white/5 hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/[0.03] transition-all overflow-hidden group/cancel"
                  >
                    <span className="relative z-10">Cancel</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-600 gap-4 relative overflow-hidden">
            {/* Background geometric pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:20px_20px]" />

            <div className="w-12 h-12 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center justify-center text-zinc-700 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <div className="relative">
                <FaTimes className="w-4 h-4" />
                <div className="absolute -inset-2 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-700">
                Idle Engine
              </span>
              <span className="text-[11px] mt-1 text-zinc-800">
                No active protocol exposure detection
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
