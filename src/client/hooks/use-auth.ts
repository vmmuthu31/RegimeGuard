"use client";

import { useAtom, useSetAtom } from "jotai";
import { useState, useCallback } from "react";
import { userSettingsAtom, systemStatusAtom } from "../state/atoms";

interface UserData {
  id: string;
  walletAddress: string;
  settings: {
    tradingEnabled: boolean;
    maxPositionSizePercent: number;
    maxDailyLossPercent: number;
    defaultLeverage: number;
    riskProfile: "conservative" | "moderate" | "aggressive";
  };
}

// Simple mock auth hook - no Privy dependency
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userSettings, setUserSettings] = useAtom(userSettingsAtom);
  const setSystemStatus = useSetAtom(systemStatusAtom);

  const login = useCallback(() => {
    // For demo purposes, just set authenticated state
    setIsAuthenticated(true);
    setSystemStatus("operational");
  }, [setSystemStatus]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const createOrGetUser = useCallback(async (): Promise<UserData | null> => {
    return null;
  }, []);

  const updateSettings = useCallback(
    async (userId: string, newSettings: typeof userSettings) => {
      setUserSettings(newSettings);
      return true;
    },
    [setUserSettings]
  );

  return {
    ready: true,
    authenticated: isAuthenticated,
    user: null,
    walletAddress: null,
    login,
    logout,
    createOrGetUser,
    updateSettings,
    userSettings,
  };
}

export function useUserDashboard(userId: string | null) {
  const fetchDashboard = useCallback(async () => {
    if (!userId) return null;

    try {
      const response = await fetch(
        `/api/user?action=dashboard&userId=${userId}`
      );
      const data = await response.json();

      if (data.success) {
        return data.data;
      }

      return null;
    } catch {
      return null;
    }
  }, [userId]);

  return { fetchDashboard };
}

export function useTradingSession(userId: string | null) {
  const startSession = useCallback(
    async (symbols: string[], intervalMs: number, dryRun: boolean) => {
      if (!userId) return null;

      try {
        const response = await fetch("/api/loop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "start",
            userId,
            symbols,
            intervalMs,
            dryRun,
          }),
        });

        return await response.json();
      } catch {
        return null;
      }
    },
    [userId]
  );

  const stopSession = useCallback(async () => {
    try {
      const response = await fetch("/api/loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop" }),
      });

      return await response.json();
    } catch {
      return null;
    }
  }, []);

  const getStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/loop?action=status");
      return await response.json();
    } catch {
      return null;
    }
  }, []);

  return { startSession, stopSession, getStatus };
}
