"use client";

import React from "react";
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
    <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-bold text-sm text-white">Active Orders</h3>
        <span className="text-xs text-zinc-500 bg-zinc-900 border border-white/5 px-2 py-1 rounded-md">
          {orders.length} Open
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-zinc-500 font-medium bg-zinc-900/50">
            <tr>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Symbol</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Side</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Filled</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-3 text-zinc-400 font-mono">
                  {order.time}
                </td>
                <td className="px-6 py-3 font-bold text-white">
                  {order.symbol}
                </td>
                <td className="px-6 py-3 text-zinc-400">{order.type}</td>
                <td
                  className={`px-6 py-3 font-bold ${
                    order.side === "Buy" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {order.side}
                </td>
                <td className="px-6 py-3 text-white font-mono">
                  {order.price}
                </td>
                <td className="px-6 py-3 text-zinc-300 font-mono">
                  {order.amount}
                </td>
                <td className="px-6 py-3 text-zinc-400">{order.filled}</td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => onCancelOrder(order.id)}
                    className="text-zinc-500 hover:text-red-400 transition-colors bg-zinc-900/50 hover:bg-red-500/10 p-1.5 rounded-md border border-white/5 hover:border-red-500/20"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="py-8 text-center text-zinc-500 text-sm">
            No active orders
          </div>
        )}
      </div>
    </div>
  );
}
