import { create } from 'zustand';
import { REVEAL_FIELDS } from '../presentation/revealPolicy';

interface TeacherPresentationState {
  scopeKey: string | null;
  revealLevel: number;
  begin: (scopeKey: string) => void;
  showPrediction: (scopeKey: string) => void;
  revealNext: (scopeKey: string) => void;
  showAll: (scopeKey: string) => void;
}

export const useTeacherPresentationStore = create<TeacherPresentationState>(set => ({
  scopeKey: null,
  revealLevel: 0,
  begin: scopeKey => set({ scopeKey, revealLevel: 0 }),
  showPrediction: scopeKey => set({ scopeKey, revealLevel: 0 }),
  revealNext: scopeKey => set(state => ({
    scopeKey,
    revealLevel: Math.min(
      state.scopeKey === scopeKey ? state.revealLevel + 1 : 1,
      REVEAL_FIELDS.length
    )
  })),
  showAll: scopeKey => set({ scopeKey, revealLevel: REVEAL_FIELDS.length })
}));
