import { SpeechVerificationResult } from '../types';

export interface AudioTourItem {
  id: string;
  sectionId: string;
  sectionNumber: string | number;
  sectionTitle: string;
  itemIndex: number;
  totalInSection: number;
  label: string;
  spokenScript: string;
  physicalAction?: string;
  critical?: boolean;
}

export type AudioTourState = {
  isPlaying: boolean;
  isPaused: boolean;
  currentItem: AudioTourItem | null;
  currentIndex: number;
  totalItems: number;
  playbackRate: number;
};

// Check if running on iOS / iPadOS
const isIOS =
  typeof navigator !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent)));

class TextToSpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private audioCtx: AudioContext | null = null;
  private keepAliveTimer: number | null = null;
  private isUnlocked = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  // iOS Safari requires unlocking the audio context and speech synthesizer on user gesture
  public unlockAudio() {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        if (!this.audioCtx) {
          this.audioCtx = new AudioCtx();
        }
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }
      }

      if (this.synth) {
        if (this.synth.paused) {
          try {
            this.synth.resume();
          } catch {
            // Ignore
          }
        }
      }

      this.isUnlocked = true;
    } catch {
      // Audio unlock silent catch
    }
  }

  private initVoices(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    // Prefer clear, authoritative US English voices (Siri, Samantha, Daniel, Google, Natural)
    const preferred =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Samantha') ||
            v.name.includes('Siri') ||
            v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Daniel') ||
            v.name.includes('Karen') ||
            v.name.includes('Arthur'))
      ) ||
      voices.find((v) => v.lang === 'en-US' || v.lang === 'en_US') ||
      voices.find((v) => v.lang.startsWith('en'));

    this.voice = preferred || voices[0] || null;
    return this.voice;
  }

  // Clear iOS keep-alive interval
  private clearKeepAlive() {
    if (this.keepAliveTimer !== null) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  // iOS 15-second speech freeze workaround
  private startKeepAlive() {
    this.clearKeepAlive();
    if (!isIOS) return;

    this.keepAliveTimer = window.setInterval(() => {
      if (this.synth && this.synth.speaking && !this.synth.paused) {
        try {
          this.synth.pause();
          this.synth.resume();
        } catch {
          // Ignore
        }
      } else {
        this.clearKeepAlive();
      }
    }, 9000);
  }

  public speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      onEnd?: () => void;
      onError?: (err: unknown) => void;
      cancelExisting?: boolean;
    }
  ) {
    if (!this.synth) return;

    this.unlockAudio();

    // Reset paused state if stuck
    if (this.synth.paused) {
      try {
        this.synth.resume();
      } catch {
        // Ignore
      }
    }

    // On iOS Safari, calling cancel() can put the synthesizer into an unrecoverable state if called right before speak.
    // Only cancel if actively speaking.
    if (options?.cancelExisting !== false) {
      if (this.synth.speaking || this.synth.pending) {
        try {
          this.synth.cancel();
        } catch {
          // Ignore
        }
      }
    }

    if (!this.voice) {
      this.initVoices();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.volume = 1.0;
    utterance.rate = options?.rate ?? 0.95;
    utterance.pitch = options?.pitch ?? 1.0;

    if (this.voice) {
      utterance.voice = this.voice;
    }

    // Retain global reference to defeat iOS Safari garbage collector bug
    const win = window as unknown as { __activeUtterances?: SpeechSynthesisUtterance[] };
    win.__activeUtterances = win.__activeUtterances || [];
    win.__activeUtterances.push(utterance);

    let finished = false;
    const cleanup = () => {
      if (finished) return;
      finished = true;
      this.clearKeepAlive();
      this.currentUtterance = null;
      if (win.__activeUtterances) {
        win.__activeUtterances = win.__activeUtterances.filter((u) => u !== utterance);
      }
    };

    utterance.onstart = () => {
      this.startKeepAlive();
    };

    utterance.onend = () => {
      cleanup();
      if (options?.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      cleanup();
      if (options?.onError) options.onError(e);
    };

    this.currentUtterance = utterance;

    // Execute speak
    const executeSpeak = () => {
      if (!this.synth) return;
      try {
        if (this.synth.paused) {
          this.synth.resume();
        }
        this.synth.speak(utterance);
      } catch {
        // Fallback
      }
    };

    // On iOS, if we just cancelled, give the engine 20ms to settle
    if (isIOS) {
      setTimeout(executeSpeak, 25);
    } else {
      executeSpeak();
    }
  }

  public pause() {
    this.clearKeepAlive();
    if (this.synth && this.synth.speaking) {
      try {
        this.synth.pause();
      } catch {
        // Ignore
      }
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      try {
        this.synth.resume();
        this.startKeepAlive();
      } catch {
        // Ignore
      }
    }
  }

  public stop() {
    this.clearKeepAlive();
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // Ignore
      }
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return !!(this.synth && this.synth.speaking && !this.synth.paused);
  }
}

