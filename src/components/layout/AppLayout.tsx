import React from 'react';
import { Header } from './Header';
import { PeriodicTable } from '../table/PeriodicTable';
import { SimulationCanvas } from '../simulation/SimulationCanvas';
import { PlaybackControls } from '../simulation/PlaybackControls';
import { LiveInfoPanel } from '../theory/LiveInfoPanel';
import { SimulationModal } from '../simulation/SimulationModal';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-50 overflow-hidden select-none">
      {/* Top Application Header */}
      <Header />

      {/* Main 2-Column Split: 62% Left (Periodic Table) / 38% Right (Simulation & Theory) */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Column: 18-column Periodic Table (62% width) */}
        <section className="w-[62%] h-full border-r border-slate-700 flex flex-col min-w-0">
          <PeriodicTable />
        </section>

        {/* Right Column: Canvas Simulator + Controls + Live Theory (38% width) */}
        <section className="w-[38%] h-full flex flex-col min-w-0 bg-slate-900">
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
      </main>

      {/* Large-Scale Simulation & Animation Modal */}
      <SimulationModal />
    </div>
  );
};
