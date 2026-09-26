import React, { useState, useEffect } from 'react';
import { INSPECTION_SECTIONS, TOTAL_INSPECTION_ITEMS } from './data/inspectionData';
import { InspectionItem, UserProfile, FontSizeOption } from './types';
import { Navbar } from './components/Navbar';
import { WalkaroundRadar } from './components/WalkaroundRadar';
import { SectionCard } from './components/SectionCard';
import { AirBrakeSimulator } from './components/AirBrakeSimulator';
import { StudyGuideView } from './components/StudyGuideView';
import { SpeechPracticeModal } from './components/SpeechPracticeModal';
import { VideoTutorialModal } from './components/VideoTutorialModal';
import { ProfileModal } from './components/ProfileModal';
import { CompletionReportModal } from './components/CompletionReportModal';
import { SplashScreen } from './components/SplashScreen';
import { AppInstallBanner } from './components/AppInstallBanner';
import { AncoraGiftModal } from './components/AncoraGiftModal';
import { AudioTourPlayerBar } from './components/AudioTourPlayerBar';
import { PdfDocumentLightbox } from './components/PdfDocumentLightbox';
import { BottomNavBar } from './components/BottomNavBar';
import { SuperMenuModal } from './components/SuperMenuModal';
import {
  loadUserProfile,
  saveUserProfile,
  loadAppSettings,
  saveAppSettings,
  loadActiveInspectionProgress,
  saveActiveInspectionProgress,
  clearActiveInspectionProgress,
  saveInspectionLog,
  isUserLoggedIn,
  setUserLoggedIn,
  clearUserSession
} from './utils/storage';
import { tts } from './utils/speech';
import confetti from 'canvas-confetti';

