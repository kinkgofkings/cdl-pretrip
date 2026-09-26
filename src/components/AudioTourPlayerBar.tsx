import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Square,
  Volume2,
  ChevronUp,
  ChevronDown,
  Gauge,
  Headphones,
  CheckCircle2
} from 'lucide-react';
import { audioTour, AudioTourState } from '../utils/speech';

interface Props {
  outdoorMode?: boolean;
}

export const AudioTourPlayerBar: React.FC<Props> = ({ outdoorMode }) => {
  const [state, setState] = useState<AudioTourState>(audioTour.getState());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = audioTour.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  if (!state.isPlaying) {
    return null;
  }

  const { currentItem, currentIndex, totalItems, isPaused, playbackRate } = state;
  if (!currentItem) return null;

  const cycleRate = () => {
    if (playbackRate <= 0.85) audioTour.setPlaybackRate(1.0);
    else if (playbackRate <= 1.0) audioTour.setPlaybackRate(1.15);
    else audioTour.setPlaybackRate(0.85);
  };

  return (
    <div
      className="fixed bottom-16 md:bottom-2 left-0 right-0 z-50 transition-all duration-300 pointer-events-auto"
      style={{
        paddingBottom: 'max(0.25rem, calc(env(safe-area-inset-bottom, 0px) + 0.15rem))',
        paddingLeft: 'max(0.5rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(0.5rem, env(safe-area-inset-right, 0px))'
      }}
    >
      <div className="max-w-4xl mx-auto px-3">
        <div
          className={`rounded-2xl shadow-2xl border transition-all ${
            outdoorMode
              ? 'bg-white border-2 border-slate-900 text-slate-950 shadow-slate-900/30'
              : 'bg-slate-950/95 border-2 border-blue-500/50 text-white backdrop-blur-2xl shadow-black/80'
          }`}
        >
          {/* Expanded Drawer: Full Script preview */}
          {isExpanded && (
            <div className={`p-4 border-b text-xs leading-relaxed max-h-48 overflow-y-auto ${
              outdoorMode ? 'border-slate-300 bg-slate-50' : 'border-slate-800 bg-slate-900/80 text-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Target Verbatim Script Recitation
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {currentItem.critical && (
                    <span className="text-red-400 font-black mr-2">● CRITICAL ITEM</span>
                  )}
                  Item {currentIndex + 1} of {totalItems}
                </span>
              </div>
              <p className="font-semibold text-sm sm:text-base text-blue-300">
                "{currentItem.spokenScript || currentItem.label}"
              </p>
              {currentItem.physicalAction && (
                <p className="text-[11px] text-amber-300/90 mt-1 italic">
                  Physical Action: {currentItem.physicalAction}
                </p>
              )}
            </div>
          )}

          {/* Player Main Controls Bar */}
          <div className="p-2.5 sm:p-3 flex items-center justify-between gap-2">
            {/* Left: Indicator & Track Details */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden ${
                  outdoorMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                }`}
              >
                {!isPaused ? (
                  <div className="flex items-center gap-0.5 h-4">
                    <span className="w-1 bg-white rounded-full animate-pulse h-2" />
                    <span className="w-1 bg-white rounded-full animate-pulse h-4" />
                    <span className="w-1 bg-white rounded-full animate-pulse h-3" />
                  </div>
                ) : (
                  <Headphones className="w-4 h-4 text-white" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 font-bold truncate">
                    Sec {currentItem.sectionNumber}: {currentItem.sectionTitle}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {currentIndex + 1}/{totalItems}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-black truncate text-white">
                  {currentItem.label}
                </h4>
              </div>
            </div>

            {/* Middle: Playback Actions */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Previous */}
              <button
                onClick={() => audioTour.prevItem()}
                className={`p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white transition active:scale-95 ${
                  outdoorMode ? 'hover:bg-slate-200 text-slate-700' : 'hover:bg-slate-800'
                }`}
                title="Previous Component"
              >
                <SkipBack className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              {/* Play / Pause Toggle */}
              <button
                onClick={() => {
                  if (isPaused) audioTour.resumeTour();
                  else audioTour.pauseTour();
                }}
                className="p-2 sm:p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/40 transition active:scale-95 flex items-center justify-center"
                title={isPaused ? 'Resume Audio Recitation' : 'Pause Audio Recitation'}
              >
                {isPaused ? (
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                ) : (
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={() => audioTour.nextItem()}
                className={`p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white transition active:scale-95 ${
                  outdoorMode ? 'hover:bg-slate-200 text-slate-700' : 'hover:bg-slate-800'
                }`}
                title="Next Component"
              >
                <SkipForward className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              {/* Speed Cycle Button */}
              <button
                onClick={cycleRate}
                className={`px-2 py-1.5 rounded-xl text-[10px] font-mono font-bold border transition active:scale-95 ${
                  outdoorMode
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-slate-900 border-slate-800 text-amber-400'
                }`}
                title="Change Speaking Pace"
              >
                {playbackRate}x
              </button>
            </div>

            {/* Right: Expand & Stop */}
            <div className="flex items-center gap-1 flex-shrink-0 pl-1 border-l border-slate-800/80">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`p-1.5 rounded-xl text-slate-400 hover:text-white transition ${
                  outdoorMode ? 'hover:bg-slate-200 text-slate-700' : 'hover:bg-slate-800'
                }`}
                title={isExpanded ? 'Collapse script preview' : 'View full verbatim text script'}
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>

              <button
                onClick={() => audioTour.stopTour()}
                className={`p-1.5 rounded-xl text-rose-400 hover:text-rose-300 transition ${
                  outdoorMode ? 'hover:bg-rose-100' : 'hover:bg-rose-950/40'
                }`}
                title="Stop Audio Recitation Tour"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
