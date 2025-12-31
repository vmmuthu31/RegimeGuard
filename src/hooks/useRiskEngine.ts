import { useAtom } from 'jotai';
import { riskExposureAtom, volatilityGuardAtom, riskLevelAtom } from '../atoms/risk.atom';

export const useRiskEngine = () => {
  const [exposure] = useAtom(riskExposureAtom);
  const [isGuardArmed] = useAtom(volatilityGuardAtom);
  const [riskLevel] = useAtom(riskLevelAtom);

  return {
    exposure,
    isGuardArmed,
    riskLevel,
  };
};
