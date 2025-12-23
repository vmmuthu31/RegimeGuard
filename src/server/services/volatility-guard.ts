import { DEFAULT_RISK_PARAMS } from "@/shared/constants";
import type { VolatilityGuardStatus, Candle } from "@/shared/types";
import { calculateVolatility } from "@/shared/utils";

export interface VolatilityHistory {
  values: number[];
  maxSize: number;
}

export function createVolatilityHistory(
  maxSize: number = 100
): VolatilityHistory {
  return { values: [], maxSize };
}

export function addVolatilityReading(
  history: VolatilityHistory,
  volatility: number
): VolatilityHistory {
  const newValues = [...history.values, volatility];
  if (newValues.length > history.maxSize) {
    newValues.shift();
  }
  return { ...history, values: newValues };
}

export function detectVolatilitySpike(
  currentVolatility: number,
  history: VolatilityHistory
): { spikeDetected: boolean; magnitude: number } {
  if (history.values.length < 10) {
    return { spikeDetected: false, magnitude: 0 };
  }

  const recentValues = history.values.slice(-20);
  const avgVolatility =
    recentValues.reduce((s, v) => s + v, 0) / recentValues.length;
  const stdDev = Math.sqrt(
    recentValues.reduce((s, v) => s + Math.pow(v - avgVolatility, 2), 0) /
      recentValues.length
  );

  const zScore = stdDev > 0 ? (currentVolatility - avgVolatility) / stdDev : 0;
  const spikeDetected =
    zScore > 2 ||
    currentVolatility > DEFAULT_RISK_PARAMS.volatilityThreshold * 2;

  return { spikeDetected, magnitude: zScore };
}

export function detectAnomaly(
  candles: Candle[],
  windowSize: number = 20
): { anomalyDetected: boolean; reason: string | null } {
  if (candles.length < windowSize) {
    return { anomalyDetected: false, reason: null };
  }

  const recent = candles.slice(-windowSize);
  const latest = recent[recent.length - 1];
  const volumes = recent.map((c) => c.volume);
  const avgVolume = volumes.reduce((s, v) => s + v, 0) / volumes.length;

  const priceRanges = recent.map((c) => (c.high - c.low) / c.low);
  const avgRange = priceRanges.reduce((s, r) => s + r, 0) / priceRanges.length;
  const latestRange = (latest.high - latest.low) / latest.low;

  if (latest.volume > avgVolume * 3) {
    return {
      anomalyDetected: true,
      reason: "Volume surge detected (3x average)",
    };
  }

  if (latestRange > avgRange * 3) {
    return {
      anomalyDetected: true,
      reason: "Abnormal price range (3x average)",
    };
  }

  const priceChange = Math.abs(latest.close - latest.open) / latest.open;
  if (priceChange > 0.03) {
    return {
      anomalyDetected: true,
      reason: "Flash move detected (>3% single candle)",
    };
  }

  return { anomalyDetected: false, reason: null };
}

export function evaluateVolatilityGuard(
  candles: Candle[],
  volatilityHistory: VolatilityHistory
): { status: VolatilityGuardStatus; updatedHistory: VolatilityHistory } {
  const closes = candles.map((c) => c.close);
  const returns = closes.slice(1).map((c, i) => (c - closes[i]) / closes[i]);
  const currentVolatility = calculateVolatility(returns.slice(-14));

  const updatedHistory = addVolatilityReading(
    volatilityHistory,
    currentVolatility
  );
  const { spikeDetected } = detectVolatilitySpike(
    currentVolatility,
    updatedHistory
  );
  const { anomalyDetected } = detectAnomaly(candles);

  const killSwitchActive = spikeDetected && anomalyDetected;

  const status: VolatilityGuardStatus = {
    spikeDetected,
    anomalyDetected,
    killSwitchActive,
    currentVolatility,
    volatilityThreshold: DEFAULT_RISK_PARAMS.volatilityThreshold,
    timestamp: Date.now(),
  };

  return { status, updatedHistory };
}
