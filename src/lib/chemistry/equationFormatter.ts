import { ElementData, ReactionScenario, BondAnalysis, BondType } from '../../types/chemistry';

/**
 * Maps ASCII digits following chemical symbols to Unicode subscript characters.
 * Example: "H2O" -> "H₂O", "Al2O3" -> "Al₂O₃", "CH4" -> "CH₄"
 */
export function toSubscript(formula: string): string {
  const subscriptMap: Record<string, string> = {
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉',
  };

  return formula.replace(/([A-Za-z\)])(\d+)/g, (_, prefix, digits) => {
    const sub = digits.split('').map((d: string) => subscriptMap[d] || d).join('');
    return `${prefix}${sub}`;
  });
}

/**
 * Standard Turkish Anion nomenclature for binary compounds.
 */
const ANION_NAMES_TR: Record<string, string> = {
  O: 'Oksit',
  F: 'Florür',
  Cl: 'Klorür',
  Br: 'Bromür',
  I: 'İyodür',
  S: 'Sülfür',
  N: 'Nitrür',
  P: 'Fosfür',
  C: 'Karbür',
  H: 'Hidrür',
  Se: 'Selenür',
  Te: 'Tellürür',
  As: 'Arsenür',
  Si: 'Silisür',
  B: 'Borür'
};

/**
 * Common chemical compound names in Turkish for high-frequency classroom curriculum.
 */
const COMMON_COMPOUND_NAMES_TR: Record<string, string> = {
  NaCl: 'Sodyum Klorür',
  H2O: 'Su (Dihidrojen Monoksit)',
  'H₂O': 'Su (Dihidrojen Monoksit)',
  CH4: 'Metan Gazı',
  'CH₄': 'Metan Gazı',
  NH3: 'Amonyak',
  'NH₃': 'Amonyak',
  CO2: 'Karbondioksit',
  'CO₂': 'Karbondioksit',
  CO: 'Karbonmonoksit',
  O2: 'Oksijen Gazı',
  'O₂': 'Oksijen Gazı',
  N2: 'Azot Gazı',
  'N₂': 'Azot Gazı',
  H2: 'Hidrojen Gazı',
  'H₂': 'Hidrojen Gazı',
  F2: 'Flor Gazı',
  'F₂': 'Flor Gazı',
  Cl2: 'Klor Gazı',
  'Cl₂': 'Klor Gazı',
  Br2: 'Brom Molekülü',
  'Br₂': 'Brom Molekülü',
  I2: 'İyot Molekülü',
  'I₂': 'İyot Molekülü',
  MgO: 'Magnezyum Oksit',
  KF: 'Potasyum Florür',
  CaO: 'Kalsiyum Oksit',
  KCl: 'Potasyum Klorür',
  LiF: 'Lityum Florür',
  LiCl: 'Lityum Klorür',
  MgCl2: 'Magnezyum Klorür',
  'MgCl₂': 'Magnezyum Klorür',
  CaCl2: 'Kalsiyum Klorür',
  'CaCl₂': 'Kalsiyum Klorür',
  BaO: 'Baryum Oksit',
  Na2O: 'Sodyum Oksit',
  'Na₂O': 'Sodyum Oksit',
  K2O: 'Potasyum Oksit',
  'K₂O': 'Potasyum Oksit',
  Al2O3: 'Alüminyum Oksit',
  'Al₂O₃': 'Alüminyum Oksit',
  AlF3: 'Alüminyum Florür',
  'AlF₃': 'Alüminyum Florür',
  AlCl3: 'Alüminyum Klorür',
  'AlCl₃': 'Alüminyum Klorür',
  ZnO: 'Çinko Oksit',
  AgCl: 'Gümüş Klorür',
  CaF2: 'Kalsiyum Florür',
  'CaF₂': 'Kalsiyum Florür',
  BaCl2: 'Baryum Klorür',
  'BaCl₂': 'Baryum Klorür',
  Na2S: 'Sodyum Sülfür',
  'Na₂S': 'Sodyum Sülfür',
  K2S: 'Potasyum Sülfür',
  'K₂S': 'Potasyum Sülfür',
  CaS: 'Kalsiyum Sülfür',
  MgS: 'Magnezyum Sülfür',
  Li3N: 'Lityum Nitrür',
  'Li₃N': 'Lityum Nitrür',
  Na3N: 'Sodyum Nitrür',
  'Na₃N': 'Sodyum Nitrür',
  Mg3N2: 'Magnezyum Nitrür',
  'Mg₃N₂': 'Magnezyum Nitrür',
  Ca3N2: 'Kalsiyum Nitrür',
  'Ca₃N₂': 'Kalsiyum Nitrür'
};

