import { describe, it, expect } from 'vitest';
import { CovalentReactionStrategy } from './CovalentReactionStrategy';
import { ReactionContext } from './IReactionStrategy';
import { ElementData } from '../../../types/chemistry';
import rawElements from '../../../data/elements.json';

const elementsMap = rawElements as Record<string, ElementData>;
const getElement = (symbol: string): ElementData => {
  const el = Object.values(elementsMap).find(e => e.symbol === symbol);
  if (!el) throw new Error(`Element ${symbol} not found in elements.json`);
  return el;
};

const makeContext = (atomA: ElementData, atomB: ElementData): ReactionContext => {
  const deltaEN =
    atomA.electronegativity !== null && atomB.electronegativity !== null
      ? Number(Math.abs(atomA.electronegativity - atomB.electronegativity).toFixed(2))
      : 0;

  const isNobleInvolved =
    atomA.category === 'noble' ||
    atomB.category === 'noble' ||
    atomA.group === 18 ||
    atomB.group === 18 ||
    atomA.electronegativity === null ||
    atomB.electronegativity === null;

  const isAElectroNegative = (atomA.electronegativity ?? 0) >= (atomB.electronegativity ?? 0);
  const acceptor = isAElectroNegative ? atomA : atomB;
  const donor = isAElectroNegative ? atomB : atomA;

  return {
    reactants: [atomA, atomB],
    primaryAtom: atomA,
    secondaryAtom: atomB,
    deltaEN,
    donor,
    acceptor,
    isNobleInvolved
  };
};

describe('CovalentReactionStrategy Bond-Order Calculations', () => {
  const strategy = new CovalentReactionStrategy();

  describe('Diatomic Homonuclear Covalent Bonds', () => {
    it('calculates 1 shared pair for H₂ (single bond)', () => {
      const h = getElement('H');
      const ctx = makeContext(h, h);
      const res = strategy.resolve(ctx);

      expect(res.bondAnalysis.sharedElectronPairs).toBe(1);
      expect(res.bondAnalysis.bondType).toBe('nonpolar-covalent');
      expect(res.bondAnalysis.deltaEN).toBe(0);
    });

    it('calculates 2 shared pairs for O₂ (double bond)', () => {
      const o = getElement('O');
      const ctx = makeContext(o, o);
      const res = strategy.resolve(ctx);

      expect(res.bondAnalysis.sharedElectronPairs).toBe(2);
      expect(res.bondAnalysis.bondType).toBe('nonpolar-covalent');
    });

    it('calculates 3 shared pairs for N₂ (triple bond)', () => {
      const n = getElement('N');
      const ctx = makeContext(n, n);
      const res = strategy.resolve(ctx);

      expect(res.bondAnalysis.sharedElectronPairs).toBe(3);
      expect(res.bondAnalysis.bondType).toBe('nonpolar-covalent');
    });

    // Regression tests for Task 1's confirmed bug (previously fell through to Math.min(7, 7, 2) = 2)
    it('calculates 1 shared pair for Cl₂ (single bond, regression test)', () => {
      const cl = getElement('Cl');
      const ctx = makeContext(cl, cl);
      const res = strategy.resolve(ctx);

      expect(res.bondAnalysis.sharedElectronPairs).toBe(1);
      expect(res.bondAnalysis.bondType).toBe('nonpolar-covalent');
    });

    it('calculates 1 shared pair for F₂ (single bond, regression test)', () => {
      const f = getElement('F');
      const ctx = makeContext(f, f);
      const res = strategy.resolve(ctx);

      expect(res.bondAnalysis.sharedElectronPairs).toBe(1);
      expect(res.bondAnalysis.bondType).toBe('nonpolar-covalent');
    });

    it('calculates 1 shared pair for Br₂ (single bond, regression test)', () => {
      const br = getElement('Br');
      const ctx = makeContext(br, br);
      const res = strategy.resolve(ctx);

      expect(res.bondAnalysis.sharedElectronPairs).toBe(1);
      expect(res.bondAnalysis.bondType).toBe('nonpolar-covalent');
    });
  });

  describe('Heteronuclear Covalent Bonds', () => {
    it('calculates 1 shared pair per bond for H + O (H₂O, polar covalent)', () => {
      const h = getElement('H');
      const o = getElement('O');
      const ctx = makeContext(h, o);
      const res = strategy.resolve(ctx);

      expect(res.bondAnalysis.sharedElectronPairs).toBe(1);
      expect(res.bondAnalysis.bondType).toBe('polar-covalent');
      expect(res.bondAnalysis.deltaEN).toBe(1.24);
    });

    it('calculates 1 shared pair per bond for C + H (CH₄, nonpolar covalent)', () => {
      const c = getElement('C');
      const h = getElement('H');
      const ctx = makeContext(c, h);
      const res = strategy.resolve(ctx);

      expect(res.bondAnalysis.sharedElectronPairs).toBe(1);
      expect(res.bondAnalysis.bondType).toBe('nonpolar-covalent');
      expect(res.bondAnalysis.deltaEN).toBe(0.35);
    });
  });
});
