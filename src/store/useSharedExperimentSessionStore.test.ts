import { beforeEach, describe, expect, it } from 'vitest';
import { useSharedExperimentSessionStore } from './useSharedExperimentSessionStore';

describe('shared experiment prediction session', () => {
  beforeEach(() => useSharedExperimentSessionStore.getState().begin('hf:'));

  it('keeps the answer hidden until a prediction is selected', () => {
    useSharedExperimentSessionStore.getState().reveal();
    expect(useSharedExperimentSessionStore.getState().revealed).toBe(false);
    useSharedExperimentSessionStore.getState().choose('ionic');
    useSharedExperimentSessionStore.getState().reveal();
    expect(useSharedExperimentSessionStore.getState().revealed).toBe(true);
  });

  it('starts a new link without carrying the prior choice or answer', () => {
    useSharedExperimentSessionStore.getState().choose('polar-covalent');
    useSharedExperimentSessionStore.getState().reveal();
    useSharedExperimentSessionStore.getState().begin('nacl:');
    expect(useSharedExperimentSessionStore.getState()).toMatchObject({
      scopeKey: 'nacl:', choice: null, revealed: false
    });
  });
});
