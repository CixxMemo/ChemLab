import React from 'react';
import { AppLink } from '../navigation/AppLink';
import { getLaboratoryPath } from '../../navigation/routes';

type NotFoundReason = 'page' | 'experiment' | 'content';

interface NotFoundPageProps {
  reason?: NotFoundReason;
}

const MESSAGE: Readonly<Record<NotFoundReason, { label: string; title: string; description: string }>> = {
  page: { label: 'Bağlantı bulunamadı', title: 'Bu sayfa bulunamadı.', description: 'Adres değişmiş olabilir. Ana sayfaya dönerek kullanıma açık bölümlerden birini seçebilirsin.' },
  experiment: { label: 'Deney bulunamadı', title: 'Bu deney henüz kullanılabilir değil.', description: 'Doğrulanmış hazır deneylerden birini açabilir veya serbest laboratuvarda atomları kendin seçebilirsin.' },
  content: { label: 'İçerik hazırlık aşamasında', title: 'Ders içeriği henüz açık değil.', description: 'Konu ve hazır ders sayfaları sonraki geliştirme aşamasında açılacak. Şimdilik doğrulanmış deneyleri laboratuvarda inceleyebilirsin.' }
};

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ reason = 'page' }) => (
  <div className="flex h-full items-center justify-center overflow-y-auto bg-slate-950 px-5 py-10 text-center">
    <section className="max-w-lg rounded border border-slate-700 bg-slate-900 p-8">
      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-chem-alkaline">{MESSAGE[reason].label}</p>
      <h1 id="route-heading" tabIndex={-1} className="mt-3 text-3xl font-semibold text-slate-50 outline-none">{MESSAGE[reason].title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">{MESSAGE[reason].description}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <AppLink to="/" className="touch-target inline-flex items-center rounded border border-slate-700 px-4 text-sm font-semibold text-slate-50 hover:bg-slate-800">Ana sayfa</AppLink>
        <AppLink to={getLaboratoryPath('free')} className="touch-target inline-flex items-center rounded border border-chem-transition bg-slate-800 px-4 text-sm font-semibold text-slate-50 hover:bg-slate-700">Serbest Laboratuvar</AppLink>
      </div>
    </section>
  </div>
);
