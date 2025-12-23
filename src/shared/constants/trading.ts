export const WEEX_BASE_URL = "https://api-contract.weex.com";

export const TRADING_PAIRS = [
  "cmt_btcusdt",
  "cmt_ethusdt",
  "cmt_solusdt",
  "cmt_dogeusdt",
  "cmt_xrpusdt",
  "cmt_adausdt",
  "cmt_bnbusdt",
  "cmt_ltcusdt",
] as const;

export type TradingPair = (typeof TRADING_PAIRS)[number];

export const MAX_LEVERAGE = 20;

export const REGIME_TYPES = {
  TRENDING: "TRENDING",
  RANGE_BOUND: "RANGE_BOUND",
  HIGH_VOLATILITY: "HIGH_VOLATILITY",
} as const;

export type RegimeType = (typeof REGIME_TYPES)[keyof typeof REGIME_TYPES];

export const STRATEGY_TYPES = {
  TREND_FOLLOWING: "TREND_FOLLOWING",
  MEAN_REVERSION: "MEAN_REVERSION",
  NO_TRADE: "NO_TRADE",
} as const;

export type StrategyType = (typeof STRATEGY_TYPES)[keyof typeof STRATEGY_TYPES];

export const ORDER_SIDES = {
  BUY: "1",
  SELL: "2",
} as const;

export const ORDER_TYPES = {
  LIMIT: "0",
  MARKET: "1",
} as const;

export const RISK_LEVELS = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;

export type RiskLevel = (typeof RISK_LEVELS)[keyof typeof RISK_LEVELS];

export const REGIME_STRATEGY_MAP: Record<RegimeType, StrategyType> = {
  [REGIME_TYPES.TRENDING]: STRATEGY_TYPES.TREND_FOLLOWING,
  [REGIME_TYPES.RANGE_BOUND]: STRATEGY_TYPES.MEAN_REVERSION,
  [REGIME_TYPES.HIGH_VOLATILITY]: STRATEGY_TYPES.NO_TRADE,
};

export const DEFAULT_RISK_PARAMS = {
  maxPositionSizePercent: 0.1,
  defaultStopLossPercent: 0.02,
  maxDailyLossPercent: 0.05,
  tradeCooldownMs: 60000,
  volatilityThreshold: 0.03,
} as const;
