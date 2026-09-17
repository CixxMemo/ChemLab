import React, { useEffect, useRef } from 'react';
import { CanvasBohrEngine } from '../../lib/canvas/CanvasBohrEngine';
import { useCanvasRenderer } from '../../lib/canvas/useCanvasRenderer';
import { RevealPolicy } from '../../presentation/revealPolicy';
import { useChemistryStore } from '../../store/useChemistryStore';
import { useUIStore } from '../../store/useUIStore';
import { CompoundProductBadge } from '../simulation/CompoundProductBadge';
import { PlaybackControls } from '../simulation/PlaybackControls';
import { TeacherPresentationControls } from './TeacherPresentationControls';
import { TeacherTheoryPanel } from './TeacherTheoryPanel';

export const TeacherSimulationModal: React.FC<{ scopeKey: string; reveal: RevealPolicy }> = ({ scopeKey, reveal }) => {
  const isOpen = useUIStore(state => state.isAnimationModalOpen);
  const close = useUIStore(state => state.closeAnimationModal);
  const selected = useChemistryStore(state => state.selectedElements);
  const analysis = useChemistryStore(state => state.bondAnalysis);
  const scenario = useChemistryStore(state => state.activeScenario);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<CanvasBohrEngine | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  if (!engineRef.current) engineRef.current = new CanvasBohrEngine();
  useCanvasRenderer({ canvasRef, containerRef, engine: engineRef.current, active: isOpen });

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [isOpen, close]);

  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-2 md:p-5">
    <div role="dialog" aria-modal="true" aria-label="Öğretmen büyük ekran deney görünümü" className="flex h-full w-full max-w-7xl flex-col overflow-hidden rounded border border-slate-600 bg-slate-900 text-slate-50">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-700 bg-slate-950 px-4 py-2 text-lg font-semibold">
        <span>{selected.map(element => element.symbol).join(' + ')} · büyük ekran</span>
        <button ref={closeRef} type="button" onClick={close} className="touch-target rounded border border-slate-600 px-4 hover:bg-slate-800" aria-label="Büyük ekranı kapat">Kapat ×</button>
      </div>
      <TeacherPresentationControls scopeKey={scopeKey} enableShortcuts={false} />
      <div ref={containerRef} className="simulation-surface relative min-h-0 flex-1 bg-slate-950">
        <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
        {!reveal.showCanvas && <div className="absolute inset-0 flex items-center justify-center bg-slate-950 p-6 text-center text-2xl font-semibold" role="status">Atom çifti hazır. Tam çözüm açılınca animasyon gösterilecek.</div>}
      </div>
      <CompoundProductBadge reveal={reveal} />
      <PlaybackControls />
      <div className="max-h-44 shrink-0 overflow-y-auto"><TeacherTheoryPanel reveal={reveal} analysis={analysis} scenario={scenario} /></div>
    </div>
  </div>;
};
