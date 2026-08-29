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

export interface ElementData {
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
