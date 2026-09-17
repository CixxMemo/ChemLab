import React, { useEffect } from 'react';
import { resolveSharedExperiment } from '../../data/sharedExperiment';
import { BOND_CHOICES } from '../learning/PredictionStep';
import { BUTTON, PANEL } from '../learning/lessonStyles';
import { AppLayout } from '../layout/AppLayout';
import { AppLink } from '../navigation/AppLink';
import { getTaskPath } from '../../navigation/routes';
import { useChemistryStore } from '../../store/useChemistryStore';
import { useSharedExperimentSessionStore } from '../../store/useSharedExperimentSessionStore';
import { useUIStore } from '../../store/useUIStore';
import { NotFoundPage } from './NotFoundPage';

interface SharedExperimentPageProps { scenarioId: string; taskId: string | null }

export const SharedExperimentPage: React.FC<SharedExperimentPageProps> = ({ scenarioId, taskId }) => {
  const scenarios = useChemistryStore(state => state.scenarios);
  const loadScenario = useChemistryStore(state => state.loadScenarioById);
  const setPlaybackStatus = useChemistryStore(state => state.setPlaybackStatus);
  const analysis = useChemistryStore(state => state.bondAnalysis);
  const closeModal = useUIStore(state => state.closeAnimationModal);
  const session = useSharedExperimentSessionStore();
  const shared = resolveSharedExperiment(scenarios, scenarioId, taskId);
  const valid = shared !== null;
  const scopeKey = `${scenarioId}:${taskId ?? ''}`;
  const current = session.scopeKey === scopeKey;

  useEffect(() => {
    if (!valid) return;
    session.begin(scopeKey);
    loadScenario(scenarioId, { autoplay: false });
    closeModal();
    return () => closeModal();
  }, [valid, scopeKey, scenarioId, session.begin, loadScenario, closeModal]);

  if (!shared) return <NotFoundPage reason="experiment" />;
  const { scenario, task } = shared;
  const reveal = () => {
    if (!current || !session.choice) return;
    session.reveal();
    setPlaybackStatus('playing');
  };

  if (current && session.revealed) return <div className="flex h-full min-h-0 flex-col">
    <div className="shrink-0 border-b border-slate-700 bg-slate-900 px-5 py-3 text-sm text-slate-50" role="status">
      Tahminin: {BOND_CHOICES.find(option => option.value === session.choice)?.label}. Motor sonucu: {BOND_CHOICES.find(option => option.value === analysis?.bondType)?.label ?? 'Bağ oluşmaz'}.
      {task && <AppLink to={getTaskPath(task.id)} className="touch-target ml-3 inline-flex items-center text-chem-transition">İlgili göreve geç →</AppLink>}
    </div>
    <AppLayout guided />
  </div>;

  return <div className="h-full overflow-y-auto bg-slate-950 px-5 py-8 text-slate-50">
    <div className="mx-auto max-w-3xl">
      <p className="font-mono text-xs text-chem-transition">Paylaşılan rehberli deney</p>
      <h1 id="route-heading" tabIndex={-1} className="mt-2 text-3xl font-semibold outline-none">{scenario.reactantKeys.join(' + ')} · önce tahmin et</h1>
      <p className="mt-3 text-slate-300">Öğretmenin paylaştığı atom çifti hazır. Sonuç, tahminini onaylayana kadar gizlidir.</p>
      {task && <p className="mt-3 text-sm text-slate-300">İlişkili görev: {task.title}</p>}
      <section className={`${PANEL} mt-6`} aria-label="Bağ türü tahmini">
        <fieldset className="grid gap-2 sm:grid-cols-2"><legend className="mb-3 font-semibold">Bu iki atom için hangi bağ sonucunu beklersin?</legend>
          {BOND_CHOICES.map(option => <label key={option.value} className="touch-target flex items-center gap-3 rounded border border-slate-700 bg-slate-950 px-4 py-3 has-[:checked]:border-chem-transition">
            <input type="radio" name="shared-prediction" checked={current && session.choice === option.value} onChange={() => session.choose(option.value)} className="accent-sky-400" />{option.label}
          </label>)}
        </fieldset>
        <button type="button" disabled={!current || !session.choice} onClick={reveal} className={`${BUTTON} mt-5 disabled:opacity-50`}>Tahmini onayla ve deneyi aç</button>
      </section>
    </div>
  </div>;
};
