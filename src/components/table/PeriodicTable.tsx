import React, { useState, useMemo } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { ElementCell } from './ElementCell';
import { FilterBar } from './FilterBar';
import { CategoryLegend } from './CategoryLegend';
import { ElementData } from '../../types/chemistry';

export const PeriodicTable: React.FC = () => {
  const { elements, filterCategory, setFilterCategory, hoveredElement } = useSimulationStore();
  const [searchQuery, setSearchQuery] = useState('');

  const elementsList = useMemo(() => Object.values(elements), [elements]);

  const filteredElements = useMemo(() => {
    return elementsList.filter((el) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSym = el.symbol.toLowerCase().includes(q);
        const matchesNameTR = el.nameTR.toLowerCase().includes(q);
        const matchesNameEN = (el.nameEN || el.name || '').toLowerCase().includes(q);
        const matchesNum = el.atomicNumber.toString() === q;
        if (!matchesSym && !matchesNameTR && !matchesNameEN && !matchesNum) {
          return false;
        }
      }

      // Category filter
      if (filterCategory && el.category !== filterCategory) {
        return false;
      }

      return true;
    });
  }, [elementsList, searchQuery, filterCategory]);

  const filteredSymbolSet = useMemo(() => new Set(filteredElements.map(e => e.symbol)), [filteredElements]);

  // Group elements by period and f-block
  const elementsByZ = useMemo(() => {
    const map = new Map<number, ElementData>();
    elementsList.forEach(el => map.set(el.atomicNumber, el));
    return map;
  }, [elementsList]);

  // Helper to render an element cell safely
  const renderCell = (z: number, gridColStart?: number) => {
    const el = elementsByZ.get(z);
    if (!el) return null;
    const isDimmed = !filteredSymbolSet.has(el.symbol);
    return (
      <ElementCell
        key={el.atomicNumber}
        element={el}
        isDimmed={isDimmed}
        gridColumnStart={gridColStart}
      />
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden select-none">
      {/* Search & Selection Bar */}
      <FilterBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Category Legend & Filter Chips */}
      <CategoryLegend />

      {/* Main Content Area - Shifted down with comfortable vertical padding & centering */}
      <div className="flex-1 overflow-auto px-3 pt-4 pb-2 flex flex-col justify-between min-h-0">
        <div className="w-full min-w-[760px] flex flex-col gap-1 my-auto">
          {/* Main 18-column Periodic Table Grid (Periods 1 - 7) */}
          <div className="grid grid-cols-18 gap-1 w-full">
            {/* Period 1 */}
            {renderCell(1, 1)}
            {renderCell(2, 18)}

            {/* Period 2 */}
            {renderCell(3, 1)}
            {renderCell(4, 2)}
            {renderCell(5, 13)}
            {renderCell(6, 14)}
            {renderCell(7, 15)}
            {renderCell(8, 16)}
            {renderCell(9, 17)}
            {renderCell(10, 18)}

            {/* Period 3 */}
            {renderCell(11, 1)}
            {renderCell(12, 2)}
            {renderCell(13, 13)}
            {renderCell(14, 14)}
            {renderCell(15, 15)}
            {renderCell(16, 16)}
            {renderCell(17, 17)}
            {renderCell(18, 18)}

            {/* Period 4 */}
            {Array.from({ length: 18 }, (_, i) => i + 19).map(z => renderCell(z))}

            {/* Period 5 */}
            {Array.from({ length: 18 }, (_, i) => i + 37).map(z => renderCell(z))}

            {/* Period 6 */}
            {renderCell(55, 1)}
            {renderCell(56, 2)}
            {/* Lanthanide Marker in Col 3 */}
            <button
              onClick={() => setFilterCategory(filterCategory === 'lanthanide' ? null : 'lanthanide')}
              className={`flex flex-col items-center justify-center p-1 rounded border text-[9.5px] font-mono transition-colors ${
                filterCategory === 'lanthanide'
                  ? 'bg-slate-800 border-white text-slate-50'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
              }`}
              title="Lantanitler Serisi (57-71)"
            >
              <span className="font-bold text-chem-fblock">57-71</span>
              <span className="text-[8px] text-slate-400">* La-Lu</span>
            </button>
            {Array.from({ length: 15 }, (_, i) => i + 72).map(z => renderCell(z))}

            {/* Period 7 */}
            {renderCell(87, 1)}
            {renderCell(88, 2)}
            {/* Actinide Marker in Col 3 */}
            <button
              onClick={() => setFilterCategory(filterCategory === 'actinide' ? null : 'actinide')}
              className={`flex flex-col items-center justify-center p-1 rounded border text-[9.5px] font-mono transition-colors ${
                filterCategory === 'actinide'
                  ? 'bg-slate-800 border-white text-slate-50'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
              }`}
              title="Aktinitler Serisi (89-103)"
            >
              <span className="font-bold text-chem-fblock">89-103</span>
              <span className="text-[8px] text-slate-400">** Ac-Lr</span>
            </button>
            {Array.from({ length: 15 }, (_, i) => i + 104).map(z => renderCell(z))}
          </div>

          {/* F-Block: Lanthanides & Actinides seamlessly aligned under Columns 4..18 */}
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-col gap-1">
            {/* Lanthanides Row (57-71) */}
            <div className="grid grid-cols-18 gap-1 w-full items-center">
              <div
                onClick={() => setFilterCategory(filterCategory === 'lanthanide' ? null : 'lanthanide')}
                className="col-span-3 flex items-center justify-end pr-2 text-[10px] font-mono text-slate-400 font-semibold cursor-pointer hover:text-slate-200"
              >
                * Lantanitler (57-71)
              </div>
              {Array.from({ length: 15 }, (_, i) => i + 57).map(z => renderCell(z))}
            </div>

            {/* Actinides Row (89-103) */}
            <div className="grid grid-cols-18 gap-1 w-full items-center">
              <div
                onClick={() => setFilterCategory(filterCategory === 'actinide' ? null : 'actinide')}
                className="col-span-3 flex items-center justify-end pr-2 text-[10px] font-mono text-slate-400 font-semibold cursor-pointer hover:text-slate-200"
              >
                ** Aktinitler (89-103)
              </div>
              {Array.from({ length: 15 }, (_, i) => i + 89).map(z => renderCell(z))}
            </div>
          </div>
        </div>

        {/* Hover Inspector Quick Bar */}
        {hoveredElement ? (
          <div className="mt-2 p-2 rounded bg-slate-900 border border-slate-700 flex items-center justify-between text-xs font-mono select-none min-h-[36px]">
            <div className="flex items-center gap-3">
              <span className="text-chem-transition font-bold text-sm">
                {hoveredElement.atomicNumber}. {hoveredElement.symbol}
              </span>
              <span className="text-slate-100 font-sans font-semibold">
                {hoveredElement.nameTR} {hoveredElement.nameEN || hoveredElement.name ? `(${hoveredElement.nameEN || hoveredElement.name})` : ''}
              </span>
              <span className="text-slate-400">
                Elektronegatiflik: <strong className="text-chem-alkaline">{hoveredElement.electronegativity !== null ? hoveredElement.electronegativity : '-'}</strong>
              </span>
              <span className="text-slate-400">
                Valans e⁻: <strong className="text-chem-electron">{hoveredElement.valanceElectrons !== null ? hoveredElement.valanceElectrons : '-'}</strong>
              </span>
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-sm hidden lg:block font-sans">
              {hoveredElement.summaryTR}
            </div>
          </div>
        ) : (
          <div className="mt-2 p-2 rounded bg-slate-900/40 border border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-500 select-none min-h-[36px]">
            <span>Element üzerine gelerek ayrıntılı bilgi edinebilirsiniz.</span>
            <span className="text-[11px] hidden sm:inline">118 Element • Tam Periyodik Tablo</span>
          </div>
        )}
      </div>
    </div>
  );
};
