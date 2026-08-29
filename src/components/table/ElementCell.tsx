import React from 'react';
import { ElementData } from '../../types/chemistry';
import { useSimulationStore } from '../../store/useSimulationStore';
import { CATEGORY_COLORS } from '../../lib/canvas/atomRenderer';

interface ElementCellProps {
  element: ElementData;
  isDimmed?: boolean;
  gridColumnStart?: number;
}

export const ElementCell: React.FC<ElementCellProps> = ({ element, isDimmed, gridColumnStart }) => {
  const { selectedElements, selectElement, hoveredElement, setHoveredElement, viewMode } = useSimulationStore();

  const isSelected = selectedElements.some(e => e.symbol === element.symbol);
  const isHovered = hoveredElement?.symbol === element.symbol;
  const categoryColor = CATEGORY_COLORS[element.category] || '#4FA6E0';

  // Electronegativity heatmap background calculation
  let customBg = '#151C28';
  if (viewMode === 'electronegativity' && element.electronegativity !== null && element.electronegativity > 0) {
    // EN ranges between 0.7 (Fr) and 4.0 (F)
    const normalized = Math.min(1, Math.max(0, (element.electronegativity - 0.7) / 3.3));
    // Interpolate from deep dark blue to vivid amber/coral
    const r = Math.round(21 + normalized * 180);
    const g = Math.round(28 + (1 - normalized) * 60);
    const b = Math.round(40 + (1 - normalized) * 120);
    customBg = `rgb(${r}, ${g}, ${b})`;
  }

  return (
    <button
      onClick={() => selectElement(element)}
      onMouseEnter={() => setHoveredElement(element)}
      onMouseLeave={() => setHoveredElement(null)}
      style={{
        gridColumnStart: gridColumnStart,
        backgroundColor: customBg,
        borderColor: isSelected ? '#FFFFFF' : isHovered ? categoryColor : '#263345',
      }}
      className={`
        relative flex flex-col justify-between p-1 rounded transition-all duration-150
        min-w-0 w-full min-h-[38px] sm:min-h-[44px] touch-target select-none border text-left
        ${isDimmed ? 'opacity-25 grayscale' : 'opacity-100 hover:scale-[1.03]'}
        ${isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-950 z-10 shadow-sharp-active' : 'z-0'}
      `}
      title={`${element.atomicNumber}. ${element.nameTR} (${element.symbol}) - EN: ${element.electronegativity}`}
    >
      {/* Top row: Atomic Number and Category Indicator */}
      <div className="flex items-center justify-between w-full leading-none">
        <span className="text-[10px] font-mono text-slate-400 font-semibold">
          {element.atomicNumber}
        </span>
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: categoryColor }}
        />
      </div>

      {/* Center: Symbol */}
      <div className="text-center my-auto">
        <span
          className="font-mono font-bold text-sm tracking-tight"
          style={{ color: isSelected ? '#FFFFFF' : '#F8FAFC' }}
        >
          {element.symbol}
        </span>
      </div>

      {/* Bottom row: NameTR and Electronegativity */}
      <div className="flex items-center justify-between w-full leading-none text-[9px] font-mono text-slate-400">
        <span className="truncate max-w-[32px] font-sans">
          {element.nameTR}
        </span>
        <span className="text-[8.5px] text-chem-alkaline font-bold">
          {element.electronegativity !== null ? element.electronegativity.toFixed(1) : '-'}
        </span>
      </div>
    </button>
  );
};
