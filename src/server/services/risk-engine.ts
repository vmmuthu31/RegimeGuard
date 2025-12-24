import {
  DEFAULT_RISK_PARAMS,
  RiskLevel,
  StopLossAdjustment,
  RegimeType,
} from "@/shared/constants";
import type {
  RegimeClassification,
  RiskDecision,
  Position,
  AccountBalance,
} from "@/shared/types";

interface RiskState {
  recentDrawdown: number;
  lastTradeTime: number;
  dailyLossPercent: number;
  consecutiveLosses: number;
}

export function evaluateRisk(
  regime: RegimeClassification,
  currentVolatility: number,
  positions: Position[],
  balance: AccountBalance | null,
  riskState: RiskState
): RiskDecision {
  const explanations: string[] = [];
  let positionSizeMultiplier = 1.0;
  let stopLossAdjustment: StopLossAdjustment = StopLossAdjustment.NORMAL;
  let tradeCooldownActive = false;
  let tradeSuspended = false;
  let riskLevel: RiskLevel = RiskLevel.LOW;

  if (regime.regime === RegimeType.HIGH_VOLATILITY) {
    positionSizeMultiplier = 0.25;
    stopLossAdjustment = StopLossAdjustment.TIGHTENED;
    riskLevel = RiskLevel.HIGH;
    explanations.push(
      "High volatility regime detected. Position size reduced to 25%."
    );
  } else if (regime.regime === RegimeType.RANGE_BOUND) {
    positionSizeMultiplier = 0.6;
    explanations.push("Range-bound regime. Position size set to 60%.");
  }

  if (regime.confidence < 0.6) {
    positionSizeMultiplier *= 0.7;
    explanations.push(
      `Low regime confidence (${(regime.confidence * 100).toFixed(
        0
      )}%). Size reduced by 30%.`
    );
  }

  if (currentVolatility > DEFAULT_RISK_PARAMS.volatilityThreshold) {
    const volatilityExcess =
      currentVolatility / DEFAULT_RISK_PARAMS.volatilityThreshold;
    const volatilityPenalty = Math.min(volatilityExcess * 0.2, 0.5);
    positionSizeMultiplier *= 1 - volatilityPenalty;
    stopLossAdjustment = StopLossAdjustment.TIGHTENED;
    explanations.push(
      `Elevated volatility (${(currentVolatility * 100).toFixed(
        2
      )}%). Stops tightened.`
    );
  }

  if (riskState.recentDrawdown > 0.02) {
    const drawdownPenalty = Math.min(riskState.recentDrawdown * 5, 0.5);
    positionSizeMultiplier *= 1 - drawdownPenalty;
    explanations.push(
      `Recent drawdown of ${(riskState.recentDrawdown * 100).toFixed(
        1
      )}%. Size reduced.`
    );
  }

  if (
    riskState.dailyLossPercent >
    DEFAULT_RISK_PARAMS.maxDailyLossPercent * 0.7
  ) {
    stopLossAdjustment = StopLossAdjustment.TIGHTENED;
    riskLevel = RiskLevel.HIGH;
    explanations.push("Approaching daily loss limit. Risk level elevated.");
  }

  if (riskState.dailyLossPercent >= DEFAULT_RISK_PARAMS.maxDailyLossPercent) {
    tradeSuspended = true;
    riskLevel = RiskLevel.CRITICAL;
    explanations.push("Daily loss limit reached. Trading suspended.");
  }

  const timeSinceLastTrade = Date.now() - riskState.lastTradeTime;
  if (timeSinceLastTrade < DEFAULT_RISK_PARAMS.tradeCooldownMs) {
    tradeCooldownActive = true;
    explanations.push("Trade cooldown active.");
  }

  if (riskState.consecutiveLosses >= 3) {
    tradeCooldownActive = true;
    positionSizeMultiplier *= 0.5;
    explanations.push(
      `${riskState.consecutiveLosses} consecutive losses. Extended cooldown and reduced size.`
    );
  }

  const totalPositionValue = positions.reduce(
    (sum, p) => sum + Math.abs(p.size * p.markPrice),
    0
  );
  const maxPositionValue =
    (balance?.equity || 0) * DEFAULT_RISK_PARAMS.maxPositionSizePercent;

  if (totalPositionValue > maxPositionValue * 0.8) {
    positionSizeMultiplier *= 0.3;
    riskLevel = riskLevel === RiskLevel.LOW ? RiskLevel.MEDIUM : riskLevel;
    explanations.push(
      "Approaching position size limit. New positions reduced."
    );
  }

  positionSizeMultiplier = Math.max(0.1, Math.min(positionSizeMultiplier, 1.0));

  if (!tradeSuspended && riskLevel !== RiskLevel.CRITICAL) {
    if (positionSizeMultiplier < 0.3) {
      riskLevel = RiskLevel.HIGH;
    } else if (positionSizeMultiplier < 0.7) {
      riskLevel = riskLevel === RiskLevel.LOW ? RiskLevel.MEDIUM : riskLevel;
    }
  }

  return {
    positionSizeMultiplier,
    stopLossAdjustment,
    tradeCooldownActive,
    tradeSuspended,
    riskLevel,
    explanation: explanations.join(" "),
    timestamp: Date.now(),
  };
}

export function calculatePositionSize(
  baseSize: number,
  riskDecision: RiskDecision,
  balance: AccountBalance | null,
  currentPrice: number
): number {
  if (riskDecision.tradeSuspended) {
    return 0;
  }

  const maxSize =
    ((balance?.equity || 0) * DEFAULT_RISK_PARAMS.maxPositionSizePercent) /
    currentPrice;
  const adjustedSize = baseSize * riskDecision.positionSizeMultiplier;

  return Math.min(adjustedSize, maxSize);
}

export function calculateStopLoss(
  entryPrice: number,
  side: "LONG" | "SHORT",
  atr: number,
  stopLossAdjustment: StopLossAdjustment
): number {
  const baseStopPercent = DEFAULT_RISK_PARAMS.defaultStopLossPercent;
  let adjustmentMultiplier = 1.0;

  if (stopLossAdjustment === StopLossAdjustment.TIGHTENED) {
    adjustmentMultiplier = 0.7;
  } else if (stopLossAdjustment === StopLossAdjustment.WIDENED) {
    adjustmentMultiplier = 1.3;
  }

  const atrBasedStop = (atr / entryPrice) * 2;
  const stopDistance =
    Math.max(baseStopPercent, atrBasedStop) * adjustmentMultiplier;

  if (side === "LONG") {
    return entryPrice * (1 - stopDistance);
  }
  return entryPrice * (1 + stopDistance);
}
