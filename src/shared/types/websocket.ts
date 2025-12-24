import { DepthType } from "../constants/enums";

export interface WsTickerData {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  trades: string;
  size: string;
  value: string;
  high: string;
  low: string;
  lastPrice: string;
  markPrice: string;
  indexPrice?: string;
}

export interface WsKlineData {
  symbol: string;
  klineTime: string;
  size: string;
  value: string;
  high: string;
  low: string;
  open: string;
  close: string;
}

export interface WsDepthData {
  startVersion: string;
  endVersion: string;
  level: number;
  depthType: DepthType;
  symbol: string;
  asks: Array<{ price: string; size: string }>;
  bids: Array<{ price: string; size: string }>;
}

export interface WsTradeData {
  time: string;
  price: string;
  size: string;
  value: string;
  buyerMaker: boolean;
}

export interface WsAccountData {
  coinId: string;
  marginMode: string;
  crossContractId: string;
  isolatedPositionId: string;
  amount: string;
  pendingDepositAmount: string;
  pendingWithdrawAmount: string;
  pendingTransferInAmount: string;
  pendingTransferOutAmount: string;
  liquidating: boolean;
  createdTime: string;
  updatedTime: string;
}

export interface WsPositionData {
  id: string;
  coinId: string;
  contractId: string;
  side: "LONG" | "SHORT";
  marginMode: string;
  separatedMode: string;
  leverage: string;
  size: string;
  openValue: string;
  openFee: string;
  fundingFee: string;
  isolatedMargin: string;
  createdTime: string;
  updatedTime: string;
}

export interface WsOrderData {
  id: string;
  coinId: string;
  contractId: string;
  marginMode: string;
  positionSide: string;
  orderSide: string;
  price: string;
  size: string;
  clientOrderId: string;
  type: string;
  timeInForce: string;
  reduceOnly: boolean;
  status: string;
  cumFillSize: string;
  cumFillValue: string;
  cumFillFee: string;
  createdTime: string;
  updatedTime: string;
}

export interface WsFillData {
  id: string;
  coinId: string;
  contractId: string;
  orderId: string;
  marginMode: string;
  positionSide: string;
  orderSide: string;
  fillSize: string;
  fillValue: string;
  fillFee: string;
  realizePnl: string;
  direction: "MAKER" | "TAKER";
  createdTime: string;
  updatedTime: string;
}

export type WsMessageHandler<T> = (data: T) => void;

export interface WsSubscription {
  channel: string;
  symbol?: string;
  interval?: string;
  level?: string;
}
