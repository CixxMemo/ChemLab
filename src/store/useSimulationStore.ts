import { useUIStore, UIState } from './useUIStore';
import { useChemistryStore, ChemistryState } from './useChemistryStore';

export type SimulationStore = UIState & ChemistryState;

/**
 * Facade combining UIState and ChemistryState for backwards compatibility.
 * In compliance with SRP and DIP, new components should import `useUIStore` or `useChemistryStore` directly.
 */
export function useSimulationStore(): SimulationStore;
export function useSimulationStore<T>(selector: (state: SimulationStore) => T): T;
export function useSimulationStore<T>(selector?: (state: SimulationStore) => T): T | SimulationStore {
  const ui = useUIStore();
  const chem = useChemistryStore();
  const combined: SimulationStore = { ...chem, ...ui };

  if (selector) {
    return selector(combined);
  }
  return combined;
}

useSimulationStore.getState = (): SimulationStore => ({
  ...useChemistryStore.getState(),
  ...useUIStore.getState()
});
