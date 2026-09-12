import { describe, it, expect } from 'vitest';
import { ReactionEngine } from './ReactionEngine';
import { ElementData } from '../../../types/chemistry';
import rawElements from '../../../data/elements.json';

const elementsMap = rawElements as Record<string, ElementData>;
const getElement = (symbol: string): ElementData => {
  const el = Object.values(elementsMap).find(e => e.symbol === symbol);
  if (!el) throw new Error(`Element ${symbol} not found in elements.json`);
  return el;
};

const createMockElement = (overrides: Partial<ElementData>): ElementData => ({
  atomicNumber: 999,
  symbol: 'Xx',
  name: 'MockElement',
  nameTR: 'Yapay Element',
  group: 14,
  period: 2,
  category: 'nonmetal',
  electronegativity: 2.0,
  valanceElectrons: 4,
  shells: [2, 4],
  atomicMass: 100,
  nameEN: 'MockElement',
  ...overrides
});

describe('ReactionEngine.resolve()', () => {
  const engine = new ReactionEngine();

  describe('Noble-gas & null-electronegativity short-circuit', () => {
    it('short-circuits to InertReactionStrategy when He (noble) is involved', () => {
      const he = getElement('He');
      const ne = getElement('Ne');
      const resolution = engine.resolve([he, ne]);

      expect(resolution).not.toBeNull();
      expect(resolution?.bondAnalysis.bondType).toBe('no-bond');
      expect(resolution?.physics.repulsion).toBe(true);
      expect(resolution?.physics.isReactionOccurred).toBe(false);
    });

    it('short-circuits to InertReactionStrategy when a noble gas interacts with a reactive metal', () => {
      const ar = getElement('Ar');
      const na = getElement('Na');
      const resolution = engine.resolve([ar, na]);

      expect(resolution).not.toBeNull();
      expect(resolution?.bondAnalysis.bondType).toBe('no-bond');
      expect(resolution?.physics.repulsion).toBe(true);
      expect(resolution?.physics.isReactionOccurred).toBe(false);
    });

    it('short-circuits to InertReactionStrategy when element has null electronegativity', () => {
      const rf = getElement('Rf'); // Rutherfordium has electronegativity: null
      const cl = getElement('Cl');
      const resolution = engine.resolve([rf, cl]);

      expect(resolution).not.toBeNull();
      expect(resolution?.bondAnalysis.bondType).toBe('no-bond');
      expect(resolution?.bondAnalysis.deltaEN).toBeNull();
      expect(resolution?.physics.isReactionOccurred).toBe(false);
    });
  });

  describe('ΔEN = 1.7 boundary (Ionic vs Covalent selection)', () => {
    it('selects IonicReactionStrategy when ΔEN > 1.7 (e.g. real NaCl, ΔEN = 2.23)', () => {
      const na = getElement('Na');
      const cl = getElement('Cl');
      const resolution = engine.resolve([na, cl]);

      expect(resolution).not.toBeNull();
      expect(resolution?.bondAnalysis.bondType).toBe('ionic');
      expect(resolution?.bondAnalysis.deltaEN).toBe(2.23);
      expect(resolution?.bondAnalysis.formulaRatio?.formula).toBe('NaCl');
    });

    it('selects IonicReactionStrategy on strict threshold ΔEN = 1.71 (> 1.7)', () => {
      const donor = createMockElement({ symbol: 'Da', electronegativity: 1.0, valanceElectrons: 1, category: 'alkali' });
      const acceptor = createMockElement({ symbol: 'Aa', electronegativity: 2.71, valanceElectrons: 7, category: 'halogen' });
      const resolution = engine.resolve([donor, acceptor]);

      expect(resolution).not.toBeNull();
      expect(resolution?.bondAnalysis.bondType).toBe('ionic');
      expect(resolution?.bondAnalysis.deltaEN).toBe(1.71);
      expect(resolution?.physics.isReactionOccurred).toBe(true);
    });

    it('selects CovalentReactionStrategy on exact boundary ΔEN = 1.70 (<= 1.7)', () => {
      const atomA = createMockElement({ symbol: 'Ea', electronegativity: 1.0, valanceElectrons: 4 });
      const atomB = createMockElement({ symbol: 'Eb', electronegativity: 2.70, valanceElectrons: 4 });
      const resolution = engine.resolve([atomA, atomB]);

      expect(resolution).not.toBeNull();
      expect(resolution?.bondAnalysis.bondType).toBe('polar-covalent');
      expect(resolution?.bondAnalysis.deltaEN).toBe(1.70);
    });

    it('selects CovalentReactionStrategy when ΔEN = 1.69 (< 1.7)', () => {
      const atomA = createMockElement({ symbol: 'Ea', electronegativity: 1.0, valanceElectrons: 4 });
      const atomB = createMockElement({ symbol: 'Eb', electronegativity: 2.69, valanceElectrons: 4 });
      const resolution = engine.resolve([atomA, atomB]);

      expect(resolution).not.toBeNull();
      expect(resolution?.bondAnalysis.bondType).toBe('polar-covalent');
      expect(resolution?.bondAnalysis.deltaEN).toBe(1.69);
    });
  });

  describe('ΔEN = 0.4 boundary (Polar vs Nonpolar Covalent classification)', () => {
    it('classifies as polar-covalent when ΔEN > 0.4 (e.g. mock ΔEN = 0.41)', () => {
      const atomA = createMockElement({ symbol: 'Pa', electronegativity: 2.0, valanceElectrons: 6 });
      const atomB = createMockElement({ symbol: 'Pb', electronegativity: 2.41, valanceElectrons: 6 });
      const resolution = engine.resolve([atomA, atomB]);

      expect(resolution).not.toBeNull();
      expect(resolution?.bondAnalysis.bondType).toBe('polar-covalent');
      expect(resolution?.bondAnalysis.deltaEN).toBe(0.41);
    });

    it('classifies as nonpolar-covalent on exact boundary ΔEN = 0.40 (<= 0.4)', () => {
      const atomA = createMockElement({ symbol: 'Na', electronegativity: 2.0, valanceElectrons: 6 });
      const atomB = createMockElement({ symbol: 'Nb', electronegativity: 2.40, valanceElectrons: 6 });
      const resolution = engine.resolve([atomA, atomB]);

      expect(resolution).not.toBeNull();
      expect(resolution?.bondAnalysis.bondType).toBe('nonpolar-covalent');
      expect(resolution?.bondAnalysis.deltaEN).toBe(0.40);
    });

    it('classifies as nonpolar-covalent when ΔEN < 0.4 (e.g. real CH₄, ΔEN = 0.35)', () => {
      const c = getElement('C');
      const h = getElement('H');
      const resolution = engine.resolve([c, h]);

      expect(resolution).not.toBeNull();
      expect(resolution?.bondAnalysis.bondType).toBe('nonpolar-covalent');
      expect(resolution?.bondAnalysis.deltaEN).toBe(0.35);
    });

    it('classifies as nonpolar-covalent when ΔEN = 0.00 (e.g. real O₂)', () => {
      const o1 = getElement('O');
      const o2 = getElement('O');
      const resolution = engine.resolve([o1, o2]);

      expect(resolution).not.toBeNull();
      expect(resolution?.bondAnalysis.bondType).toBe('nonpolar-covalent');
      expect(resolution?.bondAnalysis.deltaEN).toBe(0.00);
    });
  });
});
