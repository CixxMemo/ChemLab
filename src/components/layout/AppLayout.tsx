import React from 'react';
import { Header } from './Header';
import { PeriodicTable } from '../table/PeriodicTable';
import { SimulationCanvas } from '../simulation/SimulationCanvas';
import { PlaybackControls } from '../simulation/PlaybackControls';
import { LiveInfoPanel } from '../theory/LiveInfoPanel';
import { SimulationModal } from '../simulation/SimulationModal';

export const AppLayout: React.FC<{ guided?: boolean }> = ({ guided = false }) => {
  return (
    <div className="flex flex-col h-full min-h-0 w-full bg-slate-950 text-slate-50 overflow-auto lg:overflow-hidden select-none">
      {/* Top Application Header */}
      <Header guided={guided} />

      {/* Main 2-Column Split: 62% Left (Periodic Table) / 38% Right (Simulation & Theory) */}
      <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden">
        {/* Left Column: 18-column Periodic Table (62% width) */}
        <section className="w-full lg:w-[60%] min-h-screen lg:min-h-0 lg:h-full border-r border-slate-700 flex flex-col min-w-0">
          <PeriodicTable guided={guided} />
        </section>

        {/* Right Column: Canvas Simulator + Controls + Live Theory (38% width) */}
        <section className="w-full lg:w-[40%] min-h-screen lg:min-h-0 lg:h-full flex flex-col min-w-0 bg-slate-900">
          {/* Top Half: 2D Canvas Interactive Simulator */}
          <div className="h-[52%] w-full relative flex flex-col border-b border-slate-700 bg-slate-950">
            <SimulationCanvas />
          </div>

          {/* Middle: Timeline & Step Scrubbing Controls */}
          <PlaybackControls />

          {/* Bottom Half: Synchronized Live Theory & Rationale Panel */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <LiveInfoPanel />
          </div>
        </section>
      </div>

      {/* Large-Scale Simulation & Animation Modal */}
      <SimulationModal guided={guided} />
    </div>
  );
};
