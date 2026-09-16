import { describe, expect, it } from 'vitest';
import { learningTopics } from './learningTopics';
import { useChemistryStore } from '../store/useChemistryStore';

describe('verified teaching content', () => {
  const scenarios = useChemistryStore.getState().scenarios;

  it('has six unique topics with three explained questions each', () => {
    expect(learningTopics).toHaveLength(6);
    expect(new Set(learningTopics.map(topic => topic.id)).size).toBe(6);
    for (const topic of learningTopics) {
      expect(topic.questions).toHaveLength(3);
      expect(new Set(topic.questions.map(question => question.id)).size).toBe(3);
      expect(topic.questions.every(question => question.explanation.length > 0)).toBe(true);
      expect(topic.questions.every(question => question.options[question.correctIndex])).toBe(true);
      expect(topic.source).toBeTruthy();
      expect(topic.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('links only verified scenarios and existing prerequisites', () => {
    for (const topic of learningTopics) {
      expect(topic.experimentIds.length).toBeGreaterThan(0);
      expect(topic.experimentIds.every(id => scenarios.some(scenario => scenario.id === id))).toBe(true);
      if (topic.prerequisiteId) {
        expect(learningTopics.some(prerequisite => prerequisite.id === topic.prerequisiteId)).toBe(true);
      }
    }
  });

  it('anchors the ionic vertical slice to the resolved NaCl outcome', () => {
    const ionicTopic = learningTopics.find(topic => topic.id === 'iyonik-bag');
    useChemistryStore.getState().loadScenarioById(ionicTopic?.experimentIds[0] ?? '', { autoplay: false });
    const state = useChemistryStore.getState();
    expect(state.bondAnalysis?.bondType).toBe('ionic');
    expect(state.playbackStatus).toBe('paused');
    expect(state.progress).toBe(0);
    expect(ionicTopic?.questions).toHaveLength(3);
  });

  it('keeps the large-EN nonmetal pair covalent in the teaching flow', () => {
    useChemistryStore.getState().loadScenarioById('hf', { autoplay: false });
    expect(useChemistryStore.getState().bondAnalysis?.bondType).toBe('polar-covalent');
  });
});
