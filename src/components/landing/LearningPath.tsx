import { ArrowRight, Check, Compass } from 'lucide-react';
import { learningTopics } from '../../data/learningTopics';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import { getTaskListPath, getTopicPath } from '../../navigation/routes';
import { AppLink } from '../navigation/AppLink';
import { EYEBROW, FIRST_ORDINAL, LEARNING_PATH_ID, ORDINAL_DIGITS, PROGRAMMATIC_FOCUS } from './landingStyles';

const NO_COMPLETED_TOPICS = 0; // The first visit shows a starting point instead of a resume prompt.

export function LearningPath() {
  const completedTopicIds = useLearningProgressStore(state => state.completedTopicIds);
  const completedTopics = learningTopics.filter(topic => completedTopicIds.includes(topic.id));
  const nextTopic = learningTopics.find(topic => !completedTopicIds.includes(topic.id));
  const [firstTopic] = learningTopics;
  const suggestedTopic = nextTopic ?? firstTopic;
  const started = completedTopics.length > NO_COMPLETED_TOPICS;
  const suggestionLabel = !nextTopic ? 'Öğrenme yolunu tamamladın'
    : started ? 'Öğrenmeye devam et' : 'İlk kez buradaysan buradan başla';

  return (
    <section id={LEARNING_PATH_ID} tabIndex={PROGRAMMATIC_FOCUS} aria-labelledby="learning-path-heading" className="outline-none">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className={EYEBROW}>ÖĞRENME YOLUN</p>
          <h2 id="learning-path-heading" className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Küçük adımlar. Birbirine bağlanan bilgiler.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
            İlk atomdan bağları karşılaştırmaya kadar ilerle. Her konuda tahmin et, deneyi gözlemle ve açıklamalı soruları yanıtla.
          </p>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-xs text-slate-300">
          {completedTopics.length} / {learningTopics.length} konu tamamlandı
        </span>
      </div>
      {suggestedTopic && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-700 bg-slate-900 px-5 py-4">
          <div className="flex items-center gap-3">
            <Compass className="h-5 w-5 shrink-0 text-chem-nonmetal" aria-hidden="true" />
            <div>
              <p className="text-xs text-slate-400">{suggestionLabel}</p>
              <p className="mt-1 text-sm font-semibold">
                {nextTopic ? suggestedTopic.title : 'Konuları tekrar et veya görevlerle bilgini sına.'}
              </p>
            </div>
          </div>
          <AppLink to={getTopicPath('student', suggestedTopic.id)} className="touch-target inline-flex items-center gap-2 text-sm font-semibold text-chem-nonmetal hover:text-slate-50">
            {nextTopic ? 'Konuyu aç' : 'Tekrar et'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </AppLink>
        </div>
      )}
      <ol className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {learningTopics.map((topic, index) => {
          const complete = completedTopicIds.includes(topic.id);
          return (
            <li key={topic.id}>
              <AppLink to={getTopicPath('student', topic.id)} className="touch-target group flex h-full flex-col rounded-lg border border-slate-700 bg-slate-900 p-5 transition-colors hover:border-chem-transition hover:bg-slate-800">
                <span className="flex items-center justify-between">
                  <span className="font-mono text-sm text-chem-transition">
                    {String(index + FIRST_ORDINAL).padStart(ORDINAL_DIGITS, '0')}
                  </span>
                  {complete ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-chem-nonmetal">
                      <Check className="h-4 w-4" aria-hidden="true" /> Tamamlandı
                    </span>
                  ) : <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-chem-transition" aria-hidden="true" />}
                </span>
                <h3 className="mt-4 font-semibold text-slate-100">{topic.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{topic.objective}</p>
                <span className="mt-auto pt-5 text-xs text-slate-400">Tahmin · Deney · {topic.questions.length} soru</span>
              </AppLink>
            </li>
          );
        })}
      </ol>
      <AppLink to={getTaskListPath()} className="touch-target mt-4 inline-flex items-center gap-2 text-sm font-medium text-chem-transition hover:text-slate-50">
        Öğrendiklerini uygulamaya hazır mısın? Rehberli görevlere geç
        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
      </AppLink>
    </section>
  );
}
