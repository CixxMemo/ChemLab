import { IReactionStrategy, ReactionContext, ReactionResolution } from './IReactionStrategy';
import { ElementData, FormulaRatio, ReactionScenario } from '../../../types/chemistry';
import rawReactions from '../../../data/reactions.json';

const reactions = rawReactions as ReactionScenario[];

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function calculateIonicRatio(donor: ElementData, acceptor: ElementData): FormulaRatio {
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

export class IonicReactionStrategy implements IReactionStrategy {
  public readonly id = 'ionic';
  public readonly name = 'İyonik Bağ Reaksiyonu';

  public static calculateIonicRatio(donor: ElementData, acceptor: ElementData): FormulaRatio {
    return calculateIonicRatio(donor, acceptor);
  }

  public supports(context: ReactionContext): boolean {
    const { deltaEN, isNobleInvolved } = context;
    return !isNobleInvolved && deltaEN !== null && deltaEN > 1.7;
  }

  public resolve(context: ReactionContext): ReactionResolution {
    const { primaryAtom, secondaryAtom, deltaEN, donor, acceptor } = context;
    const safeDeltaEN = deltaEN ?? 2.0;

    const dVal = donor.valanceElectrons ?? 1;
    const aVal = acceptor.valanceElectrons ?? 7;
    const transferredElectrons = Math.min(dVal, 8 - aVal);
    const cationCharge = dVal <= 3 ? dVal : 1;
    const anionCharge = (8 - aVal) <= 3 ? (8 - aVal) : 1;
    const formulaRatio = calculateIonicRatio(donor, acceptor);

    const explanationTR = `Elektronegatiflik farkı (ΔEN = ${safeDeltaEN.toFixed(2)} > 1.7) yüksek olduğundan ${donor.symbol} atomu ${transferredElectrons} elektronunu ${acceptor.symbol} atomuna aktarır. Oluşan ${donor.symbol}⁺${cationCharge > 1 ? cationCharge : ''} ve ${acceptor.symbol}⁻${anionCharge > 1 ? anionCharge : ''} iyonları arasında iyonik bağ (${formulaRatio.formula}) kurulur.`;

    // Check for predefined scenario or dynamically synthesize one
    const symbols = [primaryAtom.symbol, secondaryAtom.symbol];
    const existingScenario = reactions.find(
      r => r.bondType === 'ionic' &&
           r.reactantKeys.every(k => symbols.includes(k)) &&
           symbols.every(s => r.reactantKeys.includes(s))
    );

    const scenario: ReactionScenario = existingScenario || {
      id: `ionic_${formulaRatio.formula.toLowerCase()}`,
      nameTR: `${donor.nameTR} ${acceptor.nameTR} İyonik Bileşiği`,
      formula: formulaRatio.formula,
      reactantKeys: [donor.symbol, acceptor.symbol],
      stoichiometry: [
        { symbol: donor.symbol, count: formulaRatio.donorCount },
        { symbol: acceptor.symbol, count: formulaRatio.acceptorCount }
      ],
      bondType: 'ionic',
      deltaEN: safeDeltaEN,
      descriptionTR: explanationTR,
      steps: [
        {
          progressThreshold: 0.0,
          titleTR: 'Başlangıç Durumu',
          descriptionTR: `${donor.nameTR} (${donor.symbol}) ve ${acceptor.nameTR} (${acceptor.symbol}) atomları yaklaşıyor.`,
          highlightAtom: donor.symbol
        },
        {
          progressThreshold: 0.35,
          titleTR: `Elektron Transferi (ΔEN = ${safeDeltaEN.toFixed(2)})`,
          descriptionTR: `ΔEN > 1.7 olduğundan ${donor.symbol} atomundan ${acceptor.symbol} atomuna ${transferredElectrons} valans elektronu aktarılır.`,
          highlightAtom: acceptor.symbol
        },
        {
          progressThreshold: 0.75,
          titleTR: 'İyon Oluşumu ve Kararlı Oktet',
          descriptionTR: `${donor.symbol}⁺${cationCharge > 1 ? cationCharge : ''} katyonu ve ${acceptor.symbol}⁻${anionCharge > 1 ? anionCharge : ''} anyonu elektrostatik çekimle bağlanır.`,
          highlightAtom: donor.symbol
        },
        {
          progressThreshold: 1.0,
          titleTR: 'İyonik Bağ Tamamlandı',
          descriptionTR: `Kristal elektrostatik iyonik bağ (${formulaRatio.formula}) kuruldu.`
        }
      ]
    };

    return {
      scenario,
      bondAnalysis: {
        bondType: 'ionic',
        deltaEN: safeDeltaEN,
        primaryAtom,
        secondaryAtom,
        transferredElectrons,
        cationCharge,
        anionCharge,
        formulaRatio,
        isOctetSatisfied: true,
        explanationTR
      },
      physics: {
        repulsion: false,
        repulsionStrength: 0,
        overlapDistance: 180,
        isReactionOccurred: true
      }
    };
  }
}
