"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useCallback } from "react";
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

export function useAuth() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const [userSettings, setUserSettings] = useAtom(userSettingsAtom);
  const setSystemStatus = useSetAtom(systemStatusAtom);

  const walletAddress = wallets[0]?.address || user?.wallet?.address || null;

  const createOrGetUser = useCallback(async (): Promise<UserData | null> => {
    if (!walletAddress) return null;

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getByWallet",
          walletAddress,
        }),
      });

      const data = await response.json();

      if (data.success && data.data?.user) {
        return {
          id: data.data.user.id,
          walletAddress: data.data.user.wallet_address,
          settings: data.data.user.settings,
        };
      }

      const createResponse = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          walletAddress,
        }),
      });

      const createData = await createResponse.json();

      if (createData.success && createData.data?.user) {
        return {
          id: createData.data.user.id,
          walletAddress: createData.data.user.wallet_address,
          settings: createData.data.user.settings,
        };
      }

      return null;
    } catch (error) {
      console.error("Error creating/getting user:", error);
      return null;
    }
  }, [walletAddress]);

  useEffect(() => {
    if (authenticated && walletAddress) {
      createOrGetUser().then((userData) => {
        if (userData?.settings) {
          setUserSettings(userData.settings);
          setSystemStatus("operational");
        }
      });
    }
  }, [
    authenticated,
    walletAddress,
    createOrGetUser,
    setUserSettings,
    setSystemStatus,
  ]);

  const updateSettings = useCallback(
    async (userId: string, newSettings: typeof userSettings) => {
      try {
        const response = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "updateSettings",
            userId,
            settings: newSettings,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setUserSettings(newSettings);
          return true;
        }

        return false;
      } catch {
        return false;
      }
    },
    [setUserSettings]
  );

  return {
    ready,
    authenticated,
    user,
    walletAddress,
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