export const tts = new TextToSpeechEngine();

// ==========================================
// CONTINUOUS AUDIO TOUR ENGINE (All Platforms & iOS)
// ==========================================

type TourListener = (state: AudioTourState) => void;

class AudioTourController {
  private queue: AudioTourItem[] = [];
  private currentIndex = 0;
  private isPlaying = false;
  private isPaused = false;
  private playbackRate = 0.95;
  private listeners: Set<TourListener> = new Set();
  private nextItemTimeout: number | null = null;

  public subscribe(listener: TourListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((l) => l(state));
  }

  public getState(): AudioTourState {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      currentItem: this.queue[this.currentIndex] || null,
      currentIndex: this.currentIndex,
      totalItems: this.queue.length,
      playbackRate: this.playbackRate
    };
  }

  public startTour(items: AudioTourItem[], startIndex = 0, initialRate = 0.95) {
    if (!items || items.length === 0) return;

    this.stopTour();
    this.queue = items;
    this.currentIndex = Math.max(0, Math.min(startIndex, items.length - 1));
    this.playbackRate = initialRate;
    this.isPlaying = true;
    this.isPaused = false;

    tts.unlockAudio();
    this.notify();
    this.speakCurrentItem();
  }

  private speakCurrentItem() {
    if (!this.isPlaying || this.isPaused || this.currentIndex >= this.queue.length) {
      return;
    }

    const item = this.queue[this.currentIndex];
    if (!item) {
      this.stopTour();
      return;
    }

    this.notify();

    // Prepare speech text:
    // If it's the first item of a section or index 0, announce the section clearly first!
    const isFirstInSection =
      this.currentIndex === 0 ||
      this.queue[this.currentIndex - 1]?.sectionId !== item.sectionId;

    let fullSpeech = '';
    if (isFirstInSection) {
      fullSpeech += `Section ${item.sectionNumber}: ${item.sectionTitle}. `;
    }

    fullSpeech += `${item.label}. ${item.spokenScript || 'Inspect this component.'}`;
    if (item.physicalAction) {
      fullSpeech += ` Action: ${item.physicalAction}.`;
    }

    tts.speak(fullSpeech, {
      rate: this.playbackRate,
      cancelExisting: true,
      onEnd: () => {
        if (!this.isPlaying || this.isPaused) return;

        // Natural breath pause between inspection components (1.1 seconds)
        this.nextItemTimeout = window.setTimeout(() => {
          if (!this.isPlaying || this.isPaused) return;

          if (this.currentIndex < this.queue.length - 1) {
            this.currentIndex++;
            this.speakCurrentItem();
          } else {
            // Tour Completed!
            tts.speak('Pre-trip inspection script tour completed. Excellent work.', {
              rate: this.playbackRate,
              onEnd: () => this.stopTour()
            });
          }
        }, 1100);
      },
      onError: () => {
        // If error or cancelled, move forward safely after short pause
        this.nextItemTimeout = window.setTimeout(() => {
          if (this.isPlaying && !this.isPaused && this.currentIndex < this.queue.length - 1) {
            this.currentIndex++;
            this.speakCurrentItem();
          }
        }, 1000);
      }
    });
  }

  public pauseTour() {
    if (!this.isPlaying) return;
    this.isPaused = true;
    if (this.nextItemTimeout !== null) {
      clearTimeout(this.nextItemTimeout);
      this.nextItemTimeout = null;
    }
    tts.pause();
    this.notify();
  }

  public resumeTour() {
    if (!this.isPlaying || !this.isPaused) return;
    this.isPaused = false;
    tts.resume();
    this.notify();

    // If synth is not speaking, re-trigger current item
    if (!tts.isSpeaking()) {
      this.speakCurrentItem();
    }
  }

  public stopTour() {
    this.isPlaying = false;
    this.isPaused = false;
    if (this.nextItemTimeout !== null) {
      clearTimeout(this.nextItemTimeout);
      this.nextItemTimeout = null;
    }
    tts.stop();
    this.notify();
  }

  public nextItem() {
    if (this.nextItemTimeout !== null) {
      clearTimeout(this.nextItemTimeout);
      this.nextItemTimeout = null;
    }
    if (this.currentIndex < this.queue.length - 1) {
      this.currentIndex++;
      this.speakCurrentItem();
    } else {
      this.stopTour();
    }
  }

  public prevItem() {
    if (this.nextItemTimeout !== null) {
      clearTimeout(this.nextItemTimeout);
      this.nextItemTimeout = null;
    }
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.speakCurrentItem();
    } else {
      this.speakCurrentItem();
    }
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    this.notify();
    if (this.isPlaying && !this.isPaused) {
      // Re-speak current item at new rate
      this.speakCurrentItem();
    }
  }
}

