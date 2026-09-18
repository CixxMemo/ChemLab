import { describe, expect, it } from 'vitest';
import { createLandingPreviewStore, PREVIEW_END, PREVIEW_START } from './createLandingPreviewStore';
import { useChemistryStore } from './useChemistryStore';

const MIDPOINT = 0.5; // Mid-animation fixture for pausing, seeking and session isolation.
const BELOW_START = -1; // Out-of-range input below the timeline's lower bound.
const ABOVE_END = 2; // Out-of-range input above the timeline's upper bound.

describe('isolated landing preview playback', () => {
  it('starts paused and does not alter other previews or the laboratory', () => {
    const laboratory = useChemistryStore.getState();
    const preview = createLandingPreviewStore('nacl');
    const otherPreview = createLandingPreviewStore('h2o');
    preview.getState().togglePlayback();
    preview.getState().setProgress(MIDPOINT);
    preview.getState().selectScenario('o2');
    expect(preview.getState()).toMatchObject({ selectedScenarioId: 'o2', progress: PREVIEW_START, playbackStatus: 'paused' });
    expect(otherPreview.getState()).toMatchObject({ selectedScenarioId: 'h2o', progress: PREVIEW_START, playbackStatus: 'paused' });
    expect(useChemistryStore.getState()).toBe(laboratory);
  });

  it('pauses, resumes and replays from the beginning after completion', () => {
    const preview = createLandingPreviewStore('nacl');
    preview.getState().togglePlayback();
    preview.getState().setProgress(MIDPOINT);
    preview.getState().togglePlayback();
    expect(preview.getState()).toMatchObject({ progress: MIDPOINT, playbackStatus: 'paused' });
    preview.getState().togglePlayback();
    expect(preview.getState()).toMatchObject({ progress: MIDPOINT, playbackStatus: 'playing' });
    preview.getState().setProgress(PREVIEW_END);
    expect(preview.getState().playbackStatus).toBe('completed');
    preview.getState().togglePlayback();
    expect(preview.getState()).toMatchObject({ progress: PREVIEW_START, playbackStatus: 'playing' });
  });

  it('seeking pauses playback and restart keeps the chosen experiment', () => {
    const preview = createLandingPreviewStore('h2o');
    preview.getState().togglePlayback();
    preview.getState().seek(MIDPOINT);
    expect(preview.getState()).toMatchObject({ progress: MIDPOINT, playbackStatus: 'paused' });
    preview.getState().restart();
    expect(preview.getState()).toMatchObject({ selectedScenarioId: 'h2o', progress: PREVIEW_START, playbackStatus: 'paused' });
  });

  it.each([
    [BELOW_START, PREVIEW_START], [PREVIEW_START, PREVIEW_START],
    [PREVIEW_END, PREVIEW_END], [ABOVE_END, PREVIEW_END],
    [NaN, PREVIEW_START], [Infinity, PREVIEW_START]
  ])('normalizes %s to %s for both seeking and animation updates', (input, expected) => {
    const preview = createLandingPreviewStore('nacl');
    preview.getState().seek(input);
    expect(preview.getState().progress).toBe(expected);
    expect(preview.getState().playbackStatus).toBe(expected === PREVIEW_END ? 'completed' : 'paused');
    preview.getState().setProgress(input);
    expect(preview.getState().progress).toBe(expected);
  });
});
