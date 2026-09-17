import { describe, expect, it } from 'vitest';
import { learningTopics } from './learningTopics';
import { teacherFlows } from './teacherFlows';

describe('teacher lesson flows', () => {
  it('covers every topic once with a complete teaching sequence', () => {
    expect(teacherFlows).toHaveLength(learningTopics.length);
    expect(new Set(teacherFlows.map(flow => flow.topicId)).size).toBe(learningTopics.length);
    for (const flow of teacherFlows) {
      expect(learningTopics.some(topic => topic.id === flow.topicId)).toBe(true);
      expect([flow.openingQuestion, flow.predictionPrompt, flow.explanationPrompt, flow.exitTicket]
        .every(text => text.length > 0)).toBe(true);
    }
  });
});
