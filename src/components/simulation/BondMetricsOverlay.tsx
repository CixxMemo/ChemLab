import React from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

export const BondMetricsOverlay: React.FC = () => {
  const { activeScenario, bondAnalysis, selectedElements } = useSimulationStore();

  if (!activeScenario && selectedElements.length === 0) {
    return null;
  }

  const deltaEN = bondAnalysis ? bondAnalysis.deltaEN : activeScenario ? activeScenario.deltaEN : null;
  const bondType = bondAnalysis ? bondAnalysis.bondType : activeScenario ? activeScenario.bondType : 'no-bond';

  let bondTypeLabel = 'Belirsiz';
  let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';

  if (bondType === 'ionic') {
    bondTypeLabel = 'İyonik Bağ (ΔEN > 1.7)';
    badgeColor = 'bg-sky-950/80 text-chem-ionic border-sky-600/60';
  } else if (bondType === 'polar-covalent') {
    bondTypeLabel = 'Polar Kovalent (0.4 < ΔEN ≤ 1.7)';
    badgeColor = 'bg-amber-950/80 text-chem-polar border-amber-600/60';
  } else if (bondType === 'nonpolar-covalent') {
    bondTypeLabel = 'Apolar Kovalent (ΔEN ≤ 0.4)';
    badgeColor = 'bg-emerald-950/80 text-chem-covalent border-emerald-600/60';
  } else if (bondType === 'inert' || bondType === 'no-bond') {
    bondTypeLabel = 'Asal / Tepkime Yok (no-bond)';
    badgeColor = 'bg-rose-950/80 text-chem-repulsion border-rose-600/60';
  }

  return (
    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-10 select-none">
      {/* Reaction Formula Badge */}
      <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded shadow-sm">
        <Zap className="w-4 h-4 text-chem-electron" />
        <span className="font-mono font-bold text-sm text-slate-50">
          {activeScenario ? activeScenario.formula : selectedElements.map(e => e.symbol).join(' + ')}
        </span>
      </div>

      {/* Center: Electronegativity Difference Badge */}
      <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded shadow-sm font-mono text-xs">
        <Activity className="w-3.5 h-3.5 text-chem-transition" />
        <span className="text-slate-400">ΔEN =</span>
        <span className="font-bold text-chem-alkaline">
          {deltaEN !== null ? deltaEN.toFixed(2) : 'n/a'}
        </span>
      </div>

      {/* Right: Bond Classification Badge */}
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded border font-mono text-xs font-semibold ${badgeColor}`}>
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>{bondTypeLabel}</span>
      </div>
    </div>
  );
};
