import React from 'react';
import { ElementData } from '../../types/chemistry';
import { CATEGORY_COLORS } from '../../lib/canvas/atomRenderer';
import { Atom, Layers, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { getSingleElementGuide } from '../../lib/chemistry/singleElementGuide';

interface SingleElementDetailProps {
  element: ElementData;
}

const CATEGORY_NAMES_TR: Record<string, string> = {
  alkali: 'Alkali Metal (1A Grubu)',
  alkaline: 'Toprak Alkali Metal (2A Grubu)',
  transition: 'Geçiş Metali (d-Bloku)',
  'post-transition': 'Zayıf Metal (Post-Geçiş)',
  metalloid: 'Yarı Metal',
  nonmetal: 'Ametal',
  halogen: 'Halojen (7A Grubu)',
  noble: 'Soygaz (Asal Gaz - 8A)',
  lanthanide: 'Lantanit (İç Geçiş)',
  actinide: 'Aktinit (İç Geçiş)'
};

export const SingleElementDetail: React.FC<SingleElementDetailProps> = ({ element }) => {
  const categoryColor = CATEGORY_COLORS[element.category] || '#4FA6E0';
  const categoryName = CATEGORY_NAMES_TR[element.category] || element.category;
  const shells = element.shells || [element.atomicNumber];
  const { bondingTendency, recommendedPartners } = getSingleElementGuide(element);

  const shellNames = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

  return (
    <div className="flex flex-col gap-3">
      {/* Header Info Card */}
      <div className="bg-slate-950 p-3 rounded border border-slate-700 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded border flex items-center justify-center font-mono font-bold text-lg text-slate-50 shadow-sm"
              style={{ backgroundColor: '#151C28', borderColor: categoryColor }}
            >
              {element.symbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono font-bold text-sm text-slate-50">
                  {element.nameTR}
                </h3>
                {element.nameEN && element.nameEN !== element.nameTR && (
                  <span className="text-xs text-slate-400 font-sans">
                    ({element.nameEN})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: categoryColor }}
                />
                <span className="text-[11px] font-mono text-slate-300">
                  {categoryName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-slate-400">Atom Numarası</span>
            <span className="text-sm font-mono font-bold text-chem-transition">
              Z = {element.atomicNumber}
            </span>
          </div>
        </div>

        {/* Quick summary text */}
        {element.summaryTR && (
          <p className="text-xs text-slate-300 font-sans leading-relaxed border-t border-slate-800 pt-2">
            {element.summaryTR}
          </p>
        )}
      </div>

      {/* 4-Box Properties Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Group & Period */}
        <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex flex-col gap-0.5 font-mono">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Layers className="w-3 h-3 text-chem-transition" />
            Periyodik Konum
          </span>
          <span className="text-xs font-bold text-slate-100">
            Grup {element.group} • {element.period}. Periyot
          </span>
        </div>

        {/* Atomic Mass */}
        <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex flex-col gap-0.5 font-mono">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Atom className="w-3 h-3 text-chem-electron" />
            Bağıl Atom Kütlesi
          </span>
          <span className="text-xs font-bold text-slate-100">
            {element.atomicMass.toFixed(3)} u
          </span>
        </div>

        {/* Electronegativity */}
        <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex flex-col gap-0.5 font-mono">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-chem-alkaline" />
            Elektronegatiflik (Pauling)
          </span>
          <span className="text-xs font-bold text-chem-alkaline">
            {element.electronegativity !== null ? element.electronegativity.toFixed(2) : 'Tanımsız (Soygaz)'}
          </span>
        </div>

        {/* Valence Electrons */}
        <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex flex-col gap-0.5 font-mono">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-chem-electron" />
            Değerlik Elektronları
          </span>
          <span className="text-xs font-bold text-chem-electron">
            {element.valanceElectrons !== null ? `${element.valanceElectrons} e⁻` : 'Geçiş Metali'}
          </span>
        </div>
      </div>

      {/* Bohr Shells Breakdown */}
      <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex flex-col gap-1.5 font-mono">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-chem-transition" />
            Katman Elektron Dağılımı:
          </span>
          <span className="text-slate-400 text-[10px]">
            Toplam: <strong className="text-slate-200">{element.atomicNumber} e⁻</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {shells.map((count, idx) => {
            const isOutermost = idx === shells.length - 1;
            const shellLetter = shellNames[idx] || `${idx + 1}`;
            return (
              <div
                key={idx}
                className={`flex-1 min-w-[55px] p-1.5 rounded border text-center flex flex-col items-center ${
                  isOutermost
                    ? 'bg-slate-800 border-chem-highlight text-slate-50'
                    : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                <span className="text-[9px] text-slate-400">
                  {idx + 1}. ({shellLetter})
                </span>
                <span className="text-xs font-bold font-mono">
                  {count} e⁻
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stability & Bonding Tendency */}
      <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 flex flex-col gap-1 text-xs">
        <div className="flex items-center gap-1.5 font-mono font-semibold text-chem-transition">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Kimyasal Davranış ve Kararlılık Eğilimi</span>
        </div>
        <p className="text-slate-300 font-sans leading-relaxed text-[11.5px]">
          {bondingTendency}
        </p>
      </div>

      {/* Interactive 2nd Element Prompt */}
      <div className="p-3 rounded bg-slate-950 border border-slate-700 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-chem-alkaline">
          <ArrowRight className="w-3.5 h-3.5" />
          <span>Bağ Simülasyonunu Başlatın:</span>
        </div>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          {recommendedPartners}
        </p>
      </div>
    </div>
  );
};
