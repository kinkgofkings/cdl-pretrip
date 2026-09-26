import React, { useRef, useState, useEffect } from 'react';
import { InspectionSection, InspectionItem } from '../types';
import {
  Check,
  Volume2,
  VolumeX,
  Mic,
  Play,
  Pause,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  Headphones,
  Square,
  Sparkles
} from 'lucide-react';
import { tts, audioTour, AudioTourItem, AudioTourState } from '../utils/speech';

interface Props {
  section: InspectionSection;
  sectionIndex: number;
  totalSections: number;
  checkedItemIds: string[];
  onToggleItem: (id: string) => void;
  onNextSection: () => void;
  onPrevSection: () => void;
  onOpenSpeechPractice: (item: InspectionItem) => void;
  onOpenVideoTutorial: (item: InspectionItem) => void;
  outdoorMode?: boolean;
  voiceGuided?: boolean;
  allSections?: InspectionSection[];
}

export const SectionCard: React.FC<Props> = ({
  section,
  sectionIndex,
  totalSections,
  checkedItemIds,
  onToggleItem,
  onNextSection,
  onPrevSection,
  onOpenSpeechPractice,
  onOpenVideoTutorial,
  outdoorMode,
  voiceGuided,
  allSections
}) => {
  const [speakingItemId, setSpeakingItemId] = useState<string | null>(null);
  const [tourState, setTourState] = useState<AudioTourState>(audioTour.getState());
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  useEffect(() => {
    return audioTour.subscribe(setTourState);
  }, []);

  // Swipe detection: swipe left -> next, swipe right -> prev
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 60;

    if (distance > minSwipeDistance && sectionIndex < totalSections - 1) {
      onNextSection();
    } else if (distance < -minSwipeDistance && sectionIndex > 0) {
      onPrevSection();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const handleSpeakItemScript = (item: InspectionItem) => {
    if (speakingItemId === item.id) {
      tts.stop();
      setSpeakingItemId(null);
      return;
    }

    const textToSpeak = item.spokenScript || item.details || item.label;
    setSpeakingItemId(item.id);
    tts.speak(textToSpeak, {
      onEnd: () => setSpeakingItemId(null),
      onError: () => setSpeakingItemId(null)
    });
  };

  const isSectionTourPlaying =
    tourState.isPlaying && tourState.currentItem?.sectionId === section.id;

  const handleListenThisSection = () => {
    if (isSectionTourPlaying) {
      if (tourState.isPaused) {
        audioTour.resumeTour();
      } else {
        audioTour.pauseTour();
      }
      return;
    }

    const items: AudioTourItem[] = section.items.map((it, idx) => ({
      id: it.id,
      sectionId: section.id,
      sectionNumber: section.number,
      sectionTitle: section.title,
      itemIndex: idx,
      totalInSection: section.items.length,
      label: it.label,
      spokenScript: it.spokenScript || it.details || it.label,
      physicalAction: it.physicalAction,
      critical: it.critical
    }));
    audioTour.startTour(items, 0);
  };

  const handleListenAllWalkaround = () => {
    if (!allSections) return;
    const allItems: AudioTourItem[] = allSections.flatMap((sec) =>
      sec.items.map((it, idx) => ({
        id: it.id,
        sectionId: sec.id,
        sectionNumber: sec.number,
        sectionTitle: sec.title,
        itemIndex: idx,
        totalInSection: sec.items.length,
        label: it.label,
        spokenScript: it.spokenScript || it.details || it.label,
        physicalAction: it.physicalAction,
        critical: it.critical
      }))
    );
    audioTour.startTour(allItems, 0);
  };

  const allItemsChecked = section.items.every((it) => checkedItemIds.includes(it.id));

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`rounded-3xl p-4 sm:p-6 transition-colors duration-200 border flex flex-col justify-between shadow-2xl relative select-none ${
        outdoorMode
          ? 'bg-white border-4 border-slate-900 text-slate-950'
          : 'glass-panel text-slate-100'
      }`}
    >
      {/* Top Banner / Category header */}
      <div>
        <div className="border-b pb-4 mb-4 border-slate-700/50">
          {/* Top Row: Section Number Badge (Left) and Checked Progress Badge (Right) */}
          <div className="flex items-center justify-between gap-2 w-full mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                outdoorMode
                  ? 'bg-blue-200 text-blue-950 font-black'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold'
              }`}
            >
              Section {section.number} of {totalSections}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-black border flex-shrink-0 ${
                allItemsChecked
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : outdoorMode
                  ? 'bg-slate-100 text-slate-800 border-slate-300'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700'
              }`}
            >
              {section.items.filter((it) => checkedItemIds.includes(it.id)).length} / {section.items.length} Checked
            </span>
          </div>

          {/* Section Title: Takes full 100% card width */}
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight w-full text-inherit">
            {section.title}
          </h2>

          {/* Subtitle / Focus Areas: Takes full 100% card width */}
          {section.subtitle && (
            <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-1.5 leading-relaxed w-full">
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Critical Range Rule Banner */}
        {section.criticalRule && (
          <div
            className={`p-4 rounded-2xl mb-4 text-sm sm:text-base font-semibold flex items-start gap-3 border shadow-sm ${
              outdoorMode
                ? 'bg-amber-100 border-2 border-amber-600 text-amber-950'
                : 'bg-amber-500/15 border-amber-500/40 text-amber-200'
            }`}
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
            <div>
              <span className="uppercase text-xs sm:text-sm tracking-wider block font-black text-amber-500 mb-0.5">
                EXAM MANDATE / CRITICAL RANGE RULE:
              </span>
              <span className="leading-relaxed">{section.criticalRule}</span>
            </div>
          </div>
        )}

        {/* Continuous Audio Memorization Bar */}
        <div
          className={`p-3.5 sm:p-4 rounded-2xl mb-5 border transition-all ${
            isSectionTourPlaying
              ? outdoorMode
                ? 'bg-blue-100 border-2 border-blue-600'
                : 'bg-blue-950/60 border-2 border-blue-500/60 shadow-lg shadow-blue-500/15'
              : outdoorMode
              ? 'bg-slate-100 border-slate-300'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isSectionTourPlaying
                    ? 'bg-blue-600 text-white animate-pulse'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}
              >
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                  <span>Audio Memorization Mode</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 uppercase font-bold">
                    Hands-Free
                  </span>
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  Listen to the instructor voice recite every item and script in exact order.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Listen to This Section in Order */}
              <button
                onClick={handleListenThisSection}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95 ${
                  isSectionTourPlaying
                    ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 font-black'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                }`}
              >
                {isSectionTourPlaying ? (
                  tourState.isPaused ? (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Resume Section</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause Recitation</span>
                    </>
                  )
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Listen to Section in Order</span>
                  </>
                )}
              </button>

              {/* Stop button if playing */}
              {isSectionTourPlaying && (
                <button
                  onClick={() => audioTour.stopTour()}
                  className="p-2 rounded-xl text-xs font-bold bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600/30 transition active:scale-95"
                  title="Stop Recitation"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              )}

              {/* Listen to Full Walkaround */}
              {allSections && !isSectionTourPlaying && (
                <button
                  onClick={handleListenAllWalkaround}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition border active:scale-95 ${
                    outdoorMode
                      ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-200'
                      : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300'
                  }`}
                  title="Listen to all 11 walkaround sections from start to finish"
                >
                  Listen All 11 Sections
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Items Checklist for this walkaround section */}
        <div className="space-y-4 mb-6">
          {section.items.map((item) => {
            const isChecked = checkedItemIds.includes(item.id);
            const isCurrentlySpeaking =
              tourState.isPlaying && tourState.currentItem?.id === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl p-4 sm:p-5 transition-all border ${
                  isCurrentlySpeaking
                    ? 'ring-2 ring-blue-500 border-blue-400 bg-blue-950/40 shadow-xl shadow-blue-500/20'
                    : isChecked
                    ? outdoorMode
                      ? 'bg-emerald-50 border-2 border-emerald-600'
                      : 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                    : outdoorMode
                    ? 'bg-slate-50 border-2 border-slate-300 hover:border-slate-400'
                    : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Currently speaking indicator badge */}
                {isCurrentlySpeaking && (
                  <div className="mb-2 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white flex items-center gap-1.5 shadow-sm">
                      <Volume2 className="w-3.5 h-3.5 animate-pulse" /> Speaking Now • Listen & Memorize
                    </span>
                  </div>
                )}

                {/* Header row: Checkbox, Label & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
                  <div
                    onClick={() => onToggleItem(item.id)}
                    className="flex items-center gap-3.5 cursor-pointer select-none min-w-0 flex-1"
                  >
                    <button
                      type="button"
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all flex-shrink-0 border ${
                        isChecked
                          ? outdoorMode
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-500/30'
                          : outdoorMode
                          ? 'bg-white border-slate-400 hover:border-slate-600'
                          : 'bg-slate-800 border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      {isChecked && <Check className="w-5 h-5 stroke-[3.5]" />}
                    </button>

                    <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
                      <span
                        className={`text-base sm:text-lg md:text-xl font-black tracking-tight leading-snug ${
                          isChecked ? 'line-through opacity-70' : ''
                        }`}
                      >
                        {item.label}
                      </span>
                      {item.critical && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-black uppercase tracking-wider bg-red-600 text-white shadow-sm flex-shrink-0">
                          Critical
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right side utility buttons: Video Tutorial & Voice Practice */}
                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                    {/* Component Walkthrough & Audio Guide Button */}
                    <button
                      onClick={() => onOpenVideoTutorial(item)}
                      className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 flex items-center gap-1.5 border ${
                        outdoorMode
                          ? 'bg-blue-100 text-blue-900 border-blue-300 hover:bg-blue-200'
                          : 'bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/25'
                      }`}
                      title="Component Walkthrough, Touch Points & Audio Guide"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Guide</span>
                    </button>

                    {/* Word-For-Word Practice Button */}
                    {item.spokenScript && (
                      <button
                        onClick={() => onOpenSpeechPractice(item)}
                        className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 flex items-center gap-1.5 border ${
                          outdoorMode
                            ? 'bg-blue-100 text-blue-900 border-blue-400 hover:bg-blue-200'
                            : 'bg-blue-600/20 text-blue-300 border-blue-500/40 hover:bg-blue-600/30'
                        }`}
                        title="Word-For-Word Speech Recitation Practice"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Recite</span>
                      </button>
                    )}

                    {/* Single Item Listen Button */}
                    <button
                      onClick={() => handleSpeakItemScript(item)}
                      className={`p-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 border ${
                        speakingItemId === item.id
                          ? 'bg-blue-600 text-white border-blue-400 animate-pulse'
                          : outdoorMode
                          ? 'bg-slate-200 text-slate-800 border-slate-300 hover:bg-slate-300'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                      title="Listen to this component script alone"
                    >
                      {speakingItemId === item.id ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* FULL-WIDTH Inspection Criteria Details */}
                {item.details && (
                  <div className="mt-3 w-full">
                    <p className={`text-sm sm:text-base text-slate-200 leading-relaxed font-normal ${
                      isChecked ? 'opacity-70' : ''
                    }`}>
                      {item.details}
                    </p>
                  </div>
                )}

                {/* Spoken Script Callout Box */}
                {item.spokenScript && (
                  <div
                    className={`mt-3.5 p-3 sm:p-4 rounded-xl text-xs sm:text-sm border transition-colors ${
                      isCurrentlySpeaking
                        ? 'bg-blue-950/70 border-blue-400/80 text-blue-100'
                        : outdoorMode
                        ? 'bg-slate-100 border-slate-300 text-slate-900'
                        : 'bg-slate-950/80 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400 uppercase font-black mb-1">
                      <span>Exact Verbatim Script To Say:</span>
                    </div>
                    <p className="font-semibold text-white leading-relaxed">
                      "{item.spokenScript}"
                    </p>
                    {item.physicalAction && (
                      <p className="mt-1 text-[11px] text-amber-300/80 italic font-medium">
                        Physical Demonstration: {item.physicalAction}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation between sections */}
      <div className="flex items-center justify-between gap-3 pt-5 border-t border-slate-700/50 mt-4">
        <button
          onClick={onPrevSection}
          disabled={sectionIndex === 0}
          className={`px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition flex items-center gap-2 border active:scale-95 ${
            sectionIndex === 0
              ? 'opacity-40 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-600'
              : outdoorMode
              ? 'bg-slate-200 border-slate-400 text-slate-900 hover:bg-slate-300'
              : 'bg-slate-800/90 border-slate-700 text-white hover:bg-slate-700'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden xs:inline">Previous Section</span>
          <span className="xs:hidden">Prev</span>
        </button>

        <span className="text-xs font-mono font-bold text-slate-400">
          Section {sectionIndex + 1} of {totalSections}
        </span>

        <button
          onClick={onNextSection}
          disabled={sectionIndex === totalSections - 1}
          className={`px-5 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition flex items-center gap-2 border active:scale-95 shadow-lg ${
            sectionIndex === totalSections - 1
              ? 'opacity-40 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-600'
              : outdoorMode
              ? 'bg-blue-700 border-blue-800 text-white hover:bg-blue-800'
              : 'bg-blue-600 hover:bg-blue-500 border-blue-400 text-white shadow-blue-600/30'
          }`}
        >
          <span className="hidden xs:inline">Next Section</span>
          <span className="xs:hidden">Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
