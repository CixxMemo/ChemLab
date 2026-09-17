import { create } from 'zustand';
import { BondType } from '../types/chemistry';

interface SharedExperimentSessionState {
  scopeKey: string | null;
  choice: BondType | null;
  revealed: boolean;
  begin: (scopeKey: string) => void;
  choose: (choice: BondType) => void;
  reveal: () => void;
}

export const useSharedExperimentSessionStore = create<SharedExperimentSessionState>(set => ({
  scopeKey: null,
  choice: null,
  revealed: false,
  begin: scopeKey => set({ scopeKey, choice: null, revealed: false }),
  choose: choice => set({ choice }),
  reveal: () => set(state => state.choice ? { revealed: true } : state)
}));
