import type { TradingPair } from "../constants/trading";
import {
  RegimeType,
  StrategyType,
  OrderSide,
  PositionSide,
  RiskLevel,
  OrderStatus,
  MarginMode,
} from "../constants/enums";

export interface DbUser {
  id: string;
  walletAddress: string;
  createdAt: Date;
  updatedAt: Date;
  settings: UserSettings;
}

export interface UserSettings {
  tradingEnabled: boolean;
  maxPositionSizePercent: number;
  maxDailyLossPercent: number;
  defaultLeverage: number;
  preferredPairs: TradingPair[];
  riskProfile: "conservative" | "moderate" | "aggressive";
}

export interface DbTrade {
  id: string;
  userId: string;
  symbol: TradingPair;
  side: OrderSide;
  positionSide: PositionSide;
  strategy: StrategyType;
  regime: RegimeType;
  entryPrice: number;
  exitPrice: number | null;
  size: number;
  leverage: number;
  stopLoss: number;
  takeProfit: number;
  fee: number;
  realizedPnl: number | null;
  pnlPercent: number | null;
  status: "OPEN" | "CLOSED" | "LIQUIDATED" | "CANCELLED";
  confidence: number;
  explanation: string;
  orderId: string;
  createdAt: Date;
  closedAt: Date | null;
  aiLogId: string | null;
}

export interface DbPosition {
  id: string;
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
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbOrder {
  id: string;
  orderId: string;
  userId: string;
  symbol: TradingPair;
  side: OrderSide;
  positionSide: PositionSide;
  type: "LIMIT" | "MARKET" | "STOP_LIMIT" | "STOP_MARKET";
  price: number | null;
  size: number;
  filledSize: number;
  status: OrderStatus;
  clientOrderId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbAiDecision {
  id: string;
  userId: string;
  symbol: TradingPair;
  type: "REGIME" | "RISK" | "TRADE" | "VOLATILITY";
  regime: RegimeType;
  confidence: number;
  riskLevel: RiskLevel;
  decision: Record<string, unknown>;
  explanation: string;
  indicators: Record<string, number>;
  createdAt: Date;
  weexLogId: string | null;
}

export interface DbPerformanceMetrics {
  id: string;
  userId: string;
  period: "DAILY" | "WEEKLY" | "MONTHLY" | "ALL_TIME";
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnl: number;
  totalPnlPercent: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  avgHoldingTime: number;
  bestTrade: number;
  worstTrade: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbTradingSession {
  id: string;
  userId: string;
  startedAt: Date;
  stoppedAt: Date | null;
  status: "RUNNING" | "PAUSED" | "STOPPED" | "ERROR";
  symbols: TradingPair[];
  intervalMs: number;
  dryRun: boolean;
  cyclesCompleted: number;
  tradesExecuted: number;
  totalPnl: number;
  errors: string[];
}
