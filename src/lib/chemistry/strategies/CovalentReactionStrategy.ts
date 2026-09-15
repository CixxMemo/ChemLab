import { IReactionStrategy, ReactionContext, ReactionResolution } from './IReactionStrategy';
import {
  BondType,
  ElementData,
  OctetStatus,
  ReactionScenario,
  ReactionStep
} from '../../../types/chemistry';
import {
  createOctetStatus,
  isMetalNonMetalPair,
  isNonMetalPair
} from '../reactionDomain';
import { checkOctetSatisfaction } from '../octetChecker';
import rawReactions from '../../../data/reactions.json';

const reactions = rawReactions as ReactionScenario[];
const POLAR_COVALENT_THRESHOLD = 0.4;
const IONIC_THRESHOLD = 1.7;

function hasResolvableElectronegativity(context: ReactionContext): boolean {
  return !context.isNobleInvolved
    && context.deltaEN !== null
    && context.primaryAtom.electronegativity !== null
    && context.secondaryAtom.electronegativity !== null;
}

function resolveCovalentBondType(deltaEN: number): BondType {
  return deltaEN > POLAR_COVALENT_THRESHOLD ? 'polar-covalent' : 'nonpolar-covalent';
}

function calculateSharedElectronPairs(primaryAtom: ElementData, secondaryAtom: ElementData): number {
  if (primaryAtom.valanceElectrons === null || secondaryAtom.valanceElectrons === null) return 0;

  const primaryNeed = checkOctetSatisfaction(primaryAtom, primaryAtom.valanceElectrons).remainingNeeded;
  const secondaryNeed = checkOctetSatisfaction(secondaryAtom, secondaryAtom.valanceElectrons).remainingNeeded;
  return primaryAtom.symbol === secondaryAtom.symbol ? primaryNeed : Math.min(primaryNeed, secondaryNeed);
}

function findPredefinedScenario(
  primaryAtom: ElementData,
  secondaryAtom: ElementData
): ReactionScenario | undefined {
  if (primaryAtom.symbol === secondaryAtom.symbol) {
    return reactions.find(reaction => reaction.id === `${primaryAtom.symbol.toLowerCase()}2`);
  }

  const symbols = new Set([primaryAtom.symbol, secondaryAtom.symbol]);
  return reactions.find(reaction => reaction.reactantKeys.length >= 2
    && reaction.reactantKeys.every(symbol => symbols.has(symbol))
    && symbols.size === new Set(reaction.reactantKeys).size);
}

function createCovalentExplanation(
  context: ReactionContext,
  bondType: BondType,
  deltaEN: number
): string {
  const sharesByCategory = isNonMetalPair(context.primaryAtom.category, context.secondaryAtom.category);
  const sharingReason = sharesByCategory
    ? 'Her iki atom ametal olduğundan elektronlar aktarılmak yerine ortaklaşa kullanılır.'
    : 'Elektronlar kovalent bağda ortaklaşa kullanılır.';
  const polarityReason = bondType === 'polar-covalent'
    ? `ΔEN = ${deltaEN.toFixed(2)}, 0.4 değerinden büyük olduğu için elektronlar ${context.acceptor.symbol} atomuna daha yakın çekilir (Polar Kovalent Bağ).`
    : `ΔEN = ${deltaEN.toFixed(2)}, 0.4 veya altında olduğu için elektron çiftleri eşit paylaşılır (Apolar Kovalent Bağ).`;
  return `${sharingReason} ${polarityReason}`;
}

function createReactionStep(
  progressThreshold: number,
  titleTR: string,
  descriptionTR: string,
  highlightAtom?: string
): ReactionStep {
  return { progressThreshold, titleTR, descriptionTR, highlightAtom };
}

function createCovalentSteps(
  context: ReactionContext,
  bondType: BondType,
  sharedElectronPairs: number
): ReactionStep[] {
  const isPolar = bondType === 'polar-covalent';
  const sharingLabel = isPolar ? 'ΔEN > 0.4' : 'ΔEN ≤ 0.4';
  const distributionTitle = isPolar ? 'Kutup ve Kısmi Yük Ayrımı' : 'Simetrik Elektron Dağılımı';
  const distributionText = isPolar
    ? `Elektronlar daha elektronegatif ${context.acceptor.symbol} atomuna doğru kayar.`
    : 'Elektron çiftleri her iki atom çekirdeği arasında simetrik olarak paylaşılır.';

  return [
    createReactionStep(0, 'Başlangıç Durumu', `${context.primaryAtom.nameTR} ve ${context.secondaryAtom.nameTR} atomları kovalent paylaşım alanına yaklaşıyor.`, context.primaryAtom.symbol),
    createReactionStep(0.4, `Katman Kesişimi (${sharingLabel})`, 'Atomların değerlik enerji katmanları kesişerek ortaklaşa elektron bulutu oluşturur.', context.secondaryAtom.symbol),
    createReactionStep(0.75, distributionTitle, distributionText, context.acceptor.symbol),
    createReactionStep(1, 'Kovalent Bağ Tamamlandı', `${sharedElectronPairs} çift elektron paylaşılarak moleküler bağ kuruldu.`)
  ];
}

