import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Download, Monitor, Smartphone, X, ExternalLink, MoreVertical, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  outdoorMode?: boolean;
}

export const InstallPromptModal: React.FC<Props> = ({ isOpen, onClose, outdoorMode }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isWindows, isDesktop, install } = usePWAInstall();
  const [installing, setInstalling] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [browserType, setBrowserType] = useState<'chrome' | 'edge' | 'safari' | 'other'>('chrome');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.includes('edg/')) {
        setBrowserType('edge');
      } else if (ua.includes('crios') || ua.includes('chrome')) {
        setBrowserType('chrome');
      } else if (ua.includes('safari') && !ua.includes('chrome')) {
        setBrowserType('safari');
      } else {
        setBrowserType('other');
      }
    }
  }, []);

  // Lock background body scroll whenever modal is open
  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNativeInstallClick = async () => {
    setInstalling(true);
    setStatusMsg(null);
    const result = await install();
    setInstalling(false);

    if (result === 'accepted') {
      setStatusMsg('Installation initiated! Check your home screen / desktop.');
      setTimeout(() => onClose(), 1600);
    } else if (result === 'dismissed') {
      setStatusMsg('Installation prompt cancelled.');
    } else {
      // Manual needed (Android Chrome 3-dots, desktop address bar, or iOS share)
      if (isAndroid) {
        setStatusMsg('Tap the 3 dots (⋮) in Chrome top-right, then select "Install app".');
      } else if (isDesktop) {
        setStatusMsg('Use the browser address bar icon (⊕) or browser menu.');
      } else {
        setStatusMsg('Use the browser Share menu to Add to Home Screen.');
      }
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] overflow-y-auto bg-black/90 p-3 sm:p-4 backdrop-blur-xl flex flex-col justify-start sm:justify-center items-center"
      style={{
        paddingTop: 'max(1rem, calc(env(safe-area-inset-top, 0px) + 0.5rem))',
        paddingBottom: 'max(2rem, calc(env(safe-area-inset-bottom, 0px) + 1rem))',
        paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0px))',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl transition-all border my-auto relative z-10 ${
          outdoorMode
            ? 'bg-white border-4 border-slate-900 text-slate-950 shadow-2xl'
            : 'bg-slate-900 text-slate-100 border-2 border-blue-500/50 shadow-2xl shadow-black'
        }`}
      >
        {/* Header - Always visible at the top */}
        <div className="flex items-center justify-between border-b pb-3.5 mb-4 border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
              {isDesktop ? (
                <Monitor className="w-5 h-5" />
              ) : (
                <Smartphone className="w-5 h-5 text-emerald-300" />
              )}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                {isAndroid
                  ? 'Install Android App (WebAPK)'
                  : isDesktop
                  ? 'Save App to PC Desktop'
                  : 'Install CDL Pre-Trip App'}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {isAndroid
                  ? 'Full Android app with launcher icon, splash screen & offline cache'
                  : isWindows
                  ? 'Windows EliteOne PC / Chrome / Edge App'
                  : 'Instant offline access on the truck yard'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition flex-shrink-0 bg-slate-800/60"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div className="mb-4 p-3 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* 1-Click Install Button */}
        <div className="mb-4">
          <button
            onClick={handleNativeInstallClick}
            disabled={installing}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 ${
              outdoorMode
                ? 'bg-blue-700 hover:bg-blue-800 text-white'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>
              {installing
                ? 'Launching Android Installer...'
                : isInstallable
                ? 'Install Android App Now'
                : isAndroid
                ? 'Tap to Launch Android App Install'
                : isDesktop
                ? 'Trigger Desktop App Install'
                : 'Install CDL App'}
            </span>
          </button>
          <p className="text-[11px] text-center text-slate-400 mt-2">
            {isAndroid
              ? 'Installs as a standalone APK app like LightsOut or Aura with native splash screen & app icon.'
              : isDesktop
              ? 'Creates a standalone desktop icon with independent window & full offline caching.'
              : 'Works offline with zero cellular data.'}
          </p>
        </div>

        {/* Dedicated Android Chrome Guide */}
        {isAndroid && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-700 text-xs space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                Chrome on Android (WebAPK Direct Install)
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                Standalone App
              </span>
            </div>

            {/* Step 1: 3-dots */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <div className="font-bold text-white mb-0.5 flex items-center gap-1.5">
                  <span>Tap Chrome's Top-Right Menu</span>
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[11px] font-mono border border-slate-700">
                    ⋮ (3 dots)
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Look at the top-right corner of your browser screen (next to the address bar) and tap the <strong>three vertical dots (⋮)</strong>.
                </p>
              </div>
            </div>

            {/* Step 2: Install app */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <div className="font-bold text-white mb-0.5">
                  Select <span className="text-emerald-400">"Install app"</span> (Not "Create shortcut")
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  In the menu, tap <strong>"Install app"</strong>, then tap <strong>Install</strong> on the confirmation banner.
                </p>
              </div>
            </div>

            {/* Step 3: Success info */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <div className="font-bold text-white mb-0.5">Full Android App (WebAPK)</div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Installed in your app drawer with its own app icon and animated launch splash screen. Opens completely independent of Chrome!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Specific Desktop (EliteOne PC) Instructions */}
        {isDesktop && (
          <div className="space-y-4 mb-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-700 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-blue-400" />
                  {browserType === 'edge' ? 'Microsoft Edge on Windows' : 'Google Chrome on Windows (EliteOne PC)'}
                </span>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                  EliteOne Ready
                </span>
              </div>

              {/* Step 1: Address Bar icon */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <div className="font-bold text-white mb-0.5">Check Your Browser Address Bar (Top Right)</div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Look at the right end of the URL address bar at the top of your screen:
                    {browserType === 'edge' ? (
                      <> Click the <strong className="text-white">App Available (⊞ or ⊕)</strong> icon and click <strong className="text-blue-400">Install</strong>.</>
                    ) : (
                      <> Click the <strong className="text-white">Install App (monitor with down arrow or ⊕)</strong> icon and click <strong className="text-blue-400">Install</strong>.</>
                    )}
                  </p>
                </div>
              </div>

              {/* Step 2: Browser Menu */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <div className="font-bold text-white mb-0.5">Or From the Browser Menu:</div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {browserType === 'edge' ? (
                      <>
                        Click the <strong className="text-white">three dots (⋯)</strong> in Edge top-right → <strong className="text-white">Apps</strong> → <strong className="text-blue-400">"Install this site as an app"</strong> → check <strong className="text-white">"Create Desktop shortcut"</strong>.
                      </>
                    ) : (
                      <>
                        Click the <strong className="text-white">three dots (⋮)</strong> in Chrome top-right → <strong className="text-white">Save and share</strong> → <strong className="text-blue-400">"Install Class A CDL Pre-Trip..."</strong>.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* iOS Instructions */}
        {isIOS && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-700 text-xs space-y-2 mb-4">
            <div className="font-bold text-amber-300">iPhone / iPad Step:</div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              1. Tap the <strong className="text-white">Share</strong> button (square with arrow up) at the bottom.<br />
              2. Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong>.<br />
              3. Tap <strong className="text-white">Add</strong> in the top-right corner.
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
        >
          Close
        </button>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
