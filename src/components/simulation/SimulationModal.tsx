import React, { useRef, useEffect } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { renderScene } from '../../lib/canvas/animationPhysics';
import { OctetStatusBadge } from '../theory/OctetStatusBadge';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sparkles,
  Zap,
  Activity,
  ShieldCheck,
  Info
} from 'lucide-react';

export const SimulationModal: React.FC = () => {
  const {
    isAnimationModalOpen,
    closeAnimationModal,
    activeScenario,
    elements,
    selectedElements,
    scenarios,
    loadScenarioById,
    playbackStatus,
    setPlaybackStatus,
    progress,
    setProgress,
    stepForward,
    stepBackward,
    playbackSpeed,
    setPlaybackSpeed,
    bondAnalysis
  } = useSimulationStore();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  // Keyboard shortcut: Escape to close modal
  useEffect(() => {
    if (!isAnimationModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAnimationModal();
      } else if (e.key === ' ' && (e.target as HTMLElement)?.tagName !== 'INPUT') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnimationModalOpen, closeAnimationModal, playbackStatus, progress]);

  // Canvas animation loop inside modal
  useEffect(() => {
    if (!isAnimationModalOpen) return;

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

      // Update rotation angle for Bohr orbits
      rotationAngle += deltaSec * 1.5;

      // If playing, advance timeline progress
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
  }, [isAnimationModalOpen, activeScenario, elements, selectedElements, setProgress, setPlaybackStatus]);

  if (!isAnimationModalOpen) {
    return null;
  }

  const isPlayable = selectedElements.length > 0 || activeScenario !== null;

  const togglePlay = () => {
    if (!isPlayable) return;
    if (playbackStatus === 'playing') {
      setPlaybackStatus('paused');
    } else {
      if (progress >= 1) {
        setProgress(0);
      }
      setPlaybackStatus('playing');
    }
  };

  const deltaEN = bondAnalysis ? bondAnalysis.deltaEN : activeScenario ? activeScenario.deltaEN : null;
  const bondType = bondAnalysis ? bondAnalysis.bondType : activeScenario ? activeScenario.bondType : 'no-bond';

  let bondTypeLabel = 'Belirsiz Etkileşim';
  let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';

  if (bondType === 'ionic') {
    bondTypeLabel = 'İyonik Bağ (ΔEN > 1.7)';
    badgeColor = 'bg-sky-950/90 text-chem-ionic border-sky-600/70';
  } else if (bondType === 'polar-covalent') {
    bondTypeLabel = 'Polar Kovalent (0.4 < ΔEN ≤ 1.7)';
    badgeColor = 'bg-amber-950/90 text-chem-polar border-amber-600/70';
  } else if (bondType === 'nonpolar-covalent') {
    bondTypeLabel = 'Apolar Kovalent (ΔEN ≤ 0.4)';
    badgeColor = 'bg-emerald-950/90 text-chem-covalent border-emerald-600/70';
  } else if (bondType === 'inert' || bondType === 'no-bond') {
    bondTypeLabel = 'Asal / Tepkime Yok (no-bond)';
    badgeColor = 'bg-rose-950/90 text-chem-repulsion border-rose-600/70';
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

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 select-none animate-fadeIn"
      onClick={closeAnimationModal}
    >
      {/* Modal Dialog Window */}
      <div
        className="relative w-full max-w-6xl h-[92vh] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Bar */}
        <div className="h-14 bg-slate-950 border-b border-slate-700 px-4 flex items-center justify-between gap-3 flex-shrink-0">
          {/* Left: Brand & Formula info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded">
              <Zap className="w-4 h-4 text-chem-electron" />
              <span className="font-mono font-bold text-sm text-slate-50">
                {activeScenario ? activeScenario.formula : selectedElements.map(e => e.symbol).join(' + ')}
              </span>
              {activeScenario && (
                <span className="text-xs text-slate-400 font-sans hidden sm:inline">
                  ({activeScenario.nameTR})
                </span>
              )}
            </div>

            {/* ΔEN Badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-2.5 py-1.5 rounded font-mono text-xs">
              <Activity className="w-3.5 h-3.5 text-chem-transition" />
              <span className="text-slate-400">ΔEN =</span>
              <span className="font-bold text-chem-alkaline">
                {deltaEN !== null ? deltaEN.toFixed(2) : 'n/a'}
              </span>
            </div>

            {/* Bond Type Badge */}
            <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded border font-mono text-xs font-semibold ${badgeColor}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{bondTypeLabel}</span>
            </div>
          </div>

          {/* Center: Scenario Quick Switcher */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900 p-1 rounded border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 px-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-chem-alkaline" />
              Senaryolar:
            </span>
            {scenarios.map((sc) => {
              const isActive = activeScenario?.id === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => loadScenarioById(sc.id)}
                  className={`h-7 px-2.5 rounded font-mono text-xs font-semibold transition-colors flex items-center justify-center touch-target ${
                    isActive
                      ? 'bg-slate-800 text-slate-50 border border-chem-highlight'
                      : 'bg-transparent text-slate-400 hover:text-slate-200'
                  }`}
                  title={sc.nameTR}
                >
                  {sc.formula}
                </button>
              );
            })}
          </div>

          {/* Right: Close Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={closeAnimationModal}
              className="w-10 h-10 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-slate-50 hover:bg-slate-700 flex items-center justify-center transition-colors touch-target"
              title="Modalı Kapat (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Center Area: Full Scale Canvas */}
        <div ref={containerRef} className="relative flex-1 w-full bg-slate-950 overflow-hidden">
          {/* Live Step Explanation Floating HUD */}
          {currentStep && (
            <div className="absolute top-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-10 pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-3 rounded shadow-lg flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-chem-transition">
                    <Info className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{currentStep.titleTR}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-slate-400">
                    Adım {currentStepIndex + 1} / {steps.length}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {currentStep.descriptionTR}
                </p>
              </div>
            </div>
          )}

          {/* Floating Octet Badges inside Modal Top Right */}
          {selectedElements.length > 0 && (
            <div className="absolute top-4 right-4 z-10 hidden sm:flex flex-col gap-1.5 max-w-xs pointer-events-none">
              {selectedElements.map((el, i) => (
                <div key={`${el.symbol}-${i}`} className="pointer-events-auto">
                  <OctetStatusBadge element={el} progress={progress} />
                </div>
              ))}
            </div>
          )}

          <canvas
            ref={canvasRef}
            className="w-full h-full block cursor-crosshair"
          />
        </div>

        {/* Modal Bottom Playback Controls Bar */}
        <div className="bg-slate-900 border-t border-slate-700 px-4 md:px-6 py-3 flex flex-col gap-2.5 flex-shrink-0">
          {/* Timeline Scrubber */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 w-12 text-right">
              {Math.round(progress * 100)}%
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.005}
              value={progress}
              onChange={(e) => {
                setProgress(parseFloat(e.target.value));
                if (playbackStatus === 'playing') {
                  setPlaybackStatus('paused');
                }
              }}
              disabled={!isPlayable}
              className="flex-1 h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-chem-transition disabled:opacity-40"
            />
            <span className="text-xs font-mono text-slate-400 w-14">
              {progress >= 1 ? 'Tamamlandı' : 'Aşama'}
            </span>
          </div>

          {/* Bottom Buttons Bar */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* Left: Playback buttons */}
            <div className="flex items-center gap-2">
              {/* Step Back */}
              <button
                onClick={stepBackward}
                disabled={!isPlayable || progress <= 0}
                className="w-10 h-10 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-slate-50 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center transition-colors touch-target"
                title="Geri Adım (-10%)"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Play / Pause Primary Button */}
              <button
                onClick={togglePlay}
                disabled={!isPlayable}
                className={`h-10 px-5 rounded font-mono text-xs font-bold flex items-center gap-2 transition-colors touch-target ${
                  playbackStatus === 'playing'
                    ? 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                    : 'bg-chem-transition hover:bg-sky-400 text-slate-950'
                } disabled:opacity-40 disabled:hover:bg-chem-transition`}
                title={playbackStatus === 'playing' ? 'Durdur' : 'Oynat (Boşluk Tuşu)'}
              >
                {playbackStatus === 'playing' ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>DURDUR</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>OYNAT</span>
                  </>
                )}
              </button>

              {/* Step Forward */}
              <button
                onClick={stepForward}
                disabled={!isPlayable || progress >= 1}
                className="w-10 h-10 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-slate-50 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center transition-colors touch-target"
                title="İleri Adım (+10%)"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Reset */}
              <button
                onClick={() => {
                  setProgress(0);
                  setPlaybackStatus('paused');
                }}
                disabled={!isPlayable}
                className="w-10 h-10 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-slate-50 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center transition-colors touch-target ml-1"
                title="Başa Dön"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile / Compact Scenario Selector */}
            <div className="flex lg:hidden items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800">
              {scenarios.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => loadScenarioById(sc.id)}
                  className={`h-7 px-2 rounded font-mono text-[11px] font-semibold ${
                    activeScenario?.id === sc.id
                      ? 'bg-slate-800 text-slate-50 border border-chem-highlight'
                      : 'text-slate-400'
                  }`}
                >
                  {sc.formula}
                </button>
              ))}
            </div>

            {/* Right: Playback Speed Selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-700">
              <span className="text-[10px] font-mono text-slate-400 px-1.5 hidden sm:inline">Hız:</span>
              {[0.5, 1.0, 2.0].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`h-8 px-2.5 rounded text-xs font-mono font-semibold transition-colors touch-target ${
                    playbackSpeed === speed
                      ? 'bg-slate-800 text-slate-50 border border-slate-600'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
