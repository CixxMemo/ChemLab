import React, { useEffect } from 'react';
import { LearningTopic, getLearningTopic, learningTopics } from '../../data/learningTopics';
import { getModePath, getTopicPath } from '../../navigation/routes';
import { useChemistryStore } from '../../store/useChemistryStore';
import { useLessonSessionStore } from '../../store/useLessonSessionStore';
import { useUIStore } from '../../store/useUIStore';
import { ObservationStep } from '../learning/ObservationStep';
import { PredictionStep } from '../learning/PredictionStep';
import { QuestionsStep } from '../learning/QuestionsStep';
import { TopicOverview } from '../learning/TopicOverview';
import { BUTTON } from '../learning/lessonStyles';
import { AppLink } from '../navigation/AppLink';
import { NotFoundPage } from './NotFoundPage';

interface LessonPageProps {
  mode: 'student' | 'teacher';
  topicId: string;
}

const NEXT_TOPIC_OFFSET = 1; // The next entry in the ordered teaching sequence.

function getNextTopic(topic: LearningTopic): LearningTopic | undefined {
  const index = learningTopics.findIndex(item => item.id === topic.id);
  return learningTopics[index + NEXT_TOPIC_OFFSET];
}

export const LessonPage: React.FC<LessonPageProps> = ({ mode, topicId }) => {
  const topic = getLearningTopic(topicId);
  const scenarios = useChemistryStore(state => state.scenarios);
  const loadScenario = useChemistryStore(state => state.loadScenarioById);
  const begin = useLessonSessionStore(state => state.begin);
  const closeModal = useUIStore(state => state.closeAnimationModal);
  const session = useLessonSessionStore();
  const valid = topic !== undefined && topic.experimentIds.every(id => scenarios.some(scenario => scenario.id === id));

  useEffect(() => {
    if (!valid || !topic) return;
    begin(topic.id);
    loadScenario(topic.experimentIds[0], { autoplay: false });
    closeModal();
    return () => closeModal();
  }, [valid, topic, mode, begin, loadScenario, closeModal]);

  if (!valid || !topic) return <NotFoundPage reason="content" />;
  const stage = session.topicId === topic.id ? session.stage : 'predict';
  const nextTopic = stage === 'complete' ? getNextTopic(topic) : undefined;
  if (stage === 'observe') return <ObservationStep topic={topic} prediction={session.prediction} />;

  return <div className="h-full overflow-y-auto bg-slate-950 text-slate-50">
    <div className="mx-auto max-w-5xl px-5 py-8 md:px-10">
      <AppLink to={getModePath(mode)} className="touch-target inline-flex items-center text-sm text-chem-transition">← Konulara dön</AppLink>
      <p className="mt-5 font-mono text-xs text-chem-transition">{mode === 'teacher' ? 'Hazır ders içeriği' : 'Öğrenci konusu'}</p>
      <h1 id="route-heading" tabIndex={-1} className="mt-2 text-3xl font-semibold outline-none">{topic.title}</h1>
      {stage === 'predict' && <div className="mt-6 grid gap-5"><TopicOverview topic={topic} mode={mode} /><PredictionStep topic={topic} /></div>}
      {(stage === 'check' || stage === 'complete') && <QuestionsStep topic={topic} mode={mode} completed={stage === 'complete'} />}
      {nextTopic && <AppLink to={getTopicPath(mode, nextTopic.id)} className={`${BUTTON} mt-4`}>Sonraki konu: {nextTopic.title}</AppLink>}
    </div>
  </div>;
};
