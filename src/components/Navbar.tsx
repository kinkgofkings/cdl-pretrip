import React, { useState, useEffect } from 'react';
import {
  Truck,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  User,
  ShieldCheck,
  Award,
  FileText,
  Type,
  BookOpen,
  Menu,
  GraduationCap
} from 'lucide-react';
import { UserProfile, FontSizeOption } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { OfflineIndicator } from './OfflineIndicator';

interface Props {
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
  onOpenSplash?: () => void;
  onOpenAncoraGift?: () => void;
  onOpenSuperMenu: () => void;
  progressPercent: number;
  isLoggedIn?: boolean;
}

export const Navbar: React.FC<Props> = ({
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
  onOpenSplash,
  onOpenAncoraGift,
  onOpenSuperMenu,
  progressPercent,
  isLoggedIn
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth < 768 || /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768 || /android|iphone|ipad|ipod/i.test(navigator.userAgent));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header
      className={`ios-header mobile-header-safe sticky top-0 z-30 transition-colors duration-150 border-b backdrop-blur-xl w-full max-w-full ${
        outdoorMode
          ? 'bg-white/95 border-slate-300 text-slate-950 shadow-sm'
          : 'bg-slate-950/90 border-slate-800/80 text-white'
      }`}
      style={{
        paddingTop: isMobile
          ? 'max(env(safe-area-inset-top, 0px), 0.75rem)'
          : 'max(env(safe-area-inset-top, 0px), 0px)',
        paddingLeft: 'max(0px, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(0px, env(safe-area-inset-right, 0px))',
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 w-full">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink min-w-0">
          <div
            onClick={onOpenSplash}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 cursor-pointer active:scale-95 transition ${
              outdoorMode
                ? 'bg-blue-700 text-white'
                : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/25'
            }`}
            title="Class A CDL Pre-Trip"
          >
            <Truck className="w-5 h-5" />
          </div>
          <div className="min-w-0 truncate">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-black tracking-tight uppercase truncate">
                <span>Class A CDL</span>
                <span className="text-blue-500 ml-1">Pre-Trip</span>
              </h1>
            </div>
            <div className="text-[10px] text-slate-400 hidden lg:block">
              Front-to-Back Walkaround & Air Brake Mastery
            </div>
          </div>
        </div>

        {/* Center Mode Nav Tabs - Desktop Only (md and above) */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800 text-xs flex-shrink-0">
          <button
            type="button"
            onClick={() => onChangeTab('walkaround')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'walkaround'
                ? outdoorMode
                  ? 'bg-blue-700 text-white shadow'
                  : 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Walk-Around</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('airbrake')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'airbrake'
                ? outdoorMode
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-amber-500 text-slate-950 shadow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Air Brake Sim</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('studyguide')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'studyguide'
                ? outdoorMode
                  ? 'bg-blue-700 text-white shadow'
                  : 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Exam Scripts</span>
          </button>

          {/* Dedicated Badass PDF Vault Tab */}
          <button
            type="button"
            onClick={() => onChangeTab('pdfviewer')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pdfviewer'
                ? outdoorMode
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black'
                : 'text-amber-400 hover:text-amber-300'
            }`}
            title="Open Dedicated Badass PDF Lightbox Viewer with swipe and breadcrumbs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>PDF Vault</span>
          </button>
        </div>

        {/* Right utility buttons: Completely Decluttered */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Desktop-only quick tools (Keeps mobile clean) */}
          <div className="hidden md:flex items-center gap-1.5">
            {/* Offline Sync Badge */}
            <OfflineIndicator outdoorMode={outdoorMode} />

            {/* PWA Install Button */}
            <PWAInstallButton outdoorMode={outdoorMode} />

            {/* Super Menu Desktop Button */}
            <button
              type="button"
              onClick={onOpenSuperMenu}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition active:scale-95 border flex items-center gap-1.5 shadow-sm cursor-pointer ${
                outdoorMode
                  ? 'bg-slate-100 text-slate-900 border-slate-300 hover:bg-slate-200'
                  : 'bg-slate-900/80 text-sky-300 border-sky-500/40 hover:bg-slate-800'
              }`}
              title="Super Menu: Quick Access to Tools, PDF Vault, Audio Tour, and Reset"
            >
              <Menu className="w-4 h-4 text-sky-400" />
              <span className="font-mono">Super Menu</span>
            </button>

            {/* Voice Guidance Toggle */}
            <button
              type="button"
              onClick={onToggleVoiceGuided}
              className={`p-2 rounded-xl text-xs font-semibold transition active:scale-95 flex items-center gap-1 border flex-shrink-0 cursor-pointer ${
                voiceGuided
                  ? outdoorMode
                    ? 'bg-blue-100 text-blue-900 border-blue-400'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-sm'
                  : outdoorMode
                  ? 'bg-white text-slate-400 border-slate-300'
                  : 'bg-slate-900/60 text-slate-500 border-slate-800'
              }`}
              title={voiceGuided ? 'Voice Guidance Active (Audio Coach)' : 'Voice Guidance Muted'}
            >
              {voiceGuided ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Font Size Scaling Toggle */}
            <button
              type="button"
              onClick={onCycleFontSize}
              className={`p-2 rounded-xl text-xs font-black transition active:scale-95 border flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                fontSize === 'xlarge'
                  ? outdoorMode
                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : fontSize === 'large'
                  ? outdoorMode
                    ? 'bg-blue-100 text-blue-900 border-blue-400'
                    : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : outdoorMode
                  ? 'bg-white text-slate-700 border-slate-300'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
              title={`Font Size: ${
                fontSize === 'xlarge' ? 'Extra Large (135% - Yard Vision)' : fontSize === 'large' ? 'Large (115% - High Legibility)' : 'Standard (100%)'
              }`}
            >
              <Type className="w-4 h-4" />
              <span className="font-mono text-[11px] font-black">
                {fontSize === 'xlarge' ? 'A++' : fontSize === 'large' ? 'A+' : 'A'}
              </span>
            </button>
          </div>

          {/* Outdoor Daylight Mode Switch (Visible on Mobile & Desktop) */}
          <button
            type="button"
            onClick={onToggleOutdoorMode}
            className={`p-2 rounded-xl text-xs font-semibold transition active:scale-95 border flex-shrink-0 cursor-pointer ${
              outdoorMode
                ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
            title={outdoorMode ? 'Switch to Dark Mode' : 'Switch to Outdoor High-Contrast Daylight Mode'}
          >
            {outdoorMode ? <Sun className="w-4 h-4 text-amber-950" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Profile Avatar Button (Visible on Mobile & Desktop) */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="relative flex items-center p-0.5 rounded-xl transition active:scale-95 group focus:outline-none flex-shrink-0 cursor-pointer"
            title={isLoggedIn ? `Logged In: ${profile.name || profile.email}` : 'Profile & Settings'}
          >
            <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-800 border-2 border-blue-500/50 flex items-center justify-center shadow-md">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-slate-300" />
              )}
            </div>
            {isLoggedIn && (
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border-2 border-slate-950" />
            )}
          </button>
        </div>
      </div>

      {/* Global walk progress micro-bar across entire screen width */}
      <div className="w-full bg-slate-900 h-1 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
};
