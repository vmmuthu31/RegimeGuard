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
                  className={`px-4 py-3.5 text-[10px] text-zinc-300 font-bold uppercase tracking-[0.15em] border-b border-white/20 ${head.width
                    } ${head.align || "text-left"}`}
                >
                  {head.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="group hover:bg-white/[0.025] transition-all duration-300 relative"
              >
                {/* Visual Accent - Permanent */}
                <td className="absolute left-0 top-0 bottom-0 w-[2px] bg-emerald-500/40 shadow-[4px_0_15px_rgba(16,185,129,0.2)]" />

                <td className="px-4 py-4 text-[11px] text-zinc-400 group-hover:text-zinc-200 transition-colors uppercase font-medium">
                  {order.time}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[11px] font-black text-white tracking-tight">
                      {order.symbol}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-zinc-950 border border-white/20 text-zinc-200 uppercase font-black tracking-tighter shadow-md">
                    {order.type}
                  </span>
                </td>
                <td
                  className={`px-4 py-4 text-[11px] font-black tracking-widest transition-all ${order.side === "Buy" ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]" : "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.3)]"
                    }`}
                >
                  <span className="flex items-center gap-1.5">
                    {order.side === "Buy" ? "↑" : "↓"}
                    {order.side}
                  </span>
                </td>
                <td className="px-4 py-4 text-[12px] font-bold text-white font-mono tracking-tight">
                  {order.price}
                </td>
                <td className="px-4 py-4 text-[12px] font-bold text-white font-mono tracking-tight">
                  {order.amount}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 overflow-hidden rounded bg-zinc-950 p-1 w-fit border border-white/10 shadow-inner">
                    <div
                      className="h-1.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] rounded-full"
                      style={{
                        width: `${(parseFloat(order.filled) /
                          parseFloat(order.amount)) *
                          100
                          }%`,
                      }}
                    />
                    <span className="text-[10px] text-white font-black font-mono">
                      {order.filled}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => onCancelOrder(order.id)}
                    className="relative px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border border-white/10 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/[0.05] transition-all overflow-hidden group/cancel shadow-sm active:scale-95"
                  >
                    <span className="relative z-10">Cancel</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-4 relative overflow-hidden">
            {/* Background geometric pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/20 flex items-center justify-center text-zinc-400 shadow-2xl group-hover:scale-110 transition-transform duration-500">
              <div className="relative">
                <FaTimes className="w-5 h-5" />
                <div className="absolute -inset-4 bg-emerald-500/20 blur-2xl opacity-100" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white">
                Intelligence Idle
              </span>
              <span className="text-[12px] mt-1 text-zinc-500 font-bold uppercase tracking-tighter">
                No active protocol exposure detection
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
