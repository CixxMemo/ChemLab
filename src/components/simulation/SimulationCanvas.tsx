import React, { useRef } from 'react';
import { useCanvasRenderer } from '../../lib/canvas/useCanvasRenderer';
import { BondMetricsOverlay } from './BondMetricsOverlay';

export const SimulationCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Decoupled canvas renderer hook with DIP abstraction
  useCanvasRenderer({
    canvasRef,
    containerRef
  });

  return (
    <div ref={containerRef} className="relative flex-1 w-full h-full bg-slate-950 overflow-hidden select-none">
      <SimulationCanvasOverlay />
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair"
      />
    </div>
  );
};

const SimulationCanvasOverlay: React.FC = () => {
  return <BondMetricsOverlay />;
};
