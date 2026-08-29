import React, { useRef, useEffect } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { renderScene } from '../../lib/canvas/animationPhysics';
import { BondMetricsOverlay } from './BondMetricsOverlay';

export const SimulationCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    progress,
    setProgress,
    playbackStatus,
    playbackSpeed,
    activeScenario,
    elements,
    selectedElements,
    setPlaybackStatus
  } = useSimulationStore();

  const progressRef = useRef(progress);
  const playbackStatusRef = useRef(playbackStatus);
  const playbackSpeedRef = useRef(playbackSpeed);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    playbackStatusRef.current = playbackStatus;
  }, [playbackStatus]);

  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotationAngle = 0;
    let lastTimestamp = performance.now();

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;

      canvas.width = Math.floor(rect.width * scale);
      canvas.height = Math.floor(rect.height * scale);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.resetTransform?.();
      ctx.scale(scale, scale);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const loop = (currentTimestamp: number) => {
      const deltaSec = (currentTimestamp - lastTimestamp) / 1000;
      lastTimestamp = currentTimestamp;

      // Update rotation angle for Bohr orbits (always rotating smoothly)
      rotationAngle += deltaSec * 1.5;

      // If playing, advance timeline progress
      if (playbackStatusRef.current === 'playing') {
        const totalDuration = 4.0 / playbackSpeedRef.current; // 4 seconds per complete reaction at 1x
        const nextProgress = progressRef.current + deltaSec / totalDuration;

        if (nextProgress >= 1) {
          setProgress(1);
          setPlaybackStatus('completed');
        } else {
          setProgress(nextProgress);
        }
      }

      const rect = container.getBoundingClientRect();

      renderScene(ctx, rect.width, rect.height, {
        progress: progressRef.current,
        rotation: rotationAngle,
        flashProgress: 0,
        scenario: activeScenario,
        elementsMap: elements,
        selectedElements: selectedElements
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [activeScenario, elements, selectedElements, setProgress, setPlaybackStatus]);

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
