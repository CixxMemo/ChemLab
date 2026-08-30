import { create } from 'zustand';
import rawElements from '../data/elements.json';
import { ElementData, ReactionScenario, BondAnalysis, PlaybackStatus } from '../types/chemistry';
import { resolveBond } from '../lib/chemistry/bondResolver';
import { resolveScenario, getAllScenarios } from '../lib/chemistry/stoichiometry';

const elementsMap = rawElements as Record<string, ElementData>;

interface SimulationStore {
  // Data
  elements: Record<string, ElementData>;
  scenarios: ReactionScenario[];

  // Selection & Chemistry state
  selectedElements: ElementData[];
  activeScenario: ReactionScenario | null;
  bondAnalysis: BondAnalysis | null;
  hoveredElement: ElementData | null;

  // Playback & Animation state
  playbackStatus: PlaybackStatus;
  progress: number; // 0.0 to 1.0
  playbackSpeed: number; // 0.5, 1.0, 2.0

  // Filter & Display state
  filterCategory: string | null;
  viewMode: 'standard' | 'electronegativity';
  isFullscreen: boolean;
  isAnimationModalOpen: boolean;

  // Actions
  selectElement: (element: ElementData) => void;
  deselectElement: (symbol: string) => void;
  setHoveredElement: (element: ElementData | null) => void;
  loadScenarioById: (scenarioId: string) => void;
  setPlaybackStatus: (status: PlaybackStatus) => void;
  setProgress: (progress: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setFilterCategory: (category: string | null) => void;
  setViewMode: (mode: 'standard' | 'electronegativity') => void;
  toggleFullscreen: () => void;
  openAnimationModal: () => void;
  closeAnimationModal: () => void;
  toggleAnimationModal: () => void;
  resetSimulation: () => void;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  elements: elementsMap,
  scenarios: getAllScenarios(),

  selectedElements: [],
  activeScenario: null,
  bondAnalysis: null,
  hoveredElement: null,

  playbackStatus: 'idle',
  progress: 0,
  playbackSpeed: 1,

  filterCategory: null,
  viewMode: 'standard',
  isFullscreen: false,
  isAnimationModalOpen: false,

  selectElement: (element: ElementData) => {
    const current = get().selectedElements;

    let nextSelection: ElementData[];
    if (current.length === 0) {
      nextSelection = [element];
    } else if (current.length === 1) {
      nextSelection = [...current, element];
    } else {
      // If already 2 selected, start fresh with the new element
      nextSelection = [element];
    }

    const symbols = nextSelection.map(e => e.symbol);
    const scenario = resolveScenario(symbols);

    let bond: BondAnalysis | null = null;
    if (nextSelection.length >= 2) {
      bond = resolveBond(nextSelection[0], nextSelection[1]);
    } else if (nextSelection.length === 1) {
      if (nextSelection[0].category === 'noble' || nextSelection[0].electronegativity === null || scenario?.id === 'o2') {
        bond = resolveBond(nextSelection[0], nextSelection[0]);
      }
    }

    set({
      selectedElements: nextSelection,
      activeScenario: scenario,
      bondAnalysis: bond,
      progress: 0,
      playbackStatus: nextSelection.length >= 2 || scenario ? 'playing' : 'idle'
    });
  },

  deselectElement: (symbol: string) => {
    const nextSelection = get().selectedElements.filter(e => e.symbol !== symbol);
    set({
      selectedElements: nextSelection,
      activeScenario: null,
      bondAnalysis: null,
      progress: 0,
      playbackStatus: 'idle'
    });
  },

  setHoveredElement: (element) => set({ hoveredElement: element }),

  loadScenarioById: (scenarioId: string) => {
    const scenarios = get().scenarios;
    const target = scenarios.find(s => s.id === scenarioId);
    if (!target) return;

    // Resolve representative elements for selection
    const allElements = Object.values(get().elements);
    const selected: ElementData[] = [];

    target.reactantKeys.forEach(sym => {
      const el = allElements.find(e => e.symbol === sym);
      if (el) selected.push(el);
    });

    const bond = selected.length >= 2
      ? resolveBond(selected[0], selected[1])
      : selected.length === 1
      ? resolveBond(selected[0], selected[0])
      : null;

    set({
      activeScenario: target,
      selectedElements: selected,
      bondAnalysis: bond,
      progress: 0,
      playbackStatus: 'playing'
    });
  },

  setPlaybackStatus: (status) => set({ playbackStatus: status }),

  setProgress: (progress) => {
    const clamped = Math.max(0, Math.min(1, progress));
    set({
      progress: clamped,
      playbackStatus: clamped >= 1 ? 'completed' : get().playbackStatus
    });
  },

  stepForward: () => {
    const next = Math.min(1, get().progress + 0.1);
    set({
      progress: next,
      playbackStatus: next >= 1 ? 'completed' : 'paused'
    });
  },

  stepBackward: () => {
    const prev = Math.max(0, get().progress - 0.1);
    set({
      progress: prev,
      playbackStatus: 'paused'
    });
  },

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  setFilterCategory: (category) => set({ filterCategory: category }),

  setViewMode: (mode) => set({ viewMode: mode }),

  toggleFullscreen: () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      set({ isFullscreen: true });
    } else {
      document.exitFullscreen().catch(() => {});
      set({ isFullscreen: false });
    }
  },

  openAnimationModal: () => set({ isAnimationModalOpen: true }),
  closeAnimationModal: () => set({ isAnimationModalOpen: false }),
  toggleAnimationModal: () => set((state) => ({ isAnimationModalOpen: !state.isAnimationModalOpen })),

  resetSimulation: () => {
    set({
      selectedElements: [],
      activeScenario: null,
      bondAnalysis: null,
      progress: 0,
      playbackStatus: 'idle'
    });
  }
}));
