import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import { learningTasks } from '../../data/learningTasks';
import { getSharedExperimentPath } from '../../navigation/routes';
import { isLoopbackOrigin, parseShareOrigin } from '../../navigation/shareOrigin';
import { useTeacherShareStore } from '../../store/useTeacherShareStore';
import { TeacherShareQrDialog } from './TeacherShareQrDialog';

export const TeacherShareControls: React.FC<{ scenarioId: string }> = ({ scenarioId }) => {
  const [shareOriginInput, setShareOriginInput] = useState(window.location.origin);
  const [isQrOpen, setQrOpen] = useState(false);
  const taskId = useTeacherShareStore(state => state.taskId);
  const status = useTeacherShareStore(state => state.status);
  const selectTask = useTeacherShareStore(state => state.selectTask);
  const setStatus = useTeacherShareStore(state => state.setStatus);
  const tasks = learningTasks.filter(task => task.scenarioId === scenarioId);
  const validTaskId = tasks.some(task => task.id === taskId) ? taskId : null;
  const shareOrigin = parseShareOrigin(shareOriginInput);
  const url = shareOrigin ? `${shareOrigin}${getSharedExperimentPath(scenarioId, validTaskId ?? undefined)}` : '';
  const needsReachableAddress = shareOrigin ? isLoopbackOrigin(shareOrigin) : false;

  const copyLink = async () => {
    if (!url) return;
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
      {isLoopbackOrigin(window.location.origin) && <label className="grid gap-1 text-xs text-slate-300">
        Telefonların erişebildiği adres
        <input type="url" value={shareOriginInput} onChange={event => { setShareOriginInput(event.target.value); setStatus(''); }}
          aria-invalid={!shareOrigin} aria-describedby="share-origin-help"
          className="touch-target min-w-0 rounded border border-slate-600 bg-slate-950 px-3 text-sm text-slate-50" />
        <span id="share-origin-help" className="leading-relaxed text-slate-400">Yerel kullanımda tahtanın ağ adresini girin (ör. http://192.168.1.20:5173).</span>
      </label>}
      {!shareOrigin && <p role="alert" className="text-xs text-chem-alkaline">Yalnızca http:// veya https:// ile başlayan ana adresi girin.</p>}
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={copyLink} disabled={!url}
          className="touch-target rounded border border-chem-transition bg-slate-800 px-2 font-semibold hover:bg-slate-700 disabled:opacity-50">Bağlantıyı kopyala</button>
        <button type="button" onClick={() => setQrOpen(true)} disabled={!url}
          className="touch-target inline-flex items-center justify-center gap-2 rounded border border-slate-600 bg-slate-950 px-2 font-semibold hover:bg-slate-800 disabled:opacity-50">
          <QrCode className="h-4 w-4" /> Karekod oluştur
        </button>
      </div>
      <input readOnly aria-label="Paylaşılabilir öğrenci bağlantısı" value={url} onFocus={event => event.target.select()} className="touch-target min-w-0 flex-1 rounded border border-slate-600 bg-slate-950 px-3 text-slate-200" />
    </div>
    <p role="status" className="mt-3 text-xs leading-relaxed text-slate-400">{status || 'Hesap gerekmez. Bağlantı yalnızca doğrulanmış deney ve isteğe bağlı görevi içerir.'}</p>
    {needsReachableAddress && <p className="mt-2 text-xs leading-relaxed text-chem-alkaline">127.0.0.1/localhost telefonlarda açılmaz. Erişilebilir bir adres girin veya uygulamanın yayımlanmış sürümünü açın.</p>}
    {isQrOpen && url && <TeacherShareQrDialog url={url} onClose={() => setQrOpen(false)} />}
  </section>;
};
