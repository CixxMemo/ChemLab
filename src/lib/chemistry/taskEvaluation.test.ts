import { describe, expect, it } from 'vitest';
import { learningTasks } from '../../data/learningTasks';
import { useChemistryStore } from '../../store/useChemistryStore';
import { resolveBond } from './bondResolver';
import { isCorrectTaskChoice } from './taskEvaluation';

describe('guided task chemistry evaluation', () => {
  const { scenarios, elements } = useChemistryStore.getState();
  const allElements = Object.values(elements);

  it('evaluates every authored option from resolved properties with one correct answer', () => {
    for (const task of learningTasks) {
      const scenario = scenarios.find(item => item.id === task.scenarioId);
      expect(scenario).toBeDefined();
      const atoms = scenario?.reactantKeys.map(symbol => allElements.find(element => element.symbol === symbol));
      const [first, second] = atoms ?? [];
      expect(first).toBeDefined();
      expect(second).toBeDefined();
      if (!first || !second) continue;
      const context = { analysis: resolveBond(first, second), elements: allElements };
      const correct = task.options.filter(option => isCorrectTaskChoice(task, option, context));
      expect(correct, task.id).toHaveLength(1);
      expect(correct[0].misconception).toBe('');
      expect(task.options.filter(option => !isCorrectTaskChoice(task, option, context))
        .every(option => option.misconception.length > 0)).toBe(true);
    }
  });

  it('does not accept an unknown element or pair', () => {
    const task = learningTasks.find(item => item.kind === 'ionic-pair');
    const first = allElements.find(element => element.symbol === 'Na');
    const second = allElements.find(element => element.symbol === 'Cl');
    if (!task || !first || !second) throw new Error('Test fixture is missing');
    const context = { analysis: resolveBond(first, second), elements: allElements };
    expect(isCorrectTaskChoice(task, { value: 'unknown|Cl', label: '', misconception: '' }, context)).toBe(false);
  });

  it('uses the domain outcome for the high-EN nonmetal and noble pair boundaries', () => {
    for (const scenarioId of ['hf', 'inert_gas']) {
      const task = learningTasks.find(item => item.scenarioId === scenarioId && item.kind !== 'ionic-pair');
      const scenario = scenarios.find(item => item.id === scenarioId);
      const [first, second] = scenario?.reactantKeys.map(symbol => allElements.find(element => element.symbol === symbol)) ?? [];
      if (!task || !first || !second) throw new Error('Test fixture is missing');
      const context = { analysis: resolveBond(first, second), elements: allElements };
      expect(task.options.filter(option => isCorrectTaskChoice(task, option, context))).toHaveLength(1);
    }
  });
});
