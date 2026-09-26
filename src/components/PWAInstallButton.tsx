import React, { useState } from 'react';
import { Download, Monitor, Smartphone, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { InstallPromptModal } from './InstallPromptModal';

interface Props {
  outdoorMode?: boolean;
}

export const PWAInstallButton: React.FC<Props> = ({ outdoorMode }) => {
  const { isInstallable, isInstalled, isIOS, isDesktop, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  if (isInstalled) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold ${
          outdoorMode
            ? 'bg-emerald-100 text-emerald-900 border border-emerald-500'
            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        }`}
      >
        <CheckCircle2 className="w-3 h-3" />
        <span className="hidden sm:inline">Installed</span>
      </span>
    );
  }

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome === 'accepted') {
        return;
      }
    }
    // If not accepted or browser requires menu / address bar action (Desktop PC / iOS)
    setShowModal(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95 flex-shrink-0 ${
          outdoorMode
            ? 'bg-blue-700 text-white hover:bg-blue-800'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20'
        }`}
        title={
          isDesktop
            ? 'Save App to your EliteOne PC Desktop (Chrome / Edge)'
            : 'Install app to your home screen for quick offline access'
        }
      >
        {isDesktop ? <Monitor className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">{isDesktop ? 'Save to PC' : 'Install App'}</span>
        <span className="sm:hidden">Install</span>
      </button>

      <InstallPromptModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        outdoorMode={outdoorMode}
      />
    </>
  );
};
