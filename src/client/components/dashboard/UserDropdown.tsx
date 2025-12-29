"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaCreditCard,
} from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";

interface UserDropdownProps {
  account?: {
    balance: {
      total?: number;
      available: number;
    };
  } | null;
}

export function UserDropdown({ account }: UserDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border border-white/5 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors group outline-none focus:ring-2 focus:ring-emerald-500/20">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-600 flex items-center justify-center text-lg text-white shadow-lg shadow-emerald-500/10">
            <FaUserCircle />
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="text-xs font-medium text-white group-hover:text-emerald-400 transition-colors">
              Trader Account
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              ${account?.balance?.available?.toLocaleString() ?? "0.00"} USDT
            </span>
          </div>
          <MdKeyboardArrowDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[240px] bg-[#121214] border border-white/10 rounded-xl p-2 shadow-xl shadow-black/50 data-[side=bottom]:animate-slideUpAndFade z-50 mr-4"
          sideOffset={8}
          align="end"
        >
          <div className="px-3 py-3 mb-2 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-lg border border-white/5">
            <div className="text-xs text-zinc-400 mb-1 flex items-center gap-2">
              <FaCreditCard className="w-3 h-3" />
              <span>Available Balance</span>
            </div>
            <div className="text-xl font-bold text-emerald-400 font-mono">
              ${account?.balance?.available?.toLocaleString() ?? "0.00"}
            </div>
          </div>

          <DropdownMenu.Item className="group text-sm text-zinc-300 flex items-center gap-3 px-3 py-2.5 rounded-lg outline-none cursor-pointer hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors">
            <FaUserCircle className="w-4 h-4" />
            Profile
          </DropdownMenu.Item>

          <DropdownMenu.Item className="group text-sm text-zinc-300 flex items-center gap-3 px-3 py-2.5 rounded-lg outline-none cursor-pointer hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors">
            <FaCog className="w-4 h-4" />
            Settings
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-white/10 my-1 mx-2" />

          <DropdownMenu.Item className="group text-sm text-red-400 flex items-center gap-3 px-3 py-2.5 rounded-lg outline-none cursor-pointer hover:bg-red-500/10 transition-colors">
            <FaSignOutAlt className="w-4 h-4" />
            Logout
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
