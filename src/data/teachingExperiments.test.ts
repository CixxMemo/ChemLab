import { describe, expect, it } from 'vitest';
import rawElements from './elements.json';
import { getAllScenarios } from '../lib/chemistry/stoichiometry';
import { ReactionEngine } from '../lib/chemistry/strategies/ReactionEngine';
import { ElementData, ReactionScenario } from '../types/chemistry';

const elements = Object.values(rawElements as Record<string, ElementData>);
const engine = new ReactionEngine();
const scenarios = getAllScenarios();

// Expected classroom examples are checked against the verified values in chemistry-rules.md
// and the H–F category-first rule in agents.md.
const VERIFIED_EXPERIMENTS = [
  { id: 'nacl', symbols: ['Na', 'Cl'], categories: ['alkali', 'halogen'], valence: [1, 7], bondType: 'ionic', deltaEN: 2.23, outer: [8, 8], reacts: true },
  { id: 'h2o', symbols: ['H', 'O'], categories: ['nonmetal', 'nonmetal'], valence: [1, 6], bondType: 'polar-covalent', deltaEN: 1.24, outer: [2, 8], reacts: true },
  { id: 'hf', symbols: ['H', 'F'], categories: ['nonmetal', 'halogen'], valence: [1, 7], bondType: 'polar-covalent', deltaEN: 1.78, outer: [2, 8], reacts: true },
  { id: 'ch4', symbols: ['C', 'H'], categories: ['nonmetal', 'nonmetal'], valence: [4, 1], bondType: 'nonpolar-covalent', deltaEN: 0.35, outer: [8, 2], reacts: true },
  { id: 'o2', symbols: ['O', 'O'], categories: ['nonmetal', 'nonmetal'], valence: [6, 6], bondType: 'nonpolar-covalent', deltaEN: 0, outer: [8, 8], reacts: true },
  { id: 'inert_gas', symbols: ['He', 'Ne'], categories: ['noble', 'noble'], valence: [2, 8], bondType: 'no-bond', deltaEN: null, outer: [2, 8], reacts: false }
] as const;

describe('verified teaching experiments', () => {
  it('keeps the curated catalog limited to the verified classroom examples', () => {
    expect(scenarios.map(scenario => scenario.id)).toEqual(
      VERIFIED_EXPERIMENTS.map(experiment => experiment.id)
    );
    expect(new Set(scenarios.map(scenario => scenario.id)).size).toBe(scenarios.length);
  });

  it.each(VERIFIED_EXPERIMENTS)('resolves $id with verified chemistry', experiment => {
    const scenario = scenarios.find(item => item.id === experiment.id) as ReactionScenario;
    const reactants = experiment.symbols.map(symbol => elements.find(element => element.symbol === symbol));

    expect(scenario).toBeDefined();
    expect(scenario.reactantKeys).toEqual(experiment.symbols);
    expect(reactants.every(Boolean)).toBe(true);

    const resolvedReactants = reactants as ElementData[];
    const resolution = engine.resolve(resolvedReactants);

    expect(resolvedReactants.map(element => element.category)).toEqual(experiment.categories);
    expect(resolvedReactants.map(element => element.valanceElectrons)).toEqual(experiment.valence);
    expect(resolution?.scenario.id).toBe(experiment.id);
    expect(resolution?.scenario.formula).toBe(scenario.formula);
    expect(resolution?.bondAnalysis.bondType).toBe(experiment.bondType);
    expect(resolution?.bondAnalysis.deltaEN).toBe(experiment.deltaEN);
    expect(resolution?.bondAnalysis.octetStatuses.map(status => status.outerElectronCount)).toEqual(experiment.outer);
    expect(resolution?.physics.isReactionOccurred).toBe(experiment.reacts);
  });
});
