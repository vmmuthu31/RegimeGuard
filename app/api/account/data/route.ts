import { NextResponse } from "next/server";
import { TRADING_PAIRS, type TradingPair } from "@/shared/constants";
import { getWeexConfig } from "@/server/config";
import {
  getAccounts,
  getSingleAccount,
  getAccountAssets,
  getAccountBills,
  getUserSettings,
  changeLeverage,
  adjustPositionMargin,
  modifyAutoAppendMargin,
  getAllPositions,
  getSinglePosition,
  changeHoldMode,
  type BusinessType,
} from "@/server/services/weex-account";

type AccountEndpoint =
  | "accounts"
  | "account"
  | "assets"
  | "bills"
  | "settings"
  | "positions"
  | "position"
  | "trades";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint") as AccountEndpoint | null;

  try {
    const config = getWeexConfig();

    switch (endpoint) {
      case "accounts": {
        const data = await getAccounts(config);
        return NextResponse.json({ success: true, data });
      }

      case "account": {
        const coin = searchParams.get("coin") || "USDT";
        const data = await getSingleAccount(config, coin);
        return NextResponse.json({ success: true, data });
      }

      case "assets": {
        const data = await getAccountAssets(config);
        return NextResponse.json({ success: true, data });
      }

      case "settings": {
        const symbol = searchParams.get("symbol") as TradingPair | null;
        const validSymbol =
          symbol && TRADING_PAIRS.includes(symbol) ? symbol : undefined;
        const data = await getUserSettings(config, validSymbol);
        return NextResponse.json({ success: true, data });
      }

      case "positions": {
        const data = await getAllPositions(config);
        return NextResponse.json({ success: true, data });
      }

      case "position": {
        const symbol = searchParams.get("symbol") as TradingPair;
        if (!symbol || !TRADING_PAIRS.includes(symbol)) {
          return NextResponse.json(
            { success: false, error: "Valid symbol required" },
            { status: 400 }
          );
        }
        const data = await getSinglePosition(config, symbol);
        return NextResponse.json({ success: true, data });
      }

      case "trades": {
        const { makeAuthenticatedRequest } = await import(
          "@/server/services/weex-account"
        );

        interface FillRecord {
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

        const allFills: FillRecord[] = [];

        for (const symbol of TRADING_PAIRS) {
          try {
            const startTime = Date.now() - 7 * 24 * 60 * 60 * 1000;
            const result = await makeAuthenticatedRequest<
              | { list?: FillRecord[]; nextFlag?: boolean; totals?: number }
              | FillRecord[]
            >(
              config,
              "GET",
              "/capi/v2/order/fills",
              `?symbol=${symbol}&startTime=${startTime}&limit=100`
            );

            const fills = Array.isArray(result) ? result : result.list || [];

            if (fills.length > 0) {
              allFills.push(...fills);
            }
          } catch {
            // Skip symbols with errors
          }
        }

        allFills.sort((a, b) => b.createdTime - a.createdTime);

        return NextResponse.json({
          success: true,
          data: {
            trades: allFills.slice(0, 100).map((f) => ({
              tradeId: f.tradeId?.toString() || "0",
              orderId: f.orderId?.toString() || "0",
              symbol: f.symbol,
              positionSide: f.positionSide,
              side: f.orderSide,
              fillSize: f.fillSize,
              fillPrice: (
                parseFloat(f.fillValue || "0") / parseFloat(f.fillSize || "1")
              ).toFixed(2),
              fillValue: f.fillValue,
              fillFee: f.fillFee,
              realizePnl: f.realizePnl,
              createdTime: f.createdTime,
            })),
            total: allFills.length,
          },
        });
      }

      default: {
        return NextResponse.json({
          success: true,
          data: {
            availableEndpoints: [
              "accounts",
              "account",
              "assets",
              "bills (POST)",
              "settings",
              "positions",
              "position",
            ],
            usage: "/api/account/data?endpoint=<endpoint>",
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

type AccountPostAction =
  | "bills"
  | "leverage"
  | "adjustMargin"
  | "autoAppendMargin"
  | "changeHoldMode";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") as AccountPostAction | null;

  try {
    const config = getWeexConfig();
    const body = await request.json();

    switch (action) {
      case "bills": {
        const data = await getAccountBills(config, {
          coin: body.coin,
          symbol: body.symbol,
          businessType: body.businessType as BusinessType,
          startTime: body.startTime,
          endTime: body.endTime,
          limit: body.limit,
        });
        return NextResponse.json({ success: true, data });
      }

      case "leverage": {
        const { symbol, marginMode, longLeverage, shortLeverage } = body;
        if (!symbol || !TRADING_PAIRS.includes(symbol)) {
          return NextResponse.json(
            { success: false, error: "Valid symbol required" },
            { status: 400 }
          );
        }
        const data = await changeLeverage(
          config,
          symbol,
          marginMode || 1,
          longLeverage || 1,
          shortLeverage || 1
        );
        return NextResponse.json({ success: true, data });
      }

      case "adjustMargin": {
        const { isolatedPositionId, collateralAmount, coinId } = body;
        if (!isolatedPositionId || collateralAmount === undefined) {
          return NextResponse.json(
            {
              success: false,
              error: "isolatedPositionId and collateralAmount required",
            },
            { status: 400 }
          );
        }
        const data = await adjustPositionMargin(
          config,
          isolatedPositionId,
          collateralAmount,
          coinId
        );
        return NextResponse.json({ success: true, data });
      }

      case "autoAppendMargin": {
        const { positionId, autoAppendMargin } = body;
        if (!positionId || autoAppendMargin === undefined) {
          return NextResponse.json(
            {
              success: false,
              error: "positionId and autoAppendMargin required",
            },
            { status: 400 }
          );
        }
        const data = await modifyAutoAppendMargin(
          config,
          positionId,
          autoAppendMargin
        );
        return NextResponse.json({ success: true, data });
      }

      case "changeHoldMode": {
        const { symbol, marginMode, separatedMode } = body;
        if (!symbol || !TRADING_PAIRS.includes(symbol)) {
          return NextResponse.json(
            { success: false, error: "Valid symbol required" },
            { status: 400 }
          );
        }
        const data = await changeHoldMode(
          config,
          symbol,
          marginMode || 1,
          separatedMode || 1
        );
        return NextResponse.json({ success: true, data });
      }

      default: {
        return NextResponse.json({
          success: true,
          data: {
            availableActions: [
              "bills",
              "leverage",
              "adjustMargin",
              "autoAppendMargin",
              "changeHoldMode",
            ],
            usage: "/api/account/data?action=<action>",
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
