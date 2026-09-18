import { useId, useRef } from 'react';
import { useStore } from 'zustand';
import { ArrowUpRight, FlaskConical, Pause, Play, RotateCcw } from 'lucide-react';
import { landingExperiments, LANDING_BOND_LABELS, LandingExperiment, previewElements } from '../../data/landingExperiments';
import { createLandingPreviewStore, PREVIEW_END, PREVIEW_PERCENT, PREVIEW_SEEK_STEP, PREVIEW_SPEED, PREVIEW_START } from '../../store/createLandingPreviewStore';
import { useCanvasRenderer } from '../../lib/canvas/useCanvasRenderer';
import { CanvasBohrEngine } from '../../lib/canvas/CanvasBohrEngine';
import { FittedRenderEngine } from '../../lib/canvas/FittedRenderEngine';
import { IRenderEngine } from '../../lib/canvas/IRenderEngine';
import { AppLink } from '../navigation/AppLink';
import { getLaboratoryPath } from '../../navigation/routes';

const CONTROL_CLASS = 'touch-target inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-slate-700 px-3 text-sm font-medium text-slate-200 transition-colors hover:border-slate-400 hover:bg-slate-800';

function InteractivePreview({ initialExperiment }: { initialExperiment: LandingExperiment }) {
  const storeRef = useRef<ReturnType<typeof createLandingPreviewStore> | null>(null);
  if (!storeRef.current) storeRef.current = createLandingPreviewStore(initialExperiment.scenarioId);
  const state = useStore(storeRef.current);
  // This is a presentation lookup, never a chemistry classification.
  const experiment = landingExperiments.find(item => item.scenarioId === state.selectedScenarioId) ?? initialExperiment;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<IRenderEngine | null>(null);
  if (!engineRef.current) engineRef.current = new FittedRenderEngine(new CanvasBohrEngine());
  const timelineId = useId();
  const descriptionId = useId();

  useCanvasRenderer({
    canvasRef, containerRef, engine: engineRef.current,
    scenario: experiment.scenario, bondAnalysis: experiment.analysis,
    elements: previewElements, selectedElements: experiment.atoms,
    progress: state.progress, playbackStatus: state.playbackStatus, playbackSpeed: PREVIEW_SPEED,
    setProgress: state.setProgress, setPlaybackStatus: state.setPlaybackStatus
  });

  const playing = state.playbackStatus === 'playing';
  const playLabel = playing ? 'Duraklat' : state.playbackStatus === 'completed' ? 'Yeniden oynat' : 'Deneyi oynat';

  return (
    <section aria-label="Etkileşimli deney önizlemesi" className="min-w-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
      <div className="flex items-center justify-between gap-3 border-b border-slate-700 px-5 py-4">
        <span className="flex items-center gap-2 text-sm font-semibold"><FlaskConical className="h-4 w-4 text-chem-transition" aria-hidden="true" /> Küçük bir deneyle başla</span>
        <span className="hidden font-mono text-xs text-slate-400 sm:inline">ETKİLEŞİMLİ ÖNİZLEME</span>
      </div>
      <div className="px-5 pt-4">
        <div role="group" aria-label="Önizlenecek deneyi seç" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {landingExperiments.map(item => (
            <button key={item.scenarioId} type="button" aria-pressed={item.scenarioId === experiment.scenarioId}
              onClick={() => state.selectScenario(item.scenarioId)}
              className={`touch-target rounded-md border px-2 font-mono text-sm font-semibold transition-colors ${item.scenarioId === experiment.scenarioId ? 'border-chem-transition bg-slate-800 text-slate-50' : 'border-slate-700 text-slate-400 hover:border-slate-400 hover:text-slate-50'}`}>
              {item.label}
            </button>
          ))}
        </div>
        <h2 className="mt-5 text-lg font-semibold leading-snug">{experiment.question}</h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">Oynat veya zaman çizgisini kaydır; elektronları takip et.</p>
      </div>
      <div className="mx-3 my-4 overflow-hidden rounded-lg border border-slate-700">
        <div ref={containerRef} className="simulation-surface h-56 w-full sm:h-64">
          <canvas ref={canvasRef} className="block h-full w-full" role="img"
            aria-label={`${experiment.label} deneyinin şematik atom modeli`} aria-describedby={descriptionId} />
        </div>
      </div>
      <div className="px-5 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={state.togglePlayback} className={`${CONTROL_CLASS} border-chem-transition bg-slate-800`}>
            {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}{playLabel}
          </button>
          <button type="button" onClick={state.restart} className={CONTROL_CLASS} aria-label="Önizlemeyi başa al" title="Başa al"><RotateCcw className="h-4 w-4" aria-hidden="true" /></button>
          <label htmlFor={timelineId} className="sr-only">Deneyin ilerlemesi</label>
          <input id={timelineId} type="range" min={PREVIEW_START} max={PREVIEW_END} step={PREVIEW_SEEK_STEP} value={state.progress}
            onChange={event => state.seek(Number(event.target.value))} aria-valuetext={`Yüzde ${Math.round(state.progress * PREVIEW_PERCENT)}`}
            className="touch-target min-w-0 flex-1 cursor-pointer appearance-none" />
        </div>
        <div id={descriptionId} className="mt-4 border-t border-slate-700 pt-4" aria-live="polite" aria-atomic="true">
          <span className="font-mono text-xs font-semibold text-chem-nonmetal">{LANDING_BOND_LABELS[experiment.analysis.bondType]}</span>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{experiment.takeaway}</p>
        </div>
        <AppLink to={getLaboratoryPath('free', experiment.scenarioId)} className="touch-target mt-3 inline-flex items-center gap-2 text-sm font-semibold text-chem-transition hover:text-slate-50">
          Bu deneyi laboratuvarda aç <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </AppLink>
      </div>
    </section>
  );
}

export function ExperimentPreview() {
  const [initialExperiment] = landingExperiments;
  return initialExperiment ? <InteractivePreview initialExperiment={initialExperiment} /> : null;
}
