import { useEffect, useRef } from 'react';
import { IRenderEngine } from './IRenderEngine';
import { defaultBohrEngine } from './CanvasBohrEngine';
import { useChemistryStore } from '../../store/useChemistryStore';
import { ElementData, PlaybackStatus, ReactionScenario } from '../../types/chemistry';

export interface UseCanvasRendererOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  engine?: IRenderEngine;
  active?: boolean;

  // Optional manual overrides for dependency injection / headless testing
  scenario?: ReactionScenario | null;
  elements?: Record<string, ElementData>;
  selectedElements?: ElementData[];
  progress?: number;
  playbackStatus?: PlaybackStatus;
  playbackSpeed?: number;
  setProgress?: (progress: number) => void;
  setPlaybackStatus?: (status: PlaybackStatus) => void;
}

/**
 * SRP & DIP Abstraction Layer for Canvas Rendering.
 * Decouples the React component mounting from imperative HTML5 canvas setup,
 * device-pixel-ratio scaling, and requestAnimationFrame render loop.
 *
 * Injects IRenderEngine (DIP) rather than depending on concrete atom renderer functions.
 */
export function useCanvasRenderer(options: UseCanvasRendererOptions) {
  const chemStore = useChemistryStore();

  const {
    canvasRef,
    containerRef,
    engine = defaultBohrEngine,
    active = true,
    scenario = chemStore.activeScenario,
    elements = chemStore.elements,
    selectedElements = chemStore.selectedElements,
    progress = chemStore.progress,
    playbackStatus = chemStore.playbackStatus,
    playbackSpeed = chemStore.playbackSpeed,
    setProgress = chemStore.setProgress,
    setPlaybackStatus = chemStore.setPlaybackStatus
  } = options;

  const progressRef = useRef(progress);
  const playbackStatusRef = useRef(playbackStatus);
  const playbackSpeedRef = useRef(playbackSpeed);
  const scenarioRef = useRef(scenario);
  const elementsRef = useRef(elements);
  const selectedElementsRef = useRef(selectedElements);

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
    scenarioRef.current = scenario;
  }, [scenario]);

  useEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  useEffect(() => {
    selectedElementsRef.current = selectedElements;
  }, [selectedElements]);

  useEffect(() => {
    if (!active) return;

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

      engine.resize(rect.width, rect.height, scale);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const loop = (currentTimestamp: number) => {
      const deltaSec = (currentTimestamp - lastTimestamp) / 1000;
      lastTimestamp = currentTimestamp;

      // Update rotation angle for Bohr orbits
      rotationAngle += deltaSec * 1.5;

      // Advance timeline if playing
      if (playbackStatusRef.current === 'playing') {
        const totalDuration = 4.0 / playbackSpeedRef.current;
        const nextProgress = progressRef.current + deltaSec / totalDuration;

        if (nextProgress >= 1) {
          setProgress(1);
          setPlaybackStatus('completed');
        } else {
          setProgress(nextProgress);
        }
      }

      engine.render(ctx, {
        progress: progressRef.current,
        rotation: rotationAngle,
        flashProgress: 0,
        scenario: scenarioRef.current,
        elementsMap: elementsRef.current,
        selectedElements: selectedElementsRef.current
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [active, canvasRef, containerRef, engine, setProgress, setPlaybackStatus]);
}