export interface FormattedReactionDetails {
  equation: string;
  productFormula: string;
  compoundNameTR: string;
  bondTag: string;
  badgeColor: string;
  isInert: boolean;
}

/**
 * Resolves the localized Turkish compound name according to IUPAC and MEB standards.
 */
export function resolveCompoundNameTR(
  formula: string,
  reactants: ElementData[],
  donor?: ElementData,
  acceptor?: ElementData
): string {
  // 1. Direct dictionary match
  if (COMMON_COMPOUND_NAMES_TR[formula]) {
    return COMMON_COMPOUND_NAMES_TR[formula];
  }

  // Normalize formula from subscript to check ascii
  const asciiFormula = formula
    .replace(/₀/g, '0')
    .replace(/₁/g, '1')
    .replace(/₂/g, '2')
    .replace(/₃/g, '3')
    .replace(/₄/g, '4')
    .replace(/₅/g, '5')
    .replace(/₆/g, '6')
    .replace(/₇/g, '7')
    .replace(/₈/g, '8')
    .replace(/₉/g, '9');

  if (COMMON_COMPOUND_NAMES_TR[asciiFormula]) {
    return COMMON_COMPOUND_NAMES_TR[asciiFormula];
  }

  // 2. Diatomic (same element molecule)
  if (reactants.length >= 2 && reactants[0].symbol === reactants[1].symbol) {
    const el = reactants[0];
    return `${el.nameTR} Gazı (${el.nameTR} Molekülü)`;
  }

  // 3. Binary nomenclature: Metal/Donor + Anion
  if (donor && acceptor) {
    const anionName = ANION_NAMES_TR[acceptor.symbol];
    if (anionName) {
      return `${donor.nameTR} ${anionName}`;
    }
    return `${donor.nameTR} ${acceptor.nameTR} Bileşiği`;
  }

  if (reactants.length >= 2) {
    const elA = reactants[0];
    const elB = reactants[1];
    const enA = elA.electronegativity ?? 0;
    const enB = elB.electronegativity ?? 0;
    const d = enA <= enB ? elA : elB;
    const a = enA <= enB ? elB : elA;
    const anionName = ANION_NAMES_TR[a.symbol];
    if (anionName) {
      return `${d.nameTR} ${anionName}`;
    }
    return `${d.nameTR} ${a.nameTR} Bileşiği`;
  }

  return formula;
}

/**
 * Pure chemistry presenter helper to derive reaction equation, product, and metadata.
 */
