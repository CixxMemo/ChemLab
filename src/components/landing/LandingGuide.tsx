import { ArrowRight, ChevronDown, FlaskConical } from 'lucide-react';
import { AppLink } from '../navigation/AppLink';
import { getLaboratoryPath } from '../../navigation/routes';
import { EYEBROW, PRIMARY_LINK } from './landingStyles';

const QUESTIONS = [
  { question: 'Kimya bilgim az. Nereden başlamalıyım?', answer: '“Periyodik tabloyu oku” konusuyla başlayabilirsin. Ardından değerlik elektronları, elektronegatiflik ve bağ türlerine ilerle. Her konu bir hedef, tahmin, deney ve açıklamalı sorular içerir.' },
  { question: 'Rehberli öğrenme ile serbest laboratuvarın farkı ne?', answer: 'Rehberli öğrenmede konuları bir sırayla takip eder, tahmin ve sorularla çalışırsın. Serbest laboratuvarda ise periyodik tablodan atomları kendin seçer, farklı çiftlerin davranışlarını karşılaştırırsın.' },
  { question: 'Simülasyonlar gerçek kimyayı nasıl temsil ediyor?', answer: 'ChemLab, elektron aktarımını ve paylaşımını sadeleştirilmiş bir Bohr modeliyle gösterir. Hazır deneyler öğretim örnekleridir; serbest eşleştirmeler her gerçek koşulu kapsamaz. Bağ kutupluluğu, tüm molekülün kutupluluğuyla aynı kavram değildir.' },
  { question: 'Hesap açmam gerekiyor mu? İlerlemem kaybolur mu?', answer: 'Hesap açmadan başlayabilirsin. Tamamlanan konular ve görevler bu cihazdaki tarayıcıda saklanır. Tarayıcı verileri temizlenirse ilerleme silinir; başka bir cihazla otomatik eşitlenmez.' },
  { question: 'Akıllı tahtada ve telefonda kullanabilir miyim?', answer: 'Evet. Laboratuvardaki dokunmatik kontrolleri ve büyük ekran görünümünü sınıfta kullanabilirsin. Küçük ekranlarda periyodik tabloyu yatay kaydırabilir, konu ve görevleri kendi cihazında takip edebilirsin.' }
];

export function LandingGuide() {
  return (
    <>
      <section aria-labelledby="landing-guide-heading" className="grid gap-6 lg:grid-cols-3 lg:gap-12">
        <div>
          <p className={EYEBROW}>BAŞLAMADAN ÖNCE</p>
          <h2 id="landing-guide-heading" className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">Merak ettiklerin.</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">Ne yapabileceğini ve modelin sınırlarını bilerek keşfe başla.</p>
        </div>
        <div className="border-t border-slate-700 lg:col-span-2">
          {QUESTIONS.map(item => (
            <details key={item.question} className="group border-b border-slate-700">
              <summary className="touch-target flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-medium text-slate-200 hover:text-chem-transition [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
              </summary>
              <p className="pb-5 pr-8 text-sm leading-relaxed text-slate-400">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section aria-labelledby="landing-cta-heading" className="flex flex-wrap items-center justify-between gap-6 rounded-xl border border-slate-700 bg-slate-900 p-6 md:p-8">
        <div>
          <h2 id="landing-cta-heading" className="text-xl font-semibold md:text-2xl">Bir atom seç. Bir soruyla başla.</h2>
          <p className="mt-2 text-sm text-slate-400">İlk keşfin için ihtiyacın olan her şey laboratuvarda.</p>
        </div>
        <AppLink to={getLaboratoryPath('free')} className={PRIMARY_LINK}>
          <FlaskConical className="h-4 w-4" aria-hidden="true" /> Laboratuvarı aç
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </AppLink>
      </section>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-700 pt-6 text-xs text-slate-400">
        <span className="font-mono font-semibold text-slate-300">
          ChemLab <span className="font-sans font-normal text-slate-400">· Etkileşimli kimya laboratuvarı</span>
        </span>
        <span>Gözlemle. Sorgula. Bağlantı kur.</span>
      </footer>
    </>
  );
}
