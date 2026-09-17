import { ElementData } from '../../types/chemistry';

const DUPLET_MAX_ATOMIC_NUMBER = 2; // Only first-shell atoms use the classroom duplet model.
const FOUR_BOND_VALENCE = 4; // Group-14 nonmetals can complete an octet with four shared pairs.

export interface SingleElementGuide {
  readonly bondingTendency: string;
  readonly recommendedPartners: string;
}

function getNonmetalGuide(element: ElementData): SingleElementGuide {
  if (element.atomicNumber <= DUPLET_MAX_ATOMIC_NUMBER) return {
    bondingTendency: '1 elektrona sahiptir. Helyum dublet kararlılığına (2 e⁻) ulaşmak için 1 elektron ortaklaşır veya iyonlaşır.',
    recommendedPartners: 'Oksijen (O), Karbon (C) veya Klor (Cl) seçebilirsiniz.'
  };
  if (element.valanceElectrons === FOUR_BOND_VALENCE) return {
    bondingTendency: '4 değerlik elektronuna sahiptir. 4 kovalent bağ oluşturarak oktetini tamamlar.',
    recommendedPartners: 'Hidrojen (H) veya Oksijen (O) seçebilirsiniz.'
  };
  return {
    bondingTendency: `${element.valanceElectrons ?? '-'} değerlik elektronuna sahiptir. Elektron alarak veya ortaklaşarak oktet tamamlama eğilimindedir.`,
    recommendedPartners: 'Hidrojen (H), Sodyum (Na) veya Oksijen (O) seçebilirsiniz.'
  };
}

function getMetalGuide(element: ElementData): SingleElementGuide | null {
  if (element.category === 'alkali') return {
    bondingTendency: `1 değerlik elektronunu vererek +1 yüklü (${element.symbol}⁺) kararlı katyon oluşturur ve bir alt katmandaki soygaz oktetine ulaşır.`,
    recommendedPartners: 'Klor (Cl), Flor (F) veya Oksijen (O) seçerek İyonik Bağ oluşturabilirsiniz.'
  };
  if (element.category === 'alkaline') return {
    bondingTendency: `2 değerlik elektronunu vererek +2 yüklü (${element.symbol}²⁺) kararlı katyon oluşturur ve alt katmandaki oktet kararlılığına ulaşır.`,
    recommendedPartners: 'Oksijen (O) veya Klor (Cl) seçerek İyonik Bağ oluşturabilirsiniz.'
  };
  if (element.category === 'transition' || element.category === 'post-transition') return {
    bondingTendency: 'Metalik özellik gösterir. Değerlik elektronlarını vererek pozitif yüklü iyon oluşturma eğilimindedir.',
    recommendedPartners: 'Klor (Cl) veya Oksijen (O) seçebilirsiniz.'
  };
  return null;
}

export function getSingleElementGuide(element: ElementData): SingleElementGuide {
  if (element.category === 'noble') return {
    bondingTendency: `Tam dolu dış elektron katmanına (${element.atomicNumber <= DUPLET_MAX_ATOMIC_NUMBER ? '2 e⁻ Dublet' : '8 e⁻ Oktet'}) sahip olduğu için kimyasal olarak asaldır ve standart koşullarda bağ yapmaz.`,
    recommendedPartners: 'Diğer soygazlarla etkileşimini görmek için Helyum veya Neon seçebilirsiniz.'
  };
  if (element.category === 'halogen') return {
    bondingTendency: `7 değerlik elektronuna sahiptir. Kararlı oktet yapısına (8 e⁻) ulaşmak için 1 elektron alma (${element.symbol}⁻ anyonu) veya 1 elektron ortaklaşma eğilimindedir.`,
    recommendedPartners: 'Sodyum (Na) veya Hidrojen (H) seçerek İyonik veya Polar Kovalent bağ oluşturabilirsiniz.'
  };
  if (element.category === 'nonmetal') return getNonmetalGuide(element);
  return getMetalGuide(element) ?? {
    bondingTendency: `Periyodik tabloda ${element.period}. periyot, ${element.group}. grupta yer alır.`,
    recommendedPartners: 'Ametaller veya metaller ile reaksiyonunu test edebilirsiniz.'
  };
}