export default function App() {
  // Navigation & Mode
  const [activeTab, setActiveTab] = useState<'walkaround' | 'airbrake' | 'studyguide' | 'pdfviewer'>('walkaround');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  // Inspection Checklist State
  const [checkedItemIds, setCheckedItemIds] = useState<string[]>([]);

  // Settings & Theme
  const [outdoorMode, setOutdoorMode] = useState(false);
  const [voiceGuided, setVoiceGuided] = useState(true);
  const [fontSize, setFontSize] = useState<FontSizeOption>(() => loadAppSettings().fontSize || 'large');

  // Profile & Auth
  const [profile, setProfile] = useState<UserProfile>(loadUserProfile());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => isUserLoggedIn());

  // Modals
  const [activeSpeechItem, setActiveSpeechItem] = useState<InspectionItem | null>(null);
  const [activeVideoItem, setActiveVideoItem] = useState<InspectionItem | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAncoraGiftModalOpen, setIsAncoraGiftModalOpen] = useState(false);
  const [isSuperMenuOpen, setIsSuperMenuOpen] = useState(false);

  // Splash/Home Screen stays in place until user selects enter.
  // When leaving the app and returning, it reappears unless logged in.
  const [showSplash, setShowSplash] = useState<boolean>(() => !isUserLoggedIn());

  const handleLogin = (email: string, name?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    setUserLoggedIn(true);
    setIsLoggedIn(true);
    const existing = loadUserProfile(cleanEmail);
    const resolvedName =
      name && name.trim()
        ? name.trim()
        : existing.name && existing.name !== 'Student Driver'
        ? existing.name
        : cleanEmail.split('@')[0];
    const updated: UserProfile = {
      ...existing,
      email: cleanEmail,
      name: resolvedName
    };
    setProfile(updated);
    saveUserProfile(updated);
  };

  const handleLogout = () => {
    clearUserSession();
    setIsLoggedIn(false);
    setProfile(loadUserProfile());
    setShowSplash(true);
  };

  const handleEnterCab = () => {
    tts.unlockAudio();
    setShowSplash(false);
  };

  // Ensure iOS WebKit audio is unlocked on the very first touch/click anywhere
  useEffect(() => {
    const unlockOnFirstTouch = () => {
      tts.unlockAudio();
      window.removeEventListener('touchstart', unlockOnFirstTouch);
      window.removeEventListener('click', unlockOnFirstTouch);
    };
    window.addEventListener('touchstart', unlockOnFirstTouch, { passive: true });
    window.addEventListener('click', unlockOnFirstTouch);
    return () => {
      window.removeEventListener('touchstart', unlockOnFirstTouch);
      window.removeEventListener('click', unlockOnFirstTouch);
    };
  }, []);

  // Load cached settings & progress on mount
  useEffect(() => {
    const savedSettings = loadAppSettings();
    setOutdoorMode(savedSettings.outdoorMode);
    setVoiceGuided(savedSettings.voiceGuided);

    const savedProgress = loadActiveInspectionProgress();
    if (savedProgress) {
      setCheckedItemIds(savedProgress.checkedIds || []);
      if (typeof savedProgress.activeSectionIdx === 'number') {
        setCurrentSectionIndex(savedProgress.activeSectionIdx);
      }
    }
  }, []);

  // Save progress changes
  useEffect(() => {
    saveActiveInspectionProgress(checkedItemIds, currentSectionIndex, {});
  }, [checkedItemIds, currentSectionIndex]);

  // Apply outdoor mode class to body
  useEffect(() => {
    if (outdoorMode) {
      document.body.classList.add('outdoor-mode');
    } else {
      document.body.classList.remove('outdoor-mode');
    }
    saveAppSettings({
      ...loadAppSettings(),
      outdoorMode
    });
  }, [outdoorMode]);

  // Apply font size scaling to root html element
  useEffect(() => {
    document.documentElement.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    document.documentElement.classList.add(`text-size-${fontSize}`);
    saveAppSettings({
      ...loadAppSettings(),
      fontSize
    });
  }, [fontSize]);

  const handleCycleFontSize = () => {
    setFontSize((prev) => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'xlarge';
      return 'normal';
    });
  };

  // Handle voice guidance toggle
  const handleToggleVoiceGuided = () => {
    const nextVal = !voiceGuided;
    setVoiceGuided(nextVal);
    saveAppSettings({
      ...loadAppSettings(),
      voiceGuided: nextVal
    });
    if (!nextVal) {
      tts.stop();
    } else {
      tts.speak('Voice guidance active. Moving to next inspection component.');
    }
  };

  // Keyboard navigation: Left/Right arrows to flip walkaround sections
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeSpeechItem || activeVideoItem || isProfileModalOpen || isReportModalOpen) return;
      if (e.key === 'ArrowRight') {
        handleNextSection();
      } else if (e.key === 'ArrowLeft') {
        handlePrevSection();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSectionIndex, activeSpeechItem, activeVideoItem, isProfileModalOpen, isReportModalOpen]);

  // Checkbox toggle
  const handleToggleItem = (itemId: string) => {
    setCheckedItemIds((prev) => {
      const isAlready = prev.includes(itemId);
      const next = isAlready ? prev.filter((id) => id !== itemId) : [...prev, itemId];

      // Voice prompt when checking
      if (!isAlready && voiceGuided) {
        const item = INSPECTION_SECTIONS[currentSectionIndex].items.find((it) => it.id === itemId);
        if (item) {
          if (item.spokenScript) {
            tts.speak(`Checked: ${item.label}. Remember script: ${item.spokenScript}`);
          } else {
            tts.speak(`Checked: ${item.label}. ${item.details || ''}`);
          }
        }
      }

      return next;
    });
  };

  // Section navigation
  const handleNextSection = () => {
    if (currentSectionIndex < INSPECTION_SECTIONS.length - 1) {
      const nextIdx = currentSectionIndex + 1;
      setCurrentSectionIndex(nextIdx);
      if (voiceGuided) {
        tts.speak(`Section ${INSPECTION_SECTIONS[nextIdx].number}: ${INSPECTION_SECTIONS[nextIdx].title}`);
      }
    } else {
      // Completed full walkaround!
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
      setIsReportModalOpen(true);
      recordInspectionLog();
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
    }
  };

  const recordInspectionLog = () => {
    const score = Math.round((checkedItemIds.length / TOTAL_INSPECTION_ITEMS) * 100);
    saveInspectionLog({
      id: `insp-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      completedAt: new Date().toLocaleTimeString(),
      mode: 'practice',
      passed: score >= 85,
      score,
      totalItems: TOTAL_INSPECTION_ITEMS,
      checkedItemIds,
      speechAccuracyAverage: Math.max(88, score),
      syncedOffline: true
    });
    setProfile(loadUserProfile());
  };

  const handleRestartWalkaround = () => {
    clearActiveInspectionProgress();
    setCheckedItemIds([]);
    setCurrentSectionIndex(0);
    setIsReportModalOpen(false);
    tts.speak('Starting new Pre-Trip Inspection from Section 1: Front of vehicle.');
  };

  // Sections that are 100% checked
  const completedSectionIds = INSPECTION_SECTIONS.filter((sec) =>
    sec.items.every((it) => checkedItemIds.includes(it.id))
  ).map((s) => s.id);

  const progressPercent = Math.round((checkedItemIds.length / TOTAL_INSPECTION_ITEMS) * 100);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        outdoorMode ? 'bg-slate-100 text-slate-950' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          tts.stop();
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
        outdoorMode={outdoorMode}
        onToggleOutdoorMode={() => setOutdoorMode(!outdoorMode)}
        voiceGuided={voiceGuided}
        onToggleVoiceGuided={handleToggleVoiceGuided}
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenSplash={() => setShowSplash(true)}
        onOpenAncoraGift={() => setIsAncoraGiftModalOpen(true)}
        onOpenSuperMenu={() => setIsSuperMenuOpen(true)}
        fontSize={fontSize}
        onCycleFontSize={handleCycleFontSize}
        progressPercent={progressPercent}
        isLoggedIn={isLoggedIn}
      />

      {/* Universal Install & Setup Guidance Banner for EliteOne Windows PC, Mobile & iOS */}
      <AppInstallBanner outdoorMode={outdoorMode} />

      {/* Main Content Area with adequate padding around boxes and clearance for sticky bottom nav */}
      <main
        className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 pb-28 md:pb-12"
        style={{
          paddingBottom: 'max(6rem, calc(env(safe-area-inset-bottom, 0px) + 5rem))',
          paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0px))',
        }}
      >
        {activeTab === 'walkaround' && (
          <>
            {/* Walkaround Position Radar */}
            <WalkaroundRadar
              sections={INSPECTION_SECTIONS}
              activeSectionIndex={currentSectionIndex}
              completedSectionIds={completedSectionIds}
              onSelectSection={(idx) => {
                setCurrentSectionIndex(idx);
                if (voiceGuided) {
                  tts.speak(`Section ${INSPECTION_SECTIONS[idx].number}: ${INSPECTION_SECTIONS[idx].title}`);
                }
              }}
              outdoorMode={outdoorMode}
            />

            {/* Current Section Interactive Card */}
            <SectionCard
              section={INSPECTION_SECTIONS[currentSectionIndex]}
              sectionIndex={currentSectionIndex}
              totalSections={INSPECTION_SECTIONS.length}
              checkedItemIds={checkedItemIds}
              onToggleItem={handleToggleItem}
              onNextSection={handleNextSection}
              onPrevSection={handlePrevSection}
              onOpenSpeechPractice={(item) => setActiveSpeechItem(item)}
              onOpenVideoTutorial={(item) => setActiveVideoItem(item)}
              outdoorMode={outdoorMode}
              voiceGuided={voiceGuided}
              allSections={INSPECTION_SECTIONS}
            />
          </>
        )}

        {activeTab === 'airbrake' && (
          <AirBrakeSimulator
            outdoorMode={outdoorMode}
            onCompleteBrakeCheck={() => {
              // mark section 9 items checked
              const airBrakeIds = INSPECTION_SECTIONS[8].items.map((i) => i.id);
              setCheckedItemIds((prev) => Array.from(new Set([...prev, ...airBrakeIds])));
            }}
          />
        )}

        {activeTab === 'studyguide' && (
          <StudyGuideView
            sections={INSPECTION_SECTIONS}
            onOpenSpeechPractice={(item) => setActiveSpeechItem(item)}
            onOpenVideoTutorial={(item) => setActiveVideoItem(item)}
            outdoorMode={outdoorMode}
            onOpenPdf={() => setActiveTab('pdfviewer')}
          />
        )}

        {activeTab === 'pdfviewer' && (
          <PdfDocumentLightbox outdoorMode={outdoorMode} />
        )}
      </main>

      {/* Global Hands-Free Continuous Audio Tour Player */}
      <AudioTourPlayerBar outdoorMode={outdoorMode} />

      {/* Mobile Dedicated Bottom App Bar (Declutters top appbar completely) */}
      <BottomNavBar
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          tts.stop();
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
        onOpenSuperMenu={() => setIsSuperMenuOpen(true)}
        outdoorMode={outdoorMode}
        isSuperMenuOpen={isSuperMenuOpen}
      />

      {/* Root Portal-Backed Super Menu Modal (z-[99999] so it never falls behind sections) */}
      <SuperMenuModal
        isOpen={isSuperMenuOpen}
        onClose={() => setIsSuperMenuOpen(false)}
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          tts.stop();
        }}
        outdoorMode={outdoorMode}
        onToggleOutdoorMode={() => setOutdoorMode(!outdoorMode)}
        voiceGuided={voiceGuided}
        onToggleVoiceGuided={handleToggleVoiceGuided}
        fontSize={fontSize}
        onCycleFontSize={handleCycleFontSize}
        profile={profile}
        onOpenProfile={() => {
          setIsSuperMenuOpen(false);
          setIsProfileModalOpen(true);
        }}
        onOpenReport={() => {
          setIsSuperMenuOpen(false);
          setIsReportModalOpen(true);
        }}
        onOpenAncoraGift={() => {
          setIsSuperMenuOpen(false);
          setIsAncoraGiftModalOpen(true);
        }}
        progressPercent={progressPercent}
        isLoggedIn={isLoggedIn}
      />

      {/* Modals */}
      <SpeechPracticeModal
        item={activeSpeechItem!}
        isOpen={!!activeSpeechItem}
        onClose={() => setActiveSpeechItem(null)}
        outdoorMode={outdoorMode}
      />

      <VideoTutorialModal
        item={activeVideoItem}
        isOpen={!!activeVideoItem}
        onClose={() => setActiveVideoItem(null)}
        outdoorMode={outdoorMode}
      />

      <ProfileModal
        profile={profile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSaveProfile={(updated) => {
          saveUserProfile(updated);
          setProfile(updated);
        }}
        outdoorMode={outdoorMode}
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <CompletionReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        profile={profile}
        checkedItemIds={checkedItemIds}
        totalItems={TOTAL_INSPECTION_ITEMS}
        sections={INSPECTION_SECTIONS}
        onRestart={handleRestartWalkaround}
        outdoorMode={outdoorMode}
      />

      {/* Official Ancora Education Gift Dedication Modal */}
      <AncoraGiftModal
        isOpen={isAncoraGiftModalOpen}
        onClose={() => setIsAncoraGiftModalOpen(false)}
        outdoorMode={outdoorMode}
        onOpenPdf={() => {
          setActiveTab('pdfviewer');
          setIsAncoraGiftModalOpen(false);
        }}
      />

      {/* Cinematic Mobile App Splash / Home Screen */}
      {showSplash && (
        <SplashScreen
          onEnter={handleEnterCab}
          onOpenPdf={() => {
            tts.unlockAudio();
            setActiveTab('pdfviewer');
            setShowSplash(false);
          }}
          isLoggedIn={isLoggedIn}
          onLogin={handleLogin}
          onLogout={handleLogout}
          profile={profile}
          outdoorMode={outdoorMode}
          onToggleOutdoorMode={() => setOutdoorMode(!outdoorMode)}
        />
      )}
    </div>
  );
}
