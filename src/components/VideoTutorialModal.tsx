import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  X,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  BookOpen,
  Volume2,
  Sparkles,
  Camera,
  Layers,
  CameraOff,
  Crosshair,
  Info
} from 'lucide-react';
import { InspectionItem } from '../types';
import { tts } from '../utils/speech';

interface Props {
  item: InspectionItem | null;
  isOpen: boolean;
  onClose: () => void;
  outdoorMode?: boolean;
}

export const VideoTutorialModal: React.FC<Props> = ({ item, isOpen, onClose, outdoorMode }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState<'visual' | 'specs' | 'passfail'>('visual');
  const [viewMode, setViewMode] = useState<'blueprint' | 'camera'>('blueprint');
  const [progress, setProgress] = useState(0);

  // Live Yard Camera stream state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setViewMode('camera');
    } catch (err: unknown) {
      console.warn('Camera access issue:', err);
      setCameraError('Camera access not granted or unavailable on this device. Displaying interactive blueprint.');
      setViewMode('blueprint');
      setIsCameraActive(false);
    }
  }, []);

  // Auto-play TTS audio guide on modal open
  useEffect(() => {
    if (!isOpen || !item) {
      setIsPlaying(false);
      tts.stop();
      setProgress(0);
      stopCamera();
      return;
    }

    setIsPlaying(true);
    setProgress(0);

    // Speak audio coaching automatically
    const textToRead = `${item.tutorialTitle || item.label}. ${item.details || ''}. Exact script: ${
      item.spokenScript || 'Check condition.'
    }. Physical action required: ${item.physicalAction || 'Physically touch the part.'}`;
    tts.speak(textToRead);
  }, [isOpen, item, stopCamera]);

  // Sync playback progress timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && isOpen) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 100;
          }
          return prev + 1.25;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isOpen]);

  // Clean up camera on unmount or close
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  if (!isOpen || !item) return null;

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      tts.pause();
    } else {
      setIsPlaying(true);
      if (progress >= 100) setProgress(0);
      tts.resume();
    }
  };

  const handleReplay = () => {
    setProgress(0);
    setIsPlaying(true);
    const textToRead = `${item.tutorialTitle || item.label}. ${item.details || ''}. Exact script to say to examiner: ${
      item.spokenScript || 'Verify item condition.'
    }. Remember: ${item.physicalAction || 'Physically touch the part.'}`;
    tts.speak(textToRead);
  };

  const handleSwitchToBlueprint = () => {
    stopCamera();
    setViewMode('blueprint');
  };

  const handleSwitchToCamera = () => {
    startCamera();
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
        className={`w-full max-w-2xl rounded-3xl p-5 sm:p-6 shadow-2xl transition-all border max-h-[92vh] overflow-y-auto ${
          outdoorMode
            ? 'bg-white border-4 border-slate-900 text-slate-950'
            : 'glass-card-elevated text-slate-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b pb-3 mb-3 border-slate-700/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white flex items-center gap-1">
                <Volume2 className="w-3 h-3 fill-current" /> Audio Coach & Visual Guide
              </span>
              <span className="text-[11px] font-mono text-amber-400 font-bold">
                {item.componentLocation || 'Truck Component'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold mt-1">
              {item.tutorialTitle || item.label}
            </h2>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className={`p-1.5 rounded-full text-slate-400 hover:text-white transition ${
              outdoorMode ? 'bg-slate-200 text-slate-900' : 'bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Coach Banner */}
        <div className="mb-3 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs flex items-center justify-between text-blue-200">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>
              Listen to the voice coach or open your device camera to practice pointing at this component on a real truck.
            </span>
          </div>
        </div>

        {/* Video Canvas / Interactive Screen */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 mb-4 shadow-2xl aspect-video flex flex-col justify-between p-3.5">
          {/* View Mode 1: LIVE YARD CAMERA (Optional for real truck walkaround) */}
          {viewMode === 'camera' && (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* AR Walkaround Overlay HUD */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/80 backdrop-blur-md text-[10px] font-mono font-bold text-black flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                    LIVE YARD CAMERA ACTIVE
                  </span>
                  <span className="text-[10px] font-mono text-white/80 bg-black/50 px-2 py-0.5 rounded">
                    Aim at {item.label}
                  </span>
                </div>

                {/* Center Point & Touch Reticle */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-36 h-28 border-2 border-dashed border-amber-400 rounded-2xl flex items-center justify-center bg-amber-400/10">
                    <Crosshair className="w-8 h-8 text-amber-300 animate-pulse" />
                  </div>
                  <span className="mt-2 px-3 py-1 rounded-full bg-black/80 text-[11px] font-bold text-amber-300 border border-amber-400/40">
                    POINT & TOUCH HERE
                  </span>
                </div>

                <div className="text-center">
                  <span className="px-3 py-1 rounded-xl bg-black/80 text-[11px] font-mono text-emerald-400 border border-white/10">
                    "{item.spokenScript?.slice(0, 70)}..."
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* View Mode 2: INTERACTIVE COMPONENT BLUEPRINT & STANCE SCHEMATIC */}
          {viewMode === 'blueprint' && (
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center">
              {/* Specialized Graphic for Front Vehicle Stance */}
              {item.id.includes('stance') || item.id.includes('profile') ? (
                <svg className="w-full h-full p-2" viewBox="0 0 420 220">
                  <defs>
                    <pattern id="grid-stance" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="420" height="220" fill="url(#grid-stance)" />

                  {/* Ground Level Reference Line */}
                  <line x1="20" y1="180" x2="400" y2="180" stroke="#475569" strokeWidth="2" strokeDasharray="5 3" />
                  <text x="320" y="195" fill="#94a3b8" fontSize="9" fontFamily="monospace">GROUND PLANE</text>

                  {/* Front Semi-Truck Silhouette */}
                  <g transform="translate(110, 25)">
                    {/* Roof Cap & Clearance Lights */}
                    <path d="M 40 25 L 160 25 L 150 45 L 50 45 Z" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                    <circle cx="65" cy="35" r="3" fill="#f59e0b" />
                    <circle cx="85" cy="35" r="3" fill="#f59e0b" />
                    <circle cx="100" cy="35" r="3" fill="#f59e0b" />
                    <circle cx="115" cy="35" r="3" fill="#f59e0b" />
                    <circle cx="135" cy="35" r="3" fill="#f59e0b" />

                    {/* Windshield */}
                    <rect x="45" y="48" width="110" height="35" rx="4" fill="#0f172a" stroke="#60a5fa" strokeWidth="1" />
                    <line x1="100" y1="48" x2="100" y2="83" stroke="#334155" strokeWidth="1.5" />

                    {/* Massive Chrome Front Grille */}
                    <rect x="52" y="88" width="96" height="52" rx="6" fill="#1e293b" stroke="#93c5fd" strokeWidth="1.5" />
                    <line x1="56" y1="98" x2="144" y2="98" stroke="#475569" strokeWidth="1" />
                    <line x1="56" y1="108" x2="144" y2="108" stroke="#475569" strokeWidth="1" />
                    <line x1="56" y1="118" x2="144" y2="118" stroke="#475569" strokeWidth="1" />
                    <line x1="56" y1="128" x2="144" y2="128" stroke="#475569" strokeWidth="1" />

                    {/* Headlights */}
                    <rect x="25" y="105" width="22" height="16" rx="3" fill="#334155" stroke="#fcd34d" strokeWidth="1.5" />
                    <rect x="153" y="105" width="22" height="16" rx="3" fill="#334155" stroke="#fcd34d" strokeWidth="1.5" />

                    {/* Steer Tires (Left & Right) */}
                    <rect x="15" y="125" width="24" height="48" rx="6" fill="#090d16" stroke="#475569" strokeWidth="2" />
                    <rect x="161" y="125" width="24" height="48" rx="6" fill="#090d16" stroke="#475569" strokeWidth="2" />

                    {/* Heavy Duty Front Bumper */}
                    <rect x="10" y="138" width="180" height="16" rx="3" fill="#334155" stroke="#38bdf8" strokeWidth="2" />

                    {/* Level Stance Horizon Indicator Line (Green) */}
                    <line x1="-15" y1="146" x2="215" y2="146" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
                    <text x="35" y="172" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      LEVEL STANCE: NO LEANING
                    </text>

                    {/* Suspension Balance Equal Arrows */}
                    <g transform="translate(25, 80)">
                      <line x1="0" y1="0" x2="0" y2="20" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#arrow)" />
                      <text x="-15" y="-5" fill="#38bdf8" fontSize="8" fontFamily="monospace">SUSP L</text>
                    </g>
                    <g transform="translate(175, 80)">
                      <line x1="0" y1="0" x2="0" y2="20" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#arrow)" />
                      <text x="-5" y="-5" fill="#38bdf8" fontSize="8" fontFamily="monospace">SUSP R</text>
                    </g>

                    {/* Pulsing Point & Touch Target on Bumper */}
                    <g transform="translate(100, 146)">
                      <circle cx="0" cy="0" r="14" fill="#ef4444" fillOpacity="0.3" className="animate-ping" />
                      <circle cx="0" cy="0" r="6" fill="#ef4444" />
                      <text x="12" y="4" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">
                        TOUCH BUMPER
                      </text>
                    </g>
                  </g>
                </svg>
              ) : (
                /* Dynamic Component Schematic for all other inspection items */
                <svg className="w-full h-full opacity-80" viewBox="0 0 400 220">
                  <defs>
                    <pattern id="grid-gen" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="400" height="220" fill="url(#grid-gen)" />

                  <g transform="translate(100, 30)">
                    <rect x="0" y="20" width="200" height="120" rx="16" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
                    <circle cx="100" cy="80" r="45" fill="#1e293b" stroke="#60a5fa" strokeWidth="3" />
                    <circle cx="100" cy="80" r="28" fill="#3b82f6" fillOpacity="0.2" stroke="#93c5fd" strokeWidth="1.5" />
                    <circle cx="100" cy="80" r="10" fill="#38bdf8" className={isPlaying ? 'animate-ping' : ''} />

                    <line x1="100" y1="10" x2="100" y2="150" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="30" y1="80" x2="170" y2="80" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />

                    <g transform="translate(115, 60)">
                      <circle cx="0" cy="0" r="16" fill="#ef4444" fillOpacity="0.3" className="animate-pulse" />
                      <text x="20" y="5" fill="#f8fafc" fontSize="9" fontWeight="bold" fontFamily="monospace">
                        POINT & TOUCH
                      </text>
                    </g>
                  </g>
                </svg>
              )}
            </div>
          )}

          {/* Top Canvas Bar: Clear Status + Blueprint vs Camera Switcher */}
          <div className="relative z-10 flex items-center justify-between text-xs text-white">
            <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 font-mono flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              {isPlaying ? 'AUDIO COACH ACTIVE' : 'COACH PAUSED'}
            </span>

            {/* Mode Switcher: Blueprint vs Live Yard Camera */}
            <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={handleSwitchToBlueprint}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                  viewMode === 'blueprint'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Blueprint</span>
              </button>
              <button
                type="button"
                onClick={handleSwitchToCamera}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                  viewMode === 'camera'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Open device camera to practice pointing at a real truck"
              >
                <Camera className="w-3 h-3" />
                <span>Yard Camera</span>
              </button>
            </div>
          </div>

          {/* Bottom Player Bar: Playback Controls & Timestamp */}
          <div className="relative z-10 bg-black/85 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
            {/* Progress bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-blue-500 h-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTogglePlay}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
                  title={isPlaying ? 'Pause Audio Guide' : 'Play Audio Guide'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleReplay}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                  title="Replay Audio Guide"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleReplay}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/40 hover:bg-blue-600/60 text-blue-300 text-[11px] font-semibold transition"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Repeat Speech</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-slate-300">
                {Math.floor((progress / 100) * 45)}s / 45s
              </div>
            </div>
          </div>
        </div>

        {cameraError && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs">
            {cameraError}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-700/50 mb-3 gap-2">
          <button
            onClick={() => setActiveTab('visual')}
            className={`pb-2 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'visual'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Checklist & Script
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-2 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'specs'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Key Specs & Tolerance
          </button>
          <button
            onClick={() => setActiveTab('passfail')}
            className={`pb-2 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'passfail'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Critical Exam Traps
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'visual' && (
          <div className="space-y-3 text-xs">
            <div
              className={`p-3.5 rounded-2xl border ${
                outdoorMode
                  ? 'bg-blue-50 border-blue-300 text-blue-950'
                  : 'bg-blue-950/40 border-blue-800 text-blue-200'
              }`}
            >
              <span className="font-bold text-[10px] uppercase tracking-wider block text-blue-400 mb-1">
                Word-For-Word Spoken Delivery:
              </span>
              <p className="italic font-medium leading-relaxed text-sm">
                "{item.spokenScript || item.details}"
              </p>
            </div>

            {item.pointsToInspect && item.pointsToInspect.length > 0 && (
              <div
                className={`p-3 rounded-xl border ${
                  outdoorMode ? 'bg-slate-50 border-slate-300' : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <span className="font-bold uppercase text-[10px] text-slate-400 block mb-1.5">
                  Points To Physically Point & Touch:
                </span>
                <ul className="space-y-1.5">
                  {item.pointsToInspect.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'specs' && (
          <div
            className={`p-4 rounded-2xl border text-xs space-y-2.5 ${
              outdoorMode ? 'bg-slate-50 border-slate-300' : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="font-bold text-sm text-amber-400">
              Technical Standards & Federal Motor Carrier Tolerances
            </div>
            <p className="text-slate-300 leading-relaxed">
              {item.keySpecs ||
                'Standard CDL Class A Commercial Motor Vehicle Compliance: No cracks, breaks, leaks, or illegal welds. Hardware securely mounted with zero missing fasteners.'}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Tread/Brake Rule</span>
                <span className="text-xs font-bold text-white">4/32" Steer, 2/32" Other, 1/4" Lining</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Air System Limit</span>
                <span className="text-xs font-bold text-white">Max 4 PSI / 60s, Cut-off 120-140</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'passfail' && (
          <div
            className={`p-4 rounded-2xl border text-xs space-y-2 ${
              outdoorMode
                ? 'bg-red-50 border-red-300 text-red-950'
                : 'bg-red-950/30 border-red-800/60 text-red-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-sm text-red-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Instant Test Failures To Avoid</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Failing to physically touch or point directly at the component.</li>
              <li>Saying you would kick the tire instead of stating you would use an <strong>Air Pressure Gauge</strong>.</li>
              <li>Forgetting to state <strong>"I see no leaks from my steering gear box."</strong></li>
              <li>Failing to mention <strong>"I see NO GAP between the trailer apron and fifth wheel skid plate."</strong></li>
            </ul>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-end">
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className={`w-full py-2.5 rounded-xl font-bold text-xs transition active:scale-95 ${
              outdoorMode
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
            }`}
          >
            Got It — Return to Checklist
          </button>
        </div>
      </div>
    </div>
  );
};
