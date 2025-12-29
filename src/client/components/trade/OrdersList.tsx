"use client";

// Mock Data
const ACTIVE_ORDERS = [
  {
    id: "1",
    type: "Limit",
    side: "Buy",
    price: "41250.00",
    amount: "0.0512",
    filled: "0%",
    time: "12:30:45",
  },
  {
    id: "2",
    type: "Limit",
    side: "Sell",
    price: "43500.00",
    amount: "0.1000",
    filled: "0%",
    time: "11:15:20",
  },
];

export function OrdersList() {
  return (
    <div className="h-full bg-[#121214] border-t border-white/5 flex flex-col">
      <div className="flex items-center gap-6 px-4 border-b border-white/5">
        <button className="py-3 text-sm font-medium text-emerald-400 border-b-2 border-emerald-400">
          Open Orders (2)
        </button>
        <button className="py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors">
          Order History
        </button>
        <button className="py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors">
          Trade History
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#121214] z-10">
            <tr>
              <th className="py-2 px-4 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                Time
              </th>
              <th className="py-2 px-4 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                Side
              </th>
              <th className="py-2 px-4 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                Price (USDT)
              </th>
              <th className="py-2 px-4 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                Amount (BTC)
              </th>
              <th className="py-2 px-4 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                Filled
              </th>
              <th className="py-2 px-4 text-[10px] font-medium text-zinc-500 uppercase tracking-wider text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {ACTIVE_ORDERS.map((order) => (
              <tr key={order.id} className="group hover:bg-white/[0.02]">
                <td className="py-2.5 px-4 text-xs font-mono text-zinc-400">
                  {order.time}
                </td>
                <td
                  className={`py-2.5 px-4 text-xs font-bold ${
                    order.side === "Buy" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {order.side}
                </td>
                <td className="py-2.5 px-4 text-xs font-mono text-white">
                  {order.price}
                </td>
                <td className="py-2.5 px-4 text-xs font-mono text-white">
                  {order.amount}
                </td>
                <td className="py-2.5 px-4 text-xs font-mono text-zinc-400">
                  {order.filled}
                </td>
                <td className="py-2.5 px-4 text-right">
                  <button className="text-xs text-zinc-500 hover:text-red-400 transition-colors px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-red-500/30">
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
