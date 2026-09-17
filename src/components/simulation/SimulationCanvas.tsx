import React, { useRef } from 'react';
import { useCanvasRenderer } from '../../lib/canvas/useCanvasRenderer';
import { DebugWireframeEngine } from '../../lib/canvas/DebugWireframeEngine';
import { CanvasBohrEngine } from '../../lib/canvas/CanvasBohrEngine';
import { IRenderEngine } from '../../lib/canvas/IRenderEngine';
import { BondMetricsOverlay } from './BondMetricsOverlay';
import { CompoundProductBadge } from './CompoundProductBadge';
import { RevealPolicy } from '../../presentation/revealPolicy';

export const SimulationCanvas: React.FC<{ reveal?: RevealPolicy }> = ({ reveal }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const engineRef = useRef<IRenderEngine | null>(null);
  if (!engineRef.current) {
    const useWireframe = import.meta.env.DEV && typeof window !== 'undefined'
      && (window as Window & { __CHEMLAB_DEV_RENDERER__?: string }).__CHEMLAB_DEV_RENDERER__ === 'wireframe';
    engineRef.current = useWireframe ? new DebugWireframeEngine() : new CanvasBohrEngine();
  }

  // Decoupled canvas renderer hook with DIP abstraction
  useCanvasRenderer({
    canvasRef,
    containerRef,
    engine: engineRef.current
  });

  return (
    <div className="flex flex-1 flex-col w-full h-full min-h-0 bg-slate-950 select-none">
      <div ref={containerRef} className="simulation-surface relative flex-1 min-h-0 w-full overflow-hidden bg-slate-950">
        <SimulationCanvasOverlay reveal={reveal} />
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-crosshair"
          aria-hidden="true"
        />
        {reveal && !reveal.showCanvas && <div className="absolute inset-0 z-20 flex items-center justify-center border border-slate-700 bg-slate-950 p-6 text-center text-lg font-semibold text-slate-50" role="status">Atom çifti hazır. Çözüm aşamaları açılınca animasyon gösterilecek.</div>}
      </div>

      {/* Keep reaction details outside the drawing surface so atoms remain unobstructed. */}
      <CompoundProductBadge reveal={reveal} />
    </div>
  );
};

const SimulationCanvasOverlay: React.FC<{ reveal?: RevealPolicy }> = ({ reveal }) => {
  return <BondMetricsOverlay reveal={reveal} />;
};
