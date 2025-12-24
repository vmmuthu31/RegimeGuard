import { NextResponse } from "next/server";
import { TRADING_PAIRS, TradingPair } from "@/shared/constants";
import {
  initWebSocket,
  closeWebSocket,
  isWebSocketConnected,
  getSubscriptions,
  subscribeTicker,
  unsubscribeTicker,
  subscribeKline,
  unsubscribeKline,
  subscribeDepth,
  unsubscribeDepth,
  subscribeTrades,
  unsubscribeTrades,
  type WsTickerData,
  type WsKlineData,
  type WsDepthData,
  type WsTradeData,
  type KlineInterval,
  type DepthLevel,
} from "@/server/services/weex-websocket";

const latestData: Map<string, unknown> = new Map();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  switch (action) {
    case "status": {
      return NextResponse.json({
        success: true,
        data: {
          connected: isWebSocketConnected(),
          subscriptions: getSubscriptions(),
          timestamp: Date.now(),
        },
      });
    }

    case "data": {
      const channel = searchParams.get("channel");
      if (channel && latestData.has(channel)) {
        return NextResponse.json({
          success: true,
          data: {
            channel,
            latestData: latestData.get(channel),
            timestamp: Date.now(),
          },
        });
      }
      return NextResponse.json({
        success: true,
        data: {
          channels: Object.fromEntries(latestData),
          timestamp: Date.now(),
        },
      });
    }

    default: {
      return NextResponse.json({
        success: true,
        data: {
          description: "WebSocket Real-time Market Data",
          status: {
            connected: isWebSocketConnected(),
            subscriptions: getSubscriptions(),
          },
          endpoints: {
            "GET /api/websocket?action=status": "Connection status",
            "GET /api/websocket?action=data":
              "Get latest data for all channels",
            "GET /api/websocket?action=data&channel=ticker.cmt_btcusdt":
              "Get specific channel data",
            "POST /api/websocket (action: connect)": "Connect to WebSocket",
            "POST /api/websocket (action: disconnect)": "Disconnect",
            "POST /api/websocket (action: subscribe)": "Subscribe to channel",
            "POST /api/websocket (action: unsubscribe)":
              "Unsubscribe from channel",
          },
          channels: {
            ticker: "ticker.{symbol} - Real-time ticker data",
            kline: "kline.{priceType}.{symbol}.{interval} - Candlestick data",
            depth: "depth.{symbol}.{level} - Order book depth",
            trades: "trades.{symbol} - Public trades",
          },
        },
      });
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action;

    switch (action) {
      case "connect": {
        const success = await initWebSocket();
        return NextResponse.json({
          success,
          data: {
            message: success ? "WebSocket connected" : "Failed to connect",
            connected: isWebSocketConnected(),
          },
        });
      }

      case "disconnect": {
        closeWebSocket();
        latestData.clear();
        return NextResponse.json({
          success: true,
          data: { message: "WebSocket disconnected" },
        });
      }

      case "subscribe": {
        const channelType = body.channel as string;
        const symbolParam = body.symbol as string;
        const symbol: TradingPair = TRADING_PAIRS.includes(
          symbolParam as TradingPair
        )
          ? (symbolParam as TradingPair)
          : "cmt_btcusdt";

        if (!isWebSocketConnected()) {
          await initWebSocket();
        }

        let subscribed = false;

        switch (channelType) {
          case "ticker": {
            subscribed = subscribeTicker(symbol, (data: WsTickerData) => {
              latestData.set(`ticker.${symbol}`, data);
            });
            break;
          }
          case "kline": {
            const interval = (body.interval || "MINUTE_1") as KlineInterval;
            const priceType = body.priceType || "LAST_PRICE";
            subscribed = subscribeKline(
              symbol,
              interval,
              (data: WsKlineData) => {
                latestData.set(
                  `kline.${priceType}.${symbol}.${interval}`,
                  data
                );
              },
              priceType
            );
            break;
          }
          case "depth": {
            const level = (body.level || "15") as DepthLevel;
            subscribed = subscribeDepth(symbol, level, (data: WsDepthData) => {
              latestData.set(`depth.${symbol}.${level}`, data);
            });
            break;
          }
          case "trades": {
            subscribed = subscribeTrades(symbol, (data: WsTradeData) => {
              latestData.set(`trades.${symbol}`, data);
            });
            break;
          }
          default:
            return NextResponse.json(
              {
                success: false,
                error: `Unknown channel type: ${channelType}`,
                availableChannels: ["ticker", "kline", "depth", "trades"],
              },
              { status: 400 }
            );
        }

        return NextResponse.json({
          success: subscribed,
          data: {
            message: subscribed ? "Subscribed" : "Failed to subscribe",
            subscriptions: getSubscriptions(),
          },
        });
      }

      case "unsubscribe": {
        const channelType = body.channel as string;
        const symbolParam = body.symbol as string;
        const symbol: TradingPair = TRADING_PAIRS.includes(
          symbolParam as TradingPair
        )
          ? (symbolParam as TradingPair)
          : "cmt_btcusdt";

        let unsubscribed = false;

        switch (channelType) {
          case "ticker":
            unsubscribed = unsubscribeTicker(symbol);
            break;
          case "kline": {
            const interval = (body.interval || "MINUTE_1") as KlineInterval;
            unsubscribed = unsubscribeKline(symbol, interval, body.priceType);
            break;
          }
          case "depth": {
            const level = (body.level || "15") as DepthLevel;
            unsubscribed = unsubscribeDepth(symbol, level);
            break;
          }
          case "trades":
            unsubscribed = unsubscribeTrades(symbol);
            break;
        }

        return NextResponse.json({
          success: unsubscribed,
          data: {
            message: unsubscribed ? "Unsubscribed" : "Failed to unsubscribe",
            subscriptions: getSubscriptions(),
          },
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown action: ${action}`,
            availableActions: [
              "connect",
              "disconnect",
              "subscribe",
              "unsubscribe",
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
