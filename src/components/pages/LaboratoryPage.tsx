import React, { useEffect } from 'react';
import { AppLayout } from '../layout/AppLayout';
import { NotFoundPage } from './NotFoundPage';
import { useChemistryStore } from '../../store/useChemistryStore';
import { useUIStore } from '../../store/useUIStore';
import { ExperienceMode } from '../../navigation/routes';
import { useTeacherPresentationStore } from '../../store/useTeacherPresentationStore';

interface LaboratoryPageProps {
  mode: ExperienceMode;
  scenarioId: string | null;
}

const DEFAULT_SCENARIO_ID = 'nacl'; // Preserve the existing NaCl first-open demonstration.

const MODE_GUIDANCE = {
  student: 'Öğrenci laboratuvarı: atomları seç, sonucu incele ve farklı çiftleri karşılaştır.',
  teacher: 'Öğretmen laboratuvarı: oynatmayı durdurup adımlarla ilerleyerek sınıfa göster.'
} as const;

export const LaboratoryPage: React.FC<LaboratoryPageProps> = ({ mode, scenarioId }) => {
  const scenarios = useChemistryStore(state => state.scenarios);
  const loadScenarioById = useChemistryStore(state => state.loadScenarioById);
  const closeAnimationModal = useUIStore(state => state.closeAnimationModal);
  const beginPresentation = useTeacherPresentationStore(state => state.begin);
  const exists = scenarioId === null || scenarios.some(scenario => scenario.id === scenarioId);

  useEffect(() => () => closeAnimationModal(), [closeAnimationModal]);

  useEffect(() => {
    if (!exists) return;
    const chosenId = scenarioId ?? DEFAULT_SCENARIO_ID;
    if (mode === 'teacher') beginPresentation(`lab:${chosenId}`);
    loadScenarioById(chosenId, { autoplay: mode !== 'teacher' });
  }, [exists, scenarioId, mode, beginPresentation, loadScenarioById]);

  if (!exists) return <NotFoundPage reason="experiment" />;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {mode !== 'free' ? <p className="shrink-0 border-b border-slate-700 bg-slate-950 px-4 py-2 text-xs text-slate-300" role="status">{MODE_GUIDANCE[mode]}</p> : null}
      <AppLayout guided={mode === 'teacher'} presentationKey={mode === 'teacher' ? `lab:${scenarioId ?? DEFAULT_SCENARIO_ID}` : undefined} presentationScenarioId={mode === 'teacher' ? scenarioId ?? DEFAULT_SCENARIO_ID : undefined} />
    </div>
  );
};
