import { IReactionStrategy, ReactionContext, ReactionResolution } from './IReactionStrategy';
import { ElementData, OctetStatus, ReactionScenario } from '../../../types/chemistry';
import { createOctetStatus } from '../reactionDomain';
import rawReactions from '../../../data/reactions.json';

const reactions = rawReactions as ReactionScenario[];
const defaultInertScenario = reactions.find(reaction => reaction.id === 'inert_gas') || {
  id: 'inert_gas',
  nameTR: 'Soygaz Etkileşimi (Asal Kararlılık)',
  formula: 'Tepkime Yok (no-bond)',
  reactantKeys: ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn'],
  stoichiometry: [],
  bondType: 'no-bond' as const,
  deltaEN: null,
  descriptionTR: 'Soygazlar zaten kararlı bir elektron dizilimine (tam dolu oktet/dublet) sahiptir; tepkimeye girmez ve bağ oluşturmaz.',
  steps: [
    { progressThreshold: 0, titleTR: 'Soygaz Yaklaşımı', descriptionTR: 'Kararlı tam dolu katmana sahip soygaz atomu sisteme dahil ediliyor.' },
    { progressThreshold: 0.5, titleTR: 'Elektronik İtme (Repulsion)', descriptionTR: 'Soygazın dış kabuğundaki dolu elektron çiftleri diğer atomların elektronlarını iter.' },
    { progressThreshold: 1, titleTR: 'Kimyasal Tepkime Engellendi', descriptionTR: 'Soygazlar oktet/dublet kararlılığı nedeniyle bağ oluşturmaz. Sistem kararlı ve asal kalır.' }
  ]
};

function isInertElement(element: ElementData): boolean {
  return element.category === 'noble'
    || element.group === 18
    || element.electronegativity === null;
}

function selectInertElement(primaryAtom: ElementData, secondaryAtom: ElementData): ElementData {
  return isInertElement(primaryAtom) ? primaryAtom : secondaryAtom;
}

function createInertExplanation(primaryAtom: ElementData, secondaryAtom: ElementData): string {
  const inertAtom = selectInertElement(primaryAtom, secondaryAtom);
  const stabilityRule = inertAtom.atomicNumber <= 2 ? 'Dublet' : 'Oktet';
  return `${inertAtom.nameTR} zaten kararlı bir elektron dizilimine (${stabilityRule}) sahip; tepkimeye girmez (bağ oluşmaz).`;
}

function resolveInertOctetStatuses(
  primaryAtom: ElementData,
  secondaryAtom: ElementData
): readonly [OctetStatus, OctetStatus] {
  return [
    createOctetStatus(primaryAtom, primaryAtom.valanceElectrons),
    createOctetStatus(secondaryAtom, secondaryAtom.valanceElectrons)
  ] as const;
}

export class InertReactionStrategy implements IReactionStrategy {
  public readonly id = 'inert';
  public readonly name = 'Asal / Soygaz Etkileşimi';

  public supports(context: ReactionContext): boolean {
    return context.isNobleInvolved
      || isInertElement(context.primaryAtom)
      || isInertElement(context.secondaryAtom)
      || context.deltaEN === null;
  }

  public resolve(context: ReactionContext): ReactionResolution {
    const octetStatuses = resolveInertOctetStatuses(context.primaryAtom, context.secondaryAtom);

    return {
      scenario: defaultInertScenario,
      bondAnalysis: {
        bondType: 'no-bond',
        deltaEN: null,
        primaryAtom: context.primaryAtom,
        secondaryAtom: context.secondaryAtom,
        octetStatuses,
        explanationTR: createInertExplanation(context.primaryAtom, context.secondaryAtom)
      },
      physics: { repulsion: true, repulsionStrength: 1, overlapDistance: 0, isReactionOccurred: false }
    };
  }
}
