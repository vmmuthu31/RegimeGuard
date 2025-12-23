/**
 * Trade API Route
 * Handles all trading operations for RegimeGuard
 */

import { NextResponse } from "next/server";
import { getWeexConfig } from "@/server/config";
import { TRADING_PAIRS, TradingPair } from "@/shared/constants";
import {
    placeOrder,
    placeBatchOrders,
    cancelOrder,
    cancelBatchOrders,
    cancelAllOrders,
    getOrderDetail,
    getOrderHistory,
    getCurrentOrders,
    getOrderFills,
    placeTriggerOrder,
    cancelTriggerOrder,
    getCurrentPlanOrders,
    getHistoryPlanOrders,
    closeAllPositions,
    placeTpSlOrder,
    modifyTpSlOrder,
    openLong,
    openShort,
    closeLong,
    closeShort,
    type PlaceOrderParams,
    type TriggerOrderParams,
    type TpSlOrderParams,
    type BatchOrderData,
} from "@/server/services/weex-trade";
import { evaluateRisk } from "@/server/services/risk-engine";
import { classifyMarketRegime } from "@/server/services/regime-classifier";
import { getCandles } from "@/server/services/weex-client";
import type { RegimeClassification } from "@/shared/types";

// GET: Query orders (current, history, fills, detail)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    try {
        const config = getWeexConfig();

        switch (action) {
            case "detail": {
                const orderId = searchParams.get("orderId");
                if (!orderId) {
                    return NextResponse.json(
                        { success: false, error: "orderId is required" },
                        { status: 400 }
                    );
                }
                const order = await getOrderDetail(config, orderId);
                return NextResponse.json({ success: true, data: order });
            }

            case "history": {
                const symbol = searchParams.get("symbol") as TradingPair | null;
                const pageSize = searchParams.get("pageSize");
                const orders = await getOrderHistory(
                    config,
                    symbol || undefined,
                    pageSize ? parseInt(pageSize) : undefined
                );
                return NextResponse.json({ success: true, data: orders });
            }

            case "current": {
                const symbol = searchParams.get("symbol") as TradingPair | null;
                const limit = searchParams.get("limit");
                const orders = await getCurrentOrders(config, {
                    symbol: symbol || undefined,
                    limit: limit ? parseInt(limit) : undefined,
                });
                return NextResponse.json({ success: true, data: orders });
            }

            case "fills": {
                const symbol = searchParams.get("symbol") as TradingPair | null;
                const orderId = searchParams.get("orderId");
                const fills = await getOrderFills(config, {
                    symbol: symbol || undefined,
                    orderId: orderId || undefined,
                });
                return NextResponse.json({ success: true, data: fills });
            }

            case "currentPlan": {
                const symbol = searchParams.get("symbol") as TradingPair | null;
                const plans = await getCurrentPlanOrders(config, {
                    symbol: symbol || undefined,
                });
                return NextResponse.json({ success: true, data: plans });
            }

            case "historyPlan": {
                const symbol = searchParams.get("symbol") as TradingPair;
                if (!symbol) {
                    return NextResponse.json(
                        { success: false, error: "symbol is required for historyPlan" },
                        { status: 400 }
                    );
                }
                const plans = await getHistoryPlanOrders(config, symbol);
                return NextResponse.json({ success: true, data: plans });
            }

            default:
                // Default: return current orders
                const currentOrders = await getCurrentOrders(config);
                return NextResponse.json({
                    success: true,
                    data: currentOrders,
                    timestamp: Date.now(),
                });
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}

