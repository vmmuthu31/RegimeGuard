import { makeAuthenticatedRequest, type WeexConfig } from "./weex-account";

export interface AiLogInput {
  prompt?: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface AiLogOutput {
  signal?: string;
  response?: string;
  confidence?: number;
  target_price?: number;
  reason?: string;
  [key: string]: unknown;
}

export interface AiLogRequest {
  orderId?: number | null;
  stage: string;
  model: string;
  input: AiLogInput;
  output: AiLogOutput;
  explanation: string;
}

export interface AiLogResponse {
  code: string;
  msg: string;
  requestTime: number;
  data: string;
}

export async function uploadAiLog(
  config: WeexConfig,
  log: AiLogRequest
): Promise<AiLogResponse> {
  if (log.explanation.length > 1000) {
    throw new Error("Explanation must be 1000 characters or less");
  }

  return makeAuthenticatedRequest<AiLogResponse>(
    config,
    "POST",
    "/capi/v2/order/uploadAiLog",
    "",
    {
      orderId: log.orderId ?? null,
      stage: log.stage,
      model: log.model,
      input: log.input,
      output: log.output,
      explanation: log.explanation,
    }
  );
}

export function createRegimeClassificationLog(
  orderId: number | null,
  inputData: {
    symbol: string;
    rsi: number;
    ema9: number;
    ema21: number;
    atr: number;
    volatility: number;
    momentum: number;
  },
  outputData: {
    regime: string;
    confidence: number;
    strategy: string;
  },
  explanation: string
): AiLogRequest {
  return {
    orderId,
    stage: "Strategy Generation",
    model: "RegimeGuard-Classifier-v1",
    input: {
      prompt: `Classify market regime for ${inputData.symbol}`,
      data: {
        RSI_14: inputData.rsi,
        EMA_9: inputData.ema9,
        EMA_21: inputData.ema21,
        ATR_14: inputData.atr,
        Volatility: inputData.volatility,
        Momentum: inputData.momentum,
      },
    },
    output: {
      regime: outputData.regime,
      confidence: outputData.confidence,
      strategy: outputData.strategy,
      reason: `Market classified as ${outputData.regime} with ${(
        outputData.confidence * 100
      ).toFixed(1)}% confidence`,
    },
    explanation: explanation.slice(0, 1000),
  };
}

export function createRiskDecisionLog(
  orderId: number | null,
  inputData: {
    symbol: string;
    regime: string;
    regimeConfidence: number;
    currentVolatility: number;
    recentDrawdown: number;
    dailyLossPercent: number;
  },
  outputData: {
    positionSizeMultiplier: number;
    stopLossAdjustment: string;
    tradeSuspended: boolean;
    riskLevel: string;
  },
  explanation: string
): AiLogRequest {
  return {
    orderId,
    stage: "Risk Assessment",
    model: "RegimeGuard-RiskEngine-v1",
    input: {
      prompt: `Evaluate trading risk for ${inputData.symbol}`,
      data: {
        Regime: inputData.regime,
        RegimeConfidence: inputData.regimeConfidence,
        CurrentVolatility: inputData.currentVolatility,
        RecentDrawdown: inputData.recentDrawdown,
        DailyLossPercent: inputData.dailyLossPercent,
      },
    },
    output: {
      signal: outputData.tradeSuspended ? "NO_TRADE" : "TRADE_ALLOWED",
      confidence: 1 - outputData.positionSizeMultiplier,
      riskLevel: outputData.riskLevel,
      positionSizeMultiplier: outputData.positionSizeMultiplier,
      stopLossAdjustment: outputData.stopLossAdjustment,
      reason: `Risk level ${outputData.riskLevel}, position size at ${(
        outputData.positionSizeMultiplier * 100
      ).toFixed(0)}%`,
    },
    explanation: explanation.slice(0, 1000),
  };
}

export function createTradeExecutionLog(
  orderId: number,
  inputData: {
    symbol: string;
    regime: string;
    strategy: string;
    entryPrice: number;
    indicators: {
      rsi: number;
      ema9: number;
      ema21: number;
    };
  },
  outputData: {
    side: "BUY" | "SELL";
    size: number;
    stopLoss: number;
    takeProfit: number;
    confidence: number;
  },
  explanation: string
): AiLogRequest {
  return {
    orderId,
    stage: "Order Execution",
    model: "RegimeGuard-Executor-v1",
    input: {
      prompt: `Execute ${inputData.strategy} strategy for ${inputData.symbol}`,
      data: {
        Symbol: inputData.symbol,
        Regime: inputData.regime,
        Strategy: inputData.strategy,
        EntryPrice: inputData.entryPrice,
        RSI: inputData.indicators.rsi,
        EMA9: inputData.indicators.ema9,
        EMA21: inputData.indicators.ema21,
      },
    },
    output: {
      signal: outputData.side,
      confidence: outputData.confidence,
      target_price: outputData.takeProfit,
      size: outputData.size,
      stopLoss: outputData.stopLoss,
      reason: `${outputData.side} signal with ${(
        outputData.confidence * 100
      ).toFixed(1)}% confidence`,
    },
    explanation: explanation.slice(0, 1000),
  };
}

export function createVolatilityGuardLog(
  inputData: {
    symbol: string;
    currentVolatility: number;
    volatilityThreshold: number;
    spikeDetected: boolean;
    anomalyDetected: boolean;
  },
  outputData: {
    killSwitchActive: boolean;
    action: string;
  },
  explanation: string
): AiLogRequest {
  return {
    orderId: null,
    stage: "Risk Monitoring",
    model: "RegimeGuard-VolatilityGuard-v1",
    input: {
      prompt: `Monitor volatility for ${inputData.symbol}`,
      data: {
        CurrentVolatility: inputData.currentVolatility,
        VolatilityThreshold: inputData.volatilityThreshold,
        SpikeDetected: inputData.spikeDetected,
        AnomalyDetected: inputData.anomalyDetected,
      },
    },
    output: {
      signal: outputData.killSwitchActive ? "KILL_SWITCH" : "NORMAL",
      action: outputData.action,
      reason: outputData.killSwitchActive
        ? "Kill switch activated due to volatility spike and anomaly"
        : "Normal market conditions",
    },
    explanation: explanation.slice(0, 1000),
  };
}
