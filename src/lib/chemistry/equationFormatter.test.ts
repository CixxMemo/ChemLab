import { describe, expect, it } from 'vitest';
import rawElements from '../../data/elements.json';
import rawScenarios from '../../data/reactions.json';
import { ElementData, ReactionScenario } from '../../types/chemistry';
import { formatReactionDetails } from './equationFormatter';

const elements = Object.values(rawElements as Record<string, ElementData>);
const scenarios = rawScenarios as ReactionScenario[];

describe('formatReactionDetails', () => {
  it('uses curated equation data independently of scenario identity', () => {
    const scenario = scenarios.find(item => item.id === 'h2o');
    expect(scenario).toBeDefined();
    if (!scenario) return;
    const selected = elements.filter(item => scenario.reactantKeys.includes(item.symbol));
    expect(formatReactionDetails({ ...scenario, id: 'renamed' }, null, selected)?.equation)
      .toBe('2 H₂ + O₂ → 2 H₂O');
  });

  it('recognizes inert outcomes from bond type, not a scenario ID', () => {
    const scenario = scenarios.find(item => item.id === 'inert_gas');
    expect(scenario).toBeDefined();
    if (!scenario) return;
    const selected = elements.filter(item => ['He', 'Ne'].includes(item.symbol));
    expect(formatReactionDetails({ ...scenario, id: 'renamed' }, null, selected)?.isInert).toBe(true);
  });
});
