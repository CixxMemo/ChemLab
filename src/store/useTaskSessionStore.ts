import { create } from 'zustand';

interface TaskSessionState {
  taskId: string | null;
  selectedValue: string | null;
  correct: boolean;
  answer: (taskId: string, value: string, correct: boolean) => void;
}

export const useTaskSessionStore = create<TaskSessionState>(set => ({
  taskId: null,
  selectedValue: null,
  correct: false,
  answer: (taskId, selectedValue, correct) => set(state =>
    state.taskId === taskId && state.correct ? state : { taskId, selectedValue, correct })
}));
