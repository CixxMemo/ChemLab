import { describe, expect, it } from 'vitest';
import { getAllScenarios } from '../lib/chemistry/stoichiometry';
import { resolveSharedExperiment } from './sharedExperiment';

describe('shared experiment links', () => {
  const scenarios = getAllScenarios();

  it('accepts a verified experiment with or without its own task', () => {
    expect(resolveSharedExperiment(scenarios, 'hf', null)?.scenario.id).toBe('hf');
    expect(resolveSharedExperiment(scenarios, 'hf', 'hf-yanilgisi')?.task?.id).toBe('hf-yanilgisi');
  });

  it('rejects an unknown experiment, unknown task and mismatched task', () => {
    expect(resolveSharedExperiment(scenarios, 'unknown', null)).toBeNull();
    expect(resolveSharedExperiment(scenarios, 'hf', 'unknown')).toBeNull();
    expect(resolveSharedExperiment(scenarios, 'hf', 'iyonik-cift')).toBeNull();
  });
});
