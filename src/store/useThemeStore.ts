import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';
interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

// Storage can be unavailable in private/embedded browsers; theme switching still works.
const storage = createJSONStorage(() => ({
  getItem: (key: string) => { try { return localStorage.getItem(key); } catch { return null; } },
  setItem: (key: string, value: string) => { try { localStorage.setItem(key, value); } catch { /* Session-only preference. */ } },
  removeItem: (key: string) => { try { localStorage.removeItem(key); } catch { /* Storage unavailable. */ } },
}));

export const useThemeStore = create<ThemeState>()(persist(
  set => ({ theme: 'dark', toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })) }),
  {
    name: 'chemlab-theme', storage,
    partialize: state => ({ theme: state.theme }),
    merge: (saved, current) => {
      const theme = (saved as { theme?: unknown } | null)?.theme;
      return { ...current, theme: theme === 'light' ? 'light' : 'dark' };
    },
  },
));
