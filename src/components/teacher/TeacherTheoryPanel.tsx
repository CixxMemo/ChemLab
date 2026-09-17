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

const FIELD_CLASS = 'rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm leading-relaxed';

export const TeacherTheoryPanel: React.FC<TeacherTheoryPanelProps> = ({ reveal, analysis, scenario }) => (
  <section aria-label="Perdeli bağ analizi" className="flex-1 overflow-y-auto border-t border-slate-700 bg-slate-900 p-4 text-slate-50">
    <h2 className="text-sm font-semibold">Deney analizi</h2>
    <p className="mt-1 text-xs text-slate-400">Cevapları sunum çubuğundan sırayla aç.</p>
    <div className="mt-3 grid grid-cols-3 gap-2" aria-live="polite">
      <p className={FIELD_CLASS}><strong>Bağ türü:</strong> {reveal.bond && analysis ? BOND_LABELS[analysis.bondType] : 'Gizli'}</p>
      <p className={FIELD_CLASS}><strong>Ürün:</strong> {reveal.product && scenario ? scenario.formula : 'Gizli'}</p>
      <p className={FIELD_CLASS}><strong>ΔEN:</strong> {reveal.deltaEN && analysis ? analysis.deltaEN?.toFixed(2) ?? 'Tanımsız' : 'Gizli'}</p>
      <div className={`${FIELD_CLASS} col-span-3`}><strong>Oktet/dublet:</strong> {reveal.octet && analysis ? <div className="mt-2 grid gap-2">
        {[analysis.primaryAtom, analysis.secondaryAtom].map((element, index) => <OctetStatusBadge key={`${element.symbol}-${index}`} element={element} status={analysis.octetStatuses[index]} />)}
      </div> : ' Gizli'}</div>
      <p className={`${FIELD_CLASS} col-span-3`}><strong>Açıklama:</strong> {reveal.explanation && analysis ? analysis.explanationTR : 'Gizli'}</p>
    </div>
  </section>
);
