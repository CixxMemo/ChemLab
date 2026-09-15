import React, { useRef } from 'react';
import { useCanvasRenderer } from '../../lib/canvas/useCanvasRenderer';
import { debugWireframeEngine } from '../../lib/canvas/DebugWireframeEngine';
import { BondMetricsOverlay } from './BondMetricsOverlay';
import { CompoundProductBadge } from './CompoundProductBadge';

export const SimulationCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Dev-gated engine injection (DIP verification, defaults to undefined -> defaultBohrEngine)
  const devEngine = (import.meta.env.DEV && typeof window !== 'undefined' && (window as any).__CHEMLAB_DEV_RENDERER__ === 'wireframe')
    ? debugWireframeEngine
    : undefined;

  // Decoupled canvas renderer hook with DIP abstraction
  useCanvasRenderer({
    canvasRef,
    containerRef,
    engine: devEngine
  });

  return (
    <div className="flex flex-1 flex-col w-full h-full min-h-0 bg-slate-950 select-none">
      <div ref={containerRef} className="relative flex-1 min-h-0 w-full overflow-hidden">
        <SimulationCanvasOverlay />
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-crosshair"
        />
      </div>

      {/* Keep reaction details outside the drawing surface so atoms remain unobstructed. */}
      <CompoundProductBadge />
    </div>
  );
};

const SimulationCanvasOverlay: React.FC = () => {
  return <BondMetricsOverlay />;
};
