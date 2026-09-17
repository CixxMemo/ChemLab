import React from 'react';
import { FlaskConical, GraduationCap, Presentation, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from '../layout/ThemeToggle';
import { AppLink } from './AppLink';
import { ExperienceMode, getLaboratoryPath, getModePath } from '../../navigation/routes';

interface SiteHeaderProps {
  mode: ExperienceMode;
}

const NAV_CLASS = 'touch-target inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-50';

export const SiteHeader: React.FC<SiteHeaderProps> = ({ mode }) => (
  <header className="relative z-30 flex shrink-0 items-center justify-between gap-2 border-b border-slate-700 bg-slate-900 px-4 py-2 md:px-8">
    <AppLink to="/" className="touch-target inline-flex shrink-0 items-center gap-2 font-mono font-bold text-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-50" ariaLabel="ChemLab ana sayfa">
      <span className="flex h-9 w-9 items-center justify-center rounded border border-slate-700 bg-slate-950 text-chem-transition">
        <FlaskConical className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="hidden text-base sm:inline">ChemLab</span>
    </AppLink>

    <nav aria-label="Ana gezinme" className="ml-auto flex min-w-0 items-center gap-1 overflow-x-auto whitespace-nowrap">
      <AppLink to={getModePath('student')} current={mode === 'student'} className={`${NAV_CLASS} ${mode === 'student' ? 'border-chem-nonmetal bg-slate-800 text-slate-50' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}`}>
        <GraduationCap className="h-4 w-4" aria-hidden="true" /> <span className="sr-only sm:not-sr-only">Öğrenci</span>
      </AppLink>
      <AppLink to={getModePath('teacher')} current={mode === 'teacher'} className={`${NAV_CLASS} ${mode === 'teacher' ? 'border-chem-transition bg-slate-800 text-slate-50' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}`}>
        <Presentation className="h-4 w-4" aria-hidden="true" /> <span className="sr-only sm:not-sr-only">Öğretmen</span>
      </AppLink>
      <AppLink to={getLaboratoryPath('free')} className={`${NAV_CLASS} border-slate-700 bg-slate-950 text-slate-50 hover:bg-slate-800`}>
        <span className="hidden sm:inline">Serbest Laboratuvar</span><span className="sm:hidden">Laboratuvar</span> <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </AppLink>
    </nav>
    <ThemeToggle />
  </header>
);
