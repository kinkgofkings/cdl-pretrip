import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Menu,
  X,
  BookOpen,
  Truck,
  ShieldCheck,
  FileText,
  Volume2,
  VolumeX,
  Type,
  Sun,
  Moon,
  Award,
  GraduationCap,
  User,
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { UserProfile, FontSizeOption } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'walkaround' | 'airbrake' | 'studyguide' | 'pdfviewer';
  onChangeTab: (tab: 'walkaround' | 'airbrake' | 'studyguide' | 'pdfviewer') => void;
  outdoorMode: boolean;
  onToggleOutdoorMode: () => void;
  voiceGuided: boolean;
  onToggleVoiceGuided: () => void;
  fontSize: FontSizeOption;
  onCycleFontSize: () => void;
  profile: UserProfile;
  onOpenProfile: () => void;
  onOpenReport: () => void;
  onOpenAncoraGift?: () => void;
  progressPercent: number;
  isLoggedIn?: boolean;
}

export const SuperMenuModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activeTab,
  onChangeTab,
  outdoorMode,
  onToggleOutdoorMode,
  voiceGuided,
  onToggleVoiceGuided,
  fontSize,
  onCycleFontSize,
  profile,
  onOpenProfile,
  onOpenReport,
  onOpenAncoraGift,
  progressPercent,
  isLoggedIn
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-3xl p-4 sm:p-6 shadow-2xl border flex flex-col max-h-[92vh] overflow-hidden ${
          outdoorMode
            ? 'bg-white border-2 border-slate-950 text-slate-950 shadow-2xl'
            : 'bg-slate-900 border-slate-700 text-white shadow-2xl shadow-blue-950/80'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Menu className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-inherit flex items-center gap-1.5">
                <span>CDL Super Menu</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h3>
              <p className="text-[10px] text-slate-400">Master Navigation & Inspection Tools</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl text-xs font-bold transition active:scale-95 border cursor-pointer ${
              outdoorMode
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto space-y-3.5 pr-1 py-1 no-scrollbar">
          {/* FEATURED: Ancora PDF Vault Callout Card */}
          <div
            onClick={() => {
              onChangeTab('pdfviewer');
              onClose();
            }}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all active:scale-98 ${
              activeTab === 'pdfviewer'
                ? 'ring-2 ring-amber-400 bg-amber-500/20 border-amber-400'
                : outdoorMode
                ? 'bg-amber-50 border-2 border-amber-400 hover:bg-amber-100'
                : 'bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/50 hover:border-amber-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-sm">
                Master Official PDF
              </span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">6 Original Pages</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black flex-shrink-0 shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-black text-inherit">Ancora PDF Vault</div>
                <div className="text-xs text-slate-400 leading-snug">
                  Badass Lightbox swipe viewer with touch swipe, breadcrumbs & speech recitation
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-400 flex-shrink-0" />
            </div>
          </div>

          {/* Core Training Sections */}
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-1">
              Training Modes
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  onChangeTab('walkaround');
                  onClose();
                }}
                className={`p-3 rounded-xl text-left transition border flex sm:flex-col items-center sm:items-start gap-2.5 cursor-pointer ${
                  activeTab === 'walkaround'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                    : outdoorMode
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Walkaround Radar</div>
                  <div className="text-[10px] text-slate-400">11-Zone step-by-step</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onChangeTab('airbrake');
                  onClose();
                }}
                className={`p-3 rounded-xl text-left transition border flex sm:flex-col items-center sm:items-start gap-2.5 cursor-pointer ${
                  activeTab === 'airbrake'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : outdoorMode
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 font-bold shadow">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Air Brake Sim</div>
                  <div className="text-[10px] text-slate-400">Leak, alarm & pop test</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onChangeTab('studyguide');
                  onClose();
                }}
                className={`p-3 rounded-xl text-left transition border flex sm:flex-col items-center sm:items-start gap-2.5 cursor-pointer ${
                  activeTab === 'studyguide'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                    : outdoorMode
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 font-bold shadow">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Exam Scripts</div>
                  <div className="text-[10px] text-slate-400">Exact spoken text</div>
                </div>
              </button>
            </div>
          </div>

          {/* Audio & Display Preferences */}
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-1">
              Audio & Display Controls
            </div>

            <div className="space-y-2">
              {/* Voice Guidance Switch */}
              <div
                onClick={onToggleVoiceGuided}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  outdoorMode
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    voiceGuided ? 'bg-blue-600 text-white shadow' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {voiceGuided ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold">Voice Guidance (Audio Coach)</div>
                    <div className="text-[10px] text-slate-400">
                      {voiceGuided ? 'Active — reciting walkaround scripts' : 'Muted'}
                    </div>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase ${
                  voiceGuided ? 'bg-blue-600 text-white shadow' : 'bg-slate-700 text-slate-300'
                }`}>
                  {voiceGuided ? 'ON' : 'OFF'}
                </span>
              </div>

              {/* Font Size Selector */}
              <div
                className={`p-3 rounded-xl border ${
                  outdoorMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/60 border-slate-700/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold">Yard Vision Font Scaling</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {fontSize === 'xlarge' ? '135% (Yard)' : fontSize === 'large' ? '115% (Large)' : '100% (Standard)'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={onCycleFontSize}
                    className={`py-1.5 rounded-lg text-xs font-black transition border text-center cursor-pointer ${
                      fontSize === 'normal'
                        ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                        : outdoorMode
                        ? 'bg-white border-slate-300 text-slate-800'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    A (100%)
                  </button>
                  <button
                    type="button"
                    onClick={onCycleFontSize}
                    className={`py-1.5 rounded-lg text-xs font-black transition border text-center cursor-pointer ${
                      fontSize === 'large'
                        ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                        : outdoorMode
                        ? 'bg-white border-slate-300 text-slate-800'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    A+ (115%)
                  </button>
                  <button
                    type="button"
                    onClick={onCycleFontSize}
                    className={`py-1.5 rounded-lg text-xs font-black transition border text-center cursor-pointer ${
                      fontSize === 'xlarge'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                        : outdoorMode
                        ? 'bg-white border-slate-300 text-slate-800'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    A++ (135%)
                  </button>
                </div>
              </div>

              {/* Outdoor Daylight Switch */}
              <div
                onClick={onToggleOutdoorMode}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  outdoorMode
                    ? 'bg-amber-100 border-amber-300 text-amber-950'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    outdoorMode ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {outdoorMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold">Outdoor Daylight Mode</div>
                    <div className="text-[10px] text-slate-400">
                      {outdoorMode ? 'High-contrast bright daylight mode active' : 'Dark glassmorphic night theme'}
                    </div>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase ${
                  outdoorMode ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-700 text-slate-300'
                }`}>
                  {outdoorMode ? 'DAY' : 'DARK'}
                </span>
              </div>
            </div>
          </div>

          {/* Tools & Tributes */}
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-1">
              Tools & Recognition
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Scorecard & Exam Report */}
              <button
                type="button"
                onClick={() => {
                  onOpenReport();
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                  outdoorMode ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>Scorecard</span>
                    <span className="text-[10px] font-mono px-1.5 rounded bg-blue-600/30 text-blue-300">{progressPercent}%</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Checklist progress & results</div>
                </div>
              </button>

              {/* Ancora Gift Tribute */}
              {onOpenAncoraGift && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenAncoraGift();
                    onClose();
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                    outdoorMode ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold">Ancora Tribute</div>
                    <div className="text-[10px] text-slate-400 truncate">Dedicated to instructors</div>
                  </div>
                </button>
              )}

              {/* Driver Profile */}
              <button
                type="button"
                onClick={() => {
                  onOpenProfile();
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                  outdoorMode ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold">Driver Profile</div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {isLoggedIn ? profile.name || profile.email : 'Login & Biometrics'}
                  </div>
                </div>
              </button>

              {/* Quick Reload App */}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                  outdoorMode ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-700/40 text-slate-300 border border-slate-600 flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold">Reload App</div>
                  <div className="text-[10px] text-slate-400 truncate">Refresh cache and views</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-700/60 mt-2 flex items-center justify-between text-[11px] text-slate-400 flex-shrink-0">
          <span className="font-mono text-[10px]">Ancora Education Edition</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow active:scale-95 transition cursor-pointer"
          >
            Close Menu
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
