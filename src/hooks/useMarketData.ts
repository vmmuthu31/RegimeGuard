import { useQuery } from '@tanstack/react-query';

// Mock data for now
const fetchMarketData = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    btcPrice: 42000 + Math.random() * 1000,
    volatility: 1.2 + Math.random() * 0.5,
    volume: 24000000000,
  };
};

export const useMarketData = () => {
  return useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    refetchInterval: 3000,
  });
};
