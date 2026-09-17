import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PROGRESS_STORAGE_KEY, sanitizeSavedProgress, useLearningProgressStore } from './useLearningProgressStore';

describe('versioned local learning progress', () => {
  beforeEach(() => useLearningProgressStore.getState().clearProgress());
  afterEach(() => vi.unstubAllGlobals());

  it('records topics and tasks once and updates question attempts', () => {
    const progress = useLearningProgressStore.getState();
    progress.completeTopic('iyonik-bag');
    progress.completeTopic('iyonik-bag');
    progress.completeTask('iyonik-cift');
    progress.recordQuestionResult('ib-1', false);
    progress.recordQuestionResult('ib-1', true);
    expect(useLearningProgressStore.getState().completedTopicIds).toEqual(['iyonik-bag']);
    expect(useLearningProgressStore.getState().completedTaskIds).toEqual(['iyonik-cift']);
    expect(useLearningProgressStore.getState().questionResults['ib-1']).toEqual({ correct: true, attempts: 2 });
  });

  it('clears all local learning records', () => {
    useLearningProgressStore.getState().completeTask('konum');
    useLearningProgressStore.getState().clearProgress();
    expect(useLearningProgressStore.getState().completedTaskIds).toEqual([]);
    expect(useLearningProgressStore.getState().questionResults).toEqual({});
  });

  it('rejects corrupt persisted fields while preserving valid records', () => {
    expect(sanitizeSavedProgress(null).completedTaskIds).toEqual([]);
    expect(sanitizeSavedProgress({
      completedTopicIds: ['periyodik-tablo', 7],
      completedTaskIds: 'bad',
      questionResults: { 'pt-1': { correct: true, attempts: 1 }, bad: { correct: 'yes', attempts: -1 } }
    })).toEqual({
      completedTopicIds: ['periyodik-tablo'],
      completedTaskIds: [],
      questionResults: { 'pt-1': { correct: true, attempts: 1 } }
    });
  });

  it('rehydrates browser-only progress and removes it when cleared', async () => {
    const saved = new Map<string, string>();
    vi.stubGlobal('document', {});
    vi.stubGlobal('window', { localStorage: {
      getItem: (key: string) => saved.get(key) ?? null,
      setItem: (key: string, value: string) => { saved.set(key, value); },
      removeItem: (key: string) => { saved.delete(key); }
    } });
    useLearningProgressStore.getState().completeTask('konum');
    const snapshot = saved.get(PROGRESS_STORAGE_KEY);
    expect(snapshot).toContain('"version":1');
    useLearningProgressStore.setState({ completedTaskIds: [] });
    if (!snapshot) throw new Error('Progress was not saved');
    saved.set(PROGRESS_STORAGE_KEY, snapshot);
    await useLearningProgressStore.persist.rehydrate();
    expect(useLearningProgressStore.getState().completedTaskIds).toEqual(['konum']);
    useLearningProgressStore.getState().clearProgress();
    expect(saved.has(PROGRESS_STORAGE_KEY)).toBe(false);
  });

  it('discards an incompatible old progress schema', async () => {
    const saved = new Map<string, string>();
    saved.set(PROGRESS_STORAGE_KEY, JSON.stringify({
      state: { completedTopicIds: ['iyonik-bag'], completedTaskIds: ['iyonik-cift'], questionResults: {} },
      version: 0
    }));
    vi.stubGlobal('document', {});
    vi.stubGlobal('window', { localStorage: {
      getItem: (key: string) => saved.get(key) ?? null,
      setItem: (key: string, value: string) => { saved.set(key, value); },
      removeItem: (key: string) => { saved.delete(key); }
    } });
    await useLearningProgressStore.persist.rehydrate();
    expect(useLearningProgressStore.getState().completedTopicIds).toEqual([]);
    expect(useLearningProgressStore.getState().completedTaskIds).toEqual([]);
  });
});
