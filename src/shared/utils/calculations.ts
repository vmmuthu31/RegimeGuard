export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function calculateATR(
  candles: Array<{ high: number; low: number; close: number }>,
  period: number = 14
): number {
  if (candles.length < period + 1) return 0;

  const trueRanges: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    const current = candles[i];
    const previous = candles[i - 1];
    const tr = Math.max(
      current.high - current.low,
      Math.abs(current.high - previous.close),
      Math.abs(current.low - previous.close)
    );
    trueRanges.push(tr);
  }

  const recentTRs = trueRanges.slice(-period);
  return recentTRs.reduce((sum, tr) => sum + tr, 0) / period;
}

export function calculateEMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1] || 0;

  const multiplier = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((sum, p) => sum + p, 0) / period;

  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }

  return ema;
}

export function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;

  const changes: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  const recentChanges = changes.slice(-period);
  const gains = recentChanges.filter((c) => c > 0);
  const losses = recentChanges.filter((c) => c < 0).map((c) => Math.abs(c));

  const avgGain =
    gains.length > 0 ? gains.reduce((s, g) => s + g, 0) / period : 0;
  const avgLoss =
    losses.length > 0 ? losses.reduce((s, l) => s + l, 0) / period : 0;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

export function calculateVolatility(returns: number[]): number {
  if (returns.length < 2) return 0;
  const mean = returns.reduce((s, r) => s + r, 0) / returns.length;
  const squaredDiffs = returns.map((r) => Math.pow(r - mean, 2));
  const variance = squaredDiffs.reduce((s, d) => s + d, 0) / returns.length;
  return Math.sqrt(variance);
}

export function generateClientOid(): string {
  return `rg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export interface FibonacciLevels {
  high: number;
  low: number;
  levels: {
    level: number;
    price: number;
    label: string;
  }[];
}

export function calculateFibonacciLevels(
  high: number,
  low: number
): FibonacciLevels {
  const range = high - low;
  const fibRatios = [
    { ratio: 0, label: "0%" },
    { ratio: 0.236, label: "23.6%" },
    { ratio: 0.382, label: "38.2%" },
    { ratio: 0.5, label: "50%" },
    { ratio: 0.618, label: "61.8%" },
    { ratio: 0.786, label: "78.6%" },
    { ratio: 1, label: "100%" },
  ];

  return {
    high,
    low,
    levels: fibRatios.map((fib) => ({
      level: fib.ratio,
      price: high - range * fib.ratio,
      label: fib.label,
    })),
  };
}

export function findNearestFibLevel(
  currentPrice: number,
  fibLevels: FibonacciLevels
): { level: number; price: number; label: string; distance: number } | null {
  if (!fibLevels.levels.length) return null;

  let nearest = fibLevels.levels[0];
  let minDistance = Math.abs(currentPrice - nearest.price);

  for (const level of fibLevels.levels) {
    const distance = Math.abs(currentPrice - level.price);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = level;
    }
  }

  return {
    ...nearest,
    distance: (minDistance / currentPrice) * 100,
  };
}

export interface SwingPoint {
  index: number;
  timestamp: number;
  price: number;
  type: "high" | "low";
  strength: number;
}

export function detectSwingPoints(
  candles: Array<{
    timestamp: number;
    high: number;
    low: number;
    close: number;
  }>,
  lookback: number = 5
): SwingPoint[] {
  if (candles.length < lookback * 2 + 1) return [];

  const swingPoints: SwingPoint[] = [];

  for (let i = lookback; i < candles.length - lookback; i++) {
    const current = candles[i];

    let isSwingHigh = true;
    for (let j = i - lookback; j <= i + lookback; j++) {
      if (j !== i && candles[j].high >= current.high) {
        isSwingHigh = false;
        break;
      }
    }

    if (isSwingHigh) {
      const leftMax = Math.max(
        ...candles.slice(i - lookback, i).map((c) => c.high)
      );
      const rightMax = Math.max(
        ...candles.slice(i + 1, i + lookback + 1).map((c) => c.high)
      );
      const avgNeighbor = (leftMax + rightMax) / 2;
      const strength = Math.min((current.high - avgNeighbor) / avgNeighbor, 1);

      swingPoints.push({
        index: i,
        timestamp: current.timestamp,
        price: current.high,
        type: "high",
        strength: Math.max(strength, 0.1),
      });
    }

    let isSwingLow = true;
    for (let j = i - lookback; j <= i + lookback; j++) {
      if (j !== i && candles[j].low <= current.low) {
        isSwingLow = false;
        break;
      }
    }

    if (isSwingLow) {
      const leftMin = Math.min(
        ...candles.slice(i - lookback, i).map((c) => c.low)
      );
      const rightMin = Math.min(
        ...candles.slice(i + 1, i + lookback + 1).map((c) => c.low)
      );
      const avgNeighbor = (leftMin + rightMin) / 2;
      const strength = Math.min((avgNeighbor - current.low) / avgNeighbor, 1);

      swingPoints.push({
        index: i,
        timestamp: current.timestamp,
        price: current.low,
        type: "low",
        strength: Math.max(strength, 0.1),
      });
    }
  }

  return swingPoints.sort((a, b) => a.timestamp - b.timestamp);
}

export function calculateSupportResistance(
  swingPoints: SwingPoint[],
  currentPrice: number,
  tolerance: number = 0.02
): {
  support: number[];
  resistance: number[];
} {
  if (!swingPoints.length) return { support: [], resistance: [] };

  const highs = swingPoints.filter((p) => p.type === "high");
  const lows = swingPoints.filter((p) => p.type === "low");

  const clusterPrices = (points: SwingPoint[]): number[] => {
    if (!points.length) return [];

    const sorted = [...points].sort((a, b) => a.price - b.price);
    const clusters: number[][] = [[sorted[0].price]];

    for (let i = 1; i < sorted.length; i++) {
      const lastCluster = clusters[clusters.length - 1];
      const lastPrice = lastCluster[lastCluster.length - 1];

      if (Math.abs(sorted[i].price - lastPrice) / lastPrice <= tolerance) {
        lastCluster.push(sorted[i].price);
      } else {
        clusters.push([sorted[i].price]);
      }
    }
    return clusters.map(
      (cluster) => cluster.reduce((sum, p) => sum + p, 0) / cluster.length
    );
  };

  const resistanceLevels = clusterPrices(highs).filter(
    (price) => price > currentPrice
  );
  const supportLevels = clusterPrices(lows).filter(
    (price) => price < currentPrice
  );

  return {
    support: supportLevels.slice(-3).reverse(),
    resistance: resistanceLevels.slice(0, 3),
  };
}
