import React, { useEffect } from 'react';
import { REVEAL_FIELDS } from '../../presentation/revealPolicy';
import { useChemistryStore } from '../../store/useChemistryStore';
import { useTeacherPresentationStore } from '../../store/useTeacherPresentationStore';
import { useUIStore } from '../../store/useUIStore';

const FIELD_LABELS = ['Bağ türü', 'Ürün formülü', 'ΔEN', 'Oktet/dublet', 'Açıklama'] as const;
const CONTROL_CLASS = 'touch-target rounded border border-slate-600 bg-slate-950 px-3 font-semibold text-slate-50 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2';

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

  return <section aria-label="Öğretmen sunum kontrolleri" className="shrink-0 border-b border-slate-600 bg-slate-900 px-4 py-3 text-lg">
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 font-semibold text-slate-50">Öğretmen perdesi</span>
      <button type="button" onClick={() => showPrediction(scopeKey)} className={CONTROL_CLASS}>Tahmin görünümü</button>
      <button type="button" onClick={() => revealNext(scopeKey)} disabled={level >= REVEAL_FIELDS.length} className={`${CONTROL_CLASS} disabled:opacity-50`}>
        {level < REVEAL_FIELDS.length ? `Sıradaki: ${FIELD_LABELS[level]}` : 'Tüm aşamalar açık'}
      </button>
      <button type="button" onClick={() => showAll(scopeKey)} className={CONTROL_CLASS}>Cevapları göster</button>
      <button type="button" onClick={toggleFullscreen} className={CONTROL_CLASS}>Tam ekran</button>
      <span className="ml-auto text-base text-slate-200" role="status">{level}/{REVEAL_FIELDS.length} alan açık</span>
    </div>
    <p className="mt-2 text-base text-slate-200">←/→ adım · Home başa dön · oynatma için aşağıdaki düğmeler. Azaltılmış hareket tercihi desteklenir.</p>
  </section>;
};
