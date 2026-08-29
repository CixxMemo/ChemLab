import React from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';

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
  const { filterCategory, setFilterCategory } = useSimulationStore();

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-1.5 px-3 bg-slate-900/60 border-b border-slate-700/80 select-none text-[11px]">
      <span className="text-slate-400 font-mono mr-1">Gruplar:</span>
      {CATEGORIES.map((cat) => {
        const isSelected = filterCategory === cat.id;
        return (
          <button
            key={cat.id}
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
          onClick={() => setFilterCategory(null)}
          className="text-xs text-slate-400 hover:text-slate-200 underline ml-auto px-2 py-1"
        >
          Filtreyi Temizle
        </button>
      )}
    </div>
  );
};
