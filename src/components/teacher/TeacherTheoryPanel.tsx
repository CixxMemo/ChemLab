import React from 'react';
import { RevealPolicy } from '../../presentation/revealPolicy';
import { BondAnalysis, ReactionScenario } from '../../types/chemistry';
import { OctetStatusBadge } from '../theory/OctetStatusBadge';

interface TeacherTheoryPanelProps {
  reveal: RevealPolicy;
  analysis: BondAnalysis | null;
  scenario: ReactionScenario | null;
}

const BOND_LABELS = {
  ionic: 'İyonik', 'polar-covalent': 'Polar kovalent',
  'nonpolar-covalent': 'Apolar kovalent', inert: 'Tepkime yok', 'no-bond': 'Bağ oluşmaz'
} as const;

const FIELD_CLASS = 'rounded border border-slate-600 bg-slate-950 px-3 py-2 text-lg';

export const TeacherTheoryPanel: React.FC<TeacherTheoryPanelProps> = ({ reveal, analysis, scenario }) => (
  <section aria-label="Perdeli bağ analizi" className="flex-1 overflow-y-auto border-t border-slate-700 bg-slate-900 p-4 text-slate-50">
    <h2 className="text-xl font-semibold">Çözüm kartları</h2>
    <p className="mt-1 text-base text-slate-200">Alanları öğretmen perdesinden sırayla açabilirsin.</p>
    <div className="mt-4 grid gap-2" aria-live="polite">
      <p className={FIELD_CLASS}><strong>Bağ türü:</strong> {reveal.bond && analysis ? BOND_LABELS[analysis.bondType] : 'Gizli'}</p>
      <p className={FIELD_CLASS}><strong>Ürün:</strong> {reveal.product && scenario ? scenario.formula : 'Gizli'}</p>
      <p className={FIELD_CLASS}><strong>ΔEN:</strong> {reveal.deltaEN && analysis ? analysis.deltaEN?.toFixed(2) ?? 'Tanımsız' : 'Gizli'}</p>
      <div className={FIELD_CLASS}><strong>Oktet/dublet:</strong> {reveal.octet && analysis ? <div className="mt-2 grid gap-2">
        {[analysis.primaryAtom, analysis.secondaryAtom].map((element, index) => <OctetStatusBadge key={`${element.symbol}-${index}`} element={element} status={analysis.octetStatuses[index]} />)}
      </div> : ' Gizli'}</div>
      <p className={FIELD_CLASS}><strong>Açıklama:</strong> {reveal.explanation && analysis ? analysis.explanationTR : 'Gizli'}</p>
    </div>
  </section>
);