export function formatReactionDetails(
  activeScenario: ReactionScenario | null,
  bondAnalysis: BondAnalysis | null,
  selectedElements: ElementData[]
): FormattedReactionDetails | null {
  // If no scenario and fewer than 2 elements are selected, hide cleanly
  if (!activeScenario && selectedElements.length < 2) {
    return null;
  }

  const effectiveBondType: BondType =
    bondAnalysis?.bondType || activeScenario?.bondType || 'no-bond';

  const isInert =
    effectiveBondType === 'inert' ||
    effectiveBondType === 'no-bond';

  // 1. Inert / No reaction state
  if (isInert) {
    const symA = selectedElements[0]?.symbol || activeScenario?.reactantKeys[0] || '?';
    const symB = selectedElements[1]?.symbol || activeScenario?.reactantKeys[1] || '?';
    return {
      equation: `${symA} + ${symB} → ⊘`,
      productFormula: '',
      compoundNameTR: 'Tepkime Gerçekleşmez',
      bondTag: 'Tepkime Gerçekleşmez',
      badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-500/30',
      isInert: true
    };
  }

  // 2. Identify donor and acceptor for accurate nomenclature & equation
  let donor: ElementData | undefined;
  let acceptor: ElementData | undefined;

  if (selectedElements.length >= 2) {
    const elA = selectedElements[0];
    const elB = selectedElements[1];
    const enA = elA.electronegativity ?? 0;
    const enB = elB.electronegativity ?? 0;
    donor = enA <= enB ? elA : elB;
    acceptor = enA <= enB ? elB : elA;
  }

  // Determine raw product formula
  let rawFormula = '';
  if (activeScenario?.formula) {
    rawFormula = activeScenario.formula;
  } else if (bondAnalysis?.formulaRatio?.formula) {
    rawFormula = bondAnalysis.formulaRatio.formula;
  } else if (selectedElements.length >= 2) {
    if (selectedElements[0].symbol === selectedElements[1].symbol) {
      rawFormula = `${selectedElements[0].symbol}2`;
    } else if (donor && acceptor) {
      rawFormula = `${donor.symbol}${acceptor.symbol}`;
    } else {
      rawFormula = `${selectedElements[0].symbol}${selectedElements[1].symbol}`;
    }
  }

  const productFormula = toSubscript(rawFormula);
  const compoundNameTR = resolveCompoundNameTR(
    productFormula,
    selectedElements,
    donor,
    acceptor
  );

  // Determine Bond Tag and Muted Palette color
  let bondTag = 'Kimyasal Bağ';
  let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';

  if (effectiveBondType === 'ionic') {
    bondTag = 'İyonik Bileşik';
    badgeColor = 'bg-sky-950/80 text-sky-300 border-sky-500/30';
  } else if (effectiveBondType === 'polar-covalent') {
    bondTag = 'Polar Kovalent Molekül';
    badgeColor = 'bg-amber-950/80 text-amber-300 border-amber-500/30';
  } else if (effectiveBondType === 'nonpolar-covalent') {
    bondTag = 'Apolar Kovalent Molekül';
    badgeColor = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30';
  }

  // Format the balanced reaction equation
  let equation = '';

  // Curated display notation is data, not a scenario-identity chemistry branch.
  if (activeScenario?.displayEquationTR) {
    equation = activeScenario.displayEquationTR;
  } else if (
    selectedElements.length >= 2 &&
    selectedElements[0].symbol === selectedElements[1].symbol
  ) {
    // Diatomic e.g. N + N -> N₂
    const sym = selectedElements[0].symbol;
    equation = `${sym} + ${sym} → ${sym}₂`;
  } else if (bondAnalysis?.formulaRatio && donor && acceptor) {
    // Dynamic ionic ratio e.g. Mg + O -> MgO, 2 Na + O -> Na₂O, Ca + 2 F -> CaF₂
    const { donorCount, acceptorCount } = bondAnalysis.formulaRatio;
    const dStr = donorCount > 1 ? `${donorCount} ` : '';
    const aStr = acceptorCount > 1 ? `${acceptorCount} ` : '';
    equation = `${dStr}${donor.symbol} + ${aStr}${acceptor.symbol} → ${productFormula}`;
  } else if (activeScenario?.stoichiometry && activeScenario.stoichiometry.length === 2) {
    const s1 = activeScenario.stoichiometry[0];
    const s2 = activeScenario.stoichiometry[1];
    const r1 = s1.count > 1 ? `${s1.count} ${s1.symbol}` : s1.symbol;
    const r2 = s2.count > 1 ? `${s2.count} ${s2.symbol}` : s2.symbol;
    equation = `${r1} + ${r2} → ${productFormula}`;
  } else if (selectedElements.length >= 2) {
    // General pair e.g. N + Ir -> NIr
    const symA = selectedElements[0].symbol;
    const symB = selectedElements[1].symbol;
    equation = `${symA} + ${symB} → ${productFormula}`;
  } else {
    equation = productFormula;
  }

  return {
    equation,
    productFormula,
    compoundNameTR,
    bondTag,
    badgeColor,
    isInert: false
  };
}
