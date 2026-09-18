import { createStore } from 'zustand/vanilla';
import { PlaybackStatus } from '../types/chemistry';

export const PREVIEW_START = 0; // Normalized animation timeline begins with separate atoms.
export const PREVIEW_END = 1; // End of the animation timeline; never used to infer chemistry facts.
export const PREVIEW_SPEED = 1; // Reuse the renderer's normal playback rate.
export const PREVIEW_SEEK_STEP = 0.01; // Allow one-percent keyboard and pointer timeline adjustments.
export const PREVIEW_PERCENT = 100; // Convert normalized progress to an accessible percentage.

interface LandingPreviewState {
  readonly selectedScenarioId: string;
  readonly progress: number;
  readonly playbackStatus: PlaybackStatus;
  selectScenario: (scenarioId: string) => void;
  togglePlayback: () => void;
  restart: () => void;
  seek: (progress: number) => void;
  setProgress: (progress: number) => void;
  setPlaybackStatus: (status: PlaybackStatus) => void;
}

function clampProgress(value: number): number {
  return Number.isFinite(value) ? Math.min(PREVIEW_END, Math.max(PREVIEW_START, value)) : PREVIEW_START;
}

// Each mounted preview owns its playback. No global simulation state is changed.
export function createLandingPreviewStore(initialScenarioId: string) {
  return createStore<LandingPreviewState>((set) => ({
    selectedScenarioId: initialScenarioId,
    progress: PREVIEW_START,
    playbackStatus: 'paused',
    selectScenario: selectedScenarioId => set({ selectedScenarioId, progress: PREVIEW_START, playbackStatus: 'paused' }),
    togglePlayback: () => set(state => ({
      progress: state.progress >= PREVIEW_END ? PREVIEW_START : state.progress,
      playbackStatus: state.playbackStatus === 'playing' ? 'paused' : 'playing'
    })),
    restart: () => set({ progress: PREVIEW_START, playbackStatus: 'paused' }),
    seek: value => {
      const progress = clampProgress(value);
      set({ progress, playbackStatus: progress >= PREVIEW_END ? 'completed' : 'paused' });
    },
    setProgress: value => set(state => {
      const progress = clampProgress(value);
      return { progress, playbackStatus: progress >= PREVIEW_END ? 'completed' : state.playbackStatus };
    }),
    setPlaybackStatus: playbackStatus => set({ playbackStatus })
  }));
}
