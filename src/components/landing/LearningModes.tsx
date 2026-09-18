import { ArrowRight, Check, GraduationCap, Presentation } from 'lucide-react';
import { getModePath } from '../../navigation/routes';
import { AppLink } from '../navigation/AppLink';
import { EYEBROW } from './landingStyles';

const MODES = [
  {
    mode: 'student', Icon: GraduationCap, label: 'ÖĞRENCİLER İÇİN', title: 'Kendi hızında, merakının peşinde.',
    description: 'Önce tahminini yap, sonra deneyle karşılaştır. Yanlış cevaplar da öğrenmenin bir parçası.',
    features: ['Açıklamalı sorular ve yeniden deneme', 'Bu tarayıcıda saklanan öğrenme ilerlemesi', 'Hazır deneylerden serbest keşfe geçiş'],
    action: 'Öğrenci olarak başla', color: 'text-chem-nonmetal'
  },
  {
    mode: 'teacher', Icon: Presentation, label: 'ÖĞRETMENLER İÇİN', title: 'Bir soruyla bütün sınıfı dahil et.',
    description: '“Elektron nereye gider?” diye sor. Tahminleri topla, animasyonu adım adım aç ve birlikte tartışın.',
    features: ['Hazır ders akışları ve öğretmen notları', 'Büyük ekran ve adımlı sunum kontrolleri', 'Bağlantı veya QR ile deney paylaşımı'],
    action: 'Öğretmen olarak başla', color: 'text-chem-transition'
  }
] as const;

export function LearningModes() {
  return (
    <section aria-labelledby="learning-modes-heading">
      <p className={EYEBROW}>AYNI LABORATUVAR, FARKLI YOLLAR</p>
      <h2 id="learning-modes-heading" className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">Tek başına keşfet. Sınıfça anlamlandır.</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {MODES.map(({ mode, Icon, label, title, description, features, action, color }) => (
          <article key={mode} className="flex flex-col rounded-xl border border-slate-700 bg-slate-900 p-6 md:p-8">
            <div className={`flex items-center gap-3 ${color}`}>
              <Icon className="h-6 w-6" aria-hidden="true" />
              <p className="font-mono text-xs tracking-widest">{label}</p>
            </div>
            <h3 className="mt-6 text-xl font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{description}</p>
            <ul className="mb-6 mt-5 space-y-3">
              {features.map(feature => (
                <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                  <Check className={`h-5 w-4 shrink-0 ${color}`} aria-hidden="true" />{feature}
                </li>
              ))}
            </ul>
            <AppLink to={getModePath(mode)} className={`touch-target mt-auto flex items-center justify-between gap-2 border-t border-slate-700 pt-5 text-sm font-semibold hover:text-slate-50 ${color}`}>
              {action}<ArrowRight className="h-4 w-4" aria-hidden="true" />
            </AppLink>
          </article>
        ))}
      </div>
    </section>
  );
}
