import { IReactionStrategy, ReactionContext, ReactionResolution } from './IReactionStrategy';
import {
  ElementData,
  FormulaRatio,
  OctetStatus,
  ReactionScenario,
  ReactionStep
} from '../../../types/chemistry';
import {
  createOctetStatus,
  isMetalNonMetalPair,
  isNonMetalPair
} from '../reactionDomain';
import rawReactions from '../../../data/reactions.json';

const reactions = rawReactions as ReactionScenario[];
const IONIC_THRESHOLD = 1.7;

interface IonicTransfer {
  transferredElectrons: number;
  cationCharge: number;
  anionCharge: number;
}

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function calculateIonicRatio(donor: ElementData, acceptor: ElementData): FormulaRatio {
  const donorCharge = Math.max(1, donor.valanceElectrons ?? 1);
  const acceptorCharge = Math.max(1, 8 - (acceptor.valanceElectrons ?? 7));
  const divisor = gcd(donorCharge, acceptorCharge);
  const donorCount = acceptorCharge / divisor;
  const acceptorCount = donorCharge / divisor;
  const donorSubscript = donorCount > 1 ? donorCount.toString() : '';
  const acceptorSubscript = acceptorCount > 1 ? acceptorCount.toString() : '';

  return {
    donorCount,
    acceptorCount,
    formula: `${donor.symbol}${donorSubscript}${acceptor.symbol}${acceptorSubscript}`
  };
}

function hasResolvableElectronegativity(context: ReactionContext): boolean {
  return !context.isNobleInvolved
    && context.deltaEN !== null
    && context.primaryAtom.electronegativity !== null
    && context.secondaryAtom.electronegativity !== null;
}

function calculateIonicTransfer(donor: ElementData, acceptor: ElementData): IonicTransfer {
  const donorValence = donor.valanceElectrons ?? 1;
  const acceptorValence = acceptor.valanceElectrons ?? 7;
  const transferredElectrons = Math.min(donorValence, Math.max(1, 8 - acceptorValence));
  const cationCharge = donorValence <= 3 ? donorValence : 1;
  const anionCharge = (8 - acceptorValence) <= 3 ? 8 - acceptorValence : 1;

  return { transferredElectrons, cationCharge, anionCharge };
}

function findPredefinedIonicScenario(
  primaryAtom: ElementData,
  secondaryAtom: ElementData
): ReactionScenario | undefined {
  const symbols = new Set([primaryAtom.symbol, secondaryAtom.symbol]);
  return reactions.find(reaction => reaction.bondType === 'ionic'
    && reaction.reactantKeys.length === symbols.size
    && reaction.reactantKeys.every(symbol => symbols.has(symbol)));
}

function createIonicExplanation(
  context: ReactionContext,
  transfer: IonicTransfer,
  formulaRatio: FormulaRatio,
  deltaEN: number
): string {
  const categoryReason = isMetalNonMetalPair(context.primaryAtom.category, context.secondaryAtom.category)
    ? 'Metal ve ametal atomları arasında elektron aktarımı gerçekleşir.'
    : `Elektronegatiflik farkı (ΔEN = ${deltaEN.toFixed(2)}) iyonik eşik değerini aşar.`;
  const donorIon = formatIon(context.donor.symbol, '⁺', transfer.cationCharge);
  const acceptorIon = formatIon(context.acceptor.symbol, '⁻', transfer.anionCharge);
  return `${categoryReason} ${context.donor.symbol} atomu ${transfer.transferredElectrons} elektronunu ${context.acceptor.symbol} atomuna aktarır. ${donorIon} ve ${acceptorIon} iyonları arasında iyonik bağ (${formulaRatio.formula}) kurulur.`;
}

function formatIon(symbol: string, sign: '⁺' | '⁻', charge: number): string {
  return `${symbol}${sign}${charge > 1 ? charge : ''}`;
}

function createIonicStep(
  progressThreshold: number,
  titleTR: string,
  descriptionTR: string,
  highlightAtom?: string
): ReactionStep {
  return { progressThreshold, titleTR, descriptionTR, highlightAtom };
}

