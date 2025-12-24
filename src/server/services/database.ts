import {
  getSupabaseServerClient,
  isSupabaseConfigured,
} from "../config/supabase";
import type { TradingPair } from "@/shared/constants";
import {
  RegimeType,
  StrategyType,
  OrderSide,
  PositionSide,
  RiskLevel,
  MarginMode,
} from "@/shared/constants";

export async function createTrade(trade: {
  userId: string;
  symbol: TradingPair;
  side: OrderSide;
  positionSide: PositionSide;
  strategy: StrategyType;
  regime: RegimeType;
  entryPrice: number;
  size: number;
  leverage: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
  explanation: string;
  orderId: string;
}) {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("trades")
    .insert({
      user_id: trade.userId,
      symbol: trade.symbol,
      side: trade.side,
      position_side: trade.positionSide,
      strategy: trade.strategy,
      regime: trade.regime,
      entry_price: trade.entryPrice,
      size: trade.size,
      leverage: trade.leverage,
      stop_loss: trade.stopLoss,
      take_profit: trade.takeProfit,
      confidence: trade.confidence,
      explanation: trade.explanation,
      order_id: trade.orderId,
      status: "OPEN",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating trade:", error);
    return null;
  }

  return data;
}

export async function closeTrade(
  tradeId: string,
  exitPrice: number,
  entryPrice: number,
  size: number,
  side: string
) {
  if (!isSupabaseConfigured()) return null;

  const pnl =
    side === "LONG"
      ? (exitPrice - entryPrice) * size
      : (entryPrice - exitPrice) * size;
  const pnlPercent =
    ((exitPrice - entryPrice) / entryPrice) * 100 * (side === "LONG" ? 1 : -1);

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("trades")
    .update({
      exit_price: exitPrice,
      realized_pnl: pnl,
      pnl_percent: pnlPercent,
      status: "CLOSED",
      closed_at: new Date().toISOString(),
    })
    .eq("id", tradeId)
    .select()
    .single();

  if (error) {
    console.error("Error closing trade:", error);
    return null;
  }

  return data;
}

export async function getUserTrades(userId: string, limit: number = 50) {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching trades:", error);
    return [];
  }

  return data || [];
}

export async function getOpenTrades(userId: string) {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "OPEN");

  if (error) {
    console.error("Error fetching open trades:", error);
    return [];
  }

  return data || [];
}

export async function upsertPosition(position: {
  userId: string;
  symbol: TradingPair;
  side: PositionSide;
  marginMode: MarginMode;
  size: number;
  entryPrice: number;
  markPrice: number;
  liquidationPrice: number;
  leverage: number;
  margin: number;
}) {
  if (!isSupabaseConfigured()) return null;

  const unrealizedPnl =
    position.side === PositionSide.LONG
      ? (position.markPrice - position.entryPrice) * position.size
      : (position.entryPrice - position.markPrice) * position.size;
  const unrealizedPnlPercent =
    ((position.markPrice - position.entryPrice) / position.entryPrice) * 100;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("positions")
    .upsert(
      {
        user_id: position.userId,
        symbol: position.symbol,
        side: position.side,
        margin_mode: position.marginMode,
        size: position.size,
        entry_price: position.entryPrice,
        mark_price: position.markPrice,
        liquidation_price: position.liquidationPrice,
        leverage: position.leverage,
        margin: position.margin,
        unrealized_pnl: unrealizedPnl,
        unrealized_pnl_percent: unrealizedPnlPercent,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,symbol,side" }
    )
    .select()
    .single();

  if (error) {
    console.error("Error upserting position:", error);
    return null;
  }

  return data;
}

export async function getUserPositions(userId: string) {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("positions")
    .select("*")
    .eq("user_id", userId)
    .gt("size", 0);

  if (error) {
    console.error("Error fetching positions:", error);
    return [];
  }

  return data || [];
}

export async function deletePosition(
  userId: string,
  symbol: string,
  side: string
) {
  if (!isSupabaseConfigured()) return false;

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("positions")
    .delete()
    .eq("user_id", userId)
    .eq("symbol", symbol)
    .eq("side", side);

  if (error) {
    console.error("Error deleting position:", error);
    return false;
  }

  return true;
}

export async function logAiDecision(decision: {
  userId: string;
  symbol: TradingPair;
  type: "REGIME" | "RISK" | "TRADE" | "VOLATILITY";
  regime: RegimeType;
  confidence: number;
  riskLevel: RiskLevel;
  decision: Record<string, unknown>;
  explanation: string;
  indicators: Record<string, number>;
}) {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("ai_decisions")
    .insert({
      user_id: decision.userId,
      symbol: decision.symbol,
      type: decision.type,
      regime: decision.regime,
      confidence: decision.confidence,
      risk_level: decision.riskLevel,
      decision: decision.decision,
      explanation: decision.explanation,
      indicators: decision.indicators,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error logging AI decision:", error);
    return null;
  }

  return data?.id || null;
}

export async function startTradingSession(session: {
  userId: string;
  symbols: TradingPair[];
  intervalMs: number;
  dryRun: boolean;
}) {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("trading_sessions")
    .insert({
      user_id: session.userId,
      symbols: session.symbols,
      interval_ms: session.intervalMs,
      dry_run: session.dryRun,
      status: "RUNNING",
    })
    .select()
    .single();

  if (error) {
    console.error("Error starting session:", error);
    return null;
  }

  return data;
}

export async function updateTradingSession(
  sessionId: string,
  updates: {
    status?: string;
    cyclesCompleted?: number;
    tradesExecuted?: number;
    totalPnl?: number;
    errors?: string[];
    stoppedAt?: string;
  }
) {
  if (!isSupabaseConfigured()) return false;

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("trading_sessions")
    .update({
      status: updates.status,
      cycles_completed: updates.cyclesCompleted,
      trades_executed: updates.tradesExecuted,
      total_pnl: updates.totalPnl,
      errors: updates.errors,
      stopped_at: updates.stoppedAt,
    })
    .eq("id", sessionId);

  if (error) {
    console.error("Error updating session:", error);
    return false;
  }

  return true;
}

export async function getActiveSession(userId: string) {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("trading_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "RUNNING")
    .single();

  if (error) return null;

  return data;
}

export async function getUserPerformance(userId: string) {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("trades")
    .select("realized_pnl, status")
    .eq("user_id", userId)
    .eq("status", "CLOSED");

  if (error) {
    console.error("Error fetching performance:", error);
    return null;
  }

  if (!data || data.length === 0) {
    return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      totalPnl: 0,
      avgPnl: 0,
    };
  }

  const totalTrades = data.length;
  const winningTrades = data.filter((t) => (t.realized_pnl || 0) > 0).length;
  const losingTrades = data.filter((t) => (t.realized_pnl || 0) < 0).length;
  const totalPnl = data.reduce((sum, t) => sum + (t.realized_pnl || 0), 0);

  return {
    totalTrades,
    winningTrades,
    losingTrades,
    winRate: totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0,
    totalPnl,
    avgPnl: totalTrades > 0 ? totalPnl / totalTrades : 0,
  };
}

export { isSupabaseConfigured };
