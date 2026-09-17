import React, { useEffect } from 'react';
import { Presentation, Maximize, Eye, RotateCcw } from 'lucide-react';
import { REVEAL_FIELDS } from '../../presentation/revealPolicy';
import { useChemistryStore } from '../../store/useChemistryStore';
import { useTeacherPresentationStore } from '../../store/useTeacherPresentationStore';
import { useUIStore } from '../../store/useUIStore';

const FIELD_LABELS = ['Bağ türü', 'Ürün formülü', 'ΔEN', 'Oktet/dublet', 'Açıklama'] as const;
const CONTROL_CLASS = 'touch-target inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs font-medium text-slate-50 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2';

function handlePresentationKey(event: KeyboardEvent): void {
  const target = event.target;
  if (target instanceof HTMLElement && target.closest('button, input, select, textarea, a')) return;
  const chemistry = useChemistryStore.getState();
  if (event.key === 'ArrowLeft') chemistry.stepBackward();
  if (event.key === 'ArrowRight') chemistry.stepForward();
  if (event.key === 'Home') {
    chemistry.setProgress(0);
    chemistry.setPlaybackStatus('paused');
  }
  if (['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) event.preventDefault();
}

export const TeacherPresentationControls: React.FC<{ scopeKey: string; enableShortcuts?: boolean }> = ({ scopeKey, enableShortcuts = true }) => {
  const scope = useTeacherPresentationStore(state => state.scopeKey);
  const storedLevel = useTeacherPresentationStore(state => state.revealLevel);
  const showPrediction = useTeacherPresentationStore(state => state.showPrediction);
  const revealNext = useTeacherPresentationStore(state => state.revealNext);
  const showAll = useTeacherPresentationStore(state => state.showAll);
  const toggleFullscreen = useUIStore(state => state.toggleFullscreen);
  const level = scope === scopeKey ? storedLevel : 0;

  useEffect(() => {
    if (!enableShortcuts) return;
    window.addEventListener('keydown', handlePresentationKey);
    return () => window.removeEventListener('keydown', handlePresentationKey);
  }, [enableShortcuts]);

  return <section aria-label="Öğretmen sunum kontrolleri" className="shrink-0 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2">
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 inline-flex items-center gap-2 text-xs font-semibold text-slate-300"><Presentation className="h-4 w-4 text-chem-transition" /> Sunum</span>
      <button type="button" onClick={() => showPrediction(scopeKey)} className={CONTROL_CLASS}><RotateCcw className="h-3.5 w-3.5" /> Tahmin görünümü</button>
      <button type="button" onClick={() => revealNext(scopeKey)} disabled={level >= REVEAL_FIELDS.length} className={`${CONTROL_CLASS} disabled:opacity-50`}>
        {level < REVEAL_FIELDS.length ? `Sıradaki: ${FIELD_LABELS[level]}` : 'Tüm aşamalar açık'}
      </button>
      <button type="button" onClick={() => showAll(scopeKey)} className={CONTROL_CLASS}><Eye className="h-3.5 w-3.5" /> Cevapları göster</button>
      <button type="button" onClick={toggleFullscreen} className={CONTROL_CLASS}><Maximize className="h-3.5 w-3.5" /> Tam ekran</button>
      <span className="ml-auto rounded-md bg-slate-950 px-2 py-1 font-mono text-xs text-slate-400" role="status">{level}/{REVEAL_FIELDS.length} alan açık</span>
    </div>
    <p className="sr-only">←/→ adım · Home başa dön · oynatma için aşağıdaki düğmeler. Azaltılmış hareket tercihi desteklenir.</p>
  </section>;
};
