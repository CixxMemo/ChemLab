import { describe, it, expect } from 'vitest';
import { InertReactionStrategy } from './InertReactionStrategy';
import { ReactionContext } from './IReactionStrategy';
import { ElementData } from '../../../types/chemistry';
import rawElements from '../../../data/elements.json';

const elementsMap = rawElements as Record<string, ElementData>;
const getElement = (symbol: string): ElementData => {
  const el = Object.values(elementsMap).find(e => e.symbol === symbol);
  if (!el) throw new Error(`Element ${symbol} not found in elements.json`);
  return el;
};

describe('InertReactionStrategy', () => {
  const strategy = new InertReactionStrategy();

  describe('supports()', () => {
    it('supports noble gas pairings (He + Ne)', () => {
      const he = getElement('He');
      const ne = getElement('Ne');
      const ctx: ReactionContext = {
        reactants: [he, ne],
        primaryAtom: he,
        secondaryAtom: ne,
        deltaEN: null,
        donor: he,
        acceptor: ne,
        isNobleInvolved: true
      };

      expect(strategy.supports(ctx)).toBe(true);
    });

    it('supports null-electronegativity cases (Rf + Cl)', () => {
      const rf = getElement('Rf');
      const cl = getElement('Cl');
      const ctx: ReactionContext = {
        reactants: [rf, cl],
        primaryAtom: rf,
        secondaryAtom: cl,
        deltaEN: null,
        donor: rf,
        acceptor: cl,
        isNobleInvolved: true
      };

      expect(strategy.supports(ctx)).toBe(true);
    });

    it('does not support reactive non-noble elements with valid ΔEN (Na + Cl)', () => {
      const na = getElement('Na');
      const cl = getElement('Cl');
      const ctx: ReactionContext = {
        reactants: [na, cl],
        primaryAtom: na,
        secondaryAtom: cl,
        deltaEN: 2.23,
        donor: na,
        acceptor: cl,
        isNobleInvolved: false
      };

      expect(strategy.supports(ctx)).toBe(false);
    });
  });

  describe('resolve()', () => {
    it('returns repulsion physics and no-bond analysis for noble gases (He + Ne)', () => {
      const he = getElement('He');
      const ne = getElement('Ne');
      const ctx: ReactionContext = {
        reactants: [he, ne],
        primaryAtom: he,
        secondaryAtom: ne,
        deltaEN: null,
        donor: he,
        acceptor: ne,
        isNobleInvolved: true
      };

      const res = strategy.resolve(ctx);
      expect(res.bondAnalysis.bondType).toBe('no-bond');
      expect(res.bondAnalysis.deltaEN).toBeNull();
      expect(res.physics.isReactionOccurred).toBe(false);
      expect(res.physics.repulsion).toBe(true);
      expect(res.physics.repulsionStrength).toBe(1.0);
      expect(res.physics.overlapDistance).toBe(0);
      expect(res.scenario.id).toBe('inert_gas');
    });

    it('returns repulsion physics and no-bond for null-electronegativity atom', () => {
      const rf = getElement('Rf');
      const na = getElement('Na');
      const ctx: ReactionContext = {
        reactants: [rf, na],
        primaryAtom: rf,
        secondaryAtom: na,
        deltaEN: null,
        donor: rf,
        acceptor: na,
        isNobleInvolved: true
      };

      const res = strategy.resolve(ctx);
      expect(res.bondAnalysis.bondType).toBe('no-bond');
      expect(res.bondAnalysis.deltaEN).toBeNull();
      expect(res.physics.isReactionOccurred).toBe(false);
      expect(res.physics.repulsion).toBe(true);
    });
  });
});
