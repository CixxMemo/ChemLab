import { describe, expect, it } from 'vitest';
import { formatIonBadge, getGenericBondOffsets } from './animationPhysics';
import { RenderBondAnalysis } from './IRenderEngine';

const analysis = (bondType: RenderBondAnalysis['bondType'], pairs?: number): RenderBondAnalysis => ({
  bondType,
  sharedElectronPairs: pairs
});

describe('formatIonBadge', () => {
  it('renders one- and multi-charge ions from resolved charge data', () => {
    expect(formatIonBadge('Na', 1, '⁺')).toBe('Na⁺');
    expect(formatIonBadge('Mg', 2, '⁺')).toBe('Mg²⁺');
    expect(formatIonBadge('N', 3, '⁻')).toBe('N³⁻');
    expect(formatIonBadge('Cl', undefined, '⁻')).toBe('Cl⁻');
  });
});

describe('getGenericBondOffsets', () => {
  it('uses resolved shared pairs rather than an element symbol', () => {
    expect(getGenericBondOffsets(analysis('nonpolar-covalent', 1))).toEqual([0]);
    expect(getGenericBondOffsets(analysis('polar-covalent', 2))).toEqual([-3, 3]);
    expect(getGenericBondOffsets(analysis('nonpolar-covalent', 3))).toEqual([-6, 0, 6]);
  });

  it('draws no covalent lines for absent, ionic, or inert outcomes', () => {
    expect(getGenericBondOffsets(null)).toEqual([]);
    expect(getGenericBondOffsets(analysis('ionic', 3))).toEqual([]);
    expect(getGenericBondOffsets(analysis('inert'))).toEqual([]);
    expect(getGenericBondOffsets(analysis('no-bond'))).toEqual([]);
  });

  it('caps unsupported visual line counts without changing domain data', () => {
    expect(getGenericBondOffsets(analysis('polar-covalent', 0))).toEqual([0]);
    expect(getGenericBondOffsets(analysis('polar-covalent', 4))).toEqual([-6, 0, 6]);
  });
});