function createIonicSteps(
  context: ReactionContext,
  transfer: IonicTransfer,
  formulaRatio: FormulaRatio,
  deltaEN: number
): ReactionStep[] {
  const donorIon = formatIon(context.donor.symbol, '⁺', transfer.cationCharge);
  const acceptorIon = formatIon(context.acceptor.symbol, '⁻', transfer.anionCharge);
  return [
    createIonicStep(0, 'Başlangıç Durumu', `${context.donor.nameTR} (${context.donor.symbol}) ve ${context.acceptor.nameTR} (${context.acceptor.symbol}) atomları yaklaşıyor.`, context.donor.symbol),
    createIonicStep(0.35, `Elektron Transferi (ΔEN = ${deltaEN.toFixed(2)})`, `${context.donor.symbol} atomundan ${context.acceptor.symbol} atomuna ${transfer.transferredElectrons} valans elektronu aktarılır.`, context.acceptor.symbol),
    createIonicStep(0.75, 'İyon Oluşumu ve Kararlı Oktet', `${donorIon} katyonu ve ${acceptorIon} anyonu elektrostatik çekimle bağlanır.`, context.donor.symbol),
    createIonicStep(1, 'İyonik Bağ Tamamlandı', `Kristal elektrostatik iyonik bağ (${formulaRatio.formula}) kuruldu.`)
  ];
}

function createFallbackIonicScenario(
  context: ReactionContext,
  formulaRatio: FormulaRatio,
  explanationTR: string,
  transfer: IonicTransfer,
  deltaEN: number
): ReactionScenario {
  return {
    id: `ionic_${formulaRatio.formula.toLowerCase()}`,
    nameTR: `${context.donor.nameTR} ${context.acceptor.nameTR} İyonik Bileşiği`,
    formula: formulaRatio.formula,
    reactantKeys: [context.donor.symbol, context.acceptor.symbol],
    stoichiometry: [
      { symbol: context.donor.symbol, count: formulaRatio.donorCount },
      { symbol: context.acceptor.symbol, count: formulaRatio.acceptorCount }
    ],
    bondType: 'ionic',
    deltaEN,
    descriptionTR: explanationTR,
    steps: createIonicSteps(context, transfer, formulaRatio, deltaEN)
  };
}

function resolveIonicOuterElectronCount(element: ElementData): number | null {
  if (element.valanceElectrons === null) return null;
  return element.atomicNumber <= 2 ? 2 : 8;
}

function resolveIonicOctetStatuses(
  primaryAtom: ElementData,
  secondaryAtom: ElementData
): readonly [OctetStatus, OctetStatus] {
  return [
    createOctetStatus(primaryAtom, resolveIonicOuterElectronCount(primaryAtom)),
    createOctetStatus(secondaryAtom, resolveIonicOuterElectronCount(secondaryAtom))
  ] as const;
}

export class IonicReactionStrategy implements IReactionStrategy {
  public readonly id = 'ionic';
  public readonly name = 'İyonik Bağ Reaksiyonu';

  public static calculateIonicRatio(donor: ElementData, acceptor: ElementData): FormulaRatio {
    return calculateIonicRatio(donor, acceptor);
  }

  public supports(context: ReactionContext): boolean {
    const deltaEN = context.deltaEN;
    if (!hasResolvableElectronegativity(context) || deltaEN === null) return false;

    const isNonMetalReactantPair = isNonMetalPair(context.primaryAtom.category, context.secondaryAtom.category);
    const isIonicReactantPair = isMetalNonMetalPair(context.primaryAtom.category, context.secondaryAtom.category);
    return isIonicReactantPair || (!isNonMetalReactantPair && deltaEN > IONIC_THRESHOLD);
  }

  public resolve(context: ReactionContext): ReactionResolution {
    const deltaEN = context.deltaEN ?? IONIC_THRESHOLD;
    const transfer = calculateIonicTransfer(context.donor, context.acceptor);
    const formulaRatio = calculateIonicRatio(context.donor, context.acceptor);
    const explanationTR = createIonicExplanation(context, transfer, formulaRatio, deltaEN);
    const scenario = findPredefinedIonicScenario(context.primaryAtom, context.secondaryAtom)
      ?? createFallbackIonicScenario(context, formulaRatio, explanationTR, transfer, deltaEN);
    const octetStatuses = resolveIonicOctetStatuses(context.primaryAtom, context.secondaryAtom);

    return {
      scenario,
      bondAnalysis: {
        bondType: 'ionic',
        deltaEN,
        primaryAtom: context.primaryAtom,
        secondaryAtom: context.secondaryAtom,
        transferredElectrons: transfer.transferredElectrons,
        cationCharge: transfer.cationCharge,
        anionCharge: transfer.anionCharge,
        formulaRatio,
        octetStatuses,
        explanationTR
      },
      physics: { repulsion: false, repulsionStrength: 0, overlapDistance: 180, isReactionOccurred: true }
    };
  }
}
