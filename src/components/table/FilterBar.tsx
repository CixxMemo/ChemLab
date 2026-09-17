import React from 'react';
import { useChemistryStore } from '../../store/useChemistryStore';
import { Search, X, CheckCircle2 } from 'lucide-react';
import { RevealPolicy } from '../../presentation/revealPolicy';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  guided?: boolean;
  reveal?: RevealPolicy;
}

export const FilterBar: React.FC<FilterBarProps> = ({ searchQuery, setSearchQuery, guided = false, reveal }) => {
  const { selectedElements, deselectElement, activeScenario } = useChemistryStore();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-slate-900 border-b border-slate-700 select-none">
      {/* Search Input */}
      <div className="relative min-w-40 flex-1 max-w-xs">
        <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          aria-label="Element ara"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Element ara (örn: Na, Sodyum, 11)..."
          className="w-full h-10 pl-8 pr-10 bg-slate-950 border border-slate-700 rounded text-xs text-slate-50 placeholder-slate-500 focus:outline-none focus:border-chem-transition font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            type="button"
            aria-label="Aramayı temizle"
            className="touch-target absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-slate-400 hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Selected Element Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          Seçili Atomlar ({selectedElements.length}/2):
        </span>
        {selectedElements.length === 0 ? (
          <span className="text-xs text-slate-500 italic">Atom seçilmedi</span>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            {selectedElements.map((el, i) => (
              <span
                key={`${el.symbol}-${i}`}
                className="inline-flex min-h-10 items-center gap-1.5 rounded border border-slate-700 bg-slate-800 py-0.5 pl-2 text-slate-50 font-mono text-xs"
              >
                <span className="font-bold text-chem-transition">{el.symbol}</span>
                <span className="text-[10px] text-slate-400">({el.nameTR})</span>
                {!guided && <button
                  type="button"
                  onClick={() => deselectElement(i)}
                  className="touch-target flex h-10 w-10 items-center justify-center text-slate-400 hover:text-slate-200"
                  title={`${el.symbol} kaldır`}
                >
                  <X className="w-3 h-3" />
                </button>}
              </span>
            ))}
          </div>
        )}

        {activeScenario && (reveal?.product ?? true) && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950 border border-chem-ionic text-chem-ionic text-xs font-mono">
            <CheckCircle2 className="w-3 h-3" />
            <span>{activeScenario.formula}</span>
          </div>
        )}
      </div>
    </div>
  );
};
