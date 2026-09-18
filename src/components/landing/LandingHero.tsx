import { ArrowRight, ArrowDown, BookOpen, Check, FlaskConical, MousePointer2, ScanEye, Lightbulb } from 'lucide-react';
import { AppLink } from '../navigation/AppLink';
import { getLaboratoryPath, getModePath } from '../../navigation/routes';
import { learningTopics } from '../../data/learningTopics';
import { learningTasks } from '../../data/learningTasks';
import { getAllScenarios } from '../../lib/chemistry/stoichiometry';
import { ExperimentPreview } from './ExperimentPreview';
import { EYEBROW, PRIMARY_LINK, PROGRAMMATIC_FOCUS, SECONDARY_LINK } from './landingStyles';

const CAPABILITIES = [
  { count: learningTopics.length, label: 'rehberli konu', detail: 'Temelden bağ türlerine' },
  { count: getAllScenarios().length, label: 'hazır deney', detail: 'Aktar, paylaş, karşılaştır' },
  { count: learningTasks.length, label: 'uygulamalı görev', detail: 'Öğrendiklerini hemen dene' }
];
const WORKFLOW = [
  { step: '01', Icon: MousePointer2, title: 'Seç ve tahmin et', text: 'Bir atom çifti seç. Sence elektronlar aktarılacak mı, paylaşılacak mı?' },
  { step: '02', Icon: ScanEye, title: 'Durdur ve gözlemle', text: 'Bağın oluşumunu izle. Zaman çizgisinde ilerleyerek kritik anları yakala.' },
  { step: '03', Icon: Lightbulb, title: 'Nedenini açıkla', text: 'Bağ türünü ve kararlılığı incele. Açıklamalı sorularla öğrendiklerini pekiştir.' }
];

export function LandingHero({ onExploreTopics }: { onExploreTopics: () => void }) {
  return (
    <section aria-labelledby="route-heading">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <p className={`${EYEBROW} flex items-center gap-2`}><span className="h-2 w-2 rounded-full bg-chem-nonmetal" aria-hidden="true" /> Etkileşimli kimya laboratuvarı</p>
          <h1 id="route-heading" tabIndex={PROGRAMMATIC_FOCUS} className="mt-6 text-4xl font-semibold leading-tight tracking-tight outline-none sm:text-5xl xl:text-6xl">
            Kimya, atomlar<br />arasında başlar.<br /><span className="text-chem-nonmetal">Keşfederek öğren.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-400 md:text-lg">Bir periyodik tablo, canlı bağ simülasyonları ve adım adım dersler. ChemLab ile görünmeyen elektron hareketlerini gör; kimyasal bağların neden oluştuğunu anla.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <AppLink to={getLaboratoryPath('free')} className={PRIMARY_LINK}><FlaskConical className="h-4 w-4" aria-hidden="true" /> Laboratuvarı keşfet <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
            <AppLink to={getModePath('student')} className={SECONDARY_LINK}><BookOpen className="h-4 w-4" aria-hidden="true" /> Rehberli öğren</AppLink>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-chem-nonmetal" aria-hidden="true" /> Üyelik gerektirmez</span>
            <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-chem-nonmetal" aria-hidden="true" /> Tarayıcıda çalışır</span>
          </div>
          <button type="button" onClick={onExploreTopics} className="touch-target mt-7 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-50">Nereden başlayacağını bul <ArrowDown className="h-4 w-4" aria-hidden="true" /></button>
        </div>
        <ExperimentPreview />
      </div>
      <dl className="mt-10 grid grid-cols-3 gap-3 border-y border-slate-700 py-6 md:mt-12 md:gap-8">
        {CAPABILITIES.map(item => (
          <div key={item.label} className="grid content-center gap-2 text-center sm:grid-cols-[auto_1fr] sm:gap-x-4 sm:gap-y-1 sm:text-left">
            <dt className="row-start-2 text-xs font-semibold text-slate-200 sm:col-start-2 sm:row-start-1 sm:text-sm">{item.label}</dt>
            <dd className="col-start-1 row-start-1 self-center font-mono text-3xl font-medium text-chem-transition sm:row-end-3 md:text-4xl">{item.count}</dd>
            <dd className="hidden text-xs text-slate-400 sm:col-start-2 sm:row-start-2 md:block">{item.detail}</dd>
          </div>
        ))}
      </dl>
      <ol aria-label="ChemLab ile nasıl öğrenilir?" className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
        {WORKFLOW.map(({ step, Icon, title, text }) => (
          <li key={step} className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-chem-transition"><Icon className="h-5 w-5" aria-hidden="true" /></span>
            <div><p className="font-mono text-xs text-slate-400">{step}</p><h2 className="mt-1 text-base font-semibold">{title}</h2><p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p></div>
          </li>
        ))}
      </ol>
    </section>
  );
}
