import { create } from 'zustand';

interface NavigationState {
  pathname: string;
  navigate: (path: string) => void;
  syncFromLocation: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  pathname: window.location.pathname,

  navigate: (path) => {
    window.history.pushState(null, '', path);
    set({ pathname: window.location.pathname });
  },

  syncFromLocation: () => set({ pathname: window.location.pathname })
}));
