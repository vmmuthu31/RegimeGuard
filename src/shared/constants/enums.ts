export enum RegimeType {
  TRENDING = "TRENDING",
  RANGE_BOUND = "RANGE_BOUND",
  HIGH_VOLATILITY = "HIGH_VOLATILITY",
}

export enum StrategyType {
  TREND_FOLLOWING = "TREND_FOLLOWING",
  MEAN_REVERSION = "MEAN_REVERSION",
  NO_TRADE = "NO_TRADE",
}

export enum RiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum OrderSide {
  BUY = "BUY",
  SELL = "SELL",
}

export enum PositionSide {
  LONG = "LONG",
  SHORT = "SHORT",
}

export enum MarginMode {
  CROSS = "CROSS",
  ISOLATED = "ISOLATED",
  SHARED = "SHARED",
}

export enum OrderType {
  LIMIT = "LIMIT",
  MARKET = "MARKET",
  STOP_LIMIT = "STOP_LIMIT",
  STOP_MARKET = "STOP_MARKET",
  TAKE_PROFIT_LIMIT = "TAKE_PROFIT_LIMIT",
  TAKE_PROFIT_MARKET = "TAKE_PROFIT_MARKET",
}

export enum OrderStatus {
  PENDING = "PENDING",
  OPEN = "OPEN",
  FILLED = "FILLED",
  PARTIALLY_FILLED = "PARTIALLY_FILLED",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
}

export enum AlertLevel {
  NORMAL = "NORMAL",
  WARNING = "WARNING",
  DANGER = "DANGER",
  CRITICAL = "CRITICAL",
}

export enum StopLossAdjustment {
  NORMAL = "NORMAL",
  TIGHTENED = "TIGHTENED",
  WIDENED = "WIDENED",
}

export enum KlineInterval {
  MINUTE_1 = "MINUTE_1",
  MINUTE_5 = "MINUTE_5",
  MINUTE_15 = "MINUTE_15",
  MINUTE_30 = "MINUTE_30",
  HOUR_1 = "HOUR_1",
  HOUR_2 = "HOUR_2",
  HOUR_4 = "HOUR_4",
  HOUR_6 = "HOUR_6",
  HOUR_8 = "HOUR_8",
  HOUR_12 = "HOUR_12",
  DAY_1 = "DAY_1",
  WEEK_1 = "WEEK_1",
  MONTH_1 = "MONTH_1",
}

export enum KlinePriceType {
  LAST_PRICE = "LAST_PRICE",
  MARK_PRICE = "MARK_PRICE",
}

export enum DepthLevel {
  LEVEL_15 = "15",
  LEVEL_200 = "200",
}

export enum DepthType {
  SNAPSHOT = "SNAPSHOT",
  CHANGED = "CHANGED",
}

export enum TradingAction {
  BUY = "BUY",
  SELL = "SELL",
  HOLD = "HOLD",
  EXIT = "EXIT",
}

export const REGIME_STRATEGY_MAP: Record<RegimeType, StrategyType> = {
  [RegimeType.TRENDING]: StrategyType.TREND_FOLLOWING,
  [RegimeType.RANGE_BOUND]: StrategyType.MEAN_REVERSION,
  [RegimeType.HIGH_VOLATILITY]: StrategyType.NO_TRADE,
};
