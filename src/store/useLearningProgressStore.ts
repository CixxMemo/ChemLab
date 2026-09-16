import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface QuestionResult {
  readonly correct: boolean;
  readonly attempts: number;
}

interface SavedProgress {
  readonly completedTopicIds: readonly string[];
  readonly completedTaskIds: readonly string[];
  readonly questionResults: Readonly<Record<string, QuestionResult>>;
}

interface LearningProgressState extends SavedProgress {
  completeTopic: (id: string) => void;
  completeTask: (id: string) => void;
  recordQuestionResult: (id: string, correct: boolean) => void;
  clearProgress: () => void;
}

export const PROGRESS_STORAGE_KEY = 'chemlab-learning-progress';
const PROGRESS_SCHEMA_VERSION = 1; // Increment when the saved progress shape changes.
const INITIAL_PROGRESS: SavedProgress = { completedTopicIds: [], completedTaskIds: [], questionResults: {} };

function readIds(value: unknown): readonly string[] {
  return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
}

function readQuestionResults(value: unknown): Readonly<Record<string, QuestionResult>> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, QuestionResult] => {
    const result: unknown = entry[1];
    if (typeof result !== 'object' || result === null) return false;
    const fields = result as Record<string, unknown>;
    return typeof fields.correct === 'boolean' && Number.isInteger(fields.attempts) && (fields.attempts as number) > 0;
  }));
}

export function sanitizeSavedProgress(value: unknown): SavedProgress {
  if (typeof value !== 'object' || value === null) return INITIAL_PROGRESS;
  const fields = value as Record<string, unknown>;
  return {
    completedTopicIds: readIds(fields.completedTopicIds),
    completedTaskIds: readIds(fields.completedTaskIds),
    questionResults: readQuestionResults(fields.questionResults)
  };
}

function appendUnique(ids: readonly string[], id: string): readonly string[] {
  return ids.includes(id) ? ids : [...ids, id];
}

export const useLearningProgressStore = create<LearningProgressState>()(persist((set) => ({
  ...INITIAL_PROGRESS,
  completeTopic: id => set(state => ({ completedTopicIds: appendUnique(state.completedTopicIds, id) })),
  completeTask: id => set(state => ({ completedTaskIds: appendUnique(state.completedTaskIds, id) })),
  recordQuestionResult: (id, correct) => set(state => ({
    questionResults: {
      ...state.questionResults,
      [id]: { correct, attempts: (state.questionResults[id]?.attempts ?? 0) + 1 }
    }
  })),
  clearProgress: () => {
    set(INITIAL_PROGRESS);
    useLearningProgressStore.persist.clearStorage();
  }
}), {
  name: PROGRESS_STORAGE_KEY,
  version: PROGRESS_SCHEMA_VERSION,
  storage: createJSONStorage(() => ({
    getItem: name => typeof document === 'undefined' ? null : window.localStorage.getItem(name),
    setItem: (name, value) => { if (typeof document !== 'undefined') window.localStorage.setItem(name, value); },
    removeItem: name => { if (typeof document !== 'undefined') window.localStorage.removeItem(name); }
  })),
  partialize: state => ({
    completedTopicIds: state.completedTopicIds,
    completedTaskIds: state.completedTaskIds,
    questionResults: state.questionResults
  }),
  migrate: () => INITIAL_PROGRESS,
  merge: (persisted, current) => ({ ...current, ...sanitizeSavedProgress(persisted) })
}));
