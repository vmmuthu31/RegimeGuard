/**
 * WEEX Trade Service
 * Comprehensive trading operations for RegimeGuard
 * Following the same architecture pattern as weex-client.ts
 */

import { createHmac } from "crypto";
import { WEEX_BASE_URL, TradingPair } from "@/shared/constants";


export interface WeexConfig {
    apiKey: string;
    secretKey: string;
    passphrase: string;
}

// Order Types
export type OrderSide = "1" | "2" | "3" | "4"; // 1: Open long, 2: Open short, 3: Close long, 4: Close short
export type OrderType = "0" | "1" | "2" | "3"; // 0: Normal, 1: Post-Only, 2: FOK, 3: IOC
export type MatchPrice = "0" | "1"; // 0: Limit, 1: Market
export type MarginMode = 1 | 3; // 1: Cross, 3: Isolated
export type PlanType = "profit_plan" | "loss_plan";
export type PositionSide = "long" | "short";

export interface PlaceOrderParams {
    symbol: TradingPair;
    clientOid: string;
    size: string;
    type: OrderSide;
    orderType: OrderType;
    matchPrice: MatchPrice;
    price: string;
    presetTakeProfitPrice?: string;
    presetStopLossPrice?: string;
    marginMode?: MarginMode;
}

export interface PlaceOrderResponse {
    orderId: string;
    clientOid: string | null;
}

export interface BatchOrderData {
    client_oid: string;
    size: string;
    type: OrderSide;
    order_type: OrderType;
    match_price: MatchPrice;
    price: string;
    presetTakeProfitPrice?: string;
    presetStopLossPrice?: string;
}

export interface BatchOrderResult {
    orderId: string;
    clientOid: string;
    result: boolean;
    errorCode: string;
    errorMessage: string;
}

export interface CancelOrderResult {
    orderId: string;
    clientOid: string | null;
    result: boolean;
    errorMessage: string | null;
}

export interface OrderDetail {
    symbol: string;
    size: string;
    clientOid: string;
    createTime: number;
    filledQty: string;
    fee: string;
    orderId: string;
    price: string;
    priceAvg: string;
    status: string;
    type: string;
    orderType: string;
    totalProfits: string;
    contracts: number;
    filledQtyContracts: number;
    presetTakeProfitPrice: string | null;
    presetStopLossPrice: string | null;
}

export interface OrderFill {
    tradeId: number;
    orderId: number;
    symbol: string;
    marginMode: string;
    positionSide: string;
    orderSide: string;
    fillSize: string;
    fillValue: string;
    fillFee: string;
    realizePnl: string;
    direction: string;
    createdTime: number;
}

export interface TriggerOrderParams {
    symbol: TradingPair;
    clientOid: string;
    size: string;
    type: OrderSide;
    matchType: MatchPrice;
    executePrice: string;
    triggerPrice: string;
    marginMode?: MarginMode;
}

export interface PlanOrder extends OrderDetail {
    triggerPrice: string;
    triggerPriceType: string;
    triggerTime: string | null;
}

export interface ClosePositionResult {
    positionId: number;
    success: boolean;
    successOrderId: number;
    errorMessage: string;
}

export interface TpSlOrderParams {
    symbol: TradingPair;
    clientOrderId: string;
    planType: PlanType;
    triggerPrice: string;
    executePrice?: string;
    size: string;
    positionSide: PositionSide;
    marginMode?: MarginMode;
}

// ============================================================================
// Helper Functions
// ============================================================================

function generateSignature(
    secretKey: string,
    timestamp: string,
    method: string,
    requestPath: string,
    queryString: string,
    body: string
): string {
    const message =
        timestamp + method.toUpperCase() + requestPath + queryString + body;
    const signature = createHmac("sha256", secretKey)
        .update(message)
        .digest("base64");
    return signature;
}

