import React from 'react';
import { ArrowRight, Atom, BookOpen, FlaskConical, Presentation } from 'lucide-react';
import { AppLink } from '../navigation/AppLink';
import { getLaboratoryPath, getModePath, getTopicPath } from '../../navigation/routes';
import { learningTopics } from '../../data/learningTopics';

const PRIMARY_LINK = 'touch-target inline-flex items-center justify-center gap-2 rounded border border-chem-transition bg-slate-800 px-5 py-2 font-semibold text-slate-50 transition-colors hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-50';
const SECONDARY_LINK = 'touch-target inline-flex items-center justify-center gap-2 rounded border border-slate-700 px-5 py-2 font-semibold text-slate-200 transition-colors hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-50';

const LearningPreview: React.FC = () => (
  <aside aria-label="ChemLab kullanım adımları" className="rounded border border-slate-700 bg-slate-900 p-5 md:p-7">
    <div className="mb-6 flex items-center gap-3 border-b border-slate-700 pb-4">
      <span className="flex h-10 w-10 items-center justify-center rounded border border-slate-700 bg-slate-950 text-chem-transition"><Atom className="h-5 w-5" aria-hidden="true" /></span>
      <div><p className="font-mono text-sm font-semibold text-slate-50">Bir deneyin akışı</p><p className="text-xs text-slate-400">Atomdan açıklamaya</p></div>
    </div>
    <ol className="space-y-4">
      <li className="border-l-2 border-chem-nonmetal pl-4"><span className="font-mono text-xs text-chem-nonmetal">01 · SEÇ</span><p className="mt-1 text-sm text-slate-200">Periyodik tablodan atomları seç.</p></li>
      <li className="border-l-2 border-chem-transition pl-4"><span className="font-mono text-xs text-chem-transition">02 · GÖZLEMLE</span><p className="mt-1 text-sm text-slate-200">Bağ oluşumunu adım adım izle.</p></li>
      <li className="border-l-2 border-chem-alkaline pl-4"><span className="font-mono text-xs text-chem-alkaline">03 · ANLA</span><p className="mt-1 text-sm text-slate-200">Elektronları, bağ türünü ve kararlılığı incele.</p></li>
    </ol>
  </aside>
);

const AudienceCards: React.FC = () => (
  <section aria-label="Kullanım biçimini seç" className="grid gap-4 md:grid-cols-2">
    <article className="rounded border border-slate-700 bg-slate-900 p-6">
      <BookOpen className="mb-4 h-6 w-6 text-chem-nonmetal" aria-hidden="true" />
      <h2 className="text-xl font-semibold text-slate-50">Öğrenci modu</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">Elementleri kendi hızında keşfet; hazır örnekleri karşılaştırarak kimyasal bağların nasıl oluştuğunu gör.</p>
      <AppLink to={getModePath('student')} className="touch-target mt-5 inline-flex items-center gap-2 font-semibold text-chem-nonmetal hover:text-slate-50">Öğrenci olarak başla <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
    </article>
    <article className="rounded border border-slate-700 bg-slate-900 p-6">
      <Presentation className="mb-4 h-6 w-6 text-chem-transition" aria-hidden="true" />
      <h2 className="text-xl font-semibold text-slate-50">Öğretmen modu</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">Hazır deneyleri sınıfta aç; animasyonu durdurup adım adım ilerleterek atomların davranışını göster.</p>
      <AppLink to={getModePath('teacher')} className="touch-target mt-5 inline-flex items-center gap-2 font-semibold text-chem-transition hover:text-slate-50">Öğretmen olarak başla <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
    </article>
  </section>
);

export const LandingPage: React.FC = () => (
  <div className="h-full overflow-y-auto bg-slate-950 text-slate-50">
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-10 md:gap-14 md:px-10 md:py-16">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section>
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-chem-transition">Etkileşimli kimya laboratuvarı</p>
          <h1 id="route-heading" tabIndex={-1} className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight outline-none md:text-6xl">Kimyasal bağları yalnızca okuma. <span className="text-chem-nonmetal">Oluşurken gör.</span></h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">Periyodik tablodan atom seç, elektronların davranışını incele ve bağın neden oluştuğunu adım adım öğren. Ders anlatırken de kendi başına keşfederken de aynı laboratuvarı kullan.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <AppLink to={getModePath('student')} className={PRIMARY_LINK}>Öğrenci olarak başla <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
            <AppLink to={getModePath('teacher')} className={SECONDARY_LINK}>Öğretmen olarak başla</AppLink>
          </div>
          <AppLink to={getLaboratoryPath('free')} className="touch-target mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-300 underline decoration-slate-600 underline-offset-4 hover:text-slate-50"><FlaskConical className="h-4 w-4" aria-hidden="true" /> Doğrudan Serbest Laboratuvar’a geç</AppLink>
        </section>
        <LearningPreview />
      </div>
      <AudienceCards />
      <section aria-labelledby="home-topics-heading">
        <h2 id="home-topics-heading" className="text-xl font-semibold">Çalışılabilir konular</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {learningTopics.map(topic => <AppLink key={topic.id} to={getTopicPath('student', topic.id)} className="touch-target inline-flex items-center rounded border border-slate-700 bg-slate-900 px-4 text-sm text-slate-200 hover:border-chem-transition">{topic.title}</AppLink>)}
        </div>
      </section>
      <p className="border-t border-slate-700 pt-5 text-xs leading-relaxed text-slate-400">Altı rehberli konu ve doğrulanmış örnek deney erişime açıktır. Serbest element eşleştirmeleri sadeleştirilmiş bir öğretim modelidir; bağ kutupluluğu ile tüm molekülün kutupluluğu aynı kavram değildir.</p>
    </div>
  </div>
);
