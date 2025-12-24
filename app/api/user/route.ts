import { NextResponse } from "next/server";
import {
  getUserTrades,
  getOpenTrades,
  getUserPositions,
  getUserPerformance,
  getActiveSession,
  isSupabaseConfigured,
} from "@/server/services/database";
import { getSupabaseServerClient } from "@/server/config/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "profile";
    const userId = searchParams.get("userId");

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "Database not configured",
          message: "Supabase environment variables not set",
        },
        { status: 503 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId parameter required" },
        { status: 400 }
      );
    }

    switch (action) {
      case "trades": {
        const limit = parseInt(searchParams.get("limit") || "50");
        const trades = await getUserTrades(userId, limit);
        return NextResponse.json({
          success: true,
          data: { trades, count: trades.length },
          timestamp: Date.now(),
        });
      }

      case "openTrades": {
        const openTrades = await getOpenTrades(userId);
        return NextResponse.json({
          success: true,
          data: { trades: openTrades, count: openTrades.length },
          timestamp: Date.now(),
        });
      }

      case "positions": {
        const positions = await getUserPositions(userId);
        return NextResponse.json({
          success: true,
          data: { positions, count: positions.length },
          timestamp: Date.now(),
        });
      }

      case "performance": {
        const performance = await getUserPerformance(userId);
        return NextResponse.json({
          success: true,
          data: { performance },
          timestamp: Date.now(),
        });
      }

      case "session": {
        const session = await getActiveSession(userId);
        return NextResponse.json({
          success: true,
          data: { session, isActive: !!session },
          timestamp: Date.now(),
        });
      }

      case "profile": {
        const supabase = getSupabaseServerClient();
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          return NextResponse.json({
            success: false,
            error: "User not found",
          });
        }

        return NextResponse.json({
          success: true,
          data: { user },
          timestamp: Date.now(),
        });
      }

      case "dashboard": {
        const [trades, positions, performance, session] = await Promise.all([
          getUserTrades(userId, 10),
          getUserPositions(userId),
          getUserPerformance(userId),
          getActiveSession(userId),
        ]);

        return NextResponse.json({
          success: true,
          data: {
            recentTrades: trades,
            positions,
            performance,
            activeSession: session,
          },
          timestamp: Date.now(),
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid action",
            validActions: [
              "profile",
              "trades",
              "openTrades",
              "positions",
              "performance",
              "session",
              "dashboard",
            ],
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, walletAddress, settings } = body;

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 503 }
      );
    }

    const supabase = getSupabaseServerClient();

    switch (action) {
      case "create": {
        if (!walletAddress) {
          return NextResponse.json(
            { success: false, error: "walletAddress required" },
            { status: 400 }
          );
        }

        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("wallet_address", walletAddress)
          .single();

        if (existingUser) {
          return NextResponse.json({
            success: true,
            data: { user: existingUser, isNew: false },
            message: "User already exists",
          });
        }

        const { data: newUser, error } = await supabase
          .from("users")
          .insert({
            wallet_address: walletAddress,
            settings: settings || {
              tradingEnabled: false,
              maxPositionSizePercent: 0.1,
              maxDailyLossPercent: 0.05,
              defaultLeverage: 5,
              riskProfile: "moderate",
            },
          })
          .select()
          .single();

        if (error) {
          return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          data: { user: newUser, isNew: true },
          message: "User created successfully",
        });
      }

      case "updateSettings": {
        const { userId, settings: newSettings } = body;

        if (!userId || !newSettings) {
          return NextResponse.json(
            { success: false, error: "userId and settings required" },
            { status: 400 }
          );
        }

        const { error } = await supabase
          .from("users")
          .update({ settings: newSettings })
          .eq("id", userId);

        if (error) {
          return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: "Settings updated successfully",
        });
      }

      case "getByWallet": {
        if (!walletAddress) {
          return NextResponse.json(
            { success: false, error: "walletAddress required" },
            { status: 400 }
          );
        }

        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("wallet_address", walletAddress)
          .single();

        if (error) {
          return NextResponse.json({
            success: false,
            error: "User not found",
          });
        }

        return NextResponse.json({
          success: true,
          data: { user },
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid action",
            validActions: ["create", "updateSettings", "getByWallet"],
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
