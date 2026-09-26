import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, Download, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { InstallPromptModal } from './InstallPromptModal';

interface Props {
  outdoorMode?: boolean;
}

export const AppInstallBanner: React.FC<Props> = ({ outdoorMode }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isWindows, isDesktop, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cdl_install_banner_dismissed_v2') === 'true';
    } catch {
      return false;
    }
  });
  const [showModal, setShowModal] = useState(false);

  if (isInstalled || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem('cdl_install_banner_dismissed_v2', 'true');
    } catch {
      // Ignore
    }
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome === 'accepted') {
        return;
      }
    }
    setShowModal(true);
  };

  return (
    <>
      <div
        className={`w-full border-b transition-colors px-3 py-2 text-xs flex items-center justify-between gap-2 select-none ${
          outdoorMode
            ? 'bg-amber-100 border-amber-400 text-amber-950 font-medium'
            : 'bg-gradient-to-r from-blue-950/90 via-slate-900 to-indigo-950/90 border-blue-500/30 text-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
          <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center">
            {isDesktop ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          </div>
          <p className="truncate text-[11px] sm:text-xs">
            <strong className="text-white font-bold mr-1.5">
              {isWindows
                ? 'Windows PC / EliteOne:'
                : isDesktop
                ? 'Desktop User:'
                : isAndroid
                ? 'Android Phone:'
                : isIOS
                ? 'iPhone / iPad:'
                : 'Mobile Device:'}
            </strong>
            <span className="text-slate-300">
              {isDesktop
                ? 'Save this app to your Desktop & Taskbar for instant offline practice'
                : 'Install to Home Screen for full-screen offline CDL study on the yard'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleInstallClick}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 ${
              outdoorMode
                ? 'bg-blue-700 text-white hover:bg-blue-800'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
            }`}
          >
            <Download className="w-3 h-3" />
            <span>{isDesktop ? 'Save to PC' : 'Install App'}</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <InstallPromptModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        outdoorMode={outdoorMode}
      />
    </>
  );
};
