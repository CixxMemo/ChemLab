import React from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { Activity, ShieldCheck, Zap, Maximize2 } from 'lucide-react';

export const BondMetricsOverlay: React.FC = () => {
  const { activeScenario, bondAnalysis, selectedElements, openAnimationModal } = useSimulationStore();

  const isSingleElement = selectedElements.length === 1 && !activeScenario;
  const singleElement = isSingleElement ? selectedElements[0] : null;

  const deltaEN = bondAnalysis ? bondAnalysis.deltaEN : activeScenario ? activeScenario.deltaEN : null;
  const bondType = bondAnalysis ? bondAnalysis.bondType : activeScenario ? activeScenario.bondType : 'no-bond';

  let bondTypeLabel = 'Belirsiz';
  let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';

  if (isSingleElement && singleElement) {
    if (singleElement.category === 'noble') {
      bondTypeLabel = 'Soygaz (Kararlı Yapı)';
      badgeColor = 'bg-purple-950/80 text-chem-halogen border-purple-600/60';
    } else {
      bondTypeLabel = `Valans: ${singleElement.valanceElectrons ?? '-'} e⁻ • 2. Element Seçin`;
      badgeColor = 'bg-slate-800/90 text-chem-alkaline border-slate-700';
    }
  } else if (bondType === 'ionic') {
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
      {/* Left: Reaction Formula Badge / Single Element */}
      {activeScenario || selectedElements.length > 0 ? (
        <>
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded shadow-sm">
            <Zap className="w-4 h-4 text-chem-electron" />
            <span className="font-mono font-bold text-sm text-slate-50">
              {activeScenario
                ? activeScenario.formula
                : selectedElements.length === 1
                ? `${selectedElements[0].symbol} (${selectedElements[0].nameTR}) • Z=${selectedElements[0].atomicNumber}`
                : selectedElements.map(e => e.symbol).join(' + ')}
            </span>
          </div>

          {/* Center: Electronegativity Difference Badge or Position Info */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded shadow-sm font-mono text-xs">
            <Activity className="w-3.5 h-3.5 text-chem-transition" />
            {isSingleElement && singleElement ? (
              <>
                <span className="text-slate-400">Konum:</span>
                <span className="font-bold text-slate-200">
                  Grup {singleElement.group}, Periyot {singleElement.period}
                </span>
              </>
            ) : (
              <>
                <span className="text-slate-400">ΔEN =</span>
                <span className="font-bold text-chem-alkaline">
                  {deltaEN !== null ? deltaEN.toFixed(2) : 'n/a'}
                </span>
              </>
            )}
          </div>

          {/* Right: Bond Classification Badge & Maximize Button */}
          <div className="flex items-center gap-1.5">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded border font-mono text-xs font-semibold ${badgeColor}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{bondTypeLabel}</span>
            </div>

            <button
              onClick={openAnimationModal}
              className="pointer-events-auto w-8 h-8 rounded bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-slate-50 hover:bg-slate-800 flex items-center justify-center transition-colors touch-target shadow-sm"
              title="Büyük Ekran Modalı (Tam Ekran Görünümü)"
            >
              <Maximize2 className="w-4 h-4 text-chem-transition" />
            </button>
          </div>
        </>
      ) : (
        <div className="ml-auto">
          <button
            onClick={openAnimationModal}
            className="pointer-events-auto w-8 h-8 rounded bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-slate-50 hover:bg-slate-800 flex items-center justify-center transition-colors touch-target shadow-sm"
            title="Büyük Ekran Modalı (Tam Ekran Görünümü)"
          >
            <Maximize2 className="w-4 h-4 text-chem-transition" />
          </button>
        </div>
      )}
    </div>
  );
};
