import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { useChemistryStore } from '../../store/useChemistryStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { getLaboratoryPath, resolveRoute } from '../../navigation/routes';
import { FlaskConical, Sparkles, Layers } from 'lucide-react';

export const Header: React.FC<{ guided?: boolean }> = ({ guided = false }) => {
  const { viewMode, setViewMode } = useUIStore();
  const pathname = useNavigationStore(state => state.pathname);
  const navigate = useNavigationStore(state => state.navigate);
  const mode = resolveRoute(pathname).mode;
  const {
    scenarios,
    activeScenario,
    loadScenarioById
  } = useChemistryStore();

  const selectScenario = (scenarioId: string) => {
    loadScenarioById(scenarioId);
    navigate(getLaboratoryPath(mode, scenarioId));
  };

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-700 px-4 flex items-center justify-between select-none z-10">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-chem-transition">
          <FlaskConical className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 id="route-heading" tabIndex={-1} className="font-mono font-bold text-base text-slate-50 tracking-wide outline-none">
              ChemLab
            </h1>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              Smartboard v2.0
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
            İnteraktif Periyodik Tablo & Kimyasal Bağ Simülatörü
          </p>
        </div>
      </div>

      {/* Core Scenarios Quick Selector (Strict 5 Scenarios) */}
      {!guided ? <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto bg-slate-950 p-1 rounded border border-slate-700">
        <span className="text-[11px] font-mono text-slate-400 px-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-chem-alkaline" />
          Senaryolar:
        </span>
        {scenarios.map((sc) => {
          const isActive = activeScenario?.id === sc.id;
          return (
            <button
              id={`scenario-btn-${sc.id}`}
              key={sc.id}
              onClick={() => selectScenario(sc.id)}
              className={`h-8 px-2.5 rounded font-mono text-xs font-semibold transition-colors flex items-center justify-center touch-target ${
                isActive
                  ? 'bg-slate-800 text-slate-50 border border-chem-highlight shadow-sm'
                  : 'bg-transparent text-slate-300 hover:bg-slate-900 hover:text-slate-50 border border-transparent'
              }`}
              title={sc.nameTR}
            >
              {sc.formula}
            </button>
          );
        })}
      </div> : <span className="text-sm text-slate-300">Rehberli deney · seçili atom çifti sabit</span>}

      {/* Controls: Electronegativity Heatmap Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode(viewMode === 'standard' ? 'electronegativity' : 'standard')}
          className={`h-9 px-3 rounded border text-xs font-mono font-medium flex items-center gap-1.5 transition-colors touch-target ${
            viewMode === 'electronegativity'
              ? 'bg-slate-800 border-chem-metalloid text-chem-metalloid'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
          title="Elektronegatiflik Isı Haritasını Aç/Kapat"
        >
          <Layers className="w-4 h-4" />
          <span className="hidden md:inline">
            {viewMode === 'electronegativity' ? 'EN Haritası: Açık' : 'EN Haritası'}
          </span>
        </button>
      </div>
    </header>
  );
};
