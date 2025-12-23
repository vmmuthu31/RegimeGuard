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
