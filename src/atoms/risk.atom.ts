import { atom } from 'jotai';

export const riskExposureAtom = atom<number>(32); // Percentage
export const volatilityGuardAtom = atom<boolean>(true); // Armed/Disarmed
export const riskLevelAtom = atom<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('LOW');
