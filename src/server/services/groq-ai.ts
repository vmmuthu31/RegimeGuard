import Groq from "groq-sdk";
import { getGroqConfig } from "@/server/config";
import type {
  RegimeClassification,
  TechnicalIndicators,
  TradeSignal,
  RiskDecision,
} from "@/shared/types";
import type { TradingPair } from "@/shared/constants";

let groqClient: Groq | null = null;

function getClient(): Groq | null {
  if (groqClient) return groqClient;

  const config = getGroqConfig();
  if (!config) return null;

  groqClient = new Groq({ apiKey: config.apiKey });
  return groqClient;
}

export function isGroqAvailable(): boolean {
  return getClient() !== null;
}

interface MarketAnalysisInput {
  symbol: TradingPair;
  currentPrice: number;
  regime: RegimeClassification;
  indicators: TechnicalIndicators;
  volatilityStatus: {
    spikeDetected: boolean;
    anomalyDetected: boolean;
    currentVolatility: number;
  };
}

interface MarketAnalysisResult {
  summary: string;
  sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
  keyInsights: string[];
  riskWarnings: string[];
  confidence: number;
}

export async function analyzeMarketConditions(
  input: MarketAnalysisInput
): Promise<MarketAnalysisResult> {
  const client = getClient();

  if (!client) {
    return createFallbackAnalysis(input);
  }

  const prompt = buildMarketAnalysisPrompt(input);

  try {
    const completion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert quantitative trading analyst for RegimeGuard, an AI-driven risk-adaptive trading engine. 
Analyze market conditions and provide actionable insights. Be concise and data-driven.
Respond in JSON format only with these fields:
- summary: One sentence market overview
- sentiment: BULLISH, BEARISH, or NEUTRAL
- keyInsights: Array of 2-3 key observations
- riskWarnings: Array of 0-2 risk warnings
- confidence: Number 0-1 for analysis confidence`,
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return createFallbackAnalysis(input);
    }

    const parsed = JSON.parse(content);
    return {
      summary: parsed.summary || "Market analysis unavailable",
      sentiment: parsed.sentiment || "NEUTRAL",
      keyInsights: parsed.keyInsights || [],
      riskWarnings: parsed.riskWarnings || [],
      confidence: parsed.confidence || 0.5,
    };
  } catch {
    return createFallbackAnalysis(input);
  }
}

function buildMarketAnalysisPrompt(input: MarketAnalysisInput): string {
  return `Analyze ${input.symbol} market conditions:

Current Price: $${input.currentPrice.toFixed(2)}
Regime: ${input.regime.regime} (${(input.regime.confidence * 100).toFixed(
    0
  )}% confidence)

Technical Indicators:
- RSI(14): ${input.indicators.rsi.toFixed(1)}
- EMA9: $${input.indicators.ema9.toFixed(2)}
- EMA21: $${input.indicators.ema21.toFixed(2)}
- ATR(14): ${input.indicators.atr.toFixed(2)}
- Trend Strength: ${(input.indicators.trendStrength * 100).toFixed(0)}%
- Momentum: ${(input.indicators.momentum * 100).toFixed(2)}%
- Volatility: ${(input.indicators.volatility * 100).toFixed(2)}%

Volatility Status:
- Spike Detected: ${input.volatilityStatus.spikeDetected}
- Anomaly Detected: ${input.volatilityStatus.anomalyDetected}

Provide analysis in JSON format.`;
}

function createFallbackAnalysis(
  input: MarketAnalysisInput
): MarketAnalysisResult {
  const { regime, indicators, volatilityStatus } = input;

  let sentiment: "BULLISH" | "BEARISH" | "NEUTRAL" = "NEUTRAL";
  if (regime.regime === "TRENDING" && indicators.momentum > 0) {
    sentiment = "BULLISH";
  } else if (regime.regime === "TRENDING" && indicators.momentum < 0) {
    sentiment = "BEARISH";
  }

  const keyInsights: string[] = [];
  if (regime.regime === "TRENDING") {
    keyInsights.push(
      `Market in ${indicators.momentum > 0 ? "upward" : "downward"} trend`
    );
  } else if (regime.regime === "RANGE_BOUND") {
    keyInsights.push("Market consolidating in range");
  } else {
    keyInsights.push("High volatility conditions detected");
  }

  if (indicators.rsi < 30) {
    keyInsights.push("RSI indicates oversold conditions");
  } else if (indicators.rsi > 70) {
    keyInsights.push("RSI indicates overbought conditions");
  }

  const riskWarnings: string[] = [];
  if (volatilityStatus.spikeDetected) {
    riskWarnings.push("Volatility spike detected - reduce position sizes");
  }
  if (volatilityStatus.anomalyDetected) {
    riskWarnings.push("Market anomaly detected - exercise caution");
  }

  return {
    summary: `${input.symbol} is in a ${regime.regime
      .toLowerCase()
      .replace("_", "-")} state with ${(regime.confidence * 100).toFixed(
      0
    )}% confidence.`,
    sentiment,
    keyInsights,
    riskWarnings,
    confidence: regime.confidence * 0.8,
  };
}

interface TradeExplanationInput {
  symbol: TradingPair;
  signal: TradeSignal;
  regime: RegimeClassification;
  riskDecision: RiskDecision;
}

export async function generateTradeExplanation(
  input: TradeExplanationInput
): Promise<string> {
  const client = getClient();

  if (!client) {
    return createFallbackExplanation(input);
  }

  const prompt = `Explain this trading decision for ${
    input.symbol
  } in 2-3 sentences:

Signal: ${input.signal.side} at $${input.signal.entryPrice.toFixed(2)}
Strategy: ${input.signal.strategy}
Confidence: ${(input.signal.confidence * 100).toFixed(0)}%
Stop Loss: $${input.signal.stopLoss.toFixed(2)}
Take Profit: $${input.signal.takeProfit.toFixed(2)}

Market Regime: ${input.regime.regime} (${(
    input.regime.confidence * 100
  ).toFixed(0)}% confidence)
Position Size Multiplier: ${(
    input.riskDecision.positionSizeMultiplier * 100
  ).toFixed(0)}%
Risk Level: ${input.riskDecision.riskLevel}

Signal Reasons:
${input.signal.reasons?.map((r) => `- ${r}`).join("\n") || "N/A"}

Provide a professional, concise explanation suitable for logging.`;

  try {
    const completion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a trading decision logger for RegimeGuard. Provide concise, professional explanations of trading decisions. Limit response to 2-3 sentences.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_tokens: 200,
    });

    return (
      completion.choices[0]?.message?.content ||
      createFallbackExplanation(input)
    );
  } catch {
    return createFallbackExplanation(input);
  }
}

function createFallbackExplanation(input: TradeExplanationInput): string {
  const { signal, regime, riskDecision } = input;
  const direction = signal.side === "BUY" ? "long" : "short";
  const riskReward =
    Math.abs(signal.takeProfit - signal.entryPrice) /
    Math.abs(signal.entryPrice - signal.stopLoss);

  return `Opening ${direction} position using ${signal.strategy
    .toLowerCase()
    .replace("_", " ")} strategy under ${regime.regime
    .toLowerCase()
    .replace("_", "-")} regime (${(regime.confidence * 100).toFixed(
    0
  )}% confidence). Position sized at ${(
    riskDecision.positionSizeMultiplier * 100
  ).toFixed(0)}% with ${riskReward.toFixed(1)}:1 risk/reward ratio.`;
}

interface RegimeEnhancementInput {
  symbol: TradingPair;
  currentPrice: number;
  indicators: TechnicalIndicators;
  ruleBasedRegime: RegimeClassification;
}

export async function enhanceRegimeAnalysis(
  input: RegimeEnhancementInput
): Promise<{ enhancedConfidence: number; aiInsight: string }> {
  const client = getClient();

  if (!client) {
    return {
      enhancedConfidence: input.ruleBasedRegime.confidence,
      aiInsight: "AI analysis unavailable - using rule-based classification",
    };
  }

  const prompt = `Validate this regime classification for ${input.symbol}:

Rule-Based Classification: ${input.ruleBasedRegime.regime}
Confidence: ${(input.ruleBasedRegime.confidence * 100).toFixed(0)}%

Indicators:
- RSI: ${input.indicators.rsi.toFixed(1)}
- EMA9/EMA21: ${input.indicators.ema9.toFixed(
    2
  )} / ${input.indicators.ema21.toFixed(2)}
- Trend Strength: ${(input.indicators.trendStrength * 100).toFixed(0)}%
- Momentum: ${(input.indicators.momentum * 100).toFixed(2)}%
- Volatility: ${(input.indicators.volatility * 100).toFixed(2)}%

Respond in JSON with:
- agree: boolean (do you agree with classification?)
- adjustedConfidence: number 0-1
- insight: one sentence explanation`;

  try {
    const completion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a regime detection expert. Validate and enhance regime classifications. Respond in JSON only.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_tokens: 150,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return {
        enhancedConfidence: input.ruleBasedRegime.confidence,
        aiInsight: "AI validation unavailable",
      };
    }

    const parsed = JSON.parse(content);
    return {
      enhancedConfidence:
        parsed.adjustedConfidence || input.ruleBasedRegime.confidence,
      aiInsight: parsed.insight || "No additional insight",
    };
  } catch {
    return {
      enhancedConfidence: input.ruleBasedRegime.confidence,
      aiInsight: "AI analysis error - using rule-based classification",
    };
  }
}
