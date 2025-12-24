import {
  REGIME_STRATEGY_MAP,
  type TradingPair,
  OrderSide,
  StrategyType,
} from "@/shared/constants";
import type {
  RegimeClassification,
  TechnicalIndicators,
  TradeSignal,
} from "@/shared/types";
import { findNearestFibLevel } from "@/shared/utils";

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

  const side: OrderSide = ema9 > ema21 ? OrderSide.BUY : OrderSide.SELL;
  const stopDistance = atr * 2;
  const takeProfitDistance = atr * 3;

  const reasons: string[] = [
    `EMA crossover: ${ema9 > ema21 ? "Bullish" : "Bearish"}`,
    `Momentum: ${(momentum * 100).toFixed(2)}%`,
    `RSI: ${rsi.toFixed(1)} (healthy range)`,
  ];

  let fibContext;
  let confidenceBoost = 0;
  if (indicators.fibonacciLevels) {
    const nearestFib = findNearestFibLevel(
      currentPrice,
      indicators.fibonacciLevels
    );
    if (nearestFib && nearestFib.distance < 1) {
      fibContext = {
        nearestLevel: nearestFib.label,
        distance: nearestFib.distance,
      };
      confidenceBoost = 0.1;
      reasons.push(`Near Fibonacci ${nearestFib.label} level`);
    }
  }

  const baseConfidence = Math.min((Math.abs(ema9 - ema21) / ema21) * 20, 0.9);

  return {
    symbol,
    side,
    strategy: StrategyType.TREND_FOLLOWING,
    entryPrice: currentPrice,
    stopLoss:
      side === OrderSide.BUY
        ? currentPrice - stopDistance
        : currentPrice + stopDistance,
    takeProfit:
      side === OrderSide.BUY
        ? currentPrice + takeProfitDistance
        : currentPrice - takeProfitDistance,
    size: 0,
    confidence: Math.min(baseConfidence + confidenceBoost, 0.95),
    timestamp: Date.now(),
    reasons,
    fibonacciContext: fibContext,
    technicalContext: {
      rsi,
      trendStrength: indicators.trendStrength,
      momentum,
    },
  };
}

export function generateMeanReversionSignal(
  symbol: TradingPair,
  indicators: TechnicalIndicators,
  currentPrice: number,
  atr: number
): TradeSignal | null {
  const { rsi, ema21, fibonacciLevels, supportResistance } = indicators;

  const isOversold = rsi < 30;
  const isOverbought = rsi > 70;

  if (!isOversold && !isOverbought) {
    return null;
  }

  const side: OrderSide = isOversold ? OrderSide.BUY : OrderSide.SELL;
  const stopDistance = atr * 1.5;

  const reasons: string[] = [
    `RSI ${isOversold ? "oversold" : "overbought"}: ${rsi.toFixed(1)}`,
    `Mean reversion to EMA21: $${ema21.toFixed(2)}`,
  ];

  let takeProfitPrice = ema21;
  let confidenceBoost = 0;
  let fibContext;

  if (fibonacciLevels) {
    const nearestFib = findNearestFibLevel(currentPrice, fibonacciLevels);

    if (nearestFib) {
      fibContext = {
        nearestLevel: nearestFib.label,
        distance: nearestFib.distance,
      };

      if (
        ["38.2%", "50%", "61.8%"].includes(nearestFib.label) &&
        nearestFib.distance < 0.5
      ) {
        confidenceBoost = 0.15;
        reasons.push(
          `Strong support/resistance at Fibonacci ${nearestFib.label}`
        );

        const targetLevel = side === OrderSide.BUY ? 0.5 : 0.382;
        const fibTarget = fibonacciLevels.levels.find(
          (l) => l.level === targetLevel
        );
        if (fibTarget) {
          takeProfitPrice = fibTarget.price;
          reasons.push(
            `Target: Fibonacci ${fibTarget.label} at $${fibTarget.price.toFixed(
              2
            )}`
          );
        }
      }
    }
  }

  if (supportResistance) {
    if (side === OrderSide.BUY && supportResistance.support.length > 0) {
      const nearestSupport = supportResistance.support[0];
      if (Math.abs(currentPrice - nearestSupport) / currentPrice < 0.01) {
        confidenceBoost += 0.1;
        reasons.push(`At strong support zone: $${nearestSupport.toFixed(2)}`);
      }
    } else if (
      side === OrderSide.SELL &&
      supportResistance.resistance.length > 0
    ) {
      const nearestResistance = supportResistance.resistance[0];
      if (Math.abs(currentPrice - nearestResistance) / currentPrice < 0.01) {
        confidenceBoost += 0.1;
        reasons.push(
          `At strong resistance zone: $${nearestResistance.toFixed(2)}`
        );
      }
    }
  }

  const baseConfidence = isOversold ? (30 - rsi) / 30 : (rsi - 70) / 30;

  return {
    symbol,
    side,
    strategy: StrategyType.MEAN_REVERSION,
    entryPrice: currentPrice,
    stopLoss:
      side === OrderSide.BUY
        ? currentPrice - stopDistance
        : currentPrice + stopDistance,
    takeProfit: takeProfitPrice,
    size: 0,
    confidence: Math.min(baseConfidence + confidenceBoost, 0.95),
    timestamp: Date.now(),
    reasons,
    fibonacciContext: fibContext,
    technicalContext: {
      rsi,
      trendStrength: indicators.trendStrength,
      momentum: indicators.momentum,
    },
  };
}

export function generateTradeSignal(
  symbol: TradingPair,
  regime: RegimeClassification,
  indicators: TechnicalIndicators,
  currentPrice: number
): TradeSignal | null {
  const strategy = selectStrategy(regime);

  if (strategy === StrategyType.NO_TRADE) {
    return null;
  }

  const atr = indicators.atr;

  if (strategy === StrategyType.TREND_FOLLOWING) {
    return generateTrendFollowingSignal(symbol, indicators, currentPrice, atr);
  }

  if (strategy === StrategyType.MEAN_REVERSION) {
    return generateMeanReversionSignal(symbol, indicators, currentPrice, atr);
  }

  return null;
}
