import React from 'react';
import { useChemistryStore } from '../../store/useChemistryStore';
import { formatReactionDetails } from '../../lib/chemistry/equationFormatter';
import { FlaskConical, Ban, CheckCircle2 } from 'lucide-react';

/**
 * Presenter Component (SRP):
 * Displays the chemical reaction equation, synthesized compound product formula,
 * Turkish compound nomenclature, and bond classification badge in the bottom-left of the canvas.
 */
export const CompoundProductBadge: React.FC = () => {
  const { activeScenario, bondAnalysis, selectedElements } = useChemistryStore();

  const details = formatReactionDetails(activeScenario, bondAnalysis, selectedElements);

  if (!details) {
    return null;
  }

  const {
    equation,
    productFormula,
    compoundNameTR,
    bondTag,
    badgeColor,
    isInert
  } = details;

  return (
    <div
      id="compound-product-badge"
      className="absolute bottom-4 left-4 z-20 pointer-events-none select-none transition-all duration-300"
    >
      <div className="backdrop-blur-md bg-slate-950/85 border border-cyan-500/30 rounded-xl px-4 py-3 shadow-xl flex flex-col gap-2 min-w-[220px] max-w-[320px]">
        {/* Header: Status / Bond Type Tag */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5">
          <div className="flex items-center gap-1.5 text-slate-400">
            {isInert ? (
              <Ban className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
              {isInert ? 'Tepkime Durumu' : 'Tepkime & Ürün'}
            </span>
          </div>

          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${badgeColor}`}>
            {bondTag}
          </span>
        </div>

        {/* Hero: Reaction Equation & Product Formula */}
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-mono font-bold text-base sm:text-lg text-slate-50 tracking-wide">
            {equation}
          </span>
          {productFormula ? (
            <span className="font-mono font-semibold text-xs text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 flex-shrink-0">
              {productFormula}
            </span>
          ) : null}
        </div>

        {/* Footer: Turkish Compound Name */}
        <div className="flex items-center gap-1.5 text-xs">
          {!isInert && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
          <span className={`font-medium truncate ${isInert ? 'text-rose-300/90' : 'text-slate-200'}`}>
            {compoundNameTR}
          </span>
        </div>
      </div>
    </div>
  );
};
