import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';

export function ThemeToggle() {
  const theme = useThemeStore(state => state.theme);
  const toggleTheme = useThemeStore(state => state.toggleTheme);
  const label = theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç';
  return <button type="button" onClick={toggleTheme} aria-label={label} title={label}
    className="touch-target inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800">
    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
  </button>;
}
