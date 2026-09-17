import React from 'react';
import { learningTasks } from '../../data/learningTasks';
import { getSharedExperimentPath } from '../../navigation/routes';
import { useTeacherShareStore } from '../../store/useTeacherShareStore';

export const TeacherShareControls: React.FC<{ scenarioId: string }> = ({ scenarioId }) => {
  const taskId = useTeacherShareStore(state => state.taskId);
  const status = useTeacherShareStore(state => state.status);
  const selectTask = useTeacherShareStore(state => state.selectTask);
  const setStatus = useTeacherShareStore(state => state.setStatus);
  const tasks = learningTasks.filter(task => task.scenarioId === scenarioId);
  const validTaskId = tasks.some(task => task.id === taskId) ? taskId : null;
  const url = `${window.location.origin}${getSharedExperimentPath(scenarioId, validTaskId ?? undefined)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setStatus('Bağlantı kopyalandı. Öğrenci tahmin ekranında başlar.');
    } catch {
      setStatus('Otomatik kopyalama kullanılamadı; bağlantıyı alttaki alandan seçip kopyalayın.');
    }
  };

  return <section aria-label="Öğrenciye deney paylaş" className="shrink-0 bg-slate-900 p-4 text-sm text-slate-50">
    <div className="grid gap-3">
      <span className="font-semibold">Öğrenci bağlantısı</span>
      <label htmlFor="share-task" className="text-slate-300">Görev:</label>
      <select id="share-task" value={validTaskId ?? ''} onChange={event => selectTask(event.target.value || null)} className="touch-target rounded border border-slate-600 bg-slate-950 px-2 text-slate-50">
        <option value="">Yalnız deney</option>
        {tasks.map(task => <option key={task.id} value={task.id}>{task.title}</option>)}
      </select>
      <button type="button" onClick={copyLink} className="touch-target rounded border border-chem-transition bg-slate-800 px-4 font-semibold hover:bg-slate-700">Bağlantıyı kopyala</button>
      <input readOnly aria-label="Paylaşılabilir öğrenci bağlantısı" value={url} onFocus={event => event.target.select()} className="touch-target min-w-0 flex-1 rounded border border-slate-600 bg-slate-950 px-3 text-slate-200" />
    </div>
    <p role="status" className="mt-3 text-xs leading-relaxed text-slate-400">{status || 'Hesap gerekmez. Bağlantı yalnızca doğrulanmış deney ve isteğe bağlı görevi içerir.'}</p>
  </section>;
};
