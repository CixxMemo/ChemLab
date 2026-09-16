import { LearningTask, LearningTaskOption } from '../../data/learningTasks';
import { BondAnalysis, ElementData } from '../../types/chemistry';
import { resolveBond } from './bondResolver';

export interface TaskEvaluationContext {
  readonly analysis: BondAnalysis;
  readonly elements: readonly ElementData[];
}

export function isCorrectTaskChoice(
  task: LearningTask,
  option: LearningTaskOption,
  context: TaskEvaluationContext
): boolean {
  const { analysis, elements } = context;
  const { primaryAtom, secondaryAtom } = analysis;
  switch (task.kind) {
    case 'element-location': {
      const candidate = elements.find(element => element.symbol === option.value);
      return candidate?.group === primaryAtom.group && candidate?.period === primaryAtom.period;
    }
    case 'valence': return option.value === String(secondaryAtom.valanceElectrons);
    case 'ionic-pair': {
      const [first, second] = option.value.split('|').map(symbol => elements.find(element => element.symbol === symbol));
      return first !== undefined && second !== undefined && resolveBond(first, second).bondType === 'ionic';
    }
    case 'transfer-direction': {
      if (analysis.bondType !== 'ionic' || analysis.transferredElectrons === undefined) return false;
      const direction = (primaryAtom.electronegativity ?? 0) < (secondaryAtom.electronegativity ?? 0)
        ? 'primary-to-secondary' : 'secondary-to-primary';
      return option.value === direction;
    }
    case 'bond-type': return option.value === analysis.bondType;
    case 'shared-pairs': return option.value === String(analysis.sharedElectronPairs);
    case 'stability-targets': return option.value === analysis.octetStatuses.map(status => status.targetElectronCount).join('|');
    case 'electron-behavior': return option.value === (analysis.bondType === 'ionic' ? 'transfer' : analysis.bondType.includes('covalent') ? 'share' : 'none');
    case 'reactivity': return option.value === (analysis.bondType === 'inert' || analysis.bondType === 'no-bond' ? 'no' : 'yes');
  }
}
