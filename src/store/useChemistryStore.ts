import { create } from 'zustand';
import rawElements from '../data/elements.json';
import { ElementData, ReactionScenario, BondAnalysis, PlaybackStatus, IElementInfo } from '../types/chemistry';
import { resolveBond } from '../lib/chemistry/bondResolver';
import { resolveScenario, getAllScenarios } from '../lib/chemistry/stoichiometry';

const elementsMap = rawElements as Record<string, ElementData>;

export interface ChemistryState {
  // Domain Data
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

  // Actions
  selectElement: (element: IElementInfo) => void;
  deselectElement: (target: string | number) => void;
  setHoveredElement: (element: IElementInfo | null) => void;
  loadScenarioById: (scenarioId: string) => void;
  setPlaybackStatus: (status: PlaybackStatus) => void;
  setProgress: (progress: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
  setPlaybackSpeed: (speed: number) => void;
  resetSimulation: () => void;
}

export const useChemistryStore = create<ChemistryState>((set, get) => ({
  elements: elementsMap,
  scenarios: getAllScenarios(),

  selectedElements: [],
  activeScenario: null,
  bondAnalysis: null,
  hoveredElement: null,

  playbackStatus: 'idle',
  progress: 0,
  playbackSpeed: 1,

  selectElement: (element: IElementInfo) => {
    const fullElement = (get().elements[element.atomicNumber.toString()] || element) as ElementData;
    const current = get().selectedElements;

    let nextSelection: ElementData[];
    if (current.length === 0) {
      nextSelection = [fullElement];
    } else if (current.length === 1) {
      nextSelection = [...current, fullElement];
    } else {
      nextSelection = [fullElement];
    }

    const symbols = nextSelection.map(e => e.symbol);
    const scenario = nextSelection.length >= 2 ? resolveScenario(symbols) : null;

    let bond: BondAnalysis | null = null;
    if (nextSelection.length >= 2) {
      bond = resolveBond(nextSelection[0], nextSelection[1]);
    }

    set({
      selectedElements: nextSelection,
      activeScenario: scenario,
      bondAnalysis: bond,
      progress: 0,
      playbackStatus: nextSelection.length >= 2 ? 'playing' : 'idle'
    });
  },

  deselectElement: (target: string | number) => {
    const current = get().selectedElements;
    let nextSelection: ElementData[];
    if (typeof target === 'number') {
      nextSelection = current.filter((_, idx) => idx !== target);
    } else {
      const idx = current.findIndex(e => e.symbol === target);
      if (idx !== -1) {
        nextSelection = [...current.slice(0, idx), ...current.slice(idx + 1)];
      } else {
        nextSelection = current;
      }
    }

    const symbols = nextSelection.map(e => e.symbol);
    const scenario = nextSelection.length >= 2 ? resolveScenario(symbols) : null;
    const bond = nextSelection.length >= 2 ? resolveBond(nextSelection[0], nextSelection[1]) : null;

    set({
      selectedElements: nextSelection,
      activeScenario: scenario,
      bondAnalysis: bond,
      progress: 0,
      playbackStatus: nextSelection.length >= 2 ? 'playing' : 'idle'
    });
  },

  setHoveredElement: (element) => {
    const resolved = element ? ((get().elements[element.atomicNumber.toString()] || element) as ElementData) : null;
    set({ hoveredElement: resolved });
  },

  loadScenarioById: (scenarioId: string) => {
    const scenarios = get().scenarios;
    const target = scenarios.find(s => s.id === scenarioId);
    if (!target) return;

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
