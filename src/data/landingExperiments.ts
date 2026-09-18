import rawElements from './elements.json';
import { getAllScenarios } from '../lib/chemistry/stoichiometry';
import { resolveBond } from '../lib/chemistry/bondResolver';
import { RenderBondAnalysis } from '../lib/canvas/IRenderEngine';
import { BondType, ElementData, IAtomRenderData, ReactionScenario } from '../types/chemistry';

interface ExperimentCopy {
  readonly scenarioId: string;
  readonly label: string;
  readonly question: string;
  readonly takeaway: string;
}

export interface LandingExperiment extends ExperimentCopy {
  readonly scenario: ReactionScenario;
  readonly atoms: IAtomRenderData[];
  readonly analysis: RenderBondAnalysis;
}

// Presentation-only curation. Chemistry outcomes come from the existing resolver.
const EXPERIMENT_COPY: readonly ExperimentCopy[] = [
  { scenarioId: 'nacl', label: 'NaCl', question: 'Bir elektron yer değiştirirse ne olur?', takeaway: 'Sodyum elektron verir, klor elektronu alır. Oluşan karşıt yüklü iyonlar birbirini çeker.' },
  { scenarioId: 'h2o', label: 'H₂O', question: 'Elektronlar ortaklaşa kullanılabilir mi?', takeaway: 'Oksijen iki hidrojenle elektron paylaşır. O–H bağlarında ortak elektronlar oksijene daha güçlü çekilir.' },
  { scenarioId: 'o2', label: 'O₂', question: 'İki aynı atom nasıl bağ kurar?', takeaway: 'İki oksijen atomu iki elektron çiftini paylaşır. Özdeş atomlar arasındaki çift bağ apolar kovalenttir.' },
  { scenarioId: 'inert_gas', label: 'He + Ne', question: 'Her atom çifti bağ oluşturur mu?', takeaway: 'Helyum ve neonun dış katmanları zaten doludur. Sınıf koşullarında birbirleriyle bağ oluşturmazlar.' }
];

export const LANDING_BOND_LABELS: Readonly<Record<BondType, string>> = {
  ionic: 'İyonik bağ',
  'polar-covalent': 'Polar kovalent bağ',
  'nonpolar-covalent': 'Apolar kovalent bağ',
  inert: 'Bağ oluşmaz',
  'no-bond': 'Bağ oluşmaz'
};

const elements: Record<string, ElementData> = rawElements as Record<string, ElementData>;
export const previewElements: Record<string, IAtomRenderData> = elements;
const elementsBySymbol = new Map(Object.values(elements).map(element => [element.symbol, element]));
const scenariosById = new Map(getAllScenarios().map(scenario => [scenario.id, scenario]));

export const landingExperiments: readonly LandingExperiment[] = EXPERIMENT_COPY.flatMap(copy => {
  const scenario = scenariosById.get(copy.scenarioId);
  if (!scenario) return [];
  const atoms = scenario.reactantKeys.flatMap(symbol => {
    const element = elementsBySymbol.get(symbol);
    return element ? [element] : [];
  });
  const [primary, secondary] = atoms;
  if (!primary || !secondary) return [];
  return [{ ...copy, scenario, atoms, analysis: resolveBond(primary, secondary) }];
});
