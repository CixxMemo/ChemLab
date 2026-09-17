import { describe, expect, it } from 'vitest';
import { learningTasks } from './learningTasks';
import { learningTopics } from './learningTopics';
import { useChemistryStore } from '../store/useChemistryStore';

describe('guided task catalog', () => {
  it('contains ten unique tasks backed by verified topics and scenarios', () => {
    const scenarios = useChemistryStore.getState().scenarios;
    expect(learningTasks).toHaveLength(10);
    expect(new Set(learningTasks.map(task => task.id)).size).toBe(10);
    for (const task of learningTasks) {
      const topic = learningTopics.find(item => item.id === task.topicId);
      expect(topic).toBeDefined();
      expect(topic?.experimentIds).toContain(task.scenarioId);
      expect(scenarios.some(scenario => scenario.id === task.scenarioId)).toBe(true);
      expect(task.options).toHaveLength(3);
      expect(task.successExplanation.length).toBeGreaterThan(0);
      expect(new Set(task.options.map(option => option.value)).size).toBe(3);
    }
  });
});
