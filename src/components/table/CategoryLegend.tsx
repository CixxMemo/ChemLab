import React from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const CATEGORIES = [
  { id: 'alkali', nameTR: 'Alkali Metaller', color: '#E06C75' },
  { id: 'alkaline', nameTR: 'Toprak Alkali', color: '#E5C07B' },
  { id: 'transition', nameTR: 'Geçiş Metalleri', color: '#4FA6E0' },
  { id: 'post-transition', nameTR: 'Zayıf Metaller', color: '#5E9CD4' },
  { id: 'metalloid', nameTR: 'Yarı Metaller', color: '#56B6C2' },
  { id: 'nonmetal', nameTR: 'Ametaller', color: '#98C379' },
  { id: 'halogen', nameTR: 'Halojenler', color: '#C678DD' },
  { id: 'noble', nameTR: 'Soygazlar (Asal)', color: '#E06C9F' },
  { id: 'lanthanide', nameTR: 'Lantanit/Aktinit', color: '#ABB2BF' },
];

export const CategoryLegend: React.FC = () => {
  const { filterCategory, setFilterCategory } = useUIStore();

  return (
    <details className="group border-b border-slate-700 bg-slate-900 px-3 text-xs">
      <summary className="touch-target flex cursor-pointer list-none items-center gap-2 text-slate-400 [&::-webkit-details-marker]:hidden"><SlidersHorizontal className="h-3.5 w-3.5" /> Element grupları <span className="ml-auto text-slate-300">{CATEGORIES.find(category => category.id === filterCategory)?.nameTR ?? (filterCategory ? 'Aktinitler' : 'Tümü')}</span><ChevronDown className="h-3.5 w-3.5 group-open:rotate-180" /></summary>
      <div className="flex flex-wrap gap-1 pb-2">
      {CATEGORIES.map((cat) => {
        const isSelected = filterCategory === cat.id;
        return (
          <button
            key={cat.id}
            aria-pressed={isSelected}
            onClick={() => setFilterCategory(isSelected ? null : cat.id)}
            className={`px-2 py-1 rounded flex items-center gap-1.5 transition-colors border touch-target ${
              isSelected
                ? 'bg-slate-800 border-slate-400 text-slate-50'
                : 'bg-slate-950/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            <span>{cat.nameTR}</span>
          </button>
        );
      })}

      {filterCategory && (
        <button
          type="button"
          onClick={() => setFilterCategory(null)}
          className="touch-target text-xs text-slate-400 hover:text-slate-200 underline ml-auto px-2 py-1"
        >
          Filtreyi Temizle
        </button>
      )}
      </div>
    </details>
  );
};
