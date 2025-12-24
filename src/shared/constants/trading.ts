export * from "./enums";

export const WEEX_BASE_URL = "https://api-contract.weex.com";
export const WEEX_WS_PUBLIC_URL = "wss://ws-contract.weex.com/v2/ws/public";
export const WEEX_WS_PRIVATE_URL = "wss://ws-contract.weex.com/v2/ws/private";

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

export const WEEX_ORDER_SIDES = {
  BUY: "1",
  SELL: "2",
} as const;

export const WEEX_ORDER_TYPES = {
  LIMIT: "0",
  MARKET: "1",
} as const;

export const DEFAULT_RISK_PARAMS = {
  maxPositionSizePercent: 0.1,
  defaultStopLossPercent: 0.02,
  maxDailyLossPercent: 0.05,
  tradeCooldownMs: 60000,
  volatilityThreshold: 0.03,
} as const;

export const INDICATOR_DEFAULTS = {
  minCandlesRequired: 15,
  emaShortPeriod: 9,
  emaLongPeriod: 21,
  rsiPeriod: 14,
  atrPeriod: 14,
  volatilityLookback: 20,
} as const;

export const WEBSOCKET_CONFIG = {
  maxReconnectAttempts: 5,
  reconnectDelayMs: 1000,
  connectionLimitPerMinute: 300,
  maxSubscriptionsPerConnection: 100,
  pingIntervalMs: 30000,
} as const;

export const ORDER_SIDES = WEEX_ORDER_SIDES;
export const ORDER_TYPES = WEEX_ORDER_TYPES;

export const REGIME_TYPES = {
  TRENDING: "TRENDING" as const,
  RANGE_BOUND: "RANGE_BOUND" as const,
  HIGH_VOLATILITY: "HIGH_VOLATILITY" as const,
};

export const STRATEGY_TYPES = {
  TREND_FOLLOWING: "TREND_FOLLOWING" as const,
  MEAN_REVERSION: "MEAN_REVERSION" as const,
  NO_TRADE: "NO_TRADE" as const,
};

export const RISK_LEVELS = {
  LOW: "LOW" as const,
  MEDIUM: "MEDIUM" as const,
  HIGH: "HIGH" as const,
  CRITICAL: "CRITICAL" as const,
};