// POST: Place orders, cancel orders, close positions
export async function POST(request: Request) {
    try {
        const config = getWeexConfig();
        const body = await request.json();
        const action = body.action;

        switch (action) {
            // ========== Order Placement ==========
            case "placeOrder": {
                const params: PlaceOrderParams = {
                    symbol: body.symbol,
                    clientOid: body.clientOid || `rg_${Date.now()}`,
                    size: body.size,
                    type: body.type,
                    orderType: body.orderType || "0",
                    matchPrice: body.matchPrice || "0",
                    price: body.price || "0",
                    presetTakeProfitPrice: body.takeProfitPrice,
                    presetStopLossPrice: body.stopLossPrice,
                    marginMode: body.marginMode,
                };
                const result = await placeOrder(config, params);
                return NextResponse.json({ success: true, data: result });
            }

            case "batchOrders": {
                const orders: BatchOrderData[] = body.orders;
                const result = await placeBatchOrders(
                    config,
                    body.symbol,
                    orders,
                    body.marginMode
                );
                return NextResponse.json({ success: true, data: result });
            }

            // ========== High-Level Trade Helpers ==========
            case "openLong": {
                const result = await openLong(config, body.symbol, body.size, {
                    price: body.price,
                    isMarket: body.isMarket ?? true,
                    takeProfitPrice: body.takeProfitPrice,
                    stopLossPrice: body.stopLossPrice,
                });
                return NextResponse.json({ success: true, data: result });
            }

            case "openShort": {
                const result = await openShort(config, body.symbol, body.size, {
                    price: body.price,
                    isMarket: body.isMarket ?? true,
                    takeProfitPrice: body.takeProfitPrice,
                    stopLossPrice: body.stopLossPrice,
                });
                return NextResponse.json({ success: true, data: result });
            }

            case "closeLong": {
                const result = await closeLong(config, body.symbol, body.size, {
                    price: body.price,
                    isMarket: body.isMarket ?? true,
                });
                return NextResponse.json({ success: true, data: result });
            }

            case "closeShort": {
                const result = await closeShort(config, body.symbol, body.size, {
                    price: body.price,
                    isMarket: body.isMarket ?? true,
                });
                return NextResponse.json({ success: true, data: result });
            }

            // ========== Smart Trade with Risk Check ==========
            case "smartTrade": {
                // This integrates with RegimeGuard's risk engine
                const symbol: TradingPair = body.symbol;
                const side: "long" | "short" = body.side;
                const baseSize: string = body.size;

                // Get market regime for risk assessment
                const candles = await getCandles(symbol, "1m", 100);
                const regime: RegimeClassification = classifyMarketRegime(candles);

                // Evaluate risk
                const riskDecision = evaluateRisk(
                    regime,
                    regime.features.volatility,
                    [],
                    null,
                    {
                        recentDrawdown: body.recentDrawdown || 0,
                        lastTradeTime: body.lastTradeTime || 0,
                        dailyLossPercent: body.dailyLossPercent || 0,
                        consecutiveLosses: body.consecutiveLosses || 0,
                    }
                );

                // Check if trading is allowed
                if (riskDecision.tradeSuspended) {
                    return NextResponse.json({
                        success: false,
                        error: "Trading suspended by risk engine",
                        data: {
                            regime,
                            riskDecision,
                        },
                    });
                }

                if (riskDecision.tradeCooldownActive) {
                    return NextResponse.json({
                        success: false,
                        error: "Trade cooldown active",
                        data: {
                            regime,
                            riskDecision,
                        },
                    });
                }

                // Adjust position size based on risk
                const adjustedSize = (
                    parseFloat(baseSize) * riskDecision.positionSizeMultiplier
                ).toFixed(6);

                // Execute trade
                const tradeResult =
                    side === "long"
                        ? await openLong(config, symbol, adjustedSize, {
                            isMarket: body.isMarket ?? true,
                            takeProfitPrice: body.takeProfitPrice,
                            stopLossPrice: body.stopLossPrice,
                        })
                        : await openShort(config, symbol, adjustedSize, {
                            isMarket: body.isMarket ?? true,
                            takeProfitPrice: body.takeProfitPrice,
                            stopLossPrice: body.stopLossPrice,
                        });

                return NextResponse.json({
                    success: true,
                    data: {
                        order: tradeResult,
                        regime,
                        riskDecision,
                        adjustedSize,
                        explanation:
                            `Trade executed under ${regime.regime} regime ` +
                            `(${(regime.confidence * 100).toFixed(0)}% confidence). ` +
                            riskDecision.explanation,
                    },
                });
            }

            // ========== Order Cancellation ==========
            case "cancelOrder": {
                const result = await cancelOrder(
                    config,
                    body.orderId,
                    body.clientOid
                );
                return NextResponse.json({ success: true, data: result });
            }

            case "cancelBatch": {
                const result = await cancelBatchOrders(
                    config,
                    body.orderIds,
                    body.clientOids
                );
                return NextResponse.json({ success: true, data: result });
            }

            case "cancelAll": {
                const result = await cancelAllOrders(
                    config,
                    body.symbol,
                    body.cancelOrderType || "normal"
                );
                return NextResponse.json({ success: true, data: result });
            }

            // ========== Trigger/Plan Orders ==========
            case "placeTriggerOrder": {
                const params: TriggerOrderParams = {
                    symbol: body.symbol,
                    clientOid: body.clientOid || `rg_trigger_${Date.now()}`,
                    size: body.size,
                    type: body.type,
                    matchType: body.matchType || "1",
                    executePrice: body.executePrice,
                    triggerPrice: body.triggerPrice,
                    marginMode: body.marginMode,
                };
                const result = await placeTriggerOrder(config, params);
                return NextResponse.json({ success: true, data: result });
            }

            case "cancelTriggerOrder": {
                const result = await cancelTriggerOrder(config, body.orderId);
                return NextResponse.json({ success: true, data: result });
            }

            // ========== TP/SL Orders ==========
            case "placeTpSl": {
                const params: TpSlOrderParams = {
                    symbol: body.symbol,
                    clientOrderId: body.clientOrderId || `rg_tpsl_${Date.now()}`,
                    planType: body.planType,
                    triggerPrice: body.triggerPrice,
                    executePrice: body.executePrice,
                    size: body.size,
                    positionSide: body.positionSide,
                    marginMode: body.marginMode,
                };
                const result = await placeTpSlOrder(config, params);
                return NextResponse.json({ success: true, data: result });
            }

            case "modifyTpSl": {
                const result = await modifyTpSlOrder(
                    config,
                    body.orderId,
                    body.triggerPrice,
                    body.executePrice,
                    body.triggerPriceType
                );
                return NextResponse.json({ success: true, data: result });
            }

            // ========== Position Management ==========
            case "closeAllPositions": {
                const result = await closeAllPositions(config, body.symbol);
                return NextResponse.json({ success: true, data: result });
            }

            default:
                return NextResponse.json(
                    {
                        success: false,
                        error: `Unknown action: ${action}`,
                        availableActions: [
                            "placeOrder",
                            "batchOrders",
                            "openLong",
                            "openShort",
                            "closeLong",
                            "closeShort",
                            "smartTrade",
                            "cancelOrder",
                            "cancelBatch",
                            "cancelAll",
                            "placeTriggerOrder",
                            "cancelTriggerOrder",
                            "placeTpSl",
                            "modifyTpSl",
                            "closeAllPositions",
                        ],
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
