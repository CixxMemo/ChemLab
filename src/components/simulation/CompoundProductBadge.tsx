import React from 'react';
import { useChemistryStore } from '../../store/useChemistryStore';
import { formatReactionDetails } from '../../lib/chemistry/equationFormatter';
import { FlaskConical, Ban, CheckCircle2 } from 'lucide-react';
import { RevealPolicy } from '../../presentation/revealPolicy';

/**
 * Presenter Component (SRP):
 * Displays the chemical reaction equation, synthesized compound product formula,
 * Turkish compound nomenclature, and bond classification in a shared information rail.
 * The rail stays in document flow so it never covers atoms on compact canvases.
 */
export const CompoundProductBadge: React.FC<{ reveal?: RevealPolicy }> = ({ reveal }) => {
  const { activeScenario, bondAnalysis, selectedElements } = useChemistryStore();

  if (reveal && !reveal.product) return <div className="relative z-20 shrink-0 border-t border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-200" aria-label="Ürün gizli">
    {selectedElements.map(element => element.symbol).join(' + ')} → Ürün gizli
  </div>;

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
      className="relative z-20 flex-shrink-0 border-t border-slate-700 bg-slate-900 px-3 py-2 select-none"
      aria-label={`${equation}, ${compoundNameTR}`}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1">
        {/* Header: Status */}
        <div className="flex min-w-0 items-center gap-1.5 text-slate-400">
          {isInert ? (
            <Ban className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
          ) : (
            <FlaskConical className="w-3.5 h-3.5 flex-shrink-0 text-cyan-400" />
          )}
          <span className="truncate text-[10px] font-mono uppercase tracking-wider font-semibold">
            {isInert ? 'Tepkime Durumu' : 'Tepkime & Ürün'}
          </span>
        </div>

        {(reveal?.bond ?? true) && <span className={`max-w-[190px] truncate px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${badgeColor}`}>
          {bondTag}
        </span>}

        {/* Reaction equation */}
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="truncate font-mono font-bold text-base text-slate-50 tracking-wide">
            {equation}
          </span>
          {productFormula ? (
            <span className="font-mono font-semibold text-xs text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 flex-shrink-0">
              {productFormula}
            </span>
          ) : null}
        </div>

        {/* Turkish compound name */}
        <div className="flex min-w-0 items-center justify-end gap-1.5 text-xs">
          {!isInert && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
          <span className={`truncate font-medium ${isInert ? 'text-rose-300/90' : 'text-slate-200'}`}>
            {compoundNameTR}
          </span>
        </div>
      </div>
    </div>
  );
};
