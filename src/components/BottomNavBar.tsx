import React from 'react';
import { Truck, ShieldCheck, FileText, BookOpen, Menu } from 'lucide-react';

interface Props {
  activeTab: 'walkaround' | 'airbrake' | 'studyguide' | 'pdfviewer';
  onChangeTab: (tab: 'walkaround' | 'airbrake' | 'studyguide' | 'pdfviewer') => void;
  onOpenSuperMenu: () => void;
  outdoorMode: boolean;
  isSuperMenuOpen: boolean;
}

export const BottomNavBar: React.FC<Props> = ({
  activeTab,
  onChangeTab,
  onOpenSuperMenu,
  outdoorMode,
  isSuperMenuOpen
}) => {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 transition-colors duration-150 border-t backdrop-blur-xl md:hidden select-none ${
        outdoorMode
          ? 'bg-white/98 border-slate-300 text-slate-900 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]'
          : 'bg-slate-950/95 border-slate-800/90 text-white shadow-[0_-4px_25px_rgba(0,0,0,0.6)]'
      }`}
      style={{
        paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom, 0px))',
        paddingLeft: 'max(0.25rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(0.25rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <div className="grid grid-cols-5 h-14 sm:h-16 items-center px-1">
        {/* 1. Walkaround Tab */}
        <button
          type="button"
          onClick={() => onChangeTab('walkaround')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'walkaround' && !isSuperMenuOpen
              ? outdoorMode
                ? 'text-blue-700 font-black'
                : 'text-blue-400 font-black'
              : outdoorMode
              ? 'text-slate-500 hover:text-slate-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              activeTab === 'walkaround' && !isSuperMenuOpen
                ? outdoorMode
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-blue-500/20 text-blue-400 shadow-sm shadow-blue-500/30 ring-1 ring-blue-500/40'
                : ''
            }`}
          >
            <Truck className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 truncate">Walkaround</span>
        </button>

        {/* 2. Air Brake Tab */}
        <button
          type="button"
          onClick={() => onChangeTab('airbrake')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'airbrake' && !isSuperMenuOpen
              ? outdoorMode
                ? 'text-amber-600 font-black'
                : 'text-amber-400 font-black'
              : outdoorMode
              ? 'text-slate-500 hover:text-slate-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              activeTab === 'airbrake' && !isSuperMenuOpen
                ? outdoorMode
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-amber-500/20 text-amber-400 shadow-sm shadow-amber-500/30 ring-1 ring-amber-500/40'
                : ''
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 truncate">Air Brake</span>
        </button>

        {/* 3. Exam Scripts Tab */}
        <button
          type="button"
          onClick={() => onChangeTab('studyguide')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'studyguide' && !isSuperMenuOpen
              ? outdoorMode
                ? 'text-blue-700 font-black'
                : 'text-blue-400 font-black'
              : outdoorMode
              ? 'text-slate-500 hover:text-slate-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              activeTab === 'studyguide' && !isSuperMenuOpen
                ? outdoorMode
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-blue-500/20 text-blue-400 shadow-sm shadow-blue-500/30 ring-1 ring-blue-500/40'
                : ''
            }`}
          >
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 truncate">Scripts</span>
        </button>

        {/* 4. PDF Vault Tab */}
        <button
          type="button"
          onClick={() => onChangeTab('pdfviewer')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'pdfviewer' && !isSuperMenuOpen
              ? outdoorMode
                ? 'text-amber-600 font-black'
                : 'text-amber-300 font-black'
              : outdoorMode
              ? 'text-slate-500 hover:text-slate-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              activeTab === 'pdfviewer' && !isSuperMenuOpen
                ? outdoorMode
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gradient-to-tr from-amber-500/30 to-orange-500/30 text-amber-300 ring-1 ring-amber-500/50 shadow-sm shadow-amber-500/30'
                : ''
            }`}
          >
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 truncate font-bold">PDF Vault</span>
        </button>

        {/* 5. Super Menu Button */}
        <button
          type="button"
          onClick={onOpenSuperMenu}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
            isSuperMenuOpen
              ? outdoorMode
                ? 'text-blue-700 font-black'
                : 'text-sky-300 font-black'
              : outdoorMode
              ? 'text-slate-700 hover:text-slate-950'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-all ${
              isSuperMenuOpen
                ? outdoorMode
                  ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-500/40'
                  : 'bg-blue-600/30 text-sky-300 ring-1 ring-sky-400/50 shadow-sm shadow-sky-500/30'
                : 'bg-slate-800/60 text-sky-400'
            }`}
          >
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 truncate font-bold">Menu</span>
        </button>
      </div>
    </nav>
  );
};
