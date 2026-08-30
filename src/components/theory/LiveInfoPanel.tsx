import React from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { ElectronegativityBar } from './ElectronegativityBar';
import { OctetStatusBadge } from './OctetStatusBadge';
import { SingleElementDetail } from './SingleElementDetail';
import { BookOpen, Info, CheckCircle, ArrowRight, Atom } from 'lucide-react';

export const LiveInfoPanel: React.FC = () => {
  const { activeScenario, bondAnalysis, selectedElements, progress } = useSimulationStore();

  if (!activeScenario && selectedElements.length === 0) {
    return (
      <div className="flex-1 p-4 flex flex-col items-center justify-center text-center bg-slate-900 border-t border-slate-700 select-none">
        <Atom className="w-8 h-8 text-slate-600 mb-2 animate-pulse" />
        <h3 className="font-mono text-sm font-semibold text-slate-300">
          Canlı Teori ve Açıklama Paneli
        </h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1 font-sans">
          Sol tablodan atom seçildiğinde veya bir senaryo başlatıldığında, kimyasal bağ mekanizması ve oktet kuralları burada adım adım senkronize olarak açıklanacaktır.
        </p>
      </div>
    );
  }

  // If exactly 1 element is selected and no reaction scenario has formed yet:
  if (!activeScenario && selectedElements.length === 1) {
    return (
      <div className="flex-1 bg-slate-900 border-t border-slate-700 flex flex-col overflow-y-auto p-4 gap-3 select-none">
        <SingleElementDetail element={selectedElements[0]} />
      </div>
    );
  }

  // Calculate active reaction step based on progress
  const steps = activeScenario?.steps || [];
  let currentStepIndex = 0;
  for (let i = steps.length - 1; i >= 0; i--) {
    if (progress >= steps[i].progressThreshold) {
      currentStepIndex = i;
      break;
    }
  }
  const currentStep = steps[currentStepIndex];

  const deltaEN = bondAnalysis ? bondAnalysis.deltaEN : activeScenario ? activeScenario.deltaEN : null;

  return (
    <div className="flex-1 bg-slate-900 border-t border-slate-700 flex flex-col overflow-y-auto p-4 gap-3 select-none">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-chem-transition" />
          <h3 className="font-mono font-bold text-sm text-slate-50">
            {activeScenario ? activeScenario.nameTR : 'Element Etkileşimi'}
          </h3>
        </div>
        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-slate-400">
          Adım {currentStepIndex + 1} / {Math.max(1, steps.length)}
        </span>
      </div>

      {/* Dynamic Live Step Card */}
      {currentStep && (
        <div className="bg-slate-950 p-3 rounded border border-slate-700 flex flex-col gap-1.5 transition-all">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-chem-transition">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{currentStep.titleTR}</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {currentStep.descriptionTR}
          </p>
        </div>
      )}

      {/* Pauling Electronegativity Bar */}
      <ElectronegativityBar deltaEN={deltaEN} />

      {/* Octet & Duplet Status for Active Reactants */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-mono text-slate-400">
          Kararlılık Durumu (Oktet / Dublet):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {selectedElements.map((el, i) => (
            <OctetStatusBadge
              key={`${el.symbol}-${i}`}
              element={el}
              progress={progress}
            />
          ))}
        </div>
      </div>

      {/* Detailed Chemical Rationale */}
      {bondAnalysis && (
        <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 text-[11px] font-sans text-slate-400 flex flex-col gap-1">
          <div className="font-mono font-semibold text-slate-300 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-chem-covalent" />
            <span>Kimyasal Bağ Analizi</span>
          </div>
          <p className="leading-relaxed">
            {bondAnalysis.explanationTR}
          </p>
        </div>
      )}

      {/* Reaction Steps Timeline Checklist */}
      {steps.length > 0 && (
        <div className="flex flex-col gap-1 mt-auto pt-2 border-t border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">
            Reaksiyon Aşamaları:
          </span>
          <div className="flex flex-col gap-1">
            {steps.map((st, idx) => {
              const isPassed = progress >= st.progressThreshold;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2 text-[11px] font-mono py-0.5 px-1.5 rounded transition-colors ${
                    isCurrent
                      ? 'bg-slate-800 text-chem-transition font-bold'
                      : isPassed
                      ? 'text-slate-400 line-through opacity-70'
                      : 'text-slate-600'
                  }`}
                >
                  <ArrowRight className={`w-3 h-3 ${isCurrent ? 'text-chem-transition' : 'text-slate-600'}`} />
                  <span className="truncate">{st.titleTR}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
