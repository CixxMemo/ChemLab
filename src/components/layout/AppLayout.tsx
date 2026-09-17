import React from 'react';
import { Header } from './Header';
import { PeriodicTable } from '../table/PeriodicTable';
import { SimulationCanvas } from '../simulation/SimulationCanvas';
import { PlaybackControls } from '../simulation/PlaybackControls';
import { LiveInfoPanel } from '../theory/LiveInfoPanel';
import { SimulationModal } from '../simulation/SimulationModal';
import { TeacherSimulationModal } from '../teacher/TeacherSimulationModal';
import { TeacherPresentationControls } from '../teacher/TeacherPresentationControls';
import { getRevealPolicy } from '../../presentation/revealPolicy';
import { useTeacherPresentationStore } from '../../store/useTeacherPresentationStore';

interface AppLayoutProps {
  guided?: boolean;
  presentationKey?: string;
  presentationScenarioId?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ guided = false, presentationKey, presentationScenarioId }) => {
  const scope = useTeacherPresentationStore(state => state.scopeKey);
  const level = useTeacherPresentationStore(state => state.revealLevel);
  const reveal = presentationKey ? getRevealPolicy(scope === presentationKey ? level : 0) : undefined;
  return (
    <div className="flex flex-col h-full min-h-0 w-full bg-slate-950 text-slate-50 overflow-auto lg:overflow-hidden select-none">
      {/* Main two-column workspace: 60% table, 40% simulation and theory. */}
      <div className="flex flex-col gap-3 p-3 lg:flex-row flex-1 lg:min-h-0 lg:overflow-hidden">
        {/* Keep teacher tools with the table, leaving the full right-column height for the experiment. */}
        <section className="flex w-full min-w-0 flex-col gap-3 lg:h-full lg:min-h-0 lg:w-[60%]">
          <Header guided={guided} shareScenarioId={presentationScenarioId} />
          {presentationKey && <TeacherPresentationControls scopeKey={presentationKey} />}
          <div className="flex min-h-[var(--mobile-table-height)] min-w-0 flex-col overflow-hidden rounded-xl border border-slate-700 lg:min-h-0 lg:flex-1">
            <PeriodicTable guided={guided} reveal={reveal} />
          </div>
        </section>

        {/* Right Column: Canvas Simulator + Controls + Live Theory (40% width) */}
        <section className="w-full lg:w-[40%] min-h-[var(--mobile-simulation-height)] lg:min-h-0 lg:h-full overflow-hidden rounded-xl border border-slate-700 flex flex-col min-w-0 bg-slate-900">
          {/* Top Half: 2D Canvas Interactive Simulator */}
          <div className="h-[var(--simulation-height)] min-h-64 shrink-0 w-full relative flex flex-col border-b border-slate-700 bg-slate-950">
            <SimulationCanvas reveal={reveal} />
          </div>

          {/* Middle: Timeline & Step Scrubbing Controls */}
          <PlaybackControls />

          {/* Bottom Half: Synchronized Live Theory & Rationale Panel */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <LiveInfoPanel reveal={reveal} />
          </div>
        </section>
      </div>

      {/* Large-Scale Simulation & Animation Modal */}
      {presentationKey && reveal
        ? <TeacherSimulationModal scopeKey={presentationKey} reveal={reveal} />
        : <SimulationModal />}
    </div>
  );
};
