import { NextResponse } from "next/server";
import { TRADING_PAIRS, TradingPair } from "@/shared/constants";
import { getTicker, getCandles } from "@/server/services/weex-client";
import {
  classifyMarketRegime,
  computeTechnicalIndicators,
} from "@/server/services/regime-classifier";
import {
  evaluateVolatilityGuard,
  createVolatilityHistory,
} from "@/server/services/volatility-guard";
import {
  analyzeMarketConditions,
  enhanceRegimeAnalysis,
  generateTradeExplanation,
  isGroqAvailable,
} from "@/server/services/groq-ai";
import { generateTradeSignal } from "@/server/services/strategy-executor";
import { evaluateRisk } from "@/server/services/risk-engine";
import { isGroqConfigured } from "@/server/config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const symbolParam = searchParams.get("symbol");

  const symbol: TradingPair = TRADING_PAIRS.includes(symbolParam as TradingPair)
    ? (symbolParam as TradingPair)
    : "cmt_btcusdt";

  try {
    switch (action) {
      case "status": {
        return NextResponse.json({
          success: true,
          data: {
            groqConfigured: isGroqConfigured(),
            groqAvailable: isGroqAvailable(),
            timestamp: Date.now(),
          },
        });
      }

      case "analyze": {
        const [ticker, candles] = await Promise.all([
          getTicker(symbol),
          getCandles(symbol, "1m", 100),
        ]);

        const regime = classifyMarketRegime(candles);
        const indicators = computeTechnicalIndicators(candles);
        const { status: volatilityStatus } = evaluateVolatilityGuard(
          candles,
          createVolatilityHistory()
        );

        const analysis = await analyzeMarketConditions({
          symbol,
          currentPrice: ticker.last,
          regime,
          indicators,
          volatilityStatus: {
            spikeDetected: volatilityStatus.spikeDetected,
            anomalyDetected: volatilityStatus.anomalyDetected,
            currentVolatility: volatilityStatus.currentVolatility,
          },
        });

        const enhancedRegime = await enhanceRegimeAnalysis({
          symbol,
          currentPrice: ticker.last,
          indicators,
          ruleBasedRegime: regime,
        });

        return NextResponse.json({
          success: true,
          data: {
            symbol,
            currentPrice: ticker.last,
            analysis,
            regime: {
              ...regime,
              enhancedConfidence: enhancedRegime.enhancedConfidence,
              aiInsight: enhancedRegime.aiInsight,
            },
            indicators: {
              rsi: indicators.rsi,
              ema9: indicators.ema9,
              ema21: indicators.ema21,
              momentum: indicators.momentum,
              trendStrength: indicators.trendStrength,
              volatility: indicators.volatility,
            },
            volatilityStatus,
            groqAvailable: isGroqAvailable(),
            timestamp: Date.now(),
          },
        });
      }

      default: {
        return NextResponse.json({
          success: true,
          data: {
            message: "RegimeGuard AI API",
            endpoints: {
              "GET /api/ai?action=status": "Check Groq AI configuration status",
              "GET /api/ai?action=analyze&symbol=cmt_btcusdt":
                "AI market analysis",
              "POST /api/ai (action=explain)": "Generate trade explanation",
            },
            groqConfigured: isGroqConfigured(),
            timestamp: Date.now(),
          },
        });
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action;

    switch (action) {
      case "explain": {
        const { signal, regime, riskDecision, symbol } = body;

        if (!signal || !regime) {
          return NextResponse.json(
            { success: false, error: "signal and regime are required" },
            { status: 400 }
          );
        }

        const explanation = await generateTradeExplanation({
          symbol: symbol || "cmt_btcusdt",
          signal,
          regime,
          riskDecision: riskDecision || {
            positionSizeMultiplier: 1,
            stopLossAdjustment: "NORMAL",
            tradeCooldownActive: false,
            tradeSuspended: false,
            riskLevel: "LOW",
            explanation: "",
            timestamp: Date.now(),
          },
        });

        return NextResponse.json({
          success: true,
          data: {
            explanation,
            groqAvailable: isGroqAvailable(),
            timestamp: Date.now(),
          },
        });
      }

      case "fullAnalysis": {
        const symbolParam = body.symbol;
        const symbol: TradingPair = TRADING_PAIRS.includes(
          symbolParam as TradingPair
        )
          ? (symbolParam as TradingPair)
          : "cmt_btcusdt";

        const [ticker, candles] = await Promise.all([
          getTicker(symbol),
          getCandles(symbol, "1m", 100),
        ]);

        const regime = classifyMarketRegime(candles);
        const indicators = computeTechnicalIndicators(candles);
        const { status: volatilityStatus } = evaluateVolatilityGuard(
          candles,
          createVolatilityHistory()
        );

        const signal = generateTradeSignal(
          symbol,
          regime,
          indicators,
          ticker.last
        );

        const riskDecision = evaluateRisk(
          regime,
          volatilityStatus.currentVolatility,
          [],
          null,
          {
            recentDrawdown: 0,
            lastTradeTime: 0,
            dailyLossPercent: 0,
            consecutiveLosses: 0,
          }
        );

        const [analysis, enhancedRegime] = await Promise.all([
          analyzeMarketConditions({
            symbol,
            currentPrice: ticker.last,
            regime,
            indicators,
            volatilityStatus: {
              spikeDetected: volatilityStatus.spikeDetected,
              anomalyDetected: volatilityStatus.anomalyDetected,
              currentVolatility: volatilityStatus.currentVolatility,
            },
          }),
          enhanceRegimeAnalysis({
            symbol,
            currentPrice: ticker.last,
            indicators,
            ruleBasedRegime: regime,
          }),
        ]);

        let tradeExplanation = null;
        if (signal) {
          tradeExplanation = await generateTradeExplanation({
            symbol,
            signal,
            regime,
            riskDecision,
          });
        }

        return NextResponse.json({
          success: true,
          data: {
            symbol,
            currentPrice: ticker.last,
            analysis,
            regime: {
              ...regime,
              enhancedConfidence: enhancedRegime.enhancedConfidence,
              aiInsight: enhancedRegime.aiInsight,
            },
            indicators,
            volatilityStatus,
            signal,
            riskDecision,
            tradeExplanation,
            groqAvailable: isGroqAvailable(),
            timestamp: Date.now(),
          },
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown action: ${action}`,
            availableActions: ["explain", "fullAnalysis"],
          },
          { status: 400 }
        );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
