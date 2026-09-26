import React, { useState, useEffect } from 'react';
import { Smartphone, Volume2, X, Share, PlusSquare, Info } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  outdoorMode?: boolean;
}

export const IOSPromptBanner: React.FC<Props> = ({ outdoorMode }) => {
  const { isIOS, isInstalled } = usePWAInstall();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cdl_ios_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const [showModal, setShowModal] = useState(false);
  const [isChromeOnIOS, setIsChromeOnIOS] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      const isCriOS = ua.includes('crios'); // Chrome on iOS user agent token
      setIsChromeOnIOS(isCriOS);
    }
  }, []);

  if (!isIOS || isInstalled || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem('cdl_ios_banner_dismissed', 'true');
    } catch {
      // Ignore
    }
  };

  return (
    <>
      <div
        className={`w-full border-b transition-colors px-3 py-2 text-xs flex items-center justify-between gap-2 select-none ${
          outdoorMode
            ? 'bg-amber-100 border-amber-400 text-amber-950 font-medium'
            : 'bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border-blue-500/30 text-slate-200'
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center">
            <Smartphone className="w-3.5 h-3.5" />
          </div>
          <p className="truncate text-[11px] sm:text-xs">
            <strong className="text-white font-bold mr-1">
              {isChromeOnIOS ? 'iOS Chrome User:' : 'iPhone / iPad User:'}
            </strong>
            <span>Install to Home Screen & audio guidelines for iOS</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setShowModal(true)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
              outdoorMode
                ? 'bg-blue-700 text-white hover:bg-blue-800'
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-sm'
            }`}
          >
            <span>Setup Guide</span>
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

      {/* iOS Modal with Full Visual Step-by-Step for Chrome & Safari */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-md">
          <div
            className={`w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl transition-all border max-h-[90vh] overflow-y-auto ${
              outdoorMode
                ? 'bg-white border-4 border-slate-900 text-slate-950'
                : 'glass-card-elevated text-slate-100 border-blue-500/30'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3 mb-4 border-slate-700/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">iPhone & iPad Master Guide</h3>
                  <span className="text-[11px] text-slate-400">Audio playback & Home Screen installation</span>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Audio / Listen Fix for iPhone */}
            <div className="mb-5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
              <div className="flex items-center gap-2 mb-1.5">
                <Volume2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Hear The "Listen" Audio On iPhone:
                </h4>
              </div>
              <ul className="text-xs space-y-1.5 list-disc list-inside leading-relaxed text-slate-300">
                <li>
                  <strong className="text-white">Check Your Silent Switch:</strong> Apple silences web speech if the
                  physical switch on the left side of your iPhone is set to <span className="text-amber-400">Silent (showing orange)</span>. Turn it to <strong className="text-white">Ring</strong>.
                </li>
                <li>
                  <strong className="text-white">Turn Up Volume:</strong> Increase the device volume on the side buttons while tapping "Listen".
                </li>
                <li>
                  <strong className="text-white">Audio Chime:</strong> When you tap Listen, you will hear a confirmation chime as iOS speech begins.
                </li>
              </ul>
            </div>

            {/* Section 2: Installing to Home Screen */}
            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-2">
                <PlusSquare className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-400">
                  How To Add To Home Screen:
                </h4>
              </div>

              {isChromeOnIOS ? (
                /* Chrome on iOS Instructions */
                <div className="space-y-2.5 text-xs text-slate-300 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>Google Chrome on iOS:</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                      1
                    </span>
                    <p>
                      Tap the <strong className="text-white">Share</strong> icon <Share className="w-3.5 h-3.5 inline text-blue-400" /> or the <strong className="text-white">⋯ (three dots)</strong> menu in Chrome.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                      2
                    </span>
                    <p>
                      Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong> (iOS 16.4+) or select <strong className="text-white">"Open in Safari"</strong> to install.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                      3
                    </span>
                    <p>
                      Launch from your Home Screen for a dedicated full-screen inspection app with offline storage.
                    </p>
                  </div>
                </div>
              ) : (
                /* Safari Instructions */
                <div className="space-y-2.5 text-xs text-slate-300 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>Safari on iOS:</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                      1
                    </span>
                    <p>
                      Tap the <strong className="text-white">Share button</strong> <Share className="w-3.5 h-3.5 inline text-blue-400" /> (square with upward arrow) at the bottom of the screen.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                      2
                    </span>
                    <p>
                      Scroll down the menu and tap <strong className="text-white">"Add to Home Screen"</strong> with the plus sign icon.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                      3
                    </span>
                    <p>
                      Tap <strong className="text-white">Add</strong> in the top right. The CDL app icon will appear directly on your home screen!
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full rounded-2xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5"
            >
              <span>I Understand — Back To Inspection</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
