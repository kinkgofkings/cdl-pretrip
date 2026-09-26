import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, ChevronRight, Fingerprint, User, LogIn, LogOut, CheckCircle2, Lock, ArrowRight, Sun, Moon, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { authenticateWithBiometrics } from '../utils/auth';

interface Props {
  onEnter: () => void;
  onOpenPdf?: () => void;
  isLoggedIn: boolean;
  onLogin: (email: string, name?: string) => void;
  onLogout: () => void;
  profile: UserProfile;
  outdoorMode: boolean;
  onToggleOutdoorMode: () => void;
}

const TELEMETRY_MESSAGES = [
  'AIR BRAKE COMPRESSOR AT 128 PSI • GOVERNOR CUT-OFF READY',
  '4/32" STEER TREAD & 2/32" DRIVE/TRAILER CHECKED',
  '11-ZONE FRONT-TO-BACK WALKAROUND MATRIX CALIBRATED',
  'ANCORA WORD-FOR-WORD CDL SCRIPT RECITATION LOADED',
  'SYSTEMS CERTIFIED: READY FOR PRE-TRIP INSPECTION'
];

export const SplashScreen: React.FC<Props> = ({
  onEnter,
  onOpenPdf,
  isLoggedIn,
  onLogin,
  onLogout,
  profile,
  outdoorMode,
  onToggleOutdoorMode
}) => {
  const [telemetryIndex, setTelemetryIndex] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginEmail, setLoginEmail] = useState(profile.email || '');
  const [studentName, setStudentName] = useState(profile.name && profile.name !== 'Student Driver' ? profile.name : '');
  const [biometricFeedback, setBiometricFeedback] = useState<string | null>(null);
  const [isBiometricPending, setIsBiometricPending] = useState(false);

  // Keep state in sync if profile updates
  useEffect(() => {
    if (profile.email) {
      setLoginEmail(profile.email);
    }
    if (profile.name && profile.name !== 'Student Driver') {
      setStudentName(profile.name);
    }
  }, [profile]);

  // Rotate telemetry text slowly in the background
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryIndex((prev) => (prev + 1) % TELEMETRY_MESSAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleBiometricQuickLogin = async () => {
    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setBiometricFeedback('Please enter your student email address above first.');
      return;
    }
    setIsBiometricPending(true);
    setBiometricFeedback(null);
    try {
      const res = await authenticateWithBiometrics(cleanEmail);
      if (res.success) {
        setBiometricFeedback(res.message);
        onLogin(cleanEmail, studentName.trim() || undefined);
        setTimeout(() => {
          setShowLoginPrompt(false);
        }, 500);
      }
    } finally {
      setIsBiometricPending(false);
    }
  };

  const handleEmailLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail) return;
    onLogin(cleanEmail, studentName.trim() || undefined);
    setShowLoginPrompt(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black text-white overflow-y-auto select-none">
      {/* Cinematic Perspective Backdrop */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#020617] via-[#081024] to-[#010409] pointer-events-none">
        {/* Glow Spheres */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-blue-600/15 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-amber-500/10 rounded-full blur-[100px]" />

        {/* Perspective Highway Vector Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 400 800" preserveAspectRatio="none">
          <line x1="0" y1="520" x2="400" y2="520" stroke="#1e293b" strokeWidth="1" />
          <polygon points="180,520 220,520 380,800 20,800" fill="#090d16" />
          <line x1="180" y1="520" x2="20" y2="800" stroke="#334155" strokeWidth="2" />
          <line x1="220" y1="520" x2="380" y2="800" stroke="#334155" strokeWidth="2" />
          <line x1="200" y1="520" x2="200" y2="800" stroke="#fbbf24" strokeWidth="4" strokeDasharray="18 24" />
        </svg>
      </div>

      {/* Top Header Bar: Status & Controls */}
      <div
        className="relative z-10 p-4 sm:p-6 flex items-center justify-between max-w-4xl w-full mx-auto"
        style={{
          paddingTop: 'max(1rem, calc(env(safe-area-inset-top, 0px) + 0.5rem))',
          paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-blue-400 font-extrabold">
            Class A CDL Master
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Outdoor Mode Toggle */}
          <button
            onClick={onToggleOutdoorMode}
            className="p-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10 backdrop-blur-md transition active:scale-95"
            title={outdoorMode ? 'Switch to Dark Mode' : 'Switch to Outdoor High-Contrast Mode'}
          >
            {outdoorMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Quick Login / User status pill */}
          {isLoggedIn ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline truncate max-w-[120px]">{profile.name || profile.email}</span>
              <button
                onClick={onLogout}
                className="ml-1 text-[10px] text-slate-400 hover:text-white underline"
                title="Log Out"
              >
                Log out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginPrompt(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 text-xs font-bold transition active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Center Area: Chrome Truck Graphic, Title & Status */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 my-auto py-4">
        {/* Truck Graphic Card */}
        <div className="relative mb-4 sm:mb-6">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600 via-sky-400 to-amber-500 blur-2xl opacity-60 animate-pulse" />

          <div className="relative w-40 h-40 sm:w-52 sm:h-52 rounded-3xl p-1 bg-gradient-to-b from-slate-600 via-slate-800 to-black shadow-2xl flex items-center justify-center border border-white/20">
            <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-[#091328] to-[#020612] p-3.5 flex flex-col items-center justify-center relative overflow-hidden">
              <img
                src="/icon.svg"
                alt="CDL Truck Emblem"
                className="w-full h-full object-contain filter drop-shadow-xl transform scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Title & Badges */}
        <div className="text-center max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-black uppercase tracking-wider mb-2 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Ancora • Laurel Ridge CDL Curriculum</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase drop-shadow-lg">
            Class A CDL
          </h1>
          <p className="text-lg sm:text-xl font-extrabold tracking-widest text-sky-400 uppercase mt-0.5">
            Pre-Trip Master
          </p>

          <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-sm mx-auto mt-2">
            Front-to-back walkaround with word-for-word voice guides, video tutorials, and interactive air brake failure tests.
          </p>
        </div>

        {/* Status Box: Explaining staying on home screen vs. login */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md max-w-sm w-full text-center text-xs">
          <div className="flex items-center justify-center gap-1.5 text-slate-300 font-semibold mb-0.5">
            {isLoggedIn ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  Signed in: <strong>{profile.name && profile.name !== 'Student Driver' ? profile.name : profile.email}</strong>
                </span>
                <button
                  onClick={onLogout}
                  className="ml-2 text-[10px] text-amber-400 hover:text-amber-300 underline font-normal"
                >
                  Switch Student
                </button>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Student Guest Mode</span>
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            {isLoggedIn
              ? 'Your walkaround progress is saved to your student account on this device.'
              : 'Sign in with your student email below to stay logged in and track your inspection score.'}
          </p>
        </div>
      </div>

      {/* Lower Section: Telemetry & Enter Button */}
      <div
        className="relative z-10 p-5 flex flex-col items-center max-w-md w-full mx-auto"
        style={{
          paddingBottom: 'max(2rem, calc(env(safe-area-inset-bottom, 0px) + 1.25rem))',
          paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
        }}
      >
        {/* Live Subsystem Telemetry Badge */}
        <div className="w-full mb-3 px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 text-[10px] sm:text-[11px] font-mono flex items-center justify-between text-slate-300">
          <span className="truncate mr-2">
            {TELEMETRY_MESSAGES[telemetryIndex]}
          </span>
          <span className="text-emerald-400 font-black flex-shrink-0">100% READY</span>
        </div>

        {/* PRIMARY ACTION: ENTER CAB / START INSPECTION */}
        <div className="w-full flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onEnter}
            className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-2xl shadow-blue-600/40 hover:shadow-blue-600/60 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 border border-blue-400/50"
          >
            <span>Enter Cab & Inspect</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {onOpenPdf && (
            <button
              onClick={onOpenPdf}
              className="py-4 px-5 rounded-2xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-xl shadow-amber-500/30 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 border border-amber-300/60 flex-shrink-0"
              title="Open the 6-Page Ancora Master Pre-Trip PDF in Badass Lightbox Viewer"
            >
              <BookOpen className="w-4 h-4 text-slate-950" />
              <span>PDF Vault</span>
            </button>
          )}
        </div>

        {/* Secondary Login Action if not logged in */}
        {!isLoggedIn && (
          <button
            onClick={() => setShowLoginPrompt(true)}
            className="mt-3 text-xs font-bold text-blue-400 hover:text-blue-300 transition flex items-center gap-1.5 underline"
          >
            <Fingerprint className="w-4 h-4" />
            <span>Student Sign-In (Enter Your Student Email)</span>
          </button>
        )}
      </div>

      {/* Login Prompt Modal (if opened on home screen) */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl p-6 bg-slate-900 border border-slate-700 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <LogIn className="w-5 h-5 text-blue-400" />
                <h3 className="font-extrabold text-base">Student Driver Sign-In</h3>
              </div>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              Enter your own student email to sign in on this device. Each student&apos;s scores and inspection progress remain private to their account.
            </p>

            <form onSubmit={handleEmailLoginSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Candidate Name (Optional)
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
                  placeholder="e.g. Alex Rivera"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Student Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
                  placeholder="student@ancora.edu or personal email"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white transition active:scale-95 shadow-md shadow-blue-600/30"
              >
                Sign In to My Student Account
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleBiometricQuickLogin}
                  disabled={isBiometricPending}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>Use FaceID / Biometric Passkey</span>
                </button>
              </div>

              {biometricFeedback && (
                <div className="text-xs text-emerald-400 font-bold text-center mt-2">
                  {biometricFeedback}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
