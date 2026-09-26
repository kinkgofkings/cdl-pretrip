import React, { useState, useEffect, useRef } from 'react';
import {
  Gauge,
  Play,
  Square,
  AlertOctagon,
  Volume2,
  VolumeX,
  CheckCircle2,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Timer,
  FastForward,
  Power,
  AlertTriangle
} from 'lucide-react';
import { tts } from '../utils/speech';
import confetti from 'canvas-confetti';

interface Props {
  outdoorMode?: boolean;
  onCompleteBrakeCheck?: () => void;
}

export const AirBrakeSimulator: React.FC<Props> = ({ outdoorMode, onCompleteBrakeCheck }) => {
  // Simulator State
  const [pressure, setPressure] = useState(128); // Standard operating cut-off (120-140 PSI)
  const [engineRunning, setEngineRunning] = useState(false);
  const [keyOn, setKeyOn] = useState(true);
  const [yellowKnobOut, setYellowKnobOut] = useState(true); // Tractor parking (OUT = set)
  const [redKnobOut, setRedKnobOut] = useState(true); // Trailer supply (OUT = set)

  // Test steps:
  // 1 = Engine off / Key ON setup
  // 2 = Release brakes / Settle air
  // 3 = 60s Applied Leakage Test
  // 4 = Low Air Warning (fan to <= 60 PSI)
  // 5 = Spring Brake Pop (fan to 40 PSI trailer, 20 PSI tractor)
  // 6 = Safe Start & Air Governor Cut-Off (rebuild to 120-140 PSI)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [pedalPressed, setPedalPressed] = useState(false);

  // 60-Second Leak Timer
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [leakTestPassed, setLeakTestPassed] = useState(false);

  // Step 6 Compressor & Completion State
  const [compressorBuilding, setCompressorBuilding] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  // In-UI Status / Inline Alert Banner (No window.alert)
  const [statusBanner, setStatusBanner] = useState<{ text: string; type: 'warning' | 'info' | 'success' } | null>(null);
  const [isAudioSpeaking, setIsAudioSpeaking] = useState(false);

  // Guard refs to prevent repeating speech or audio loops during air rebuild
  const hasAnnouncedLowAirCutoffRef = useRef(false);
  const hasAnnouncedGovCutoffRef = useRef(false);

  // Audio Context & Buzzer
  const audioCtxRef = useRef<AudioContext | null>(null);
  const buzzerOscRef = useRef<OscillatorNode | null>(null);

  // Low air alarm conditions: Key ON, pressure <= 60 PSI and > 0 PSI
  const isAlarmActive = keyOn && pressure <= 60 && pressure > 0;

  // Speak helper that tracks active audio state
  const speakWithState = (text: string) => {
    setIsAudioSpeaking(true);
    tts.speak(text, {
      onEnd: () => setIsAudioSpeaking(false),
      onError: () => setIsAudioSpeaking(false)
    });
  };

  const handleStopAudio = () => {
    tts.stop();
    setIsAudioSpeaking(false);
  };

  // Sound generator
  const playSoundEffect = (type: 'sneeze' | 'pop' | 'click') => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'sneeze') {
        // Governor purge noise ("sheee-sh" air purge)
        const bufferSize = ctx.sampleRate * 0.45;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.45);
        noise.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      }
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Buzzer sound effect for Low Air Alarm
  useEffect(() => {
    try {
      if (isAlarmActive) {
        if (!audioCtxRef.current) {
          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (!buzzerOscRef.current) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(440, ctx.currentTime);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          buzzerOscRef.current = osc;
        }
      } else {
        if (buzzerOscRef.current) {
          buzzerOscRef.current.stop();
          buzzerOscRef.current.disconnect();
          buzzerOscRef.current = null;
        }
      }
    } catch {
      // ignore
    }
    return () => {
      if (buzzerOscRef.current) {
        try {
          buzzerOscRef.current.stop();
          buzzerOscRef.current.disconnect();
          buzzerOscRef.current = null;
        } catch {
          // ignore
        }
      }
    };
  }, [isAlarmActive]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      tts.stop();
      if (buzzerOscRef.current) {
        try {
          buzzerOscRef.current.stop();
          buzzerOscRef.current.disconnect();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // 60-Second Leak Timer Interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setLeakTestPassed(true);
            setCurrentStep(4);
            playSoundEffect('click');
            speakWithState('60 seconds complete. I did NOT lose more than 4 PSI in 60 seconds. Applied leakage test passed.');
            try {
              confetti({ particleCount: 35, spread: 50 });
            } catch {
              // ignore
            }
            return 0;
          }
          // Slight realistic 1-2 PSI settling drop over 60 seconds
          if (prev % 20 === 0) {
            setPressure((p) => Math.max(124, p - 1));
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  // Handle Air Rebuilding when engine is running and compressor is building
  // CRITICAL FIX: Stops compressor at 128 PSI, fires sneeze sound ONCE, speaks announcement ONCE!
  useEffect(() => {
    let pumpTimer: NodeJS.Timeout | null = null;

    if (engineRunning && compressorBuilding) {
      pumpTimer = setInterval(() => {
        setPressure((currentP) => {
          const nextP = currentP + 5;

          // 1. Check if low air warning cleared (crossed 60 PSI)
          if (nextP >= 60 && currentP < 60 && !hasAnnouncedLowAirCutoffRef.current) {
            hasAnnouncedLowAirCutoffRef.current = true;
            speakWithState('My low air alarm and light have cut off at 60 PSI.');
          }

          // 2. Check if Governor Cut-off reached (128 PSI, within 120-140 range)
          if (nextP >= 128) {
            if (!hasAnnouncedGovCutoffRef.current) {
              hasAnnouncedGovCutoffRef.current = true;

              // Immediately stop compressor building so interval doesn't re-trigger!
              setCompressorBuilding(false);
              setTestCompleted(true);

              // Play governor purge noise once
              playSoundEffect('sneeze');

              // Announce governor cut-off ONCE clearly without stuttering
              speakWithState(
                'My Low Air Alarm and Light have cut off at 60. My Air Governor has cut off at 120 to 140 PSI on my Primary and 120 to 140 on my Secondary. Air brake test complete!'
              );

              try {
                confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
              } catch {
                // ignore
              }

              if (onCompleteBrakeCheck) {
                onCompleteBrakeCheck();
              }
            }
            return 128;
          }

          return nextP;
        });
      }, 600);
    }

    return () => {
      if (pumpTimer) {
        clearInterval(pumpTimer);
      }
    };
  }, [engineRunning, compressorBuilding, onCompleteBrakeCheck]);

  // Actions
  const handlePushKnobsIn = () => {
    setStatusBanner(null);
    setYellowKnobOut(false);
    setRedKnobOut(false);
    playSoundEffect('click');
    setPressure((p) => Math.max(124, p - 3)); // Initial settling drop
    speakWithState('I will release my brakes and allow the air to settle.');
    setCurrentStep(2);
  };

  const handleStartLeakTimer = () => {
    setStatusBanner(null);
    setPedalPressed(true);
    setTimerSecondsLeft(60);
    setIsTimerRunning(true);
    setLeakTestPassed(false);
    setCurrentStep(3);
    speakWithState('Now I am going to apply pressure to my brake pedal, start a timer and I should lose no more than 4 PSI in 60 seconds.');
  };

  const handleSkipTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(0);
    setLeakTestPassed(true);
    setCurrentStep(4);
    playSoundEffect('click');
    speakWithState('60 seconds complete. I did NOT lose more than 4 PSI in 60 seconds.');
  };

  const handleFanBrakes = () => {
    // CRITICAL: Replace window.alert with in-UI notice + easy one-tap action
    if (engineRunning) {
      setStatusBanner({
        text: 'Engine is currently running with compressor active! Shut off the engine first to fan brakes down for the low air warning and pop tests.',
        type: 'warning'
      });
      return;
    }

    setStatusBanner(null);
    playSoundEffect('click');
    const newPress = Math.max(0, pressure - 12);
    setPressure(newPress);

    // Step 4: Low air alarm triggered at <= 60 PSI
    if (newPress <= 60 && currentStep <= 4) {
      setCurrentStep(4);
      speakWithState('My low air alarm and light cut on at 60 PSI.');
    }

    // Step 5: Red trailer pops at ~40 PSI
    if (newPress <= 42 && !redKnobOut) {
      setRedKnobOut(true);
      playSoundEffect('pop');
    }

    // Yellow tractor pops at ~20 PSI
    if (newPress <= 22 && !yellowKnobOut) {
      setYellowKnobOut(true);
      playSoundEffect('pop');
      setCurrentStep(5);
      speakWithState('My trailer brakes have set at 40 and my tractor brakes have set at 20 PSI.');
    }
  };

  const handleSafeStartEngine = () => {
    setStatusBanner(null);
    setEngineRunning(true);
    setCompressorBuilding(true);
    setTestCompleted(false);
    hasAnnouncedLowAirCutoffRef.current = false;
    hasAnnouncedGovCutoffRef.current = false;
    playSoundEffect('click');
    setCurrentStep(6);
    speakWithState(
      'Now I will perform a Safe Start: My truck is in neutral, brakes are set. Starting engine to rebuild air pressure.'
    );
  };

  const handleShutOffEngine = () => {
    setEngineRunning(false);
    setCompressorBuilding(false);
    setStatusBanner(null);
    playSoundEffect('click');
    speakWithState('Engine shut off. Electrical power is ON.');
  };

  const handleResetSimulator = () => {
    setPressure(128);
    setEngineRunning(false);
    setCompressorBuilding(false);
    setTestCompleted(false);
    setKeyOn(true);
    setYellowKnobOut(true);
    setRedKnobOut(true);
    setPedalPressed(false);
    setIsTimerRunning(false);
    setTimerSecondsLeft(60);
    setLeakTestPassed(false);
    setCurrentStep(1);
    setStatusBanner(null);
    hasAnnouncedLowAirCutoffRef.current = false;
    hasAnnouncedGovCutoffRef.current = false;
    handleStopAudio();
  };

  const handleToggleYellowKnob = () => {
    if (engineRunning) {
      setStatusBanner({
        text: 'Engine is currently running! Shut off engine before manipulating parking brakes during static leak checks.',
        type: 'warning'
      });
      return;
    }
    setStatusBanner(null);
    const next = !yellowKnobOut;
    setYellowKnobOut(next);
    playSoundEffect(next ? 'pop' : 'click');
    if (!next && !redKnobOut) {
      setPressure((p) => Math.max(124, p - 3));
      setCurrentStep(2);
      speakWithState('I will release my brakes and allow the air to settle.');
    }
  };

  const handleToggleRedKnob = () => {
    if (engineRunning) {
      setStatusBanner({
        text: 'Engine is currently running! Shut off engine before manipulating parking brakes during static leak checks.',
        type: 'warning'
      });
      return;
    }
    setStatusBanner(null);
    const next = !redKnobOut;
    setRedKnobOut(next);
    playSoundEffect(next ? 'pop' : 'click');
    if (!next && !yellowKnobOut) {
      setPressure((p) => Math.max(124, p - 3));
      setCurrentStep(2);
      speakWithState('I will release my brakes and allow the air to settle.');
    }
  };

  return (
    <div
      className={`rounded-3xl p-3 sm:p-5 transition-all border ${
        outdoorMode
          ? 'bg-white border-4 border-slate-900 shadow-xl text-slate-950'
          : 'glass-panel text-slate-100 shadow-2xl'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 mb-3 border-slate-700/50">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 flex items-center gap-1 shadow-sm">
              <ShieldAlert className="w-3.5 h-3.5" /> CRITICAL EXAM ZONE
            </span>
            <span className="text-[11px] sm:text-xs font-mono text-blue-400 font-bold">Instrument Cluster</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black mt-0.5">Air Brake 3-Step Exam Simulator</h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* Audio Stop / Mute Button */}
          {isAudioSpeaking && (
            <button
              onClick={handleStopAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition shadow-sm animate-pulse cursor-pointer"
              title="Stop audio speech"
            >
              <VolumeX className="w-4 h-4" /> Stop Audio
            </button>
          )}

          <button
            onClick={handleResetSimulator}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer ${
              outdoorMode
                ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <RotateCcw className="w-4 h-4" /> Reset Cluster
          </button>
        </div>
      </div>

      {/* Step Progress Pills (Compact Single Row) */}
      <div className="grid grid-cols-6 gap-1 sm:gap-1.5 mb-3">
        {[
          { num: 1, name: '1. Setup' },
          { num: 2, name: '2. Settle' },
          { num: 3, name: '3. 60s Leak' },
          { num: 4, name: '4. Low Air' },
          { num: 5, name: '5. Pop Out' },
          { num: 6, name: '6. Gov Cut' }
        ].map((step) => {
          const isActive = currentStep === step.num;
          const isDone = currentStep > step.num || (step.num === 6 && testCompleted);
          return (
            <div
              key={step.num}
              className={`py-1.5 px-1 rounded-xl text-center border font-bold text-[10px] sm:text-xs transition truncate ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-400 shadow-sm ring-2 ring-blue-500/40'
                  : isDone
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : outdoorMode
                  ? 'bg-slate-100 text-slate-600 border-slate-300'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800'
              }`}
            >
              <span>{step.name}</span>
            </div>
          );
        })}
      </div>

      {/* Status Notice Banner (Replaces window.alert) */}
      {statusBanner && (
        <div
          className={`p-3 rounded-2xl mb-3 text-xs sm:text-sm font-bold flex items-start justify-between gap-3 border ${
            statusBanner.type === 'warning'
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
              : 'bg-blue-500/20 border-blue-500/40 text-blue-200'
          }`}
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>{statusBanner.text}</span>
          </div>
          {engineRunning && (
            <button
              onClick={handleShutOffEngine}
              className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex-shrink-0 transition active:scale-95 cursor-pointer"
            >
              Shut Off Engine Now
            </button>
          )}
        </div>
      )}

      {/* SIDE-BY-SIDE DUAL GREEN GAUGES (Primary & Secondary Air Reservoirs) */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3">
        {/* Primary Air Gauge */}
        <div
          className={`p-2.5 sm:p-3 rounded-2xl border text-center flex flex-col items-center justify-center relative overflow-hidden ${
            outdoorMode ? 'bg-slate-100 border-slate-300' : 'bg-slate-900/90 border-slate-800 shadow-inner'
          }`}
        >
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-0.5">
            Primary Air Reservoir
          </span>
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
            {/* SVG Radial Gauge */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="48" fill="none" stroke="#1e293b" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke={pressure <= 60 ? '#ef4444' : pressure >= 120 ? '#10b981' : '#3b82f6'}
                strokeWidth="10"
                strokeDasharray="301.6"
                strokeDashoffset={301.6 - (301.6 * (Math.min(150, Math.max(0, pressure)) / 150))}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight leading-none text-white">
                {pressure}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-0.5">PSI</span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[9px] sm:text-[11px] font-semibold text-emerald-400">
            <Gauge className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Gov: 120–140 PSI</span>
          </div>
        </div>

        {/* Secondary Air Gauge */}
        <div
          className={`p-2.5 sm:p-3 rounded-2xl border text-center flex flex-col items-center justify-center relative overflow-hidden ${
            outdoorMode ? 'bg-slate-100 border-slate-300' : 'bg-slate-900/90 border-slate-800 shadow-inner'
          }`}
        >
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-0.5">
            Secondary Air Reservoir
          </span>
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="48" fill="none" stroke="#1e293b" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke={pressure <= 60 ? '#ef4444' : pressure >= 120 ? '#10b981' : '#6366f1'}
                strokeWidth="10"
                strokeDasharray="301.6"
                strokeDashoffset={301.6 - (301.6 * (Math.min(150, Math.max(0, pressure)) / 150))}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight leading-none text-white">
                {pressure}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-0.5">PSI</span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[9px] sm:text-[11px] font-semibold text-indigo-400">
            <Gauge className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Low Alarm: ~60 PSI</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD ANNUNCIATOR & ENGINE STATE (Compact Bar) */}
      <div
        className={`p-2 sm:p-2.5 rounded-xl border flex items-center justify-between gap-2 mb-3 ${
          outdoorMode ? 'bg-slate-100 border-slate-300' : 'bg-slate-900/80 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`p-1 rounded-lg flex-shrink-0 ${
              isAlarmActive ? 'bg-red-600 text-white animate-bounce' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div className="min-w-0 truncate">
            <span
              className={`block text-[10px] sm:text-xs uppercase font-black truncate ${
                isAlarmActive ? 'text-red-400 animate-pulse' : 'text-slate-300'
              }`}
            >
              {isAlarmActive ? 'LOW AIR PRESSURE BUZZER (≤ 60 PSI)' : 'NORMAL OPERATING RANGE'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`text-[10px] sm:text-xs font-mono font-bold ${
              engineRunning ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            {engineRunning
              ? compressorBuilding
                ? 'BUILDING AIR...'
                : 'GOV CUT-OFF'
              : 'ENGINE OFF (KEY ON)'}
          </span>
          {engineRunning && (
            <button
              onClick={handleShutOffEngine}
              className="px-2 py-0.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-[10px] font-black cursor-pointer active:scale-95"
              title="Shut off engine"
            >
              Shut Off
            </button>
          )}
        </div>
      </div>

      {/* SIDE-BY-SIDE YELLOW & RED KNOB BUTTONS (Right Beneath the Gauges!) */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
        {/* Yellow Parking Knob */}
        <button
          type="button"
          onClick={handleToggleYellowKnob}
          className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all active:scale-95 flex flex-col items-center justify-center cursor-pointer shadow-md select-none ${
            yellowKnobOut
              ? 'bg-amber-500/25 border-amber-400/90 text-amber-300 ring-2 ring-amber-500/40 shadow-amber-500/20'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
          }`}
          title="Tap to Push In or Pull Out Yellow Parking Brake Knob"
        >
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-0.5">
            PARKING (YELLOW)
          </span>
          <div className="text-xs sm:text-sm font-black tracking-tight">
            {yellowKnobOut ? 'PULLED OUT (SET)' : 'PUSHED IN (RELEASED)'}
          </div>
          <span className="text-[9px] text-slate-400 font-medium mt-0.5">
            Tap to {yellowKnobOut ? 'Push In' : 'Pull Out'}
          </span>
        </button>

        {/* Red Trailer Knob */}
        <button
          type="button"
          onClick={handleToggleRedKnob}
          className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all active:scale-95 flex flex-col items-center justify-center cursor-pointer shadow-md select-none ${
            redKnobOut
              ? 'bg-red-500/25 border-red-400/90 text-red-300 ring-2 ring-red-500/40 shadow-red-500/20'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
          }`}
          title="Tap to Push In or Pop Out Red Trailer Supply Knob"
        >
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-0.5">
            TRAILER (RED)
          </span>
          <div className="text-xs sm:text-sm font-black tracking-tight">
            {redKnobOut ? 'POPPED OUT (SET)' : 'PUSHED IN (SUPPLIED)'}
          </div>
          <span className="text-[9px] text-slate-400 font-medium mt-0.5">
            Tap to {redKnobOut ? 'Push In' : 'Pop Out'}
          </span>
        </button>
      </div>

      {/* CORE ACTION BUTTONS (Directly beneath the knobs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        {/* Fan Brakes Button (Always accessible to bleed pressure and watch gauges drop!) */}
        <button
          type="button"
          onClick={handleFanBrakes}
          className={`py-2.5 px-3 rounded-2xl font-black text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
            engineRunning
              ? 'bg-slate-800 text-slate-500 border border-slate-700'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          }`}
          title="Pump brake pedal down to exhaust 12 PSI"
        >
          <Gauge className="w-4 h-4" />
          <span>Fan Brakes (Pump Pedal -12 PSI)</span>
        </button>

        {/* Dynamic Contextual Action */}
        {(yellowKnobOut || redKnobOut) && !engineRunning && currentStep === 1 && (
          <button
            type="button"
            onClick={handlePushKnobsIn}
            className="py-2.5 px-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Push Both Knobs In (Release Brakes)</span>
          </button>
        )}

        {!yellowKnobOut && !redKnobOut && !isTimerRunning && !leakTestPassed && (currentStep === 2 || currentStep === 3) && (
          <button
            type="button"
            onClick={handleStartLeakTimer}
            className="py-2.5 px-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Timer className="w-4 h-4" />
            <span>Start 60s Applied Leak Timer</span>
          </button>
        )}

        {isTimerRunning && (
          <div className="flex items-center gap-1.5">
            <div className="flex-1 py-2.5 px-2 rounded-2xl bg-red-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 animate-pulse">
              <Timer className="w-4 h-4" />
              <span>Holding: {timerSecondsLeft}s (Max 4 PSI)</span>
            </div>
            <button
              type="button"
              onClick={handleSkipTimer}
              className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition active:scale-95 cursor-pointer"
              title="Fast Pass"
            >
              <FastForward className="w-4 h-4" />
            </button>
          </div>
        )}

        {!engineRunning && yellowKnobOut && redKnobOut && currentStep >= 4 && (
          <button
            type="button"
            onClick={handleSafeStartEngine}
            className="py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 animate-pulse cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>Safe Start Engine & Rebuild Air</span>
          </button>
        )}

        {engineRunning && (
          <button
            type="button"
            onClick={handleShutOffEngine}
            className="py-2.5 px-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Power className="w-4 h-4" />
            <span>Shut Off Engine</span>
          </button>
        )}
      </div>

      {/* SPOKEN SCRIPT TO EXAMINER (Directly beneath action buttons) */}
      <div
        className={`p-3 rounded-2xl border mb-3 ${
          outdoorMode ? 'bg-blue-50 border-blue-300 text-blue-950' : 'bg-slate-950/70 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5" /> Examiner Script (Step {currentStep} of 6):
          </span>
          <button
            type="button"
            onClick={() => {
              if (currentStep === 1) speakWithState("I am shutting off my engine and turning my key back to the ON position so that I have electrical power.");
              if (currentStep === 2) speakWithState("I will release my brakes and allow the air to settle.");
              if (currentStep === 3) speakWithState("Now I am going to apply pressure to my brake pedal, start a timer and I should lose no more than 4 PSI in 60 seconds.");
              if (currentStep === 4) speakWithState("My low air alarm and light cut on at 60 PSI.");
              if (currentStep === 5) speakWithState("My trailer brakes have set at 40 and my tractor brakes have set at 20.");
              if (currentStep === 6) speakWithState("My Low Air Alarm and Light have cut off at 60. My Air Governor has cut off at 120 to 140 on my Primary and 120 to 140 on my secondary.");
            }}
            className="text-[10px] font-bold text-blue-400 hover:text-blue-300 underline flex items-center gap-1 cursor-pointer"
          >
            Read Script Aloud
          </button>
        </div>
        <p className="text-xs sm:text-sm font-semibold leading-snug">
          {currentStep === 1 && '"I am shutting off my engine and turning my key back to the ON position so that I have electrical power."'}
          {currentStep === 2 && '"I will release my brakes and allow the air to settle."'}
          {currentStep === 3 && '"Now I am going to apply pressure to my brake pedal, start a timer and I should lose no more than 4 PSI in 60 seconds."'}
          {currentStep === 4 && '"My low air alarm and light CUT ON at 60 PSI."'}
          {currentStep === 5 && '"My trailer brakes have set at 40 and my tractor brakes have set at 20."'}
          {currentStep === 6 && '"My Low Air Alarm and Light have CUT OFF at 60. My Air Governor has CUT OFF at 120-140 on my Primary and 120-140 on my secondary."'}
        </p>
      </div>

      {/* Test Completed Celebration Card */}
      {testCompleted && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/50 text-emerald-200 mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 flex-shrink-0" />
            <div>
              <h3 className="text-base font-black text-white">Air Brake 3-Step Test Passed!</h3>
              <p className="text-xs text-emerald-300">
                You passed applied leakage, low air alarm cut-in/cut-off, emergency spring brake pop-out, and governor cut-off at 128 PSI.
              </p>
            </div>
          </div>
          <button
            onClick={handleResetSimulator}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition active:scale-95 flex-shrink-0 cursor-pointer"
          >
            Practice Again
          </button>
        </div>
      )}

      {/* Chock Retrieval Note */}
      <div
        className={`p-3 rounded-2xl border text-xs flex items-start gap-2 ${
          outdoorMode ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-slate-900/60 border-slate-800 text-slate-300'
        }`}
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-bold text-white block">Step 10 Reminder: Wheel Chock Retrieval</span>
          Exit cab facing truck with 3 points of contact, retrieve wheel chocks from steer tires, place on rear floor, re-enter with 3 points of contact, and re-fasten seatbelt before proceeding to tug tests!
        </div>
      </div>
    </div>
  );
};
