import React from 'react';
import { LearningTopic } from '../../data/learningTopics';
import { useChemistryStore } from '../../store/useChemistryStore';
import { useLessonSessionStore } from '../../store/useLessonSessionStore';
import { BondType } from '../../types/chemistry';
import { AppLayout } from '../layout/AppLayout';
import { BOND_CHOICES } from './PredictionStep';
import { BUTTON } from './lessonStyles';

const bondLabel = (type: BondType): string =>
  BOND_CHOICES.find(choice => choice.value === type)?.label ?? 'Bağ oluşmaz';

export const ObservationStep: React.FC<{ topic: LearningTopic; prediction: BondType | null }> = ({ topic, prediction }) => {
  const analysis = useChemistryStore(state => state.bondAnalysis);
  const startQuestions = useLessonSessionStore(state => state.startQuestions);
  if (!analysis || !prediction) return null;

  return <div className="flex h-full min-h-0 flex-col">
    <div className="shrink-0 border-b border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100" role="status">
      <strong>{prediction === analysis.bondType ? 'Tahminin doğru.' : 'Tahminini sonuçla karşılaştır.'}</strong>{' '}
      Sen: {bondLabel(prediction)} · Motor sonucu: {bondLabel(analysis.bondType)}.
      <span className="ml-2">{analysis.explanationTR}</span>
      <span className="ml-2">Sık karıştırılan: {topic.misconception}</span>
      {topic.examNote && <span className="ml-2">Çalışma notu: {topic.examNote}</span>}
      <button type="button" onClick={startQuestions} className={`${BUTTON} ml-3 mt-2 text-xs sm:mt-0`}>{topic.questions.length} soruya geç</button>
    </div>
    <AppLayout guided />
    <span className="sr-only">{topic.title} deneyi: oynatma denetimleriyle adım adım gözlemle.</span>
  </div>;
};
