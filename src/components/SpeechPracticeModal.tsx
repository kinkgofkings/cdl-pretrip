import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Square, CheckCircle, AlertTriangle, X, RefreshCw, Award } from 'lucide-react';
import { InspectionItem } from '../types';
import { tts, createSpeechRecognizer, isSpeechRecognitionSupported, verifySpeechAccuracy } from '../utils/speech';
import confetti from 'canvas-confetti';

interface Props {
  item: InspectionItem;
  isOpen: boolean;
  onClose: () => void;
  outdoorMode?: boolean;
}

export const SpeechPracticeModal: React.FC<Props> = ({ item, isOpen, onClose, outdoorMode }) => {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [isSpeakingModel, setIsSpeakingModel] = useState(false);
  const [verificationResult, setVerificationResult] = useState<ReturnType<typeof verifySpeechAccuracy> | null>(null);
  const [supportAudioRec, setSupportAudioRec] = useState(true);
  const [micError, setMicError] = useState<string | null>(null);

  const recognizerRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  useEffect(() => {
    setSupportAudioRec(isSpeechRecognitionSupported());
    return () => {
      tts.stop();
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSpokenText('');
      setVerificationResult(null);
      setIsListening(false);
    } else {
      tts.stop();
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const targetScript = item.spokenScript || '';

  const handleListenToggle = () => {
    if (isListening) {
      if (recognizerRef.current) recognizerRef.current.stop();
      setIsListening(false);
      evaluateSpoken(spokenText);
    } else {
      if (isSpeakingModel) {
        tts.stop();
        setIsSpeakingModel(false);
      }
      setSpokenText('');
      setVerificationResult(null);

      const recognizer = createSpeechRecognizer(
        (transcript, isFinal) => {
          setSpokenText(transcript);
          if (isFinal) {
            evaluateSpoken(transcript);
          }
        },
        (err) => {
          console.warn('Speech recognition notice:', err);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );

      if (recognizer) {
        setMicError(null);
        recognizerRef.current = recognizer;
        recognizer.start();
        setIsListening(true);
      } else {
        setMicError('Microphone speech recognition is unavailable in this browser. You can listen to the instructor model voice or read the verbatim script.');
      }
    }
  };

  const evaluateSpoken = (text: string) => {
    if (!text.trim() || !targetScript) return;
    const res = verifySpeechAccuracy(text, targetScript);
    setVerificationResult(res);
    if (res.accuracyScore >= 85) {
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      } catch {
        // ignore
      }
    }
  };

  const handlePlayModelAudio = () => {
    if (isSpeakingModel) {
      tts.stop();
      setIsSpeakingModel(false);
    } else {
      if (isListening && recognizerRef.current) {
        recognizerRef.current.stop();
        setIsListening(false);
      }
      setIsSpeakingModel(true);
      tts.speak(targetScript, {
        onEnd: () => setIsSpeakingModel(false),
        onError: () => setIsSpeakingModel(false)
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md"
      style={{
        paddingTop: 'max(1rem, calc(env(safe-area-inset-top, 0px) + 0.5rem))',
        paddingBottom: 'max(1rem, calc(env(safe-area-inset-bottom, 0px) + 0.5rem))',
        paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <div
        className={`w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl transition-all border max-h-[90vh] overflow-y-auto ${
          outdoorMode
            ? 'bg-white border-4 border-slate-900 text-slate-950'
            : 'glass-card-elevated text-slate-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b pb-4 mb-4 border-slate-700/50">
          <div>
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-amber-400 font-extrabold flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Word-For-Word Recitation Lab
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-1">{item.label}</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full text-slate-400 hover:text-white transition ${
              outdoorMode ? 'bg-slate-200 text-slate-900' : 'bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Exact Target Script to say */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 className="w-4 h-4" /> Exact Script to Say to Examiner:
            </span>
            <button
              onClick={handlePlayModelAudio}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full transition active:scale-95 ${
                isSpeakingModel
                  ? 'bg-red-500 text-white animate-pulse'
                  : outdoorMode
                  ? 'bg-blue-100 text-blue-900 border border-blue-400 hover:bg-blue-200'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30'
              }`}
            >
              {isSpeakingModel ? (
                <>
                  <Square className="w-4 h-4" /> Stop Audio
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" /> Hear Instructor
                </>
              )}
            </button>
          </div>
          <div
            className={`p-4 rounded-2xl text-base sm:text-lg leading-relaxed font-bold border ${
              outdoorMode
                ? 'bg-blue-50 border-2 border-blue-400 text-blue-950 shadow-sm'
                : 'bg-blue-950/40 border-blue-700/60 text-blue-100 shadow-inner'
            }`}
          >
            "{targetScript}"
          </div>
        </div>

        {/* Physical Action Reminder */}
        {item.physicalAction && (
          <div
            className={`p-3.5 rounded-2xl mb-4 text-xs sm:text-sm font-semibold flex items-start gap-2.5 border ${
              outdoorMode
                ? 'bg-amber-100 border-2 border-amber-400 text-amber-950'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-200'
            }`}
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
            <div>
              <span className="uppercase text-xs tracking-wider block font-black text-amber-500">
                Physical Action Required at Test:
              </span>
              <span className="leading-relaxed">{item.physicalAction}</span>
            </div>
          </div>
        )}

        {/* Live Speech Recording / Testing Interface */}
        <div
          className={`p-4 rounded-2xl border mb-4 text-center transition ${
            outdoorMode
              ? 'bg-slate-50 border-slate-300'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <button
              onClick={handleListenToggle}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-500/30'
                  : outdoorMode
                  ? 'bg-blue-700 text-white hover:bg-blue-800'
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/30 hover:scale-105'
              }`}
            >
              {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>

            <span className="text-xs font-bold">
              {isListening ? 'Listening... Speak your inspection script now!' : 'Tap mic and speak word-for-word'}
            </span>

            {micError && (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium text-left w-full">
                {micError}
              </div>
            )}

            {/* Live spoken preview */}
            <div className="w-full text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                You Said:
              </span>
              <div
                className={`p-3 rounded-xl min-h-[50px] text-xs sm:text-sm border font-medium ${
                  outdoorMode
                    ? 'bg-white border-slate-300 text-slate-900'
                    : 'bg-slate-950/70 border-slate-800 text-slate-200'
                }`}
              >
                {spokenText || (
                  <span className="text-slate-500 italic">
                    {supportAudioRec
                      ? 'Spoken words will appear here in real-time...'
                      : 'Type speech manually or test microphone.'}
                  </span>
                )}
              </div>
            </div>

            {spokenText && !isListening && (
              <button
                onClick={() => evaluateSpoken(spokenText)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                  outdoorMode
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-Check Accuracy
              </button>
            )}
          </div>
        </div>

        {/* Verification Result Card */}
        {verificationResult && (
          <div
            className={`p-4 rounded-2xl border transition-all ${
              verificationResult.accuracyScore >= 80
                ? outdoorMode
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                  : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
                : outdoorMode
                ? 'bg-amber-50 border-amber-500 text-amber-950'
                : 'bg-amber-950/40 border-amber-500/50 text-amber-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {verificationResult.accuracyScore >= 80 ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                )}
                <span className="font-extrabold text-sm sm:text-base">
                  Score: {verificationResult.accuracyScore}% Accuracy
                </span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                  verificationResult.accuracyScore >= 80
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-amber-500 text-slate-950'
                }`}
              >
                {verificationResult.accuracyScore >= 80 ? 'EXAM PASS' : 'NEEDS PRACTICE'}
              </span>
            </div>

            <p className="text-xs font-medium mb-3">{verificationResult.feedback}</p>

            {verificationResult.missingWords.length > 0 && (
              <div className="text-xs">
                <span className="font-bold text-amber-400 uppercase text-[10px] block mb-1">
                  Words Omitted:
                </span>
                <div className="flex flex-wrap gap-1">
                  {verificationResult.missingWords.slice(0, 15).map((w, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[11px] font-mono"
                    >
                      {w}
                    </span>
                  ))}
                  {verificationResult.missingWords.length > 15 && (
                    <span className="text-[11px] text-slate-400">
                      +{verificationResult.missingWords.length - 15} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-end">
          <button
            onClick={onClose}
            className={`w-full py-2.5 rounded-xl font-bold text-xs transition active:scale-95 ${
              outdoorMode
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
            }`}
          >
            Done with this Component
          </button>
        </div>
      </div>
    </div>
  );
};
