import { describe, expect, it } from 'vitest';
import { landingExperiments, LANDING_BOND_LABELS } from './landingExperiments';
import { getAllScenarios } from '../lib/chemistry/stoichiometry';
import { getLaboratoryPath, resolveRoute } from '../navigation/routes';

describe('landing experiment integration', () => {
  it('keeps the curated examples available and resolves their existing routes', () => {
    expect(landingExperiments.map(item => item.scenarioId)).toEqual(['nacl', 'h2o', 'o2', 'inert_gas']);
    for (const experiment of landingExperiments) {
      expect(getAllScenarios()).toContain(experiment.scenario);
      expect(experiment.atoms.map(atom => atom.symbol)).toEqual(experiment.scenario.reactantKeys);
      expect(experiment.analysis.bondType).toBe(experiment.scenario.bondType);
      expect(LANDING_BOND_LABELS[experiment.analysis.bondType]).toBeTruthy();
      expect(resolveRoute(getLaboratoryPath('free', experiment.scenarioId))).toEqual({
        kind: 'laboratory', mode: 'free', scenarioId: experiment.scenarioId
      });
    }
  });
});
