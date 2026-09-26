import React from 'react';
import { InspectionSection } from '../types';
import { Compass, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

interface Props {
  sections: InspectionSection[];
  activeSectionIndex: number;
  completedSectionIds: string[];
  onSelectSection: (index: number) => void;
  outdoorMode?: boolean;
}

export const WalkaroundRadar: React.FC<Props> = ({
  sections,
  activeSectionIndex,
  completedSectionIds,
  onSelectSection,
  outdoorMode
}) => {
  const current = sections[activeSectionIndex];

  return (
    <div
      className={`rounded-2xl p-3 sm:p-4 transition-colors duration-200 ${
        outdoorMode
          ? 'bg-slate-100 border-2 border-slate-900 shadow-md'
          : 'glass-panel shadow-xl'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${outdoorMode ? 'bg-blue-200 text-blue-900' : 'bg-blue-500/20 text-blue-400'}`}>
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <span className={`text-[10px] uppercase font-bold tracking-wider ${outdoorMode ? 'text-slate-700' : 'text-blue-400'}`}>
              Walkaround Position Radar
            </span>
            <div className={`text-xs sm:text-sm font-extrabold truncate max-w-[200px] sm:max-w-xs ${outdoorMode ? 'text-slate-950' : 'text-white'}`}>
              {current?.title || 'Inspection Step'}
            </div>
          </div>
        </div>

        {/* Step indicator pill */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSelectSection(Math.max(0, activeSectionIndex - 1))}
            disabled={activeSectionIndex === 0}
            className={`p-1.5 rounded-lg text-xs transition disabled:opacity-30 ${
              outdoorMode
                ? 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-200'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="Previous Section (or swipe right)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
            outdoorMode
              ? 'bg-slate-900 text-white'
              : 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
          }`}>
            {activeSectionIndex + 1} / {sections.length}
          </span>
          <button
            onClick={() => onSelectSection(Math.min(sections.length - 1, activeSectionIndex + 1))}
            disabled={activeSectionIndex === sections.length - 1}
            className={`p-1.5 rounded-lg text-xs transition disabled:opacity-30 ${
              outdoorMode
                ? 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-200'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="Next Section (or swipe left)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Step Breadcrumbs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar scroll-smooth">
        {sections.map((sec, idx) => {
          const isActive = idx === activeSectionIndex;
          const isDone = completedSectionIds.includes(sec.id);

          return (
            <button
              key={sec.id}
              onClick={() => onSelectSection(idx)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 whitespace-nowrap ${
                isActive
                  ? outdoorMode
                    ? 'bg-blue-700 text-white shadow-md'
                    : 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 ring-2 ring-blue-400/50'
                  : isDone
                  ? outdoorMode
                    ? 'bg-emerald-100 text-emerald-950 border border-emerald-500'
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : outdoorMode
                  ? 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span>{sec.number}.</span>
              <span className="hidden xs:inline truncate max-w-[100px]">{sec.title.split('/')[0].trim()}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Mini Visual Truck Graphic with Walking Path dot */}
      <div className={`mt-2 p-2.5 rounded-xl flex items-center justify-between text-[11px] ${
        outdoorMode ? 'bg-white border border-slate-300 text-slate-800' : 'bg-slate-900/60 border border-slate-800/80 text-slate-300'
      }`}>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
          <span className="font-semibold">Current Physical Zone:</span>
          <span className={`px-2 py-0.5 rounded font-mono font-bold ${
            outdoorMode ? 'bg-blue-100 text-blue-900' : 'bg-blue-500/20 text-blue-300'
          }`}>
            {current.vehicleLocation.toUpperCase().replace('_', ' ')}
          </span>
        </div>
        <div className="text-[10px] text-slate-400 hidden sm:block">
          Swipe left/right or use arrow buttons to move around vehicle
        </div>
      </div>
    </div>
  );
};
