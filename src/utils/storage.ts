import { UserProfile, InspectionLog, FontSizeOption } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'cdl_pretrip_profile',
  ACTIVE_SESSION: 'cdl_pretrip_active_session',
  HISTORY: 'cdl_pretrip_history',
  SETTINGS: 'cdl_pretrip_settings',
  OFFLINE_QUEUE: 'cdl_pretrip_offline_queue'
};

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Student Driver',
  email: '',
  phone: '',
  schoolOrCompany: 'Laurel Ridge / Ancora Training',
  targetTestDate: '',
  avatarUrl: '',
  coverPhotoUrl: '',
  biometricsEnabled: false,
  totalInspectionsRun: 0,
  bestAccuracyScore: 0,
  lastInspectionDate: undefined
};

export interface AppSettings {
  outdoorMode: boolean;
  voiceGuided: boolean;
  speechRate: number;
  soundEffects: boolean;
  autoAdvanceOnComplete: boolean;
  testStrictness: 'practice' | 'strict_exam';
  fontSize: FontSizeOption;
}

export const DEFAULT_SETTINGS: AppSettings = {
  outdoorMode: false,
  voiceGuided: true,
  speechRate: 0.95,
  soundEffects: true,
  autoAdvanceOnComplete: false,
  testStrictness: 'practice',
  fontSize: 'large' // Default to large so all text is immediately easier to read
};

export function getActiveUserEmail(): string | null {
  try {
    return localStorage.getItem('cdl_current_user_email');
  } catch {
    return null;
  }
}

export function setActiveUserEmail(email: string | null): void {
  try {
    if (email && email.trim()) {
      localStorage.setItem('cdl_current_user_email', email.trim().toLowerCase());
    } else {
      localStorage.removeItem('cdl_current_user_email');
    }
  } catch {
    // ignore
  }
}

export function isUserLoggedIn(): boolean {
  try {
    return localStorage.getItem('cdl_is_logged_in') === 'true';
  } catch {
    return false;
  }
}

export function setUserLoggedIn(status: boolean): void {
  try {
    localStorage.setItem('cdl_is_logged_in', status ? 'true' : 'false');
  } catch {
    // ignore
  }
}

export function clearUserSession(): void {
  try {
    setUserLoggedIn(false);
    setActiveUserEmail(null);
  } catch {
    // ignore
  }
}

export function loadUserProfile(targetEmail?: string): UserProfile {
  try {
    const emailToUse = (targetEmail || getActiveUserEmail() || '').trim().toLowerCase();
    if (emailToUse) {
      const studentKey = `cdl_profile_${emailToUse}`;
      const studentRaw = localStorage.getItem(studentKey);
      if (studentRaw) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(studentRaw) };
      }
    }
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    // If the legacy stored profile had the instructor's personal email but no user is currently logged in,
    // don't pre-fill it for a student on their device
    if (!isUserLoggedIn() && parsed.email === 'lightsouttattootex@gmail.com') {
      return { ...DEFAULT_PROFILE, ...parsed, email: '', name: 'Student Driver' };
    }
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    const emailToUse = profile.email ? profile.email.trim().toLowerCase() : '';
    if (emailToUse) {
      localStorage.setItem(`cdl_profile_${emailToUse}`, JSON.stringify(profile));
      setActiveUserEmail(emailToUse);
    }
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function loadAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveAppSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadInspectionHistory(): InspectionLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveInspectionLog(log: InspectionLog): void {
  try {
    const history = loadInspectionHistory();
    const updated = [log, ...history].slice(0, 50); // Keep last 50
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));

    // Update profile stats
    const profile = loadUserProfile();
    profile.totalInspectionsRun += 1;
    if (log.speechAccuracyAverage > profile.bestAccuracyScore) {
      profile.bestAccuracyScore = log.speechAccuracyAverage;
    }
    profile.lastInspectionDate = log.date;
    saveUserProfile(profile);
  } catch (e) {
    console.error('Failed to record inspection log', e);
  }
}

// Active checklist progress cache so remote/offline walks never lose state
export function loadActiveInspectionProgress(): {
  checkedIds: string[];
  activeSectionIdx: number;
  airPressureValues: Record<string, string>;
} | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveActiveInspectionProgress(
  checkedIds: string[],
  activeSectionIdx: number,
  airPressureValues: Record<string, string>
): void {
  try {
    localStorage.setItem(
      STORAGE_KEYS.ACTIVE_SESSION,
      JSON.stringify({ checkedIds, activeSectionIdx, airPressureValues, updatedAt: new Date().toISOString() })
    );
  } catch (e) {
    console.error('Failed to save active session', e);
  }
}

export function clearActiveInspectionProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  } catch {
    // ignore
  }
}
