import React, { useState, useRef } from 'react';
import { User, Mail, Camera, Fingerprint, ShieldCheck, X, Check, Calendar, Award, Phone, Building2, Upload } from 'lucide-react';
import { UserProfile } from '../types';
import { processImageFile, registerBiometricCredential, authenticateWithBiometrics } from '../utils/auth';

interface Props {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (updated: UserProfile) => void;
  outdoorMode?: boolean;
  isLoggedIn?: boolean;
  onLogin?: (email: string, name?: string) => void;
  onLogout?: () => void;
}

export const ProfileModal: React.FC<Props> = ({
  profile,
  isOpen,
  onClose,
  onSaveProfile,
  outdoorMode,
  isLoggedIn,
  onLogin,
  onLogout
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isBiometricPending, setIsBiometricPending] = useState(false);
  const [biometricFeedback, setBiometricFeedback] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Sync form state when profile changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData(profile);
      setBiometricFeedback(null);
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await processImageFile(e.target.files[0], 400, 400);
        setFormData((prev) => ({ ...prev, avatarUrl: base64 }));
      } catch (err) {
        console.error('Failed to process avatar', err);
      }
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await processImageFile(e.target.files[0], 1200, 500);
        setFormData((prev) => ({ ...prev, coverPhotoUrl: base64 }));
      } catch (err) {
        console.error('Failed to process cover photo', err);
      }
    }
  };

  const handleToggleBiometrics = async () => {
    setIsBiometricPending(true);
    setBiometricFeedback(null);
    try {
      if (!formData.biometricsEnabled) {
        const res = await registerBiometricCredential(formData.email);
        if (res.success) {
          setFormData((prev) => ({ ...prev, biometricsEnabled: true }));
          setBiometricFeedback('Biometrics / Quick Unlock successfully activated!');
        }
      } else {
        setFormData((prev) => ({ ...prev, biometricsEnabled: false }));
        setBiometricFeedback('Biometrics disabled.');
      }
    } finally {
      setIsBiometricPending(false);
    }
  };

  const handleTestBiometricUnlock = async () => {
    setIsBiometricPending(true);
    setBiometricFeedback(null);
    try {
      const res = await authenticateWithBiometrics(formData.email);
      setBiometricFeedback(res.message);
    } finally {
      setIsBiometricPending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

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
        className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl transition-all border max-h-[92vh] flex flex-col ${
          outdoorMode
            ? 'bg-white border-4 border-slate-900 text-slate-950'
            : 'glass-card-elevated text-slate-100'
        }`}
      >
        {/* Cover Photo Header */}
        <div className="relative h-32 sm:h-40 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 flex items-end p-4">
          {formData.coverPhotoUrl && (
            <img
              src={formData.coverPhotoUrl}
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

          {/* Cover Photo Upload Button */}
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 z-10"
            title="Upload cover photo (direct camera or file)"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Change Cover</span>
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverChange}
          />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 left-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition active:scale-95 z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Avatar floating overlapping */}
          <div className="relative -mb-10 sm:-mb-12 z-10 flex items-end gap-3">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-800 border-4 border-slate-950 shadow-2xl flex items-center justify-center">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-slate-400" />
                )}
              </div>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center text-white transition cursor-pointer"
                title="Upload Profile Picture"
              >
                <Camera className="w-6 h-6" />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="pb-1">
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                {formData.name || 'Candidate Name'}
              </h2>
              <span className="text-xs text-blue-300 font-mono">
                {formData.schoolOrCompany || 'CDL Training'}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 pt-12 sm:pt-14 overflow-y-auto space-y-4">
          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className={`p-2.5 rounded-xl border ${outdoorMode ? 'bg-slate-100 border-slate-300' : 'bg-slate-900/60 border-slate-800'}`}>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Inspections Completed</span>
              <span className="text-base font-black text-blue-400">{formData.totalInspectionsRun}</span>
            </div>
            <div className={`p-2.5 rounded-xl border ${outdoorMode ? 'bg-slate-100 border-slate-300' : 'bg-slate-900/60 border-slate-800'}`}>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Best Script Accuracy</span>
              <span className="text-base font-black text-emerald-400">{formData.bestAccuracyScore}%</span>
            </div>
          </div>

          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                Driver Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 pl-9 rounded-xl text-xs font-semibold border outline-none ${
                    outdoorMode
                      ? 'bg-slate-100 border-slate-300 text-slate-900 focus:border-blue-600'
                      : 'bg-slate-900/80 border-slate-800 text-white focus:border-blue-500'
                  }`}
                  placeholder="Tex Candidate"
                />
                <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 pl-9 rounded-xl text-xs font-semibold border outline-none ${
                    outdoorMode
                      ? 'bg-slate-100 border-slate-300 text-slate-900 focus:border-blue-600'
                      : 'bg-slate-900/80 border-slate-800 text-white focus:border-blue-500'
                  }`}
                  placeholder="name@email.com"
                />
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* School / Company & Test Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                Training Institution / Carrier
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.schoolOrCompany}
                  onChange={(e) => setFormData({ ...formData, schoolOrCompany: e.target.value })}
                  className={`w-full px-3 py-2 pl-9 rounded-xl text-xs font-semibold border outline-none ${
                    outdoorMode
                      ? 'bg-slate-100 border-slate-300 text-slate-900 focus:border-blue-600'
                      : 'bg-slate-900/80 border-slate-800 text-white focus:border-blue-500'
                  }`}
                  placeholder="Laurel Ridge / Ancora"
                />
                <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                Target CDL Exam Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.targetTestDate || ''}
                  onChange={(e) => setFormData({ ...formData, targetTestDate: e.target.value })}
                  className={`w-full px-3 py-2 pl-9 rounded-xl text-xs font-semibold border outline-none ${
                    outdoorMode
                      ? 'bg-slate-100 border-slate-300 text-slate-900 focus:border-blue-600'
                      : 'bg-slate-900/80 border-slate-800 text-white focus:border-blue-500'
                  }`}
                />
                <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Secure Biometric Authentication Section */}
          <div
            className={`p-4 rounded-2xl border transition ${
              formData.biometricsEnabled
                ? outdoorMode
                  ? 'bg-emerald-50 border-emerald-400'
                  : 'bg-emerald-950/30 border-emerald-500/40'
                : outdoorMode
                ? 'bg-slate-100 border-slate-300'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${formData.biometricsEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Biometric Sensor Unlock</span>
                  <span className="text-[10px] text-slate-400">
                    Use FaceID, TouchID, or Fingerprint to unlock checklists instantly
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleBiometrics}
                disabled={isBiometricPending}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                  formData.biometricsEnabled
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                    : outdoorMode
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {formData.biometricsEnabled ? 'Enabled' : 'Enable'}
              </button>
            </div>

            {formData.biometricsEnabled && (
              <div className="mt-3 pt-3 border-t border-slate-700/40 flex items-center justify-between">
                <span className="text-[11px] text-slate-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Quick Access Verified
                </span>
                <button
                  type="button"
                  onClick={handleTestBiometricUnlock}
                  disabled={isBiometricPending}
                  className="text-xs font-bold text-blue-400 hover:underline"
                >
                  Test Biometric Sensor
                </button>
              </div>
            )}

            {biometricFeedback && (
              <div className="mt-2 text-xs font-semibold text-emerald-400 text-center animate-fade-in">
                {biometricFeedback}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-2">
            <div>
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => {
                    onLogout?.();
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 border border-red-500/30 transition active:scale-95"
                >
                  Log Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (formData.email.trim()) {
                      onLogin?.(formData.email, formData.name);
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-blue-400 hover:bg-blue-500/10 border border-blue-500/30 transition active:scale-95"
                >
                  Log In as Driver
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  outdoorMode
                    ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2 rounded-xl text-xs font-bold transition shadow-lg active:scale-95 ${
                  outdoorMode
                    ? 'bg-blue-700 text-white hover:bg-blue-800'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                }`}
              >
                Save Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
