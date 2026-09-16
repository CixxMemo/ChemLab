import React from 'react';
import { LearningTopic } from '../../data/learningTopics';
import { getLaboratoryPath, getModePath } from '../../navigation/routes';
import { useChemistryStore } from '../../store/useChemistryStore';
import { useLessonSessionStore } from '../../store/useLessonSessionStore';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import { AppLink } from '../navigation/AppLink';
import { MicroQuestionCard } from './MicroQuestionCard';
import { BUTTON, PANEL } from './lessonStyles';

const RelatedExperiments: React.FC<{ topic: LearningTopic; mode: 'student' | 'teacher' }> = ({ topic, mode }) => {
  const scenarios = useChemistryStore(state => state.scenarios);
  return <div className="mt-4">
    <p className="text-sm text-slate-300">İlgili doğrulanmış deneyler:</p>
    <div className="mt-2 flex flex-wrap gap-2">
      {topic.experimentIds.map(id => {
        const scenario = scenarios.find(item => item.id === id);
        return scenario && <AppLink key={id} to={getLaboratoryPath(mode, id)} className="touch-target inline-flex items-center rounded border border-slate-700 px-3 text-sm text-chem-transition hover:bg-slate-800">{scenario.reactantKeys.join(' + ')}</AppLink>;
      })}
    </div>
  </div>;
};

export const QuestionsStep: React.FC<{ topic: LearningTopic; mode: 'student' | 'teacher'; completed: boolean }> = ({ topic, mode, completed }) => {
  const answers = useLessonSessionStore(state => state.answers);
  const complete = useLessonSessionStore(state => state.complete);
  const completeTopic = useLearningProgressStore(state => state.completeTopic);
  const score = topic.questions.filter(question => answers[question.id] === question.correctIndex).length;
  const allAnswered = topic.questions.every(question => answers[question.id] !== undefined);
  const finishTopic = () => {
    if (!allAnswered) return;
    if (mode === 'student') completeTopic(topic.id);
    complete();
  };

  return <section className="mt-6" aria-labelledby="questions-heading">
    <h2 id="questions-heading" className="text-2xl font-semibold">Kısa değerlendirme · {topic.title}</h2>
    <p className="mt-2 text-slate-300">{mode === 'student' ? 'Her yanıtın ardından açıklamayı gör. Soru sonuçların ve tamamlanan konular yalnızca bu tarayıcıda saklanır.' : 'Her yanıtın ardından açıklamayı gör; öğretmen yanıtları ilerleme kaydına eklenmez.'}</p>
    <div className="mt-5 grid gap-4">
      {topic.questions.map((question, index) => <MicroQuestionCard key={question.id} question={question} index={index} saveProgress={mode === 'student'} />)}
    </div>
    {allAnswered && !completed && <button type="button" onClick={finishTopic} className={`${BUTTON} mt-5`}>Konuyu tamamla</button>}
    {completed && <div className={`${PANEL} mt-5`} role="status">
      <p className="font-semibold">Bu oturum tamamlandı · {score}/{topic.questions.length} doğru</p>
      <p className="mt-2 text-sm text-slate-300">Yanlış yanıtlarını açıklamalarla gözden geçir veya başka bir konu aç.</p>
      <AppLink to={getModePath(mode)} className={`${BUTTON} mt-4`}>Konu listesine dön</AppLink>
      <RelatedExperiments topic={topic} mode={mode} />
    </div>}
  </section>;
};
