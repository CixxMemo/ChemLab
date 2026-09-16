import { beforeEach, describe, expect, it } from 'vitest';
import { useChemistryStore } from './useChemistryStore';

describe('useChemistryStore.loadScenarioById', () => {
  beforeEach(() => {
    useChemistryStore.getState().resetSimulation();
  });

  it('loads the inert scenario with its canonical helium-neon pair', () => {
    useChemistryStore.getState().loadScenarioById('inert_gas');

    const { activeScenario, selectedElements } = useChemistryStore.getState();

    expect(activeScenario?.id).toBe('inert_gas');
    expect(selectedElements).toHaveLength(2);
    expect(selectedElements.map(element => element.symbol)).toEqual(['He', 'Ne']);
  });

  it('preserves the configured pair for ordinary scenarios', () => {
    useChemistryStore.getState().loadScenarioById('nacl');

    const { selectedElements } = useChemistryStore.getState();

    expect(selectedElements.map(element => element.symbol)).toEqual(['Na', 'Cl']);
  });

  it('prepares guided experiments paused without changing sandbox autoplay', () => {
    useChemistryStore.getState().loadScenarioById('nacl', { autoplay: false });
    expect(useChemistryStore.getState().playbackStatus).toBe('paused');
    expect(useChemistryStore.getState().progress).toBe(0);
    useChemistryStore.getState().loadScenarioById('nacl');
    expect(useChemistryStore.getState().playbackStatus).toBe('playing');
  });
});
