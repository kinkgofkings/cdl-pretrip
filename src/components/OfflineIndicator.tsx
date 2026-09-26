import React from 'react';
import { WifiOff, Wifi, CloudCheck } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface Props {
  outdoorMode?: boolean;
}

export const OfflineIndicator: React.FC<Props> = ({ outdoorMode }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return (
      <div
        className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
          outdoorMode
            ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        }`}
        title="Syncing progress in real-time"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Online & Synced</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg animate-bounce ${
        outdoorMode
          ? 'bg-amber-500 text-slate-950 border-2 border-slate-900'
          : 'bg-amber-500 text-slate-950 border border-amber-300 shadow-amber-500/30'
      }`}
    >
      <WifiOff className="w-3.5 h-3.5" />
      <span>Offline Mode — Progress Saved Locally</span>
    </div>
  );
};
