import {
  ElementCategory,
  ElectronStabilityRule,
  ElectronTargetCount,
  IOctetStatusData,
  OctetStatus
} from '../../types/chemistry';

const METAL_CATEGORIES: ReadonlySet<ElementCategory> = new Set([
  'alkali',
  'alkaline',
  'transition',
  'post-transition',
  'lanthanide',
  'actinide'
]);

const NON_METAL_CATEGORIES: ReadonlySet<ElementCategory> = new Set([
  'nonmetal',
  'halogen'
]);

export function isMetalCategory(category: ElementCategory): boolean {
  return METAL_CATEGORIES.has(category);
}

export function isNonMetalCategory(category: ElementCategory): boolean {
  return NON_METAL_CATEGORIES.has(category);
}

export function isNonMetalPair(
  primaryCategory: ElementCategory,
  secondaryCategory: ElementCategory
): boolean {
  return isNonMetalCategory(primaryCategory) && isNonMetalCategory(secondaryCategory);
}

export function isMetalNonMetalPair(
  primaryCategory: ElementCategory,
  secondaryCategory: ElementCategory
): boolean {
  return (isMetalCategory(primaryCategory) && isNonMetalCategory(secondaryCategory))
    || (isNonMetalCategory(primaryCategory) && isMetalCategory(secondaryCategory));
}

export function createOctetStatus(
  element: IOctetStatusData,
  outerElectronCount: number | null
): OctetStatus {
  const targetElectronCount: ElectronTargetCount = element.atomicNumber <= 2 ? 2 : 8;
  const ruleName: ElectronStabilityRule = targetElectronCount === 2 ? 'Dublet' : 'Oktet';

  return Object.freeze({
    atomicNumber: element.atomicNumber,
    symbol: element.symbol,
    outerElectronCount,
    targetElectronCount,
    isSatisfied: outerElectronCount === targetElectronCount,
    ruleName
  });
}
