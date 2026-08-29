import React from 'react';
import { ElementData } from '../../types/chemistry';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface OctetStatusBadgeProps {
  element: ElementData;
  progress: number;
}

export const OctetStatusBadge: React.FC<OctetStatusBadgeProps> = ({ element, progress }) => {
  const isNoble = element.category === 'noble';
  const isDuplet = element.atomicNumber <= 2;
  const targetValence = isDuplet ? 2 : 8;

  // Initial valence before bonding
  const initialValence = element.valanceElectrons;

  // Completed status
  const isCompleted = progress >= 0.75 || isNoble;

  return (
    <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-700/80 font-mono text-xs select-none">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded bg-slate-800 border border-slate-700 font-bold flex items-center justify-center text-chem-transition text-xs">
          {element.symbol}
        </span>
        <div className="flex flex-col">
          <span className="font-sans font-semibold text-slate-100 text-xs">
            {element.nameTR}
          </span>
          <span className="text-[10px] text-slate-400">
            Dış Katman: {isCompleted ? targetValence : (initialValence ?? '-')} / {targetValence} e⁻
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {isCompleted ? (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-600/50 text-emerald-400 text-[10px]">
            <CheckCircle2 className="w-3 h-3" />
            <span>{isDuplet ? 'Dublet Tamam' : 'Oktet Tamam'}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-600/50 text-amber-400 text-[10px]">
            <AlertCircle className="w-3 h-3" />
            <span>{initialValence ?? '-'} e⁻ (Kararsız)</span>
          </span>
        )}
      </div>
    </div>
  );
};
