import { beforeEach, describe, expect, it } from 'vitest';
import { REVEAL_FIELDS } from '../presentation/revealPolicy';
import { useTeacherPresentationStore } from './useTeacherPresentationStore';

describe('teacher presentation session', () => {
  beforeEach(() => useTeacherPresentationStore.getState().begin('lesson-a'));

  it('reveals stepwise and caps the last stage', () => {
    for (let index = 0; index < REVEAL_FIELDS.length + 2; index++) {
      useTeacherPresentationStore.getState().revealNext('lesson-a');
    }
    expect(useTeacherPresentationStore.getState().revealLevel).toBe(REVEAL_FIELDS.length);
  });

  it('resets the answer curtain for a different lesson', () => {
    useTeacherPresentationStore.getState().showAll('lesson-a');
    useTeacherPresentationStore.getState().begin('lesson-b');
    expect(useTeacherPresentationStore.getState().revealLevel).toBe(0);
    expect(useTeacherPresentationStore.getState().scopeKey).toBe('lesson-b');
  });
});
