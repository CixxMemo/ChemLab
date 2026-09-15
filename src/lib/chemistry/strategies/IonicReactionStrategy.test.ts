import { describe, it, expect } from 'vitest';
import { IonicReactionStrategy, calculateIonicRatio } from './IonicReactionStrategy';
import { ReactionContext } from './IReactionStrategy';
import { ElementData } from '../../../types/chemistry';
import rawElements from '../../../data/elements.json';

const elementsMap = rawElements as Record<string, ElementData>;
const getElement = (symbol: string): ElementData => {
  const el = Object.values(elementsMap).find(e => e.symbol === symbol);
  if (!el) throw new Error(`Element ${symbol} not found in elements.json`);
  return el;
};

describe('IonicReactionStrategy.calculateIonicRatio()', () => {
  it('calculates 1:1 ratio for NaCl', () => {
    const na = getElement('Na');
    const cl = getElement('Cl');
    const ratio = IonicReactionStrategy.calculateIonicRatio(na, cl);

    expect(ratio.donorCount).toBe(1);
    expect(ratio.acceptorCount).toBe(1);
    expect(ratio.formula).toBe('NaCl');
  });

  it('calculates 1:2 ratio for MgCl₂', () => {
    const mg = getElement('Mg');
    const cl = getElement('Cl');
    const ratio = IonicReactionStrategy.calculateIonicRatio(mg, cl);

    expect(ratio.donorCount).toBe(1);
    expect(ratio.acceptorCount).toBe(2);
    expect(ratio.formula).toBe('MgCl2');
  });

  it('calculates 2:3 ratio for Al₂O₃', () => {
    const al = getElement('Al');
    const o = getElement('O');
    const ratio = IonicReactionStrategy.calculateIonicRatio(al, o);

    expect(ratio.donorCount).toBe(2);
    expect(ratio.acceptorCount).toBe(3);
    expect(ratio.formula).toBe('Al2O3');
  });

  it('exercises GCD reduction path (2:2 reduced to 1:1) for MgO', () => {
    const mg = getElement('Mg'); // valence: 2
    const o = getElement('O');   // valence: 6 -> needs 2
    const ratio = calculateIonicRatio(mg, o);

    expect(ratio.donorCount).toBe(1);
    expect(ratio.acceptorCount).toBe(1);
    expect(ratio.formula).toBe('MgO');
  });

  it('exercises GCD reduction path for CaO (1:1)', () => {
    const ca = getElement('Ca');
    const o = getElement('O');
    const ratio = IonicReactionStrategy.calculateIonicRatio(ca, o);

    expect(ratio.donorCount).toBe(1);
    expect(ratio.acceptorCount).toBe(1);
    expect(ratio.formula).toBe('CaO');
  });
});

describe('IonicReactionStrategy.resolve()', () => {
  const strategy = new IonicReactionStrategy();

  it('resolves ionic bond parameters for Na + Cl', () => {
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

    const res = strategy.resolve(ctx);
    expect(res.bondAnalysis.bondType).toBe('ionic');
    expect(res.bondAnalysis.deltaEN).toBe(2.23);
    expect(res.bondAnalysis.cationCharge).toBe(1);
    expect(res.bondAnalysis.anionCharge).toBe(1);
    expect(res.bondAnalysis.octetStatuses).toMatchObject([
      { symbol: 'Na', outerElectronCount: 8, targetElectronCount: 8, isSatisfied: true },
      { symbol: 'Cl', outerElectronCount: 8, targetElectronCount: 8, isSatisfied: true }
    ]);
    expect(res.physics.isReactionOccurred).toBe(true);
    expect(res.physics.repulsion).toBe(false);
  });

  it('rejects H + F because nonmetal pairs belong to the covalent strategy', () => {
    const h = getElement('H');
    const f = getElement('F');
    const ctx: ReactionContext = {
      reactants: [h, f],
      primaryAtom: h,
      secondaryAtom: f,
      deltaEN: 1.78,
      donor: h,
      acceptor: f,
      isNobleInvolved: false
    };

    expect(strategy.supports(ctx)).toBe(false);
  });

  it('accepts metal and nonmetal pairs before applying the ΔEN fallback', () => {
    const al = getElement('Al');
    const cl = getElement('Cl');
    const ctx: ReactionContext = {
      reactants: [al, cl],
      primaryAtom: al,
      secondaryAtom: cl,
      deltaEN: 1.55,
      donor: al,
      acceptor: cl,
      isNobleInvolved: false
    };

    expect(strategy.supports(ctx)).toBe(true);
  });
});
