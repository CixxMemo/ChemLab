import React from 'react';

interface ElectronegativityBarProps {
  deltaEN: number | null;
}

export const ElectronegativityBar: React.FC<ElectronegativityBarProps> = ({ deltaEN }) => {
  if (deltaEN === null) {
    return (
      <div className="flex flex-col gap-1.5 bg-slate-900 p-2.5 rounded border border-slate-700 select-none">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">Pauling Elektronegatiflik Skalası:</span>
          <span className="font-bold text-slate-500">ΔEN = n/a (Tanımsız)</span>
        </div>
        <div className="h-4 bg-slate-950 rounded flex items-center justify-center border border-slate-700 text-[10px] font-mono text-slate-500">
          Soygazlar standart Pauling elektronegatiflik değerine sahip değildir.
        </div>
      </div>
    );
  }

  // Max scale value is ~3.3
  const maxScale = 3.3;
  const percentage = Math.min(100, Math.max(0, (deltaEN / maxScale) * 100));

  // Threshold percentages
  const apolarLimitPct = (0.4 / maxScale) * 100; // ~12.1%
  const polarLimitPct = (1.7 / maxScale) * 100; // ~51.5%

  return (
    <div className="flex flex-col gap-1.5 bg-slate-900 p-2.5 rounded border border-slate-700 select-none">
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-400">Pauling Elektronegatiflik Skalası:</span>
        <span className="font-bold text-chem-alkaline">ΔEN = {deltaEN.toFixed(2)}</span>
      </div>

      {/* Multi-segment Scale Bar */}
      <div className="relative h-4 bg-slate-950 rounded overflow-hidden border border-slate-700">
        {/* Apolar segment (0 to 0.4) */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-emerald-900/60 border-r border-emerald-500/40"
          style={{ width: `${apolarLimitPct}%` }}
        />
        {/* Polar segment (0.4 to 1.7) */}
        <div
          className="absolute top-0 bottom-0 bg-amber-900/60 border-r border-amber-500/40"
          style={{ left: `${apolarLimitPct}%`, width: `${polarLimitPct - apolarLimitPct}%` }}
        />
        {/* Ionic segment (1.7 to 3.3) */}
        <div
          className="absolute top-0 bottom-0 bg-sky-900/60"
          style={{ left: `${polarLimitPct}%`, right: 0 }}
        />

        {/* Current Value Marker Needle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-sharp z-10 transition-all duration-200 -translate-x-1/2"
          style={{ left: `${percentage}%` }}
        />
      </div>

      {/* Labels below scale */}
      <div className="flex justify-between text-[9.5px] font-mono text-slate-400">
        <span className="text-chem-covalent">0.0 (Apolar)</span>
        <span className="text-chem-polar">0.4</span>
        <span className="text-chem-polar">1.7 (Polar)</span>
        <span className="text-chem-ionic">&gt;1.7 (İyonik)</span>
      </div>
    </div>
  );
};
