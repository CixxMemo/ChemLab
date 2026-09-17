import { describe, expect, it } from 'vitest';
import rawElements from '../../data/elements.json';
import { ElementData } from '../../types/chemistry';
import { getSingleElementGuide } from './singleElementGuide';

const elements = Object.values(rawElements as Record<string, ElementData>);
const element = (symbol: string): ElementData => {
  const result = elements.find(item => item.symbol === symbol);
  if (!result) throw new Error(`Missing test element: ${symbol}`);
  return result;
};

describe('getSingleElementGuide', () => {
  it('uses atomic structure and category for the duplet and noble cases', () => {
    expect(getSingleElementGuide(element('H')).bondingTendency).toContain('dublet');
    expect(getSingleElementGuide(element('He')).bondingTendency).toContain('2 e⁻ Dublet');
    expect(getSingleElementGuide(element('Ne')).bondingTendency).toContain('8 e⁻ Oktet');
  });

  it('uses valence and category for other nonmetals and metals', () => {
    expect(getSingleElementGuide(element('C')).bondingTendency).toContain('4 kovalent bağ');
    expect(getSingleElementGuide(element('O')).bondingTendency).toContain('6 değerlik');
    expect(getSingleElementGuide(element('Na')).bondingTendency).toContain('Na⁺');
    expect(getSingleElementGuide(element('F')).bondingTendency).toContain('F⁻');
  });
});
