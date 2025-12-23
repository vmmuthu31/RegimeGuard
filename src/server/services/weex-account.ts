import { createHmac } from "crypto";
import { WEEX_BASE_URL, type TradingPair } from "@/shared/constants";

export interface WeexConfig {
  apiKey: string;
  secretKey: string;
  passphrase: string;
}

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
  return createHmac("sha256", secretKey).update(message).digest("base64");
}

export async function makeAuthenticatedRequest<T>(
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
    throw new Error(`WEEX API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export interface FeeSetting {
  symbol?: string;
  is_set_fee_rate: boolean;
  taker_fee_rate: string;
  maker_fee_rate: string;
  is_set_fee_discount: boolean;
  fee_discount: string;
  is_set_taker_maker_fee_discount: boolean;
  taker_fee_discount: string;
  maker_fee_discount: string;
}

export interface ModeSetting {
  symbol: string;
  marginMode: string;
  separatedMode: string;
  positionMode: string;
}

export interface LeverageSetting {
  symbol: string;
  isolated_long_leverage: string;
  isolated_short_leverage: string;
  cross_leverage: string;
}

export interface AccountInfo {
  defaultFeeSetting: FeeSetting;
  feeSetting: FeeSetting[];
  modeSetting: ModeSetting[];
  leverageSetting: LeverageSetting[];
  createOrderRateLimitPerMinute: number;
  createOrderDelayMilliseconds: number;
  createdTime: number;
  updatedTime: number;
}

export interface CollateralInfo {
  coin: string;
  marginMode: string;
  crossSymbol: string | null;
  isolatedPositionId: number;
  amount: string;
  pending_deposit_amount: string;
  pending_withdraw_amount: string;
  pending_transfer_in_amount: string;
  pending_transfer_out_amount: string;
  is_liquidating: boolean;
  legacy_amount: string;
  cum_deposit_amount: string;
  cum_withdraw_amount: string;
  cum_transfer_in_amount: string;
  cum_transfer_out_amount: string;
  cum_margin_move_in_amount: string;
  cum_margin_move_out_amount: string;
  cum_position_open_long_amount: string;
  cum_position_open_short_amount: string;
  cum_position_close_long_amount: string;
  cum_position_close_short_amount: string;
  cum_position_fill_fee_amount: string;
  cum_position_liquidate_fee_amount: string;
  cum_position_funding_amount: string;
  cum_order_fill_fee_income_amount: string;
  cum_order_liquidate_fee_income_amount: string;
  created_time: number;
  updated_time: number;
}

export interface AccountsResponse {
  account: AccountInfo;
  collateral: CollateralInfo[];
  version: string | null;
}

export async function getAccounts(
  config: WeexConfig
): Promise<AccountsResponse> {
  return makeAuthenticatedRequest<AccountsResponse>(
    config,
    "GET",
    "/capi/v2/account/getAccounts",
    ""
  );
}

export async function getSingleAccount(
  config: WeexConfig,
  coin: string = "USDT"
): Promise<AccountsResponse> {
  return makeAuthenticatedRequest<AccountsResponse>(
    config,
    "GET",
    "/capi/v2/account/getAccount",
    `?coin=${coin}`
  );
}

export interface AssetBalance {
  coinName: string;
  available: string;
  frozen: string;
  equity: string;
  unrealizePnl: string;
}

export async function getAccountAssets(
  config: WeexConfig
): Promise<AssetBalance[]> {
  return makeAuthenticatedRequest<AssetBalance[]>(
    config,
    "GET",
    "/capi/v2/account/assets",
    ""
  );
}

export type BusinessType =
  | "deposit"
  | "withdraw"
  | "transfer_in"
  | "transfer_out"
  | "margin_move_in"
  | "margin_move_out"
  | "position_open_long"
  | "position_open_short"
  | "position_close_long"
  | "position_close_short"
  | "position_funding"
  | "order_fill_fee_income"
  | "order_liquidate_fee_income";

export interface BillRecord {
  billId: number;
  coin: string;
  symbol: string;
  amount: string;
  businessType: string;
  balance: string;
  fillFee: string;
  transferReason: string;
  ctime: number;
}

export interface BillsResponse {
  hasNextPage: boolean;
  items: BillRecord[];
}

export async function getAccountBills(
  config: WeexConfig,
  options?: {
    coin?: string;
    symbol?: TradingPair;
    businessType?: BusinessType;
    startTime?: number;
    endTime?: number;
    limit?: number;
  }
): Promise<BillsResponse> {
  const body: Record<string, unknown> = {};
  if (options?.coin) body.coin = options.coin;
  if (options?.symbol) body.symbol = options.symbol;
  if (options?.businessType) body.businessType = options.businessType;
  if (options?.startTime) body.startTime = options.startTime;
  if (options?.endTime) body.endTime = options.endTime;
  if (options?.limit) body.limit = Math.min(Math.max(options.limit, 1), 100);

  return makeAuthenticatedRequest<BillsResponse>(
    config,
    "POST",
    "/capi/v2/account/bills",
    "",
    body
  );
}

export interface UserSettings {
  [symbol: string]: {
    isolated_long_leverage: string;
    isolated_short_leverage: string;
    cross_leverage: string;
  };
}

export async function getUserSettings(
  config: WeexConfig,
  symbol?: TradingPair
): Promise<UserSettings> {
  const query = symbol ? `?symbol=${symbol}` : "";
  return makeAuthenticatedRequest<UserSettings>(
    config,
    "GET",
    "/capi/v2/account/settings",
    query
  );
}

export interface ApiResponse {
  msg: string;
  requestTime: number;
  code: string;
}

export async function changeLeverage(
  config: WeexConfig,
  symbol: TradingPair,
  marginMode: 1 | 3,
  longLeverage: number,
  shortLeverage: number
): Promise<ApiResponse> {
  return makeAuthenticatedRequest<ApiResponse>(
    config,
    "POST",
    "/capi/v2/account/leverage",
    "",
    {
      symbol,
      marginMode,
      longLeverage: longLeverage.toString(),
      shortLeverage: shortLeverage.toString(),
    }
  );
}

export async function adjustPositionMargin(
  config: WeexConfig,
  isolatedPositionId: number,
  collateralAmount: number,
  coinId: number = 2
): Promise<ApiResponse> {
  return makeAuthenticatedRequest<ApiResponse>(
    config,
    "POST",
    "/capi/v2/account/adjustMargin",
    "",
    {
      coinId,
      isolatedPositionId,
      collateralAmount: collateralAmount.toString(),
    }
  );
}

export async function modifyAutoAppendMargin(
  config: WeexConfig,
  positionId: number,
  autoAppendMargin: boolean
): Promise<ApiResponse> {
  return makeAuthenticatedRequest<ApiResponse>(
    config,
    "POST",
    "/capi/v2/account/modifyAutoAppendMargin",
    "",
    {
      positionId,
      autoAppendMargin,
    }
  );
}

export interface PositionInfo {
  id: number;
  account_id: number;
  coin_id: number;
  contract_id: number;
  symbol: string;
  side: "LONG" | "SHORT";
  margin_mode: "SHARED" | "ISOLATED";
  separated_mode: "COMBINED" | "SEPARATED";
  separated_open_order_id: number;
  leverage: string;
  size: string;
  open_value: string;
  open_fee: string;
  funding_fee: string;
  marginSize: string;
  isolated_margin: string;
  is_auto_append_isolated_margin: boolean;
  cum_open_size: string;
  cum_open_value: string;
  cum_open_fee: string;
  cum_close_size: string;
  cum_close_value: string;
  cum_close_fee: string;
  cum_funding_fee: string;
  cum_liquidate_fee: string;
  created_match_sequence_id: number;
  updated_match_sequence_id: number;
  created_time: number;
  updated_time: number;
  contractVal: string;
  unrealizePnl: string;
  liquidatePrice: string;
}

export async function getAllPositions(
  config: WeexConfig
): Promise<PositionInfo[]> {
  return makeAuthenticatedRequest<PositionInfo[]>(
    config,
    "GET",
    "/capi/v2/account/position/allPosition",
    ""
  );
}

export async function getSinglePosition(
  config: WeexConfig,
  symbol: TradingPair
): Promise<PositionInfo[]> {
  return makeAuthenticatedRequest<PositionInfo[]>(
    config,
    "GET",
    "/capi/v2/account/position/singlePosition",
    `?symbol=${symbol}`
  );
}

export async function changeHoldMode(
  config: WeexConfig,
  symbol: TradingPair,
  marginMode: 1 | 3,
  separatedMode: 1 = 1
): Promise<ApiResponse> {
  return makeAuthenticatedRequest<ApiResponse>(
    config,
    "POST",
    "/capi/v2/account/position/changeHoldModel",
    "",
    {
      symbol,
      marginMode,
      separatedMode,
    }
  );
}
