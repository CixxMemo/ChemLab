import { ElementData, BondType, BondAnalysis, FormulaRatio } from '../../types/chemistry';

/**
 * Calculates greatest common divisor for formula reduction.
 */
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Calculates stoichiometric ratio for ionic bond balancing (Section 7).
 * Metal loses valence e- (charge = +q1)
 * Nonmetal gains (8 - valence e-) (charge = -q2)
 */
function calculateIonicRatio(donor: ElementData, acceptor: ElementData): FormulaRatio {
  const q1 = donor.valanceElectrons ?? 1;
  const q2 = acceptor.valanceElectrons ? (8 - acceptor.valanceElectrons) : 1;

  const divisor = gcd(q1, q2);
  const donorCount = q2 / divisor;
  const acceptorCount = q1 / divisor;

  const dSub = donorCount > 1 ? donorCount.toString() : '';
  const aSub = acceptorCount > 1 ? acceptorCount.toString() : '';
  const formula = `${donor.symbol}${dSub}${acceptor.symbol}${aSub}`;

  return {
    donorCount,
    acceptorCount,
    formula
  };
}

/**
 * Pure chemistry bond resolver based strictly on Pauling Electronegativity Difference (ΔEN)
 * and Octet/Duet electronic principles.
 * 
 * Rules reference: .agents/chemistry-rules.md
 */
export function resolveBond(elemA: ElementData, elemB: ElementData): BondAnalysis {
  // Rule 1: If either atom's electronegativity is null -> return "no-bond" immediately.
  // (Section 5, Step 1: Check before anything else — you cannot subtract from null.)
  if (
    elemA.electronegativity === null ||
    elemB.electronegativity === null ||
    elemA.category === 'noble' ||
    elemB.category === 'noble' ||
    elemA.group === 18 ||
    elemB.group === 18
  ) {
    const inertAtom = elemA.electronegativity === null || elemA.category === 'noble' ? elemA : elemB;
    return {
      bondType: 'no-bond',
      deltaEN: null,
      primaryAtom: elemA,
      secondaryAtom: elemB,
      isOctetSatisfied: true,
      explanationTR: `${inertAtom.nameTR} zaten kararlı bir elektron dizilimine sahip; tepkimeye girmez (bağ oluşmaz).`
    };
  }

  // Rule 2: ΔEN = |EN_A - EN_B|
  const deltaEN = Number(Math.abs(elemA.electronegativity - elemB.electronegativity).toFixed(2));

  // Determine donor (lower EN / metal) and acceptor (higher EN / nonmetal)
  const isAElectroNegative = elemA.electronegativity >= elemB.electronegativity;
  const acceptor = isAElectroNegative ? elemA : elemB;
  const donor = isAElectroNegative ? elemB : elemA;

  let bondType: BondType;
  let explanationTR = '';
  let transferredElectrons: number | undefined = undefined;
  let sharedElectronPairs: number | undefined = undefined;
  let cationCharge: number | undefined = undefined;
  let anionCharge: number | undefined = undefined;
  let formulaRatio: FormulaRatio | undefined = undefined;

  // Rule 3, 4, 5: Classification thresholds (Section 5)
  if (deltaEN > 1.7) {
    // 5. ΔEN > 1.7 -> ionic
    bondType = 'ionic';
    const dVal = donor.valanceElectrons ?? 1;
    const aVal = acceptor.valanceElectrons ?? 7;
    transferredElectrons = Math.min(dVal, 8 - aVal);
    cationCharge = dVal <= 3 ? dVal : 1;
    anionCharge = (8 - aVal) <= 3 ? (8 - aVal) : 1;
    formulaRatio = calculateIonicRatio(donor, acceptor);

    explanationTR = `Elektronegatiflik farkı (ΔEN = ${deltaEN.toFixed(2)} > 1.7) yüksek olduğundan ${donor.symbol} atomu ${transferredElectrons} elektronunu ${acceptor.symbol} atomuna aktarır. Oluşan ${donor.symbol}⁺${cationCharge > 1 ? cationCharge : ''} ve ${acceptor.symbol}⁻${anionCharge > 1 ? anionCharge : ''} iyonları arasında iyonik bağ (${formulaRatio.formula}) kurulur.`;
  } else if (deltaEN > 0.4) {
    // 4. 0.4 < ΔEN ≤ 1.7 -> polar-covalent
    bondType = 'polar-covalent';
    const aVal = elemA.valanceElectrons ?? 4;
    const bVal = elemB.valanceElectrons ?? 4;
    sharedElectronPairs = Math.min(aVal, bVal, 2);

    explanationTR = `Elektronegatiflik farkı (0.4 < ΔEN = ${deltaEN.toFixed(2)} ≤ 1.7) orta düzeyde olduğundan elektronlar ortaklaşa kullanılır, ancak daha elektronegatif olan ${acceptor.symbol} atomuna daha yakın çekilir (Polar Kovalent Bağ).`;
  } else {
    // 3. ΔEN ≤ 0.4 -> nonpolar-covalent (including CH4 with ΔEN = 0.35 and O2 with ΔEN = 0)
    bondType = 'nonpolar-covalent';
    const aVal = elemA.valanceElectrons ?? 4;
    const bVal = elemB.valanceElectrons ?? 4;
    sharedElectronPairs = Math.min(aVal, bVal, 2);

    explanationTR = `Elektronegatiflik farkı (ΔEN = ${deltaEN.toFixed(2)} ≤ 0.4) çok düşük veya sıfır olduğundan elektron çiftleri her iki atom tarafından eşit paylaşılır (Apolar Kovalent Bağ).`;
  }

  // Section 11 boundary note:
  // Note: Bond polarity ≠ molecule polarity. A molecule can have polar bonds but be nonpolar overall due to symmetric 3D geometry (CO2, BF3). For the 5 MVP scenarios, this 2D simplification holds.

  return {
    bondType,
    deltaEN,
    primaryAtom: elemA,
    secondaryAtom: elemB,
    transferredElectrons,
    sharedElectronPairs,
    cationCharge,
    anionCharge,
    formulaRatio,
    isOctetSatisfied: true,
    explanationTR
  };
}
