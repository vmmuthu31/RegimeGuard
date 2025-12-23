import {
  REGIME_STRATEGY_MAP,
  STRATEGY_TYPES,
  type TradingPair,
} from "@/shared/constants";
import type {
  RegimeClassification,
  TechnicalIndicators,
  TradeSignal,
} from "@/shared/types";

export function selectStrategy(regime: RegimeClassification) {
  return REGIME_STRATEGY_MAP[regime.regime];
}

export function generateTrendFollowingSignal(
  symbol: TradingPair,
  indicators: TechnicalIndicators,
  currentPrice: number,
  atr: number
): TradeSignal | null {
  const { ema9, ema21, momentum, rsi } = indicators;

  if (ema9 <= ema21) {
    return null;
  }

  if (momentum <= 0.005) {
    return null;
  }

  if (rsi > 75) {
    return null;
  }

  const side: "BUY" | "SELL" = ema9 > ema21 ? "BUY" : "SELL";
  const stopDistance = atr * 2;
  const takeProfitDistance = atr * 3;

  return {
    symbol,
    side,
    strategy: STRATEGY_TYPES.TREND_FOLLOWING,
    entryPrice: currentPrice,
    stopLoss:
      side === "BUY"
        ? currentPrice - stopDistance
        : currentPrice + stopDistance,
    takeProfit:
      side === "BUY"
        ? currentPrice + takeProfitDistance
        : currentPrice - takeProfitDistance,
    size: 0,
    confidence: Math.min((Math.abs(ema9 - ema21) / ema21) * 20, 0.9),
    timestamp: Date.now(),
  };
}

export function generateMeanReversionSignal(
  symbol: TradingPair,
  indicators: TechnicalIndicators,
  currentPrice: number,
  atr: number
): TradeSignal | null {
  const { rsi, ema21 } = indicators;

  const isOversold = rsi < 30;
  const isOverbought = rsi > 70;

  if (!isOversold && !isOverbought) {
    return null;
  }

  const side: "BUY" | "SELL" = isOversold ? "BUY" : "SELL";
  const stopDistance = atr * 1.5;

  return {
    symbol,
    side,
    strategy: STRATEGY_TYPES.MEAN_REVERSION,
    entryPrice: currentPrice,
    stopLoss:
      side === "BUY"
        ? currentPrice - stopDistance
        : currentPrice + stopDistance,
    takeProfit: ema21,
    size: 0,
    confidence: isOversold ? (30 - rsi) / 30 : (rsi - 70) / 30,
    timestamp: Date.now(),
  };
}

export function generateTradeSignal(
  symbol: TradingPair,
  regime: RegimeClassification,
  indicators: TechnicalIndicators,
  currentPrice: number
): TradeSignal | null {
  const strategy = selectStrategy(regime);

  if (strategy === STRATEGY_TYPES.NO_TRADE) {
    return null;
  }

  const atr = indicators.atr;

  if (strategy === STRATEGY_TYPES.TREND_FOLLOWING) {
    return generateTrendFollowingSignal(symbol, indicators, currentPrice, atr);
  }

  if (strategy === STRATEGY_TYPES.MEAN_REVERSION) {
    return generateMeanReversionSignal(symbol, indicators, currentPrice, atr);
  }

  return null;
}
