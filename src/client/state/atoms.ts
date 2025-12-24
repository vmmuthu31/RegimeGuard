import { atom } from "jotai";
import type { TradingPair } from "@/shared/constants";
import type {
  RegimeClassification,
  RiskDecision,
  VolatilityGuardStatus,
  Position,
  AccountBalance,
  Trade,
  MarketData,
  TechnicalIndicators,
  TradeSignal,
} from "@/shared/types";

export const selectedSymbolAtom = atom<TradingPair>("cmt_btcusdt");

export const isEngineRunningAtom = atom<boolean>(false);

export const currentRegimeAtom = atom<RegimeClassification | null>(null);

export const currentRiskDecisionAtom = atom<RiskDecision | null>(null);

export const volatilityStatusAtom = atom<VolatilityGuardStatus | null>(null);

export const activePositionsAtom = atom<Position[]>([]);

export const accountBalanceAtom = atom<AccountBalance | null>(null);

export const tradeHistoryAtom = atom<Trade[]>([]);

export const marketDataAtom = atom<MarketData | null>(null);

export const technicalIndicatorsAtom = atom<TechnicalIndicators | null>(null);

export const currentSignalAtom = atom<TradeSignal | null>(null);

export const lastUpdateTimeAtom = atom<number>(Date.now());

export const systemStatusAtom = atom<
  "connecting" | "operational" | "error" | "suspended"
>("connecting");

export const tradingLoopStatusAtom = atom<{
  isRunning: boolean;
  isPaused: boolean;
  currentCycle: number;
  totalCycles: number;
  symbols: string[];
  intervalMs: number;
  dryRun: boolean;
  lastCycleTime: number | null;
  errors: string[];
}>({
  isRunning: false,
  isPaused: false,
  currentCycle: 0,
  totalCycles: 0,
  symbols: [],
  intervalMs: 60000,
  dryRun: true,
  lastCycleTime: null,
  errors: [],
});

export const websocketStatusAtom = atom<{
  publicConnected: boolean;
  privateConnected: boolean;
  subscriptions: string[];
  lastMessage: number | null;
}>({
  publicConnected: false,
  privateConnected: false,
  subscriptions: [],
  lastMessage: null,
});

export const aiStatusAtom = atom<{
  groqAvailable: boolean;
  lastAnalysis: number | null;
  pendingRequests: number;
}>({
  groqAvailable: false,
  lastAnalysis: null,
  pendingRequests: 0,
});

export const userSettingsAtom = atom<{
  tradingEnabled: boolean;
  maxPositionSizePercent: number;
  maxDailyLossPercent: number;
  defaultLeverage: number;
  riskProfile: "conservative" | "moderate" | "aggressive";
}>({
  tradingEnabled: false,
  maxPositionSizePercent: 0.1,
  maxDailyLossPercent: 0.05,
  defaultLeverage: 5,
  riskProfile: "moderate",
});

export const performanceMetricsAtom = atom<{
  totalTrades: number;
  winRate: number;
  totalPnl: number;
  totalPnlPercent: number;
  sharpeRatio: number;
  maxDrawdown: number;
} | null>(null);

export const derivedRiskLevelAtom = atom((get) => {
  const riskDecision = get(currentRiskDecisionAtom);
  return riskDecision?.riskLevel || "LOW";
});

export const derivedCanTradeAtom = atom((get) => {
  const riskDecision = get(currentRiskDecisionAtom);
  const volatility = get(volatilityStatusAtom);
  const isRunning = get(isEngineRunningAtom);

  if (!isRunning) return false;
  if (riskDecision?.tradeSuspended) return false;
  if (volatility?.killSwitchActive) return false;
  if (riskDecision?.tradeCooldownActive) return false;

  return true;
});

export const derivedSystemHealthAtom = atom((get) => {
  const systemStatus = get(systemStatusAtom);
  const loopStatus = get(tradingLoopStatusAtom);
  const wsStatus = get(websocketStatusAtom);

  return {
    overall: systemStatus === "operational" ? "healthy" : systemStatus,
    tradingLoop: loopStatus.isRunning ? "running" : "stopped",
    websocket: wsStatus.publicConnected ? "connected" : "disconnected",
    errors: loopStatus.errors.length,
  };
});