export const audioTour = new AudioTourController();

// ==========================================
// SPEECH RECOGNITION (Word-For-Word Microphone Lab)
// ==========================================

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createSpeechRecognizer(
  onTranscript: (transcript: string, isFinal: boolean) => void,
  onError?: (err: unknown) => void,
  onEnd?: () => void
): { start: () => void; stop: () => void } | null {
  if (!isSpeechRecognitionSupported()) return null;

  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionClass) return null;

  let recognizer: SpeechRecognitionInstance;
  try {
    recognizer = new SpeechRecognitionClass();
  } catch {
    return null;
  }

  // iOS Safari throws or stops if continuous = true; keep false on iOS for rock-solid stability
  recognizer.continuous = !isIOS;
  recognizer.interimResults = true;
  recognizer.lang = 'en-US';

  let stoppedManually = false;

  recognizer.onresult = (event: SpeechRecognitionEvent) => {
    let fullTranscript = '';
    let isFinal = false;

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      fullTranscript += result[0].transcript + ' ';
      if (result.isFinal) isFinal = true;
    }

    onTranscript(fullTranscript.trim(), isFinal);
  };

  if (onError) {
    recognizer.onerror = (e) => {
      onError(e);
    };
  }

  recognizer.onend = () => {
    // If on iOS and not stopped manually, auto-restart to simulate continuous recognition
    if (isIOS && !stoppedManually) {
      try {
        recognizer.start();
        return;
      } catch {
        // Fall through to onEnd
      }
    }
    if (onEnd) onEnd();
  };

  return {
    start: () => {
      stoppedManually = false;
      try {
        recognizer.start();
      } catch {
        // Already started
      }
    },
    stop: () => {
      stoppedManually = true;
      try {
        recognizer.stop();
      } catch {
        // Already stopped
      }
    }
  };
}

// Compare spoken words against target script
export function verifySpeechAccuracy(spokenText: string, targetScript: string): SpeechVerificationResult {
  const cleanWord = (w: string) =>
    w.toLowerCase().replace(/[^a-z0-9]/g, '');

  const targetTokens = targetScript
    .split(/\s+/)
    .map(cleanWord)
    .filter((w) => w.length > 0);

  const spokenTokens = spokenText
    .split(/\s+/)
    .map(cleanWord)
    .filter((w) => w.length > 0);

  if (targetTokens.length === 0) {
    return {
      spokenText,
      targetScript,
      accuracyScore: 100,
      matchedWords: [],
      missingWords: [],
      feedback: 'No required script for this item.'
    };
  }

  const matchedWords: string[] = [];
  const missingWords: string[] = [];

  const spokenSet = new Set(spokenTokens);

  for (const token of targetTokens) {
    if (spokenSet.has(token)) {
      matchedWords.push(token);
    } else {
      missingWords.push(token);
    }
  }

  // Calculate percentage of target words hit
  const score = Math.min(100, Math.round((matchedWords.length / targetTokens.length) * 100));

  let feedback = '';
  if (score >= 90) {
    feedback = 'Outstanding! Word-for-word accuracy. The CDL examiner will pass this immediately.';
  } else if (score >= 75) {
    feedback = 'Good delivery. Hit most required keywords. Review the highlighted missing terms.';
  } else if (score >= 50) {
    feedback = 'Acceptable start, but several critical specifications were omitted. Practice again out loud.';
  } else {
    feedback = 'Incomplete recitation. Make sure to say the complete script verbatim.';
  }

  return {
    spokenText,
    targetScript,
    accuracyScore: score,
    matchedWords,
    missingWords,
    feedback
  };
}
