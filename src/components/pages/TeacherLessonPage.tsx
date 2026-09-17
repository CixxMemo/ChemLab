import React, { useEffect } from 'react';
import { getLearningTopic } from '../../data/learningTopics';
import { getTeacherFlow } from '../../data/teacherFlows';
import { getRevealPolicy } from '../../presentation/revealPolicy';
import { useChemistryStore } from '../../store/useChemistryStore';
import { useTeacherPresentationStore } from '../../store/useTeacherPresentationStore';
import { useUIStore } from '../../store/useUIStore';
import { AppLayout } from '../layout/AppLayout';
import { TeacherLessonGuide } from '../teacher/TeacherLessonGuide';
import { NotFoundPage } from './NotFoundPage';

export const TeacherLessonPage: React.FC<{ topicId: string }> = ({ topicId }) => {
  const topic = getLearningTopic(topicId);
  const flow = getTeacherFlow(topicId);
  const scenarios = useChemistryStore(state => state.scenarios);
  const loadScenario = useChemistryStore(state => state.loadScenarioById);
  const closeModal = useUIStore(state => state.closeAnimationModal);
  const begin = useTeacherPresentationStore(state => state.begin);
  const scope = useTeacherPresentationStore(state => state.scopeKey);
  const level = useTeacherPresentationStore(state => state.revealLevel);
  const scenario = scenarios.find(item => item.id === topic?.experimentIds[0]);
  const scopeKey = `lesson:${topicId}`;

  useEffect(() => {
    if (!topic || !flow || !scenario) return;
    begin(scopeKey);
    loadScenario(scenario.id, { autoplay: false });
    closeModal();
    return () => closeModal();
  }, [topic, flow, scenario, scopeKey, begin, loadScenario, closeModal]);

  if (!topic || !flow || !scenario) return <NotFoundPage reason="content" />;
  const reveal = getRevealPolicy(scope === scopeKey ? level : 0);

  return <div className="flex h-full min-h-0 flex-col bg-slate-950 text-slate-50">
    <TeacherLessonGuide topic={topic} flow={flow} scenario={scenario} reveal={reveal} />
    <div className="min-h-0 flex-1"><AppLayout guided presentationKey={scopeKey} presentationScenarioId={scenario.id} /></div>
  </div>;
};
