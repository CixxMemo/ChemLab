import { beforeEach, describe, expect, it } from 'vitest';
import { useTaskSessionStore } from './useTaskSessionStore';

describe('guided task retry session', () => {
  beforeEach(() => useTaskSessionStore.setState({ taskId: null, selectedValue: null, correct: false }));

  it('allows a retry after a wrong answer and locks a correct answer', () => {
    const session = useTaskSessionStore.getState();
    session.answer('hf-yanilgisi', 'ionic', false);
    expect(useTaskSessionStore.getState()).toMatchObject({ selectedValue: 'ionic', correct: false });
    session.answer('hf-yanilgisi', 'polar-covalent', true);
    session.answer('hf-yanilgisi', 'ionic', false);
    expect(useTaskSessionStore.getState()).toMatchObject({ selectedValue: 'polar-covalent', correct: true });
  });

  it('does not carry correctness to a different task', () => {
    const session = useTaskSessionStore.getState();
    session.answer('hf-yanilgisi', 'polar-covalent', true);
    session.answer('iyonik-cift', 'wrong', false);
    expect(useTaskSessionStore.getState()).toMatchObject({ taskId: 'iyonik-cift', correct: false });
  });
});
