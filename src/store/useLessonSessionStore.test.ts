import { beforeEach, describe, expect, it } from 'vitest';
import { useLessonSessionStore } from './useLessonSessionStore';

describe('ephemeral guided lesson session', () => {
  beforeEach(() => useLessonSessionStore.getState().begin('iyonik-bag'));

  it('does not reveal a result without a prediction', () => {
    useLessonSessionStore.getState().reveal();
    expect(useLessonSessionStore.getState().stage).toBe('predict');
  });

  it('moves through prediction, observation, explained answers and completion', () => {
    useLessonSessionStore.getState().choose('ionic');
    useLessonSessionStore.getState().reveal();
    expect(useLessonSessionStore.getState().prediction).toBe('ionic');
    expect(useLessonSessionStore.getState().stage).toBe('observe');
    useLessonSessionStore.getState().startQuestions();
    useLessonSessionStore.getState().answer('ib-1', 1);
    useLessonSessionStore.getState().answer('ib-1', 0);
    expect(useLessonSessionStore.getState().answers['ib-1']).toBe(1);
    useLessonSessionStore.getState().complete();
    expect(useLessonSessionStore.getState().stage).toBe('complete');
  });

  it('starts another topic with no retained answers or prediction', () => {
    useLessonSessionStore.getState().choose('ionic');
    useLessonSessionStore.getState().reveal();
    useLessonSessionStore.getState().answer('ib-1', 1);
    useLessonSessionStore.getState().begin('kovalent-bag');
    expect(useLessonSessionStore.getState().prediction).toBeNull();
    expect(useLessonSessionStore.getState().answers).toEqual({});
  });
});