function createCovalentStoichiometry(
  primaryAtom: ElementData,
  secondaryAtom: ElementData
): ReactionScenario['stoichiometry'] {
  if (primaryAtom.symbol === secondaryAtom.symbol) return [{ symbol: primaryAtom.symbol, count: 2 }];
  return [{ symbol: primaryAtom.symbol, count: 1 }, { symbol: secondaryAtom.symbol, count: 1 }];
}

function createFallbackScenario(
  context: ReactionContext,
  bondType: BondType,
  deltaEN: number,
  sharedElectronPairs: number,
  explanationTR: string
): ReactionScenario {
  const { primaryAtom, secondaryAtom } = context;
  const isSameElement = primaryAtom.symbol === secondaryAtom.symbol;
  return {
    id: `covalent_${primaryAtom.symbol.toLowerCase()}_${secondaryAtom.symbol.toLowerCase()}`,
    nameTR: `${primaryAtom.nameTR} - ${secondaryAtom.nameTR} Kovalent Molekülü`,
    formula: isSameElement ? `${primaryAtom.symbol}₂` : `${primaryAtom.symbol}${secondaryAtom.symbol}`,
    reactantKeys: [primaryAtom.symbol, secondaryAtom.symbol],
    stoichiometry: createCovalentStoichiometry(primaryAtom, secondaryAtom),
    bondType,
    deltaEN,
    descriptionTR: explanationTR,
    steps: createCovalentSteps(context, bondType, sharedElectronPairs)
  };
}

function getReactantCount(scenario: ReactionScenario, symbol: string): number {
  return scenario.stoichiometry.find(item => item.symbol === symbol)?.count ?? 1;
}

function calculateCovalentOuterElectronCount(
  element: ElementData,
  counterpart: ElementData,
  sharedElectronPairs: number,
  scenario: ReactionScenario
): number | null {
  if (element.valanceElectrons === null) return null;
  const partnerCount = element.symbol === counterpart.symbol ? 1 : getReactantCount(scenario, counterpart.symbol);
  return element.valanceElectrons + sharedElectronPairs * partnerCount;
}

function resolveCovalentOctetStatuses(
  primaryAtom: ElementData,
  secondaryAtom: ElementData,
  sharedElectronPairs: number,
  scenario: ReactionScenario
): readonly [OctetStatus, OctetStatus] {
  return [
    createOctetStatus(primaryAtom, calculateCovalentOuterElectronCount(primaryAtom, secondaryAtom, sharedElectronPairs, scenario)),
    createOctetStatus(secondaryAtom, calculateCovalentOuterElectronCount(secondaryAtom, primaryAtom, sharedElectronPairs, scenario))
  ] as const;
}

export class CovalentReactionStrategy implements IReactionStrategy {
  public readonly id = 'covalent';
  public readonly name = 'Kovalent Bağ Reaksiyonu';

  public supports(context: ReactionContext): boolean {
    const deltaEN = context.deltaEN;
    if (!hasResolvableElectronegativity(context) || deltaEN === null) return false;

    const isNonMetalReactantPair = isNonMetalPair(context.primaryAtom.category, context.secondaryAtom.category);
    const isIonicReactantPair = isMetalNonMetalPair(context.primaryAtom.category, context.secondaryAtom.category);
    return isNonMetalReactantPair || (!isIonicReactantPair && deltaEN <= IONIC_THRESHOLD);
  }

  public resolve(context: ReactionContext): ReactionResolution {
    const deltaEN = context.deltaEN ?? 0;
    const bondType = resolveCovalentBondType(deltaEN);
    const sharedElectronPairs = calculateSharedElectronPairs(context.primaryAtom, context.secondaryAtom);
    const explanationTR = createCovalentExplanation(context, bondType, deltaEN);
    const scenario = findPredefinedScenario(context.primaryAtom, context.secondaryAtom)
      ?? createFallbackScenario(context, bondType, deltaEN, sharedElectronPairs, explanationTR);
    const octetStatuses = resolveCovalentOctetStatuses(context.primaryAtom, context.secondaryAtom, sharedElectronPairs, scenario);

    return {
      scenario,
      bondAnalysis: {
        bondType,
        deltaEN,
        primaryAtom: context.primaryAtom,
        secondaryAtom: context.secondaryAtom,
        sharedElectronPairs,
        octetStatuses,
        explanationTR
      },
      physics: { repulsion: false, repulsionStrength: 0, overlapDistance: 80, isReactionOccurred: true }
    };
  }
}
