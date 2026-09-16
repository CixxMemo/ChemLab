import { create } from 'zustand';
import { BondType } from '../types/chemistry';

export type LessonStage = 'predict' | 'observe' | 'check' | 'complete';

interface LessonSessionState {
  topicId: string | null;
  stage: LessonStage;
  choice: BondType | null;
  prediction: BondType | null;
  answers: Readonly<Record<string, number>>;
  begin: (topicId: string) => void;
  choose: (choice: BondType) => void;
  reveal: () => void;
  startQuestions: () => void;
  answer: (questionId: string, optionIndex: number) => void;
  complete: () => void;
}

export const useLessonSessionStore = create<LessonSessionState>(set => ({
  topicId: null,
  stage: 'predict',
  choice: null,
  prediction: null,
  answers: {},
  begin: topicId => set({ topicId, stage: 'predict', choice: null, prediction: null, answers: {} }),
  choose: choice => set({ choice }),
  reveal: () => set(state => state.choice ? { prediction: state.choice, stage: 'observe' } : state),
  startQuestions: () => set({ stage: 'check' }),
  answer: (questionId, optionIndex) => set(state => {
    if (state.answers[questionId] !== undefined) return state;
    return { answers: { ...state.answers, [questionId]: optionIndex } };
  }),
  complete: () => set({ stage: 'complete' })
}));
