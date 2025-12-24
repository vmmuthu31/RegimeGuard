import { DEFAULT_RISK_PARAMS, RegimeType } from "@/shared/constants";
import type {
  RegimeClassification,
  Candle,
  TechnicalIndicators,
} from "@/shared/types";
import {
  calculateATR,
  calculateEMA,
  calculateRSI,
  calculateVolatility,
  calculateFibonacciLevels,
  detectSwingPoints,
  calculateSupportResistance,
} from "@/shared/utils";

export function computeTechnicalIndicators(
  candles: Candle[]
): TechnicalIndicators {
  if (candles.length < 21) {
    return {
      atr: 0,
      ema9: 0,
      ema21: 0,
      rsi: 50,
      volatility: 0,
      momentum: 0,
      trendStrength: 0,
    };
  }

  const closes = candles.map((c) => c.close);
  const returns = closes.slice(1).map((c, i) => (c - closes[i]) / closes[i]);

  const atr = calculateATR(candles, 14);
  const ema9 = calculateEMA(closes, 9);
  const ema21 = calculateEMA(closes, 21);
  const rsi = calculateRSI(closes, 14);
  const volatility = calculateVolatility(returns.slice(-14));

  const currentPrice = closes[closes.length - 1];
  const priceChange =
    (currentPrice - closes[closes.length - 10]) / closes[closes.length - 10];
  const momentum = priceChange;

  const emaDiff = (ema9 - ema21) / ema21;
  const trendStrength = Math.abs(emaDiff) * 10;

  const vwap =
    candles.reduce((sum, c) => sum + c.close * c.volume, 0) /
    candles.reduce((sum, c) => sum + c.volume, 0);

  const swingPoints = detectSwingPoints(candles, 5);

  let fibonacciLevels;
  if (swingPoints.length >= 2) {
    const highs = swingPoints.filter((p) => p.type === "high");
    const lows = swingPoints.filter((p) => p.type === "low");

    if (highs.length > 0 && lows.length > 0) {
      const recentHigh = highs[highs.length - 1].price;
      const recentLow = lows[lows.length - 1].price;
      fibonacciLevels = calculateFibonacciLevels(
        Math.max(recentHigh, recentLow),
        Math.min(recentHigh, recentLow)
      );
    }
  }

  const supportResistance = swingPoints.length
    ? calculateSupportResistance(swingPoints, currentPrice)
    : undefined;

  return {
    atr,
    ema9,
    ema21,
    rsi,
    volatility,
    momentum,
    trendStrength: Math.min(trendStrength, 1),
    vwap,
    fibonacciLevels,
    swingPoints,
    supportResistance,
  };
}

function classifyRegimeFromIndicators(indicators: TechnicalIndicators): {
  regime: RegimeType;
  confidence: number;
} {
  const { volatility, trendStrength, momentum, rsi } = indicators;
  const volatilityThreshold = DEFAULT_RISK_PARAMS.volatilityThreshold;

  if (volatility > volatilityThreshold * 1.5) {
    const confidence = Math.min(0.5 + volatility * 5, 0.95);
    return { regime: RegimeType.HIGH_VOLATILITY, confidence };
  }

  const isTrending = trendStrength > 0.3 && Math.abs(momentum) > 0.01;
  const isOverboughtOversold = rsi > 70 || rsi < 30;

  if (isTrending && !isOverboughtOversold) {
    const confidence = Math.min(0.5 + trendStrength * 0.4, 0.9);
    return { regime: RegimeType.TRENDING, confidence };
  }

  if (!isTrending && volatility < volatilityThreshold) {
    const meanReversionSignal = isOverboughtOversold ? 0.2 : 0;
    const confidence = Math.min(
      0.5 + (1 - trendStrength) * 0.3 + meanReversionSignal,
      0.85
    );
    return { regime: RegimeType.RANGE_BOUND, confidence };
  }

  if (trendStrength > 0.2) {
    return { regime: RegimeType.TRENDING, confidence: 0.55 };
  }

  return { regime: RegimeType.RANGE_BOUND, confidence: 0.5 };
}

export function classifyMarketRegime(candles: Candle[]): RegimeClassification {
  const indicators = computeTechnicalIndicators(candles);
  const { regime, confidence } = classifyRegimeFromIndicators(indicators);

  return {
    regime,
    confidence,
    features: {
      momentum: indicators.momentum,
      volatility: indicators.volatility,
      trendStrength: indicators.trendStrength,
    },
    timestamp: Date.now(),
  };
}

export function detectRegimeTransition(
  previousRegime: RegimeClassification | null,
  currentRegime: RegimeClassification
): {
  transitionOccurred: boolean;
  fromRegime: RegimeType | null;
  toRegime: RegimeType;
  confidenceDelta: number;
} {
  if (!previousRegime) {
    return {
      transitionOccurred: false,
      fromRegime: null,
      toRegime: currentRegime.regime,
      confidenceDelta: 0,
    };
  }

  const transitionOccurred = previousRegime.regime !== currentRegime.regime;
  const confidenceDelta = currentRegime.confidence - previousRegime.confidence;

  return {
    transitionOccurred,
    fromRegime: previousRegime.regime,
    toRegime: currentRegime.regime,
    confidenceDelta,
  };
}
