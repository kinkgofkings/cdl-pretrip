import React, { useState, useEffect } from 'react';
import { InspectionSection, InspectionItem } from '../types';
import {
  Search,
  Volume2,
  VolumeX,
  Mic,
  Play,
  Pause,
  FileText,
  CheckCircle2,
  ShieldAlert,
  Headphones,
  Square,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { tts, audioTour, AudioTourItem, AudioTourState } from '../utils/speech';

interface Props {
  sections: InspectionSection[];
  onOpenSpeechPractice: (item: InspectionItem) => void;
  onOpenVideoTutorial: (item: InspectionItem) => void;
  outdoorMode?: boolean;
  onOpenPdf?: () => void;
}

export const StudyGuideView: React.FC<Props> = ({
  sections,
  onOpenSpeechPractice,
  onOpenVideoTutorial,
  outdoorMode,
  onOpenPdf
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCriticalOnly, setFilterCriticalOnly] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [tourState, setTourState] = useState<AudioTourState>(audioTour.getState());

  useEffect(() => {
    return audioTour.subscribe(setTourState);
  }, []);

  const filteredSections = sections
    .map((sec) => {
      const items = sec.items.filter((item) => {
        const matchesSearch =
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.spokenScript &&
            item.spokenScript.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.details && item.details.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCritical = !filterCriticalOnly || item.critical;
        return matchesSearch && matchesCritical;
      });
      return { ...sec, items };
    })
    .filter((sec) => sec.items.length > 0);

  // Play entire guide (all sections and items in sequence)
  const handleListenAllSectionsInOrder = () => {
    if (tourState.isPlaying) {
      if (tourState.isPaused) {
        audioTour.resumeTour();
      } else {
        audioTour.pauseTour();
      }
      return;
    }

    const allItems: AudioTourItem[] = sections.flatMap((sec) =>
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

  // Play a single section's items in sequence
  const handleListenSectionInOrder = (sec: InspectionSection) => {
    if (tourState.isPlaying && tourState.currentItem?.sectionId === sec.id) {
      if (tourState.isPaused) {
        audioTour.resumeTour();
      } else {
        audioTour.pauseTour();
      }
      return;
    }

    const items: AudioTourItem[] = sec.items.map((it, idx) => ({
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
    }));

    audioTour.startTour(items, 0);
  };

  // Single item standalone speech
  const handleSpeakSingleItem = (itemId: string, script: string) => {
    if (speakingId === itemId) {
      tts.stop();
      setSpeakingId(null);
      return;
    }

    setSpeakingId(itemId);
    tts.speak(script, {
      onEnd: () => setSpeakingId(null),
      onError: () => setSpeakingId(null)
    });
  };

  return (
    <div
      className={`rounded-3xl p-4 sm:p-6 transition-all border shadow-2xl ${
        outdoorMode
          ? 'bg-white border-4 border-slate-900 text-slate-950'
          : 'glass-panel text-slate-100'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 mb-4 border-slate-700/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Full Ancora Study Guide
            </span>
            <span className="text-xs font-mono text-slate-400">Word-For-Word Master Scripts</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1">Class A CDL Exam Script Reference</h2>
          <p className="text-xs text-slate-400">
            Listen hands-free in exact sequence to memorize required state exam wording.
          </p>
        </div>

        {/* Search & Filter & PDF Vault Link */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <input
              type="text"
              placeholder="Search components or scripts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-40 sm:w-56 px-3 py-1.5 pl-8 rounded-xl text-xs font-medium border outline-none ${
                outdoorMode
                  ? 'bg-slate-100 border-slate-300 text-slate-900'
                  : 'bg-slate-900/80 border-slate-800 text-white'
              }`}
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          </div>

          <button
            onClick={() => setFilterCriticalOnly(!filterCriticalOnly)}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              filterCriticalOnly
                ? 'bg-red-600 text-white border-red-500'
                : outdoorMode
                ? 'bg-slate-100 text-slate-800 border-slate-300'
                : 'bg-slate-900/60 text-slate-400 border-slate-800'
            }`}
          >
            Critical Only
          </button>

          {onOpenPdf && (
            <button
              onClick={onOpenPdf}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition border flex items-center gap-1.5 active:scale-95 shadow-sm ${
                outdoorMode
                  ? 'bg-amber-100 text-amber-950 border-amber-400 hover:bg-amber-200'
                  : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
              }`}
              title="Open full 6-page Ancora original PDF in badass swipeable lightbox viewer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Open PDF Vault</span>
            </button>
          )}
        </div>
      </div>

      {/* Master Full-Guide Audio Tour Banner */}
      <div
        className={`p-4 sm:p-5 rounded-2xl mb-6 border transition-all ${
          tourState.isPlaying
            ? outdoorMode
              ? 'bg-blue-100 border-2 border-blue-600'
              : 'bg-blue-950/60 border-2 border-blue-500/60 shadow-lg shadow-blue-500/15'
            : outdoorMode
            ? 'bg-slate-100 border-slate-300'
            : 'bg-slate-900/70 border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                tourState.isPlaying
                  ? 'bg-blue-600 text-white animate-pulse'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}
            >
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>Continuous Audio Recitation Engine</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                  All Platforms & iOS
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Put your headphones on and listen to all inspection components and scripts spoken in order.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleListenAllSectionsInOrder}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg active:scale-95 ${
                tourState.isPlaying
                  ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 font-black'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
            >
              {tourState.isPlaying ? (
                tourState.isPaused ? (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Resume Audio Tour</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Audio Tour</span>
                  </>
                )
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Listen to Full Exam Scripts in Order</span>
                </>
              )}
            </button>

            {tourState.isPlaying && (
              <button
                onClick={() => audioTour.stopTour()}
                className="p-2.5 rounded-xl text-xs font-bold bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600/30 transition active:scale-95 flex items-center gap-1.5"
                title="Stop Audio Recitation Tour"
              >
                <Square className="w-4 h-4 fill-current" />
                <span className="hidden xs:inline">Stop</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {filteredSections.map((sec) => {
          const isThisSectionPlaying =
            tourState.isPlaying && tourState.currentItem?.sectionId === sec.id;

          return (
            <div
              key={sec.id}
              className={`p-4 sm:p-5 rounded-2xl border transition ${
                isThisSectionPlaying
                  ? 'ring-2 ring-blue-500/60 border-blue-400/80 bg-blue-950/20'
                  : outdoorMode
                  ? 'bg-slate-50 border-slate-300'
                  : 'bg-slate-900/50 border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between gap-2 border-b pb-3 mb-3 border-slate-700/40">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-400">SECTION {sec.number}</span>
                  <h3 className="text-base sm:text-lg font-extrabold">{sec.title}</h3>
                  <span className="text-xs text-slate-400">{sec.subtitle}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleListenSectionInOrder(sec)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 border ${
                      isThisSectionPlaying
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
                        : outdoorMode
                        ? 'bg-blue-100 text-blue-900 border-blue-300 hover:bg-blue-200'
                        : 'bg-blue-500/15 text-blue-300 border-blue-500/30 hover:bg-blue-500/25'
                    }`}
                    title={
                      isThisSectionPlaying
                        ? 'Pause/resume listening to this section'
                        : 'Listen to this entire section in order'
                    }
                  >
                    {isThisSectionPlaying ? (
                      tourState.isPaused ? (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      )
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {isThisSectionPlaying
                        ? tourState.isPaused
                          ? 'Resume Section'
                          : 'Pause Section'
                        : 'Listen in Order'}
                    </span>
                  </button>

                  {isThisSectionPlaying && (
                    <button
                      onClick={() => audioTour.stopTour()}
                      className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-950/40 border border-rose-500/30 transition"
                      title="Stop section recitation"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                    </button>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {sec.items.map((item) => {
                  const isItemSpeaking =
                    tourState.isPlaying && tourState.currentItem?.id === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isItemSpeaking
                          ? 'ring-2 ring-blue-500 border-blue-400 bg-blue-950/50 shadow-xl shadow-blue-500/20'
                          : outdoorMode
                          ? 'bg-white border-slate-300 shadow-sm'
                          : 'bg-slate-950/70 border-slate-800/80 shadow-md'
                      }`}
                    >
                      {/* Active audio speaking badge */}
                      {isItemSpeaking && (
                        <div className="mb-2 flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white flex items-center gap-1.5 shadow-sm">
                            <Volume2 className="w-3.5 h-3.5 animate-pulse" /> Speaking Now • Listen & Memorize
                          </span>
                        </div>
                      )}

                      {/* Header row: Label & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/60">
                        <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
                          <span className="font-black text-base sm:text-lg md:text-xl tracking-tight leading-snug">
                            {item.label}
                          </span>
                          {item.critical && (
                            <span className="px-2 py-0.5 rounded-md text-xs font-black uppercase bg-red-600 text-white shadow-sm flex-shrink-0">
                              Critical
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                          <button
                            onClick={() => onOpenVideoTutorial(item)}
                            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition flex items-center gap-1.5 ${
                              outdoorMode
                                ? 'bg-red-50 text-red-900 border-red-300 hover:bg-red-100'
                                : 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25'
                            }`}
                            title="Watch Component Video & Visual Guide"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Guide</span>
                          </button>
                          {item.spokenScript && (
                            <button
                              onClick={() => onOpenSpeechPractice(item)}
                              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition flex items-center gap-1.5 ${
                                outdoorMode
                                  ? 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100'
                                  : 'bg-blue-500/15 text-blue-300 border-blue-500/30 hover:bg-blue-500/25'
                              }`}
                              title="Practice Speech Word-For-Word with Microphone"
                            >
                              <Mic className="w-3.5 h-3.5" />
                              <span>Recite</span>
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleSpeakSingleItem(
                                item.id,
                                item.spokenScript || item.details || item.label
                              )
                            }
                            className={`p-2 rounded-xl text-xs sm:text-sm font-bold border transition ${
                              speakingId === item.id
                                ? 'bg-blue-600 text-white border-blue-400 animate-pulse'
                                : outdoorMode
                                ? 'bg-slate-200 text-slate-800 border-slate-300'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                            title="Speak this individual script alone"
                          >
                            {speakingId === item.id ? (
                              <VolumeX className="w-3.5 h-3.5" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* FULL-WIDTH Inspection Criteria Details */}
                      {item.details && (
                        <div className="mt-3 w-full">
                          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                            {item.details}
                          </p>
                        </div>
                      )}

                      {/* Verbatim Script Box */}
                      {item.spokenScript && (
                        <div
                          className={`mt-3 p-3 sm:p-4 rounded-xl text-xs sm:text-sm border transition-colors ${
                            isItemSpeaking
                              ? 'bg-blue-950/70 border-blue-400 text-blue-100'
                              : outdoorMode
                              ? 'bg-slate-100 border-slate-300 text-slate-900'
                              : 'bg-slate-900/60 border-slate-800/80 text-slate-200'
                          }`}
                        >
                          <span className="text-[11px] font-mono text-amber-400 font-bold block mb-1">
                            Exact Verbatim Script to Say:
                          </span>
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
          );
        })}
      </div>
    </div>
  );
};
