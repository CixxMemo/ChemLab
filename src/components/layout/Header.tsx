import React from 'react';
import { Layers, Share2, ChevronDown, FlaskConical } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useChemistryStore } from '../../store/useChemistryStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { getLaboratoryPath, resolveRoute } from '../../navigation/routes';
import { TeacherShareControls } from '../teacher/TeacherShareControls';

interface HeaderProps {
  guided?: boolean;
  shareScenarioId?: string;
}

export const Header: React.FC<HeaderProps> = ({ guided = false, shareScenarioId }) => {
  const viewMode = useUIStore(state => state.viewMode);
  const setViewMode = useUIStore(state => state.setViewMode);
  const pathname = useNavigationStore(state => state.pathname);
  const navigate = useNavigationStore(state => state.navigate);
  const scenarios = useChemistryStore(state => state.scenarios);
  const activeScenario = useChemistryStore(state => state.activeScenario);
  const loadScenarioById = useChemistryStore(state => state.loadScenarioById);
  const mode = resolveRoute(pathname).mode;

  const selectScenario = (scenarioId: string) => {
    loadScenarioById(scenarioId);
    navigate(getLaboratoryPath(mode, scenarioId));
  };

  return <header className="relative z-20 flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-5">
    <div>
      <h1 id="route-heading" tabIndex={-1} className="text-lg font-semibold tracking-tight text-slate-50 outline-none">
        {guided ? 'Öğretmen laboratuvarı' : 'Keşif laboratuvarı'}
      </h1>
      <p className="mt-0.5 text-xs text-slate-400">
        {guided ? 'Tahmin et, adım adım göster, birlikte keşfet.' : 'Atomları seç, etkileşimlerini keşfet.'}
      </p>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      {!guided && <label className="flex items-center gap-2 text-xs text-slate-400">
        <FlaskConical className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Deney seç</span>
        <select aria-label="Deney seç" value={activeScenario?.id ?? ''} onChange={event => selectScenario(event.target.value)}
          className="touch-target max-w-48 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-50">
          <option value="" disabled>Özel atom çifti</option>
          {scenarios.map(scenario => <option key={scenario.id} value={scenario.id}>{scenario.formula} · {scenario.nameTR}</option>)}
        </select>
      </label>}
      <button type="button" onClick={() => setViewMode(viewMode === 'standard' ? 'electronegativity' : 'standard')}
        aria-pressed={viewMode === 'electronegativity'} title="Elektronegatiflik haritası"
        className={`touch-target flex items-center gap-2 rounded-lg border px-3 text-xs ${viewMode === 'electronegativity' ? 'border-chem-metalloid bg-slate-800 text-slate-50' : 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'}`}>
        <Layers className="h-4 w-4" /> EN haritası
      </button>
      {shareScenarioId && <details className="group">
        <summary className="touch-target flex cursor-pointer list-none items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs text-slate-300 hover:bg-slate-800 [&::-webkit-details-marker]:hidden">
          <Share2 className="h-4 w-4" /> Öğrenciyle paylaş <ChevronDown className="h-3 w-3 group-open:rotate-180" />
        </summary>
        <div className="absolute left-3 right-3 top-full overflow-hidden rounded-xl border border-slate-600 bg-slate-900 sm:left-auto sm:w-[var(--share-panel-width)]">
          <TeacherShareControls scenarioId={shareScenarioId} />
        </div>
      </details>}
    </div>
  </header>;
};
