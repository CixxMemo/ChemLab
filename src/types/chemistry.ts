export type ElementCategory =
  | 'alkali'
  | 'alkaline'
  | 'transition'
  | 'post-transition'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble'
  | 'lanthanide'
  | 'actinide';

/**
 * Segregated interface for table cells, filter listings, and search indexers.
 * (ISP - Interface Segregation Principle)
 */
export interface IElementInfo {
  atomicNumber: number;
  symbol: string;
  nameTR: string;
  category: ElementCategory;
  electronegativity: number | null;
  name?: string;
  nameEN?: string;
}

/**
 * Segregated interface for Canvas Bohr orbit and Nucleus rendering.
 * (ISP - Interface Segregation Principle)
 */
export interface IAtomRenderData {
  atomicNumber: number;
  symbol: string;
  category: ElementCategory;
  shells: number[];
  valanceElectrons: number | null;
  electronegativity?: number | null;
}

/**
 * Segregated interface for Octet & Duplet electronic status tracking.
 * (ISP - Interface Segregation Principle)
 */
export interface IOctetStatusData {
  atomicNumber: number;
  symbol: string;
  valanceElectrons: number | null;
}

export interface ElementData extends IElementInfo, IAtomRenderData, IOctetStatusData {
  atomicNumber: number;
  symbol: string;
  nameTR: string;
  name?: string;
  nameEN?: string;
  group: number; // 1-18 (or special group)
  period: number; // 1-7
  category: ElementCategory;
  electronegativity: number | null; // Pauling scale (null for noble gases without standard EN)
  shells: number[]; // e.g. [2, 8, 8, 1] for K, [2, 8, 8, 2] for Ca
  valanceElectrons: number | null; // null for transition metals out of MVP main-group scope
  atomicMass: number;
  electronConfiguration?: string;
  summaryTR?: string;
}

export type BondType = 'ionic' | 'polar-covalent' | 'nonpolar-covalent' | 'inert' | 'no-bond';

export interface StoichiometryItem {
  symbol: string;
  count: number;
}

export interface ReactionStep {
  progressThreshold: number; // 0 to 1
  titleTR: string;
  descriptionTR: string;
  highlightAtom?: string;
}

export interface ReactionScenario {
  id: string;
  nameTR: string;
  formula: string;
  reactantKeys: string[]; // e.g. ["Na", "Cl"], ["H", "O"], ["O", "O"], ["C", "H"], ["He", "Ne"]
  stoichiometry: StoichiometryItem[];
  bondType: BondType;
  deltaEN: number | null;
  descriptionTR: string;
  steps: ReactionStep[];
}

export interface FormulaRatio {
  donorCount: number;
  acceptorCount: number;
  formula: string;
}

export interface BondAnalysis {
  bondType: BondType;
  deltaEN: number | null;
  primaryAtom: ElementData;
  secondaryAtom: ElementData;
  transferredElectrons?: number;
  sharedElectronPairs?: number;
  cationCharge?: number;
  anionCharge?: number;
  formulaRatio?: FormulaRatio;
  isOctetSatisfied: boolean;
  explanationTR: string;
}

export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'completed';
