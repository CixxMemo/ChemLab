import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useThemeStore } from './useThemeStore';

const STORAGE_KEY = 'chemlab-theme';
// Zustand's default persistence schema version, used to exercise saved preferences.
const STORAGE_VERSION = 0;
let values: Map<string, string>;

beforeEach(() => {
  values = new Map();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  });
  useThemeStore.setState({ theme: 'dark' });
});
afterEach(() => vi.unstubAllGlobals());

describe('theme preference', () => {
  it('persists the selected theme and restores it on hydration', async () => {
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe('light');
    const saved = values.get(STORAGE_KEY)!;
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe('dark');
    values.set(STORAGE_KEY, saved);
    await useThemeStore.persist.rehydrate();
    expect(useThemeStore.getState().theme).toBe('light');
    expect(useThemeStore.getState().toggleTheme).toBeTypeOf('function');
  });

  it('rejects an invalid persisted theme', async () => {
    values.set(STORAGE_KEY, JSON.stringify({ state: { theme: 'invalid' }, version: STORAGE_VERSION }));
    await useThemeStore.persist.rehydrate();
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('still switches when browser storage is blocked', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('Storage blocked'); },
      setItem: () => { throw new Error('Storage blocked'); },
    });
    expect(() => useThemeStore.getState().toggleTheme()).not.toThrow();
    expect(useThemeStore.getState().theme).toBe('light');
  });
});
