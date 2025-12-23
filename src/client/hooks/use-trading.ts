import { useQuery, useMutation } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import type { TradingPair } from "@/shared/constants";
import type {
  RegimeClassification,
  VolatilityGuardStatus,
  MarketData,
  TechnicalIndicators,
  TradeSignal,
  AccountBalance,
  Position,
  RiskDecision,
} from "@/shared/types";
import {
  selectedSymbolAtom,
  currentRegimeAtom,
  volatilityStatusAtom,
  marketDataAtom,
  technicalIndicatorsAtom,
  currentSignalAtom,
  accountBalanceAtom,
  activePositionsAtom,
  currentRiskDecisionAtom,
  systemStatusAtom,
  lastUpdateTimeAtom,
} from "../state/atoms";

interface MarketResponse {
  success: boolean;
  data?: {
    symbol: TradingPair;
    ticker: MarketData;
    regime: RegimeClassification;
    indicators: TechnicalIndicators;
    volatilityStatus: VolatilityGuardStatus;
    signal: TradeSignal | null;
    timestamp: number;
  };
  error?: string;
}

async function fetchMarketData(symbol: TradingPair): Promise<MarketResponse> {
  const response = await fetch(`/api/market?symbol=${symbol}`);
  return response.json();
}

export function useMarketData() {
  const [symbol] = useAtom(selectedSymbolAtom);
  const setRegime = useSetAtom(currentRegimeAtom);
  const setVolatility = useSetAtom(volatilityStatusAtom);
  const setMarketData = useSetAtom(marketDataAtom);
  const setIndicators = useSetAtom(technicalIndicatorsAtom);
  const setSignal = useSetAtom(currentSignalAtom);
  const setLastUpdate = useSetAtom(lastUpdateTimeAtom);
  const setSystemStatus = useSetAtom(systemStatusAtom);

  return useQuery({
    queryKey: ["market", symbol],
    queryFn: async () => {
      const response = await fetchMarketData(symbol);
      if (response.success && response.data) {
        setRegime(response.data.regime);
        setVolatility(response.data.volatilityStatus);
        setMarketData(response.data.ticker);
        setIndicators(response.data.indicators);
        setSignal(response.data.signal);
        setLastUpdate(response.data.timestamp);
        setSystemStatus("operational");
      } else {
        setSystemStatus("error");
      }
      return response;
    },
    refetchInterval: 5000,
    staleTime: 3000,
  });
}

interface AccountResponse {
  success: boolean;
  data?: {
    balance: AccountBalance | null;
    positions: Position[];
    riskDecision?: RiskDecision;
    timestamp: number;
  };
  error?: string;
}

async function fetchAccountData(): Promise<AccountResponse> {
  const response = await fetch("/api/account");
  return response.json();
}

export function useAccountData() {
  const setBalance = useSetAtom(accountBalanceAtom);
  const setPositions = useSetAtom(activePositionsAtom);

  return useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const response = await fetchAccountData();
      if (response.success && response.data) {
        setBalance(response.data.balance);
        setPositions(response.data.positions);
      }
      return response;
    },
    refetchInterval: 10000,
    staleTime: 5000,
  });
}

export function useRiskEvaluation() {
  const setRiskDecision = useSetAtom(currentRiskDecisionAtom);

  return useMutation({
    mutationFn: async (params: {
      regime: RegimeClassification;
      currentVolatility: number;
      recentDrawdown?: number;
      lastTradeTime?: number;
      dailyLossPercent?: number;
      consecutiveLosses?: number;
    }) => {
      const response = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      return response.json() as Promise<AccountResponse>;
    },
    onSuccess: (data) => {
      if (data.success && data.data?.riskDecision) {
        setRiskDecision(data.data.riskDecision);
      }
    },
  });
}

interface HealthResponse {
  success: boolean;
  data: {
    status: string;
    serverTime?: number;
    localTime?: number;
    latency?: number;
    error?: string;
  };
}

async function fetchHealthStatus(): Promise<HealthResponse> {
  const response = await fetch("/api/health");
  return response.json();
}

export function useHealthCheck() {
  const setSystemStatus = useSetAtom(systemStatusAtom);

  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const response = await fetchHealthStatus();
      if (response.success && response.data.status === "operational") {
        setSystemStatus("operational");
      } else {
        setSystemStatus("error");
      }
      return response;
    },
    refetchInterval: 30000,
    staleTime: 15000,
  });
}
