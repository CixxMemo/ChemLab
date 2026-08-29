import { ElementData } from '../../types/chemistry';

/**
 * Checks if an element fulfills the octet (8 e-) or duplet (2 e- for H, He) stability rule.
 */
export function checkOctetSatisfaction(element: ElementData, currentOuterElectrons: number): {
  isSatisfied: boolean;
  targetCount: number;
  remainingNeeded: number;
  ruleName: 'Dublet' | 'Oktet';
} {
  const isDuplet = element.atomicNumber <= 2;
  const targetCount = isDuplet ? 2 : 8;
  const isSatisfied = currentOuterElectrons === targetCount;
  const remainingNeeded = Math.max(0, targetCount - currentOuterElectrons);

  return {
    isSatisfied,
    targetCount,
    remainingNeeded,
    ruleName: isDuplet ? 'Dublet' : 'Oktet'
  };
}
