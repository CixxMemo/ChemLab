import { IReactionStrategy, ReactionContext, ReactionResolution } from './IReactionStrategy';
import { BondType, ReactionScenario } from '../../../types/chemistry';
import { checkOctetSatisfaction } from '../octetChecker';
import rawReactions from '../../../data/reactions.json';

const reactions = rawReactions as ReactionScenario[];

export class CovalentReactionStrategy implements IReactionStrategy {
  public readonly id = 'covalent';
  public readonly name = 'Kovalent Bağ Reaksiyonu';

  public supports(context: ReactionContext): boolean {
    const { deltaEN, isNobleInvolved } = context;
    return !isNobleInvolved && deltaEN !== null && deltaEN <= 1.7;
  }

  public resolve(context: ReactionContext): ReactionResolution {
    const { primaryAtom, secondaryAtom, deltaEN, acceptor } = context;
    const safeDeltaEN = deltaEN ?? 0;

    const isPolar = safeDeltaEN > 0.4;
    const bondType: BondType = isPolar ? 'polar-covalent' : 'nonpolar-covalent';

    const aVal = primaryAtom.valanceElectrons ?? 4;
    const bVal = secondaryAtom.valanceElectrons ?? 4;
    const isSameElement = primaryAtom.symbol === secondaryAtom.symbol;

    const octetA = checkOctetSatisfaction(primaryAtom, aVal);
    const octetB = checkOctetSatisfaction(secondaryAtom, bVal);

    // Generic octet completion derivation:
    // For same-element diatomic bonds, octetA.remainingNeeded === octetB.remainingNeeded (H:1, O:2, N:3, Cl/F/Br:1)
    // For heteronuclear pairs, shared pairs are derived from the minimum electrons needed by either partner
    const sharedElectronPairs = isSameElement
      ? octetA.remainingNeeded
      : Math.min(octetA.remainingNeeded, octetB.remainingNeeded);

    let explanationTR: string;
    if (isPolar) {
      explanationTR = `Elektronegatiflik farkı (0.4 < ΔEN = ${safeDeltaEN.toFixed(2)} ≤ 1.7) orta düzeyde olduğundan elektronlar ortaklaşa kullanılır, ancak daha elektronegatif olan ${acceptor.symbol} atomuna daha yakın çekilir (Polar Kovalent Bağ).`;
    } else {
      explanationTR = `Elektronegatiflik farkı (ΔEN = ${safeDeltaEN.toFixed(2)} ≤ 0.4) çok düşük veya sıfır olduğundan elektron çiftleri her iki atom tarafından eşit paylaşılır (Apolar Kovalent Bağ).`;
    }

    // Check for predefined scenario matches (e.g. H2O, CH4, O2)
    const uniqueSymbols = Array.from(new Set([primaryAtom.symbol, secondaryAtom.symbol]));
    let matchedScenario: ReactionScenario | undefined;

    if (uniqueSymbols.length === 1 && isSameElement) {
      // Diatomic pairing (e.g. O + O -> O2)
      matchedScenario = reactions.find(r => r.id === `${primaryAtom.symbol.toLowerCase()}2`) ||
                        reactions.find(r => r.reactantKeys.every(k => k === primaryAtom.symbol));
    } else {
      matchedScenario = reactions.find(r =>
        r.reactantKeys.length >= 2 &&
        uniqueSymbols.every(sym => r.reactantKeys.includes(sym)) &&
        r.reactantKeys.every(k => uniqueSymbols.includes(k))
      );
    }

    const scenario: ReactionScenario = matchedScenario || {
      id: `covalent_${primaryAtom.symbol.toLowerCase()}_${secondaryAtom.symbol.toLowerCase()}`,
      nameTR: `${primaryAtom.nameTR} - ${secondaryAtom.nameTR} Kovalent Molekülü`,
      formula: isSameElement ? `${primaryAtom.symbol}₂` : `${primaryAtom.symbol}${secondaryAtom.symbol}`,
      reactantKeys: [primaryAtom.symbol, secondaryAtom.symbol],
      stoichiometry: isSameElement
        ? [{ symbol: primaryAtom.symbol, count: 2 }]
        : [
            { symbol: primaryAtom.symbol, count: 1 },
            { symbol: secondaryAtom.symbol, count: 1 }
          ],
      bondType,
      deltaEN: safeDeltaEN,
      descriptionTR: explanationTR,
      steps: [
        {
          progressThreshold: 0.0,
          titleTR: 'Başlangıç Durumu',
          descriptionTR: `${primaryAtom.nameTR} ve ${secondaryAtom.nameTR} atomları kovalent paylaşım alanına yaklaşıyor.`,
          highlightAtom: primaryAtom.symbol
        },
        {
          progressThreshold: 0.4,
          titleTR: `Katman Kesişimi (${isPolar ? '0.4 < ΔEN ≤ 1.7' : 'ΔEN ≤ 0.4'})`,
          descriptionTR: 'Atomların değerlik enerji katmanları kesişerek ortaklaşa elektron bulutu oluşturur.',
          highlightAtom: secondaryAtom.symbol
        },
        {
          progressThreshold: 0.75,
          titleTR: isPolar ? 'Kutup ve Kısmi Yük Ayrımı' : 'Simetrik Elektron Dağılımı',
          descriptionTR: isPolar
            ? `Elektronlar daha elektronegatif ${acceptor.symbol} atomuna doğru kayar.`
            : 'Elektron çiftleri her iki atom çekirdeği arasında simetrik olarak paylaşılır.',
          highlightAtom: acceptor.symbol
        },
        {
          progressThreshold: 1.0,
          titleTR: 'Kovalent Bağ Tamamlandı',
          descriptionTR: `${sharedElectronPairs} çift elektron paylaşılarak kararlı moleküler bağ kuruldu.`
        }
      ]
    };

    return {
      scenario,
      bondAnalysis: {
        bondType,
        deltaEN: safeDeltaEN,
        primaryAtom,
        secondaryAtom,
        sharedElectronPairs,
        isOctetSatisfied: true,
        explanationTR
      },
      physics: {
        repulsion: false,
        repulsionStrength: 0,
        overlapDistance: 80,
        isReactionOccurred: true
      }
    };
  }
}
