import { IReactionStrategy, ReactionContext, ReactionResolution } from './IReactionStrategy';
import rawReactions from '../../../data/reactions.json';
import { ReactionScenario } from '../../../types/chemistry';

const reactions = rawReactions as ReactionScenario[];
const defaultInertScenario = reactions.find(r => r.id === 'inert_gas') || {
  id: 'inert_gas',
  nameTR: 'Soygaz Etkileşimi (Asal Kararlılık)',
  formula: 'Tepkime Yok (no-bond)',
  reactantKeys: ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn'],
  stoichiometry: [],
  bondType: 'no-bond',
  deltaEN: null,
  descriptionTR: 'Soygazlar zaten kararlı bir elektron dizilimine (tam dolu oktet/dublet) sahiptir; tepkimeye girmez ve bağ oluşturmaz.',
  steps: [
    {
      progressThreshold: 0.0,
      titleTR: 'Soygaz Yaklaşımı',
      descriptionTR: 'Kararlı tam dolu katmana sahip soygaz atomu sisteme dahil ediliyor.'
    },
    {
      progressThreshold: 0.5,
      titleTR: 'Elektronik İtme (Repulsion)',
      descriptionTR: 'Soygazın dış kabuğundaki dolu elektron çiftleri diğer atomların elektronlarını iter.'
    },
    {
      progressThreshold: 1.0,
      titleTR: 'Kimyasal Tepkime Engellendi',
      descriptionTR: 'Soygazlar oktet/dublet kararlılığı nedeniyle bağ oluşturmaz. Sistem kararlı ve asal kalır.'
    }
  ]
};

export class InertReactionStrategy implements IReactionStrategy {
  public readonly id = 'inert';
  public readonly name = 'Asal / Soygaz Etkileşimi';

  public supports(context: ReactionContext): boolean {
    const { primaryAtom, secondaryAtom, deltaEN, isNobleInvolved } = context;
    return (
      isNobleInvolved ||
      deltaEN === null ||
      primaryAtom.electronegativity === null ||
      secondaryAtom.electronegativity === null ||
      primaryAtom.category === 'noble' ||
      secondaryAtom.category === 'noble' ||
      primaryAtom.group === 18 ||
      secondaryAtom.group === 18
    );
  }

  public resolve(context: ReactionContext): ReactionResolution {
    const { primaryAtom, secondaryAtom } = context;
    const inertAtom =
      primaryAtom.category === 'noble' || primaryAtom.electronegativity === null
        ? primaryAtom
        : secondaryAtom;

    const explanationTR = `${inertAtom.nameTR} zaten kararlı bir elektron dizilimine (${
      inertAtom.atomicNumber <= 2 ? 'Dublet' : 'Oktet'
    }) sahip; tepkimeye girmez (bağ oluşmaz).`;

    return {
      scenario: defaultInertScenario,
      bondAnalysis: {
        bondType: 'no-bond',
        deltaEN: null,
        primaryAtom,
        secondaryAtom,
        isOctetSatisfied: true,
        explanationTR
      },
      physics: {
        repulsion: true,
        repulsionStrength: 1.0,
        overlapDistance: 0,
        isReactionOccurred: false
      }
    };
  }
}
