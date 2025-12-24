import {
  RegimeType,
  RiskLevel,
  StrategyType,
  OrderSide,
  PositionSide,
  MarginMode,
  StopLossAdjustment,
  TradingAction,
} from "../constants/enums";
import type { TradingPair } from "../constants";

export interface MarketData {
  symbol: TradingPair;
  last: number;
  bestAsk: number;
  bestBid: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  timestamp: number;
  priceChangePercent: number;
  markPrice: number;
  indexPrice: number;
}

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  atr: number;
  ema9: number;
  ema21: number;
  rsi: number;
  volatility: number;
  momentum: number;
  trendStrength: number;
  vwap?: number;
  fibonacciLevels?: {
    high: number;
    low: number;
    levels: Array<{ level: number; price: number; label: string }>;
  };
  swingPoints?: Array<{
    index: number;
    timestamp: number;
    price: number;
    type: "high" | "low";
    strength: number;
  }>;
  supportResistance?: {
    support: number[];
    resistance: number[];
  };
}

export interface RegimeClassification {
  regime: RegimeType;
  confidence: number;
  features: {
    momentum: number;
    volatility: number;
    trendStrength: number;
  };
  timestamp: number;
}

export interface RiskDecision {
  positionSizeMultiplier: number;
  stopLossAdjustment: StopLossAdjustment;
  tradeCooldownActive: boolean;
  tradeSuspended: boolean;
  riskLevel: RiskLevel;
  explanation: string;
  timestamp: number;
}

export interface VolatilityGuardStatus {
  spikeDetected: boolean;
  anomalyDetected: boolean;
  killSwitchActive: boolean;
  currentVolatility: number;
  volatilityThreshold: number;
  timestamp: number;
}

export interface TradeSignal {
  symbol: TradingPair;
  side: OrderSide;
  strategy: StrategyType;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  size: number;
  confidence: number;
  timestamp: number;
  reasons?: string[];
  fibonacciContext?: {
    nearestLevel: string;
    distance: number;
  };
  technicalContext?: {
    rsi: number;
    trendStrength: number;
    momentum: number;
  };
}

export interface Position {
  symbol: TradingPair;
  side: PositionSide;
  size: number;
  entryPrice: number;
  markPrice: number;
  unrealizedPnl: number;
  leverage: number;
  marginMode: MarginMode;
  liquidationPrice: number;
  timestamp: number;
}

export interface Trade {
  id: string;
  symbol: TradingPair;
  side: OrderSide;
  price: number;
  size: number;
  fee: number;
  pnl: number;
  regime: RegimeType;
  strategy: StrategyType;
  explanation: string;
  timestamp: number;
}

export interface AccountBalance {
  coinName: string;
  available: number;
  equity: number;
  frozen: number;
  unrealizedPnl: number;
}

export interface SystemStatus {
  isRunning: boolean;
  currentRegime: RegimeClassification | null;
  riskDecision: RiskDecision | null;
  volatilityGuard: VolatilityGuardStatus | null;
  activePositions: Position[];
  accountBalance: AccountBalance | null;
  lastUpdated: number;
}

export {
  RegimeType,
  RiskLevel,
  StrategyType,
  OrderSide,
  PositionSide,
  MarginMode,
  StopLossAdjustment,
  TradingAction,
};
