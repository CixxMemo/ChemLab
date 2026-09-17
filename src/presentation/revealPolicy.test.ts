import { describe, expect, it } from 'vitest';
import { getRevealPolicy, REVEAL_FIELDS } from './revealPolicy';

describe('teacher reveal policy', () => {
  it('hides all answers in prediction view, including the answer-bearing canvas', () => {
    expect(Object.values(getRevealPolicy(0)).every(value => value === false)).toBe(true);
  });

  it('opens each answer field in sequence without opening later fields', () => {
    REVEAL_FIELDS.forEach((field, index) => {
      const policy = getRevealPolicy(index + 1);
      expect(policy[field]).toBe(true);
      expect(REVEAL_FIELDS.slice(index + 1).every(next => !policy[next])).toBe(true);
    });
  });

  it('shows the complete simulator only after all answers are visible', () => {
    expect(getRevealPolicy(REVEAL_FIELDS.length - 1).showCanvas).toBe(false);
    expect(Object.values(getRevealPolicy(REVEAL_FIELDS.length)).every(Boolean)).toBe(true);
  });

  it('keeps out-of-range levels at the nearest safe visibility boundary', () => {
    expect(Object.values(getRevealPolicy(-1)).every(value => !value)).toBe(true);
    expect(Object.values(getRevealPolicy(REVEAL_FIELDS.length + 1)).every(Boolean)).toBe(true);
  });
});
