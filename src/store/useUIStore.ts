import { create } from 'zustand';

export interface UIState {
  filterCategory: string | null;
  viewMode: 'standard' | 'electronegativity';
  isFullscreen: boolean;
  isAnimationModalOpen: boolean;

  // Actions
  setFilterCategory: (category: string | null) => void;
  setViewMode: (mode: 'standard' | 'electronegativity') => void;
  toggleFullscreen: () => void;
  openAnimationModal: () => void;
  closeAnimationModal: () => void;
  toggleAnimationModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  filterCategory: null,
  viewMode: 'standard',
  isFullscreen: false,
  isAnimationModalOpen: false,

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
}));
