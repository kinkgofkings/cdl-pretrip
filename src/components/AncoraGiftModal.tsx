import React from 'react';
import { Award, Heart, ShieldCheck, GraduationCap, Truck, CheckCircle2, X, Star, BookOpen, Printer } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  outdoorMode?: boolean;
  onOpenPdf?: () => void;
}

export const AncoraGiftModal: React.FC<Props> = ({ isOpen, onClose, outdoorMode, onOpenPdf }) => {
  if (!isOpen) return null;

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
        className={`w-full max-w-2xl rounded-3xl p-5 sm:p-7 shadow-2xl transition-all border max-h-[92vh] overflow-y-auto ${
          outdoorMode
            ? 'bg-white border-4 border-slate-900 text-slate-950'
            : 'glass-card-elevated text-slate-100'
        }`}
      >
        {/* Header with Ancora Gold Emblem */}
        <div className="flex items-start justify-between gap-3 border-b pb-4 mb-5 border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25 flex-shrink-0">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  Special Gift Dedication
                </span>
                <span className="text-xs font-mono text-blue-400 font-bold">Class A CDL</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-0.5">Presented to Ancora Education</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full text-slate-400 hover:text-white transition ${
              outdoorMode ? 'bg-slate-200 text-slate-900' : 'bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dedication Letter / Tribute Card */}
        <div
          className={`p-5 rounded-2xl border mb-5 relative overflow-hidden ${
            outdoorMode
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-gradient-to-b from-amber-500/10 via-slate-900/80 to-slate-900/90 border-amber-500/40 text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2 text-amber-400 font-black text-xs uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>A Student&apos;s Gift of Gratitude</span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white mb-2">
            In Honor of Ancora Corporate Training & Instruction Staff
          </h3>

          <p className="text-xs sm:text-sm leading-relaxed mb-3 text-slate-300">
            &ldquo;This application is dedicated with sincere gratitude to Ancora Education and Laurel Ridge for the life-changing commercial driver training provided to me. In appreciation for the opportunity and mentorship, I built this comprehensive digital training suite as a permanent gift to empower future cohorts of Ancora commercial truck driving students.&rdquo;
          </p>

          <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-amber-300">
            <span>Built by a Proud Ancora CDL Graduate</span>
            <span className="font-mono">Class A Pre-Trip Master</span>
          </div>
        </div>

        {/* Core Capabilities Built for Ancora Instructors & Students */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            What This Platform Provides to Ancora:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-2.5 ${
                outdoorMode ? 'bg-slate-100 border-slate-300' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white mb-0.5">Word-for-Word Recitation Lab</strong>
                Speech recognition tool tests student verbal inspection skills word-for-word before DMV exam day.
              </div>
            </div>

            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-2.5 ${
                outdoorMode ? 'bg-slate-100 border-slate-300' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white mb-0.5">Interactive Air Brake Cluster</strong>
                Live gauges, 60s leak timer, 60 PSI low air warning buzzer, spring brake pops, and 128 PSI governor purge.
              </div>
            </div>

            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-2.5 ${
                outdoorMode ? 'bg-slate-100 border-slate-300' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white mb-0.5">11-Zone Walkaround Radar</strong>
                Covers all FMCSA Class A vehicle areas from Front Stance to Rear DOT bumper with GPS truck schematic.
              </div>
            </div>

            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-2.5 ${
                outdoorMode ? 'bg-slate-100 border-slate-300' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white mb-0.5">Outdoor High-Contrast Yard Mode</strong>
                Specially tuned for bright sunlight conditions on the Ancora practice pad and gravel staging lot.
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Dedicated with pride • Ancora Education Edition</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenPdf && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPdf();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 transition active:scale-95 shadow-md flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open PDF Vault</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white transition active:scale-95 shadow-md shadow-blue-600/30"
            >
              Start Inspection Training
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
