import React from 'react';
import { useChemistryStore } from '../../store/useChemistryStore';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

export const PlaybackControls: React.FC = () => {
  const {
    playbackStatus,
    setPlaybackStatus,
    progress,
    setProgress,
    stepForward,
    stepBackward,
    playbackSpeed,
    setPlaybackSpeed,
    activeScenario,
    selectedElements
  } = useChemistryStore();

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

  return (
    <div className="bg-slate-900 border-t border-slate-700 px-4 py-2.5 flex flex-col gap-2 select-none">
      {/* Timeline Scrubber */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-mono text-slate-400 w-12 text-right">
          {Math.round(progress * 100)}%
        </span>
        <input
          type="range"
          aria-label="Simülasyon ilerlemesi"
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
          className="touch-target min-w-0 flex-1 h-10 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-chem-transition disabled:opacity-40"
        />
        <span className="text-[11px] font-mono text-slate-400 w-12">
          {progress >= 1 ? 'Bitti' : 'Adım'}
        </span>
      </div>

      {/* Button Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: Step and Play Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Step Back */}
          <button
            onClick={stepBackward}
            disabled={!isPlayable || progress <= 0}
            className="w-9 h-9 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-slate-50 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center transition-colors touch-target"
            title="Geri Adım (-10%)"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={togglePlay}
            disabled={!isPlayable}
            className={`h-9 px-4 rounded font-mono text-xs font-bold flex items-center gap-2 transition-colors touch-target ${
              playbackStatus === 'playing'
                ? 'bg-amber-600 hover:bg-amber-500 text-[#0B0F17]'
                : 'bg-chem-transition hover:bg-sky-400 text-[#0B0F17]'
            } disabled:opacity-40 disabled:hover:bg-chem-transition`}
            title={playbackStatus === 'playing' ? 'Durdur' : 'Oynat'}
          >
            {playbackStatus === 'playing' ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Duraklat</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Oynat</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={stepForward}
            disabled={!isPlayable || progress >= 1}
            className="w-9 h-9 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-slate-50 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center transition-colors touch-target"
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
            className="w-9 h-9 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-slate-50 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center transition-colors touch-target ml-1"
            title="Başa Dön"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Playback Speed Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-700">
          {[0.5, 1.0, 2.0].map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`h-7 px-2 rounded text-[11px] font-mono font-semibold transition-colors touch-target ${
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
  );
};
