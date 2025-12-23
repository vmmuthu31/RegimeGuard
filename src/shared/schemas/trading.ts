import { z } from "zod/v4";
import {
  TRADING_PAIRS,
  REGIME_TYPES,
  STRATEGY_TYPES,
  RISK_LEVELS,
} from "../constants";

export const TradingPairSchema = z.enum(TRADING_PAIRS);

export const RegimeTypeSchema = z.enum([
  REGIME_TYPES.TRENDING,
  REGIME_TYPES.RANGE_BOUND,
  REGIME_TYPES.HIGH_VOLATILITY,
]);

export const StrategyTypeSchema = z.enum([
  STRATEGY_TYPES.TREND_FOLLOWING,
  STRATEGY_TYPES.MEAN_REVERSION,
  STRATEGY_TYPES.NO_TRADE,
]);

export const RiskLevelSchema = z.enum([
  RISK_LEVELS.LOW,
  RISK_LEVELS.MEDIUM,
  RISK_LEVELS.HIGH,
  RISK_LEVELS.CRITICAL,
]);

export const MarketDataSchema = z.object({
  symbol: TradingPairSchema,
  last: z.number(),
  bestAsk: z.number(),
  bestBid: z.number(),
  high24h: z.number(),
  low24h: z.number(),
  volume24h: z.number(),
  timestamp: z.number(),
  priceChangePercent: z.number(),
  markPrice: z.number(),
  indexPrice: z.number(),
});

export const CandleSchema = z.object({
  timestamp: z.number(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number(),
});

export const TechnicalIndicatorsSchema = z.object({
  atr: z.number(),
  ema9: z.number(),
  ema21: z.number(),
  rsi: z.number(),
  volatility: z.number(),
  momentum: z.number(),
  trendStrength: z.number(),
});

export const RegimeClassificationSchema = z.object({
  regime: RegimeTypeSchema,
  confidence: z.number().min(0).max(1),
  features: z.object({
    momentum: z.number(),
    volatility: z.number(),
    trendStrength: z.number(),
  }),
  timestamp: z.number(),
});

export const RiskDecisionSchema = z.object({
  positionSizeMultiplier: z.number().min(0).max(1),
  stopLossAdjustment: z.enum(["NORMAL", "TIGHTENED", "WIDENED"]),
  tradeCooldownActive: z.boolean(),
  tradeSuspended: z.boolean(),
  riskLevel: RiskLevelSchema,
  explanation: z.string(),
  timestamp: z.number(),
});

export const VolatilityGuardStatusSchema = z.object({
  spikeDetected: z.boolean(),
  anomalyDetected: z.boolean(),
  killSwitchActive: z.boolean(),
  currentVolatility: z.number(),
  volatilityThreshold: z.number(),
  timestamp: z.number(),
});

export const TradeSignalSchema = z.object({
  symbol: TradingPairSchema,
  side: z.enum(["BUY", "SELL"]),
  strategy: StrategyTypeSchema,
  entryPrice: z.number(),
  stopLoss: z.number(),
  takeProfit: z.number(),
  size: z.number(),
  confidence: z.number().min(0).max(1),
  timestamp: z.number(),
});

export const PlaceOrderRequestSchema = z.object({
  symbol: TradingPairSchema,
  side: z.enum(["BUY", "SELL"]),
  size: z.number().positive(),
  price: z.number().positive().optional(),
  orderType: z.enum(["LIMIT", "MARKET"]),
  clientOid: z.string().optional(),
});

export const SetLeverageRequestSchema = z.object({
  symbol: TradingPairSchema,
  leverage: z.number().int().min(1).max(20),
});
