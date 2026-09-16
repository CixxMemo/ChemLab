import React from 'react';
import { ArrowRight, BookOpen, FlaskConical, Presentation } from 'lucide-react';
import { AppLink } from '../navigation/AppLink';
import { getLaboratoryPath } from '../../navigation/routes';

type AudienceMode = 'student' | 'teacher';

interface ExperiencePageProps {
  mode: AudienceMode;
}

const EXPERIENCE_COPY = {
  student: {
    eyebrow: 'Öğrenci modu',
    title: 'Atomları seç. Bağın neden oluştuğunu keşfet.',
    description: 'Hazır örneklerden başlayabilir ya da periyodik tablodan kendi atom çiftini seçebilirsin. Sonucu, elektron davranışını ve oktet/dublet durumunu birlikte incele.',
    instruction: 'Bir örnek aç, animasyonu durdur veya geri sar; farklı bir atom çifti seçerek sonucu karşılaştır.',
    examples: [
      { id: 'nacl', title: 'Na + Cl', detail: 'Elektron aktarımını gözlemle' },
      { id: 'hf', title: 'H + F', detail: 'Elektron paylaşımını incele' },
      { id: 'inert_gas', title: 'He + Ne', detail: 'Tepkimesiz durumu gör' }
    ]
  },
  teacher: {
    eyebrow: 'Öğretmen modu',
    title: 'Kimyasal bağları sınıfta adım adım göster.',
    description: 'Doğrulanmış örnekleri akıllı tahtada aç. Oynatmayı durdur, aşamalar arasında ilerle ve büyük ekran görünümüyle atomların davranışını sınıfa göster.',
    instruction: 'Bir deney seç; oynatma kontrolleriyle kritik anda durup sınıfa “Elektron nereye gider?” sorusunu yönelt.',
    examples: [
      { id: 'nacl', title: 'Na + Cl', detail: 'İyonik bağ örneği' },
      { id: 'h2o', title: 'H + O', detail: 'Polar kovalent örneği' },
      { id: 'o2', title: 'O + O', detail: 'Çift bağ örneği' }
    ]
  }
} as const;

const ExampleList: React.FC<ExperiencePageProps> = ({ mode }) => (
  <section aria-label="Hazır deneyler" className="rounded border border-slate-700 bg-slate-900 p-5 md:p-7">
    <h2 className="font-mono text-sm font-semibold text-slate-50">Hazır deneyler</h2>
    <p className="mt-1 text-sm text-slate-400">Doğrulanmış örneklerden biriyle başla.</p>
    <div className="mt-5 grid gap-3">
      {EXPERIENCE_COPY[mode].examples.map(example => (
        <AppLink key={example.id} to={getLaboratoryPath(mode, example.id)} className="touch-target flex items-center justify-between gap-3 rounded border border-slate-700 bg-slate-950 px-4 py-3 text-slate-50 transition-colors hover:border-chem-transition hover:bg-slate-800">
          <span><span className="block font-mono font-semibold">{example.title}</span><span className="block text-xs text-slate-400">{example.detail}</span></span>
          <ArrowRight className="h-4 w-4 shrink-0 text-chem-transition" aria-hidden="true" />
        </AppLink>
      ))}
    </div>
  </section>
);

export const ExperiencePage: React.FC<ExperiencePageProps> = ({ mode }) => {
  const copy = EXPERIENCE_COPY[mode];
  const Icon = mode === 'student' ? BookOpen : Presentation;

  return (
    <div className="h-full overflow-y-auto bg-slate-950 text-slate-50">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 md:px-10 md:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section>
          <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded border border-slate-700 bg-slate-900 text-chem-transition"><Icon className="h-6 w-6" aria-hidden="true" /></span>
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-chem-transition">{copy.eyebrow}</p>
          <h1 id="route-heading" tabIndex={-1} className="mt-3 max-w-2xl text-4xl font-semibold leading-tight tracking-tight outline-none md:text-5xl">{copy.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400">{copy.description}</p>
          <AppLink to={getLaboratoryPath(mode)} className="touch-target mt-8 inline-flex items-center justify-center gap-2 rounded border border-chem-transition bg-slate-800 px-5 py-2 font-semibold text-slate-50 transition-colors hover:bg-slate-700">
            <FlaskConical className="h-4 w-4" aria-hidden="true" /> Laboratuvarı aç
          </AppLink>
          <p className="mt-6 max-w-xl border-l-2 border-chem-alkaline pl-4 text-sm leading-relaxed text-slate-300">{copy.instruction}</p>
        </section>
        <ExampleList mode={mode} />
      </div>
    </div>
  );
};
