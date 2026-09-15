import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { IOctetStatusData, OctetStatus } from '../../types/chemistry';

interface OctetStatusBadgeProps {
  element: IOctetStatusData;
  status: OctetStatus;
}

interface StabilityIndicatorProps {
  status: OctetStatus;
}

function formatElectronCount(count: number | null): string {
  return count === null ? '-' : count.toString();
}

function getStabilityLabel(status: OctetStatus): string {
  if (status.outerElectronCount === null) return 'Valans Verisi Yok';
  return status.isSatisfied
    ? `${status.ruleName} Tamam`
    : `${formatElectronCount(status.outerElectronCount)} e⁻ (Kararsız)`;
}

const StabilityIndicator: React.FC<StabilityIndicatorProps> = ({ status }) => {
  const isKnownStable = status.outerElectronCount !== null && status.isSatisfied;
  const Icon = isKnownStable ? CheckCircle2 : AlertCircle;
  const palette = isKnownStable
    ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-400'
    : 'bg-amber-950/60 border-amber-600/50 text-amber-400';

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] ${palette}`}>
      <Icon className="w-3 h-3" />
      <span>{getStabilityLabel(status)}</span>
    </span>
  );
};

const AtomStatusSummary: React.FC<OctetStatusBadgeProps> = ({ element, status }) => (
  <div className="flex items-center gap-2">
    <span className="w-6 h-6 rounded bg-slate-800 border border-slate-700 font-bold flex items-center justify-center text-chem-transition text-xs">
      {element.symbol}
    </span>
    <div className="flex flex-col">
      <span className="font-sans font-semibold text-slate-100 text-xs">{element.symbol} Atomu</span>
      <span className="text-[10px] text-slate-400">
        Dış Katman: {formatElectronCount(status.outerElectronCount)} / {status.targetElectronCount} e⁻
      </span>
    </div>
  </div>
);

export const OctetStatusBadge: React.FC<OctetStatusBadgeProps> = ({ element, status }) => (
  <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-700/80 font-mono text-xs select-none">
    <AtomStatusSummary element={element} status={status} />
    <StabilityIndicator status={status} />
  </div>
);
