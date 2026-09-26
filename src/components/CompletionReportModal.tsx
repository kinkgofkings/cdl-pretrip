import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Printer,
  RotateCcw,
  X,
  ShieldCheck,
  GraduationCap,
  Star,
  FileCheck,
  Check
} from 'lucide-react';
import { UserProfile, InspectionSection } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  checkedItemIds: string[];
  totalItems: number;
  sections: InspectionSection[];
  onRestart: () => void;
  outdoorMode?: boolean;
}

export const CompletionReportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  profile,
  checkedItemIds,
  totalItems,
  sections,
  onRestart,
  outdoorMode
}) => {
  const [activeView, setActiveView] = useState<'scorecard' | 'certificate'>('scorecard');

  if (!isOpen) return null;

  const passedCount = checkedItemIds.length;
  const percentage = Math.round((passedCount / totalItems) * 100);
  const isPassed = percentage >= 85;
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md"
      style={{
        paddingTop: 'max(1rem, calc(env(safe-area-inset-top, 0px) + 0.5rem))',
        paddingBottom: 'max(1rem, calc(env(safe-area-inset-bottom, 0px) + 0.5rem))',
        paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <div
        className={`w-full max-w-2xl rounded-3xl p-5 sm:p-7 shadow-2xl transition-all border max-h-[94vh] overflow-y-auto ${
          outdoorMode
            ? 'bg-white border-4 border-slate-900 text-slate-950'
            : 'glass-card-elevated text-slate-100'
        }`}
      >
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 mb-4 border-slate-700/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" /> Ancora Education Edition
              </span>
              <span className="text-xs font-mono text-blue-400 font-bold">Class A CDL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-0.5">Pre-Trip Examination Record</h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* View Switcher Tabs */}
            <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveView('scorecard')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeView === 'scorecard'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" /> Scorecard
              </button>
              <button
                onClick={() => setActiveView('certificate')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeView === 'certificate'
                    ? 'bg-amber-500 text-slate-950 shadow font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" /> Certificate
              </button>
            </div>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-full text-slate-400 hover:text-white transition ${
                outdoorMode ? 'bg-slate-200 text-slate-900' : 'bg-slate-800'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VIEW 1: SCORECARD BREAKDOWN */}
        {activeView === 'scorecard' && (
          <>
            {/* Scorecard Hero Banner */}
            <div
              className={`p-5 rounded-2xl border text-center mb-4 transition-all ${
                isPassed
                  ? outdoorMode
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                    : 'bg-emerald-950/40 border-emerald-500/60 text-emerald-100'
                  : outdoorMode
                  ? 'bg-amber-50 border-amber-500 text-amber-950'
                  : 'bg-amber-950/40 border-amber-500/60 text-amber-100'
              }`}
            >
              <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-2 shadow-lg bg-black/20">
                {isPassed ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-amber-400" />
                )}
              </div>
              <span className="text-xs uppercase font-black tracking-widest block opacity-75">
                EXAM RESULT STATUS
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mt-0.5">
                {isPassed ? 'CDL ROAD READY: PASSED' : 'NEEDS ADDITIONAL WALK PRACTICE'}
              </h3>
              <p className="text-xs mt-1 font-medium max-w-sm mx-auto">
                {isPassed
                  ? 'Demonstrated strong word-for-word knowledge, physical point-and-touch technique, and air brake procedures.'
                  : 'Review missed inspection items and re-test air brake procedures before official exam day.'}
              </p>
            </div>

            {/* Candidate Details & Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-center text-xs">
              <div
                className={`p-2.5 rounded-xl border ${
                  outdoorMode ? 'bg-slate-100 border-slate-300' : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Driver</span>
                <span className="font-bold text-white truncate block">{profile.name || 'Candidate'}</span>
              </div>
              <div
                className={`p-2.5 rounded-xl border ${
                  outdoorMode ? 'bg-slate-100 border-slate-300' : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Items Checked</span>
                <span className="font-bold text-blue-400">
                  {passedCount} / {totalItems}
                </span>
              </div>
              <div
                className={`p-2.5 rounded-xl border ${
                  outdoorMode ? 'bg-slate-100 border-slate-300' : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Passing Grade</span>
                <span className="font-bold text-emerald-400">{percentage}%</span>
              </div>
              <div
                className={`p-2.5 rounded-xl border ${
                  outdoorMode ? 'bg-slate-100 border-slate-300' : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Institution</span>
                <span className="font-bold text-white truncate block">
                  {profile.schoolOrCompany || 'Ancora Education'}
                </span>
              </div>
            </div>

            {/* Section Breakdown List */}
            <div className="space-y-2 mb-5 max-h-56 overflow-y-auto pr-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Section by Section Verification:
              </span>
              {sections.map((sec) => {
                const sectionChecked = sec.items.filter((item) => checkedItemIds.includes(item.id)).length;
                const isSecComplete = sectionChecked === sec.items.length;

                return (
                  <div
                    key={sec.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                      outdoorMode
                        ? isSecComplete
                          ? 'bg-emerald-50 border-emerald-300'
                          : 'bg-slate-50 border-slate-200'
                        : isSecComplete
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                        : 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="font-mono text-blue-400">{sec.number}.</span>
                      <span className="truncate">{sec.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono flex-shrink-0">
                      <span>
                        {sectionChecked}/{sec.items.length}
                      </span>
                      {isSecComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="text-amber-400 text-[11px]">Pending</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* VIEW 2: OFFICIAL ANCORA CERTIFICATE */}
        {activeView === 'certificate' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white text-slate-950 border-4 border-amber-500 shadow-2xl relative mb-5 text-center print:border-2">
            {/* Certificate Header */}
            <div className="border-b-2 border-slate-200 pb-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <GraduationCap className="w-7 h-7 text-amber-600" />
                <span className="text-xs font-mono font-black uppercase tracking-widest text-slate-600">
                  ANCORA CORPORATE TRAINING & EDUCATION
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase font-serif">
                Certificate of Pre-Trip Mastery
              </h1>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">
                Commercial Driver License • Class A Combination Vehicle
              </p>
            </div>

            {/* Certificate Body */}
            <p className="text-xs text-slate-600 italic mb-2">This is to certify that candidate driver</p>
            <h2 className="text-2xl sm:text-4xl font-black text-blue-900 underline decoration-amber-400 underline-offset-8 mb-4 font-serif">
              {profile.name || 'Commercial Driver Candidate'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed mb-6 font-medium">
              Has completed the comprehensive 11-Zone Class A Pre-Trip Walkaround Inspection and verified modern 2024+ CDL Air Brake Systems with a final mastery score of{' '}
              <strong className="text-emerald-700 font-black">{percentage}%</strong> ({passedCount} of {totalItems} safety critical items).
            </p>

            {/* Seal & Signatures Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-left items-end">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Date Verified</span>
                <span className="text-xs font-bold font-mono text-slate-800">{currentDate}</span>
              </div>

              {/* Gold Center Seal */}
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-amber-500 text-slate-950 mx-auto flex items-center justify-center shadow-lg border-2 border-amber-300">
                  <Star className="w-7 h-7 fill-slate-950" />
                </div>
                <span className="text-[9px] uppercase font-black tracking-widest text-amber-700 block mt-1">
                  OFFICIAL CDL PASS
                </span>
              </div>

              <div className="text-right">
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Training Program</span>
                <span className="text-xs font-bold text-slate-800">{profile.schoolOrCompany || 'Ancora Education'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-700/50">
          <button
            onClick={() => window.print()}
            className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition active:scale-95 ${
              outdoorMode
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
          >
            <Printer className="w-4 h-4" /> Print Certificate / Save as PDF
          </button>

          <button
            onClick={onRestart}
            className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg active:scale-95 ${
              outdoorMode
                ? 'bg-blue-700 text-white hover:bg-blue-800'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
            }`}
          >
            <RotateCcw className="w-4 h-4" /> Start Fresh Walkaround
          </button>
        </div>
      </div>
    </div>
  );
};
