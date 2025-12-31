import { useAtom } from 'jotai';
import { regimeAtom, regimeConfidenceAtom } from '../atoms/regime.atom';
import { useEffect } from 'react';

export const useRegime = () => {
  const [regime, setRegime] = useAtom(regimeAtom);
  const [confidence, setConfidence] = useAtom(regimeConfidenceAtom);

  // Simulate regime updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly fluctuate confidence
      setConfidence(prev => Math.min(99, Math.max(60, prev + (Math.random() - 0.5) * 5)));
    }, 2000);
    return () => clearInterval(interval);
  }, [setConfidence]);

  return {
    regime,
    confidence,
  };
};
