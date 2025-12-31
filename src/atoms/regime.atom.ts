import { atom } from 'jotai';

export type RegimeType = 'TRENDING' | 'RANGING' | 'VOLATILE';

export const regimeAtom = atom<RegimeType>('TRENDING');
export const regimeConfidenceAtom = atom<number>(72);
