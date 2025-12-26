"use client";

import { ReactNode } from "react";

// Simple pass-through provider since we're not using Privy
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