async function makeRequest<T>(
    config: WeexConfig,
    method: "GET" | "POST",
    requestPath: string,
    queryString: string = "",
    body: object | null = null
): Promise<T> {
    const timestamp = Date.now().toString();
    const bodyString = body ? JSON.stringify(body) : "";
    const signature = generateSignature(
        config.secretKey,
        timestamp,
        method,
        requestPath,
        queryString,
        bodyString
    );

    const headers: Record<string, string> = {
        "ACCESS-KEY": config.apiKey,
        "ACCESS-SIGN": signature,
        "ACCESS-TIMESTAMP": timestamp,
        "ACCESS-PASSPHRASE": config.passphrase,
        "Content-Type": "application/json",
        locale: "en-US",
    };

    const url = `${WEEX_BASE_URL}${requestPath}${queryString}`;
    const response = await fetch(url, {
        method,
        headers,
        body: method === "POST" ? bodyString : undefined,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`WEEX Trade API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
}

// Order Placement

/**
 * Place a single order
 * POST /capi/v2/order/placeOrder
 */
export async function placeOrder(
    config: WeexConfig,
    params: PlaceOrderParams
): Promise<PlaceOrderResponse> {
    const body = {
        symbol: params.symbol,
        client_oid: params.clientOid,
        size: params.size,
        type: params.type,
        order_type: params.orderType,
        match_price: params.matchPrice,
        price: params.price,
        ...(params.presetTakeProfitPrice && {
            presetTakeProfitPrice: params.presetTakeProfitPrice,
        }),
        ...(params.presetStopLossPrice && {
            presetStopLossPrice: params.presetStopLossPrice,
        }),
        ...(params.marginMode && { marginMode: params.marginMode }),
    };

    const data = await makeRequest<{
        order_id: string;
        client_oid: string | null;
    }>(config, "POST", "/capi/v2/order/placeOrder", "", body);

    return { orderId: data.order_id, clientOid: data.client_oid };
}

/**
 * Place batch orders (max 20)
 * POST /capi/v2/order/batchOrders
 */
export async function placeBatchOrders(
    config: WeexConfig,
    symbol: TradingPair,
    orders: BatchOrderData[],
    marginMode?: MarginMode
): Promise<{ orderInfo: BatchOrderResult[]; result: boolean }> {
    const body = {
        symbol,
        orderDataList: orders,
        ...(marginMode && { marginMode }),
    };

    const data = await makeRequest<{
        order_info: Array<{
            order_id: string;
            client_oid: string;
            result: boolean;
            error_code: string;
            error_message: string;
        }>;
        result: boolean;
    }>(config, "POST", "/capi/v2/order/batchOrders", "", body);

    return {
        orderInfo: data.order_info.map((o) => ({
            orderId: o.order_id,
            clientOid: o.client_oid,
            result: o.result,
            errorCode: o.error_code,
            errorMessage: o.error_message,
        })),
        result: data.result,
    };
}

// Order Cancellation

/**
 * Cancel a single order
 * POST /capi/v2/order/cancel_order
 */
export async function cancelOrder(
    config: WeexConfig,
    orderId?: string,
    clientOid?: string
): Promise<CancelOrderResult> {
    if (!orderId && !clientOid) {
        throw new Error("Either orderId or clientOid is required");
    }

    const body: Record<string, string> = {};
    if (orderId) body.orderId = orderId;
    if (clientOid) body.clientOid = clientOid;

    const data = await makeRequest<{
        order_id: string;
        client_oid: string | null;
        result: boolean;
        err_msg: string | null;
    }>(config, "POST", "/capi/v2/order/cancel_order", "", body);

    return {
        orderId: data.order_id,
        clientOid: data.client_oid,
        result: data.result,
        errorMessage: data.err_msg,
    };
}

/**
 * Cancel batch orders
 * POST /capi/v2/order/cancel_batch_orders
 */
export async function cancelBatchOrders(
    config: WeexConfig,
    orderIds?: string[],
    clientOids?: string[]
): Promise<{
    result: boolean;
    orderIds: string[];
    clientOids: string[];
    cancelOrderResultList: CancelOrderResult[];
    failInfos: CancelOrderResult[];
}> {
    if (!orderIds?.length && !clientOids?.length) {
        throw new Error("Either orderIds or clientOids is required");
    }

    const body: Record<string, string[]> = {};
    if (orderIds?.length) body.ids = orderIds;
    if (clientOids?.length) body.cids = clientOids;

    const data = await makeRequest<{
        result: boolean;
        orderIds: string[];
        clientOids: string[];
        cancelOrderResultList: Array<{
            order_id: string;
            client_oid: string;
            result: boolean;
            err_msg: string;
        }>;
        failInfos: Array<{
            order_id: string;
            client_oid: string;
            result: boolean;
            err_msg: string;
        }>;
    }>(config, "POST", "/capi/v2/order/cancel_batch_orders", "", body);

    const mapResult = (item: {
        order_id: string;
        client_oid: string;
        result: boolean;
        err_msg: string;
    }): CancelOrderResult => ({
        orderId: item.order_id,
        clientOid: item.client_oid,
        result: item.result,
        errorMessage: item.err_msg,
    });

    return {
        result: data.result,
        orderIds: data.orderIds,
        clientOids: data.clientOids,
        cancelOrderResultList: data.cancelOrderResultList.map(mapResult),
        failInfos: data.failInfos.map(mapResult),
    };
}

/**
 * Cancel all orders
 * POST /capi/v2/order/cancelAllOrders
 */
export async function cancelAllOrders(
    config: WeexConfig,
    symbol?: TradingPair,
    cancelOrderType: "normal" | "plan" = "normal"
): Promise<Array<{ orderId: number; success: boolean }>> {
    const body: Record<string, string> = { cancelOrderType };
    if (symbol) body.symbol = symbol;

    const data = await makeRequest<
        Array<{ orderId: number; success: boolean }>
    >(config, "POST", "/capi/v2/order/cancelAllOrders", "", body);

    return data;
}

// Order Query

/**
 * Get single order info
 * GET /capi/v2/order/detail
 */
export async function getOrderDetail(
    config: WeexConfig,
    orderId: string
): Promise<OrderDetail> {
    const data = await makeRequest<{
        symbol: string;
        size: string;
        client_oid: string;
        createTime: string;
        filled_qty: string;
        fee: string;
        order_id: string;
        price: string;
        price_avg: string;
        status: string;
        type: string;
        order_type: string;
        totalProfits: string;
        contracts: number;
        filledQtyContracts: number;
        presetTakeProfitPrice: string | null;
        presetStopLossPrice: string | null;
    }>(config, "GET", "/capi/v2/order/detail", `?orderId=${orderId}`);

    return {
        symbol: data.symbol,
        size: data.size,
        clientOid: data.client_oid,
        createTime: parseInt(data.createTime),
        filledQty: data.filled_qty,
        fee: data.fee,
        orderId: data.order_id,
        price: data.price,
        priceAvg: data.price_avg,
        status: data.status,
        type: data.type,
        orderType: data.order_type,
        totalProfits: data.totalProfits,
        contracts: data.contracts,
        filledQtyContracts: data.filledQtyContracts,
        presetTakeProfitPrice: data.presetTakeProfitPrice,
        presetStopLossPrice: data.presetStopLossPrice,
    };
}

/**
 * Get order history
 * GET /capi/v2/order/history
 */
export async function getOrderHistory(
    config: WeexConfig,
    symbol?: TradingPair,
    pageSize?: number,
    createDate?: number
): Promise<OrderDetail[]> {
    const params = new URLSearchParams();
    if (symbol) params.append("symbol", symbol);
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (createDate) params.append("createDate", createDate.toString());

    const queryString = params.toString() ? `?${params.toString()}` : "";

    const data = await makeRequest<
        Array<{
            symbol: string;
            size: string;
            client_oid: string;
            createTime: string;
            filled_qty: string;
            fee: string;
            order_id: string;
            price: string;
            price_avg: string;
            status: string;
            type: string;
            order_type: string;
            totalProfits: string;
            contracts: number;
            filledQtyContracts: number;
            presetTakeProfitPrice: string | null;
            presetStopLossPrice: string | null;
        }>
    >(config, "GET", "/capi/v2/order/history", queryString);

    return data.map((item) => ({
        symbol: item.symbol,
        size: item.size,
        clientOid: item.client_oid,
        createTime: parseInt(item.createTime),
        filledQty: item.filled_qty,
        fee: item.fee,
        orderId: item.order_id,
        price: item.price,
        priceAvg: item.price_avg,
        status: item.status,
        type: item.type,
        orderType: item.order_type,
        totalProfits: item.totalProfits,
        contracts: item.contracts,
        filledQtyContracts: item.filledQtyContracts,
        presetTakeProfitPrice: item.presetTakeProfitPrice,
        presetStopLossPrice: item.presetStopLossPrice,
    }));
}

/**
 * Get current (open) orders
 * GET /capi/v2/order/current
 */
export async function getCurrentOrders(
    config: WeexConfig,
    options?: {
        symbol?: TradingPair;
        orderId?: string;
        startTime?: number;
        endTime?: number;
        limit?: number;
        page?: number;
    }
): Promise<OrderDetail[]> {
    const params = new URLSearchParams();
    if (options?.symbol) params.append("symbol", options.symbol);
    if (options?.orderId) params.append("orderId", options.orderId);
    if (options?.startTime) params.append("startTime", options.startTime.toString());
    if (options?.endTime) params.append("endTime", options.endTime.toString());
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.page) params.append("page", options.page.toString());

    const queryString = params.toString() ? `?${params.toString()}` : "";

    const data = await makeRequest<
        Array<{
            symbol: string;
            size: string;
            client_oid: string;
            createTime: string;
            filled_qty: string;
            fee: string;
            order_id: string;
            price: string;
            price_avg: string;
            status: string;
            type: string;
            order_type: string;
            totalProfits: string;
            contracts: number;
            filledQtyContracts: number;
            presetTakeProfitPrice: string | null;
            presetStopLossPrice: string | null;
        }>
    >(config, "GET", "/capi/v2/order/current", queryString);

    return data.map((item) => ({
        symbol: item.symbol,
        size: item.size,
        clientOid: item.client_oid,
        createTime: parseInt(item.createTime),
        filledQty: item.filled_qty,
        fee: item.fee,
        orderId: item.order_id,
        price: item.price,
        priceAvg: item.price_avg,
        status: item.status,
        type: item.type,
        orderType: item.order_type,
        totalProfits: item.totalProfits,
        contracts: item.contracts,
        filledQtyContracts: item.filledQtyContracts,
        presetTakeProfitPrice: item.presetTakeProfitPrice,
        presetStopLossPrice: item.presetStopLossPrice,
    }));
}

/**
 * Get order fills (trade details)
 * GET /capi/v2/order/fills
 */
export async function getOrderFills(
    config: WeexConfig,
    options?: {
        symbol?: TradingPair;
        orderId?: string;
        startTime?: number;
        endTime?: number;
        limit?: number;
    }
): Promise<{ list: OrderFill[]; nextFlag: boolean; totals: number }> {
    const params = new URLSearchParams();
    if (options?.symbol) params.append("symbol", options.symbol);
    if (options?.orderId) params.append("orderId", options.orderId);
    if (options?.startTime) params.append("startTime", options.startTime.toString());
    if (options?.endTime) params.append("endTime", options.endTime.toString());
    if (options?.limit) params.append("limit", options.limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : "";

    const data = await makeRequest<{
        list: Array<{
            tradeId: number;
            orderId: number;
            symbol: string;
            marginMode: string;
            positionSide: string;
            orderSide: string;
            fillSize: string;
            fillValue: string;
            fillFee: string;
            realizePnl: string;
            direction: string;
            createdTime: number;
        }>;
        nextFlag: boolean;
        totals: number;
    }>(config, "GET", "/capi/v2/order/fills", queryString);

    return {
        list: data.list.map((item) => ({
            tradeId: item.tradeId,
            orderId: item.orderId,
            symbol: item.symbol,
            marginMode: item.marginMode,
            positionSide: item.positionSide,
            orderSide: item.orderSide,
            fillSize: item.fillSize,
            fillValue: item.fillValue,
            fillFee: item.fillFee,
            realizePnl: item.realizePnl,
            direction: item.direction,
            createdTime: item.createdTime,
        })),
        nextFlag: data.nextFlag,
        totals: data.totals,
    };
}

// Trigger/Plan Orders

/**
 * Place a trigger (plan) order
 * POST /capi/v2/order/plan_order
 */
export async function placeTriggerOrder(
    config: WeexConfig,
    params: TriggerOrderParams
): Promise<PlaceOrderResponse> {
    const body = {
        symbol: params.symbol,
        client_oid: params.clientOid,
        size: params.size,
        type: params.type,
        match_type: params.matchType,
        execute_price: params.executePrice,
        trigger_price: params.triggerPrice,
        ...(params.marginMode && { marginMode: params.marginMode }),
    };

    const data = await makeRequest<{
        order_id: string;
        client_oid: string | null;
    }>(config, "POST", "/capi/v2/order/plan_order", "", body);

    return { orderId: data.order_id, clientOid: data.client_oid };
}

/**
 * Cancel a trigger order
 * POST /capi/v2/order/cancel_plan
 */
export async function cancelTriggerOrder(
    config: WeexConfig,
    orderId: string
): Promise<CancelOrderResult> {
    const data = await makeRequest<{
        order_id: string;
        client_oid: string | null;
        result: boolean;
        err_msg: string | null;
    }>(config, "POST", "/capi/v2/order/cancel_plan", "", { orderId });

    return {
        orderId: data.order_id,
        clientOid: data.client_oid,
        result: data.result,
        errorMessage: data.err_msg,
    };
}

/**
 * Get current plan orders
 * GET /capi/v2/order/currentPlan
 */
export async function getCurrentPlanOrders(
    config: WeexConfig,
    options?: {
        symbol?: TradingPair;
        orderId?: string;
        startTime?: number;
        endTime?: number;
        limit?: number;
        page?: number;
    }
): Promise<PlanOrder[]> {
    const params = new URLSearchParams();
    if (options?.symbol) params.append("symbol", options.symbol);
    if (options?.orderId) params.append("orderId", options.orderId);
    if (options?.startTime) params.append("startTime", options.startTime.toString());
    if (options?.endTime) params.append("endTime", options.endTime.toString());
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.page) params.append("page", options.page.toString());

    const queryString = params.toString() ? `?${params.toString()}` : "";

    const data = await makeRequest<
        Array<{
            symbol: string;
            size: string;
            client_oid: string;
            createTime: string;
            filled_qty: string;
            fee: string;
            order_id: string;
            price: string;
            price_avg: string;
            status: string;
            type: string;
            order_type: string;
            totalProfits: string;
            contracts: number;
            filledQtyContracts: number;
            triggerPrice: string;
            triggerPriceType: string;
            triggerTime: string | null;
            presetTakeProfitPrice: string | null;
            presetStopLossPrice: string | null;
        }>
    >(config, "GET", "/capi/v2/order/currentPlan", queryString);

    return data.map((item) => ({
        symbol: item.symbol,
        size: item.size,
        clientOid: item.client_oid,
        createTime: parseInt(item.createTime),
        filledQty: item.filled_qty,
        fee: item.fee,
        orderId: item.order_id,
        price: item.price,
        priceAvg: item.price_avg,
        status: item.status,
        type: item.type,
        orderType: item.order_type,
        totalProfits: item.totalProfits,
        contracts: item.contracts,
        filledQtyContracts: item.filledQtyContracts,
        triggerPrice: item.triggerPrice,
        triggerPriceType: item.triggerPriceType,
        triggerTime: item.triggerTime,
        presetTakeProfitPrice: item.presetTakeProfitPrice,
        presetStopLossPrice: item.presetStopLossPrice,
    }));
}

/**
 * Get history plan orders
 * GET /capi/v2/order/historyPlan
 */
export async function getHistoryPlanOrders(
    config: WeexConfig,
    symbol: TradingPair,
    options?: {
        startTime?: number;
        endTime?: number;
        delegateType?: 1 | 2 | 3 | 4;
        pageSize?: number;
    }
): Promise<{ list: PlanOrder[]; nextPage: boolean }> {
    const params = new URLSearchParams();
    params.append("symbol", symbol);
    if (options?.startTime) params.append("startTime", options.startTime.toString());
    if (options?.endTime) params.append("endTime", options.endTime.toString());
    if (options?.delegateType) params.append("delegateType", options.delegateType.toString());
    if (options?.pageSize) params.append("pageSize", options.pageSize.toString());

    const queryString = `?${params.toString()}`;

    const data = await makeRequest<{
        list: Array<{
            symbol: string;
            size: string;
            client_oid: string;
            createTime: string;
            filled_qty: string;
            fee: string;
            order_id: string;
            price: string;
            price_avg: string;
            status: string;
            type: string;
            order_type: string;
            totalProfits: string;
            contracts: number;
            filledQtyContracts: number;
            triggerPrice: string;
            triggerPriceType: string;
            triggerTime: string | null;
            presetTakeProfitPrice: string | null;
            presetStopLossPrice: string | null;
        }>;
        nextPage: boolean;
    }>(config, "GET", "/capi/v2/order/historyPlan", queryString);

    return {
        list: data.list.map((item) => ({
            symbol: item.symbol,
            size: item.size,
            clientOid: item.client_oid,
            createTime: parseInt(item.createTime),
            filledQty: item.filled_qty,
            fee: item.fee,
            orderId: item.order_id,
            price: item.price,
            priceAvg: item.price_avg,
            status: item.status,
            type: item.type,
            orderType: item.order_type,
            totalProfits: item.totalProfits,
            contracts: item.contracts,
            filledQtyContracts: item.filledQtyContracts,
            triggerPrice: item.triggerPrice,
            triggerPriceType: item.triggerPriceType,
            triggerTime: item.triggerTime,
            presetTakeProfitPrice: item.presetTakeProfitPrice,
            presetStopLossPrice: item.presetStopLossPrice,
        })),
        nextPage: data.nextPage,
    };
}

// Position Management

/**
 * Close all positions
 * POST /capi/v2/order/closePositions
 */
export async function closeAllPositions(
    config: WeexConfig,
    symbol?: TradingPair
): Promise<ClosePositionResult[]> {
    const body: Record<string, string> = {};
    if (symbol) body.symbol = symbol;

    const data = await makeRequest<
        Array<{
            positionId: number;
            success: boolean;
            successOrderId: number;
            errorMessage: string;
        }>
    >(config, "POST", "/capi/v2/order/closePositions", "", body);

    return data.map((item) => ({
        positionId: item.positionId,
        success: item.success,
        successOrderId: item.successOrderId,
        errorMessage: item.errorMessage,
    }));
}

// Take Profit / Stop Loss Orders

/**
 * Place TP/SL order
 * POST /capi/v2/order/placeTpSlOrder
 */
export async function placeTpSlOrder(
    config: WeexConfig,
    params: TpSlOrderParams
): Promise<{ orderId: number; success: boolean }> {
    const body = {
        symbol: params.symbol,
        clientOrderId: params.clientOrderId,
        planType: params.planType,
        triggerPrice: params.triggerPrice,
        executePrice: params.executePrice || "0",
        size: params.size,
        positionSide: params.positionSide,
        ...(params.marginMode && { marginMode: params.marginMode }),
    };

    const data = await makeRequest<Array<{ orderId: number; success: boolean }>>(
        config,
        "POST",
        "/capi/v2/order/placeTpSlOrder",
        "",
        body
    );

    return data[0];
}

/**
 * Modify TP/SL order
 * POST /capi/v2/order/modifyTpSlOrder
 */
export async function modifyTpSlOrder(
    config: WeexConfig,
    orderId: number,
    triggerPrice: string,
    executePrice?: string,
    triggerPriceType?: 1 | 3
): Promise<{ code: string; msg: string }> {
    const body: Record<string, unknown> = {
        orderId,
        triggerPrice,
    };
    if (executePrice) body.executePrice = executePrice;
    if (triggerPriceType) body.triggerPriceType = triggerPriceType;

    const data = await makeRequest<{
        code: string;
        msg: string;
    }>(config, "POST", "/capi/v2/order/modifyTpSlOrder", "", body);

    return data;
}

// Helper Functions 

/**
 * Open a long position with optional TP/SL
 */
export async function openLong(
    config: WeexConfig,
    symbol: TradingPair,
    size: string,
    options?: {
        price?: string;
        isMarket?: boolean;
        takeProfitPrice?: string;
        stopLossPrice?: string;
    }
): Promise<PlaceOrderResponse> {
    return placeOrder(config, {
        symbol,
        clientOid: `rg_long_${Date.now()}`,
        size,
        type: "1", // Open long
        orderType: "0", // Normal
        matchPrice: options?.isMarket ? "1" : "0",
        price: options?.price || "0",
        presetTakeProfitPrice: options?.takeProfitPrice,
        presetStopLossPrice: options?.stopLossPrice,
    });
}

/**
 * Open a short position with optional TP/SL
 */
export async function openShort(
    config: WeexConfig,
    symbol: TradingPair,
    size: string,
    options?: {
        price?: string;
        isMarket?: boolean;
        takeProfitPrice?: string;
        stopLossPrice?: string;
    }
): Promise<PlaceOrderResponse> {
    return placeOrder(config, {
        symbol,
        clientOid: `rg_short_${Date.now()}`,
        size,
        type: "2", // Open short
        orderType: "0", // Normal
        matchPrice: options?.isMarket ? "1" : "0",
        price: options?.price || "0",
        presetTakeProfitPrice: options?.takeProfitPrice,
        presetStopLossPrice: options?.stopLossPrice,
    });
}

/**
 * Close a long position
 */
export async function closeLong(
    config: WeexConfig,
    symbol: TradingPair,
    size: string,
    options?: { price?: string; isMarket?: boolean }
): Promise<PlaceOrderResponse> {
    return placeOrder(config, {
        symbol,
        clientOid: `rg_close_long_${Date.now()}`,
        size,
        type: "3", // Close long
        orderType: "0",
        matchPrice: options?.isMarket ? "1" : "0",
        price: options?.price || "0",
    });
}

/**
 * Close a short position
 */
export async function closeShort(
    config: WeexConfig,
    symbol: TradingPair,
    size: string,
    options?: { price?: string; isMarket?: boolean }
): Promise<PlaceOrderResponse> {
    return placeOrder(config, {
        symbol,
        clientOid: `rg_close_short_${Date.now()}`,
        size,
        type: "4", // Close short
        orderType: "0",
        matchPrice: options?.isMarket ? "1" : "0",
        price: options?.price || "0",
    });
}
