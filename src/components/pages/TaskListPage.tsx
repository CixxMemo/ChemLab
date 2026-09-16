import React from 'react';
import { learningTasks } from '../../data/learningTasks';
import { learningTopics } from '../../data/learningTopics';
import { getModePath, getTaskPath } from '../../navigation/routes';
import { useLearningProgressStore } from '../../store/useLearningProgressStore';
import { AppLink } from '../navigation/AppLink';

const TASK_ORDINAL_WIDTH = 2; // Keep task numbers aligned from 01 through 10.

export const TaskListPage: React.FC = () => {
  const completedTaskIds = useLearningProgressStore(state => state.completedTaskIds);
  const completedTopicIds = useLearningProgressStore(state => state.completedTopicIds);
  const clearProgress = useLearningProgressStore(state => state.clearProgress);

  const confirmClear = () => {
    if (window.confirm('Bu tarayıcıdaki tamamlanan konu, görev ve soru sonuçları silinsin mi?')) clearProgress();
  };

  return <div className="h-full overflow-y-auto bg-slate-950 text-slate-50">
    <div className="mx-auto max-w-5xl px-5 py-8 md:px-10">
      <AppLink to={getModePath('student')} className="touch-target inline-flex items-center text-sm text-chem-transition">← Öğrenci moduna dön</AppLink>
      <p className="mt-5 font-mono text-xs text-chem-transition">Öğrenci görevleri</p>
      <h1 id="route-heading" tabIndex={-1} className="mt-2 text-3xl font-semibold outline-none">10 rehberli görev</h1>
      <p className="mt-3 text-slate-300">Bir yanıt seç, açıklamayı gör ve gerekirse yeniden dene. Görevler doğrulanmış deneylere dayanır.</p>
      <section aria-label="Bu cihazdaki ilerleme" className="mt-6 rounded border border-slate-700 bg-slate-900 p-5">
        <p className="font-semibold">Bu cihazdaki ilerleme: {completedTaskIds.length}/{learningTasks.length} görev · {completedTopicIds.length}/{learningTopics.length} konu</p>
        <p className="mt-1 text-sm text-slate-400">Kayıt yalnızca bu tarayıcıda tutulur; hesap veya cihazlar arası eşitleme yoktur.</p>
        <button type="button" onClick={confirmClear} className="touch-target mt-3 rounded border border-slate-700 px-3 text-sm text-slate-300 hover:bg-slate-800">İlerlemeyi temizle</button>
      </section>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {learningTasks.map((task, index) => <AppLink key={task.id} to={getTaskPath(task.id)} className="touch-target rounded border border-slate-700 bg-slate-900 p-5 hover:border-chem-transition">
          <span className="font-mono text-xs text-chem-transition">{String(index + 1).padStart(TASK_ORDINAL_WIDTH, '0')}</span>
          <span className="ml-3 font-semibold">{task.title}</span>
          <span className="mt-1 block text-sm text-slate-400">{task.prompt}</span>
          {completedTaskIds.includes(task.id) && <span className="mt-2 block text-sm text-chem-nonmetal">Tamamlandı ✓</span>}
        </AppLink>)}
      </div>
    </div>
  </div>;
};
