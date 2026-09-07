import React, { useState, useEffect } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { engineInstance } from '../../teaching-engine/Engine';
import { recorderInstance } from '../../services/recorderService';
import { getThemeClasses } from '../../utils/themeStyles';
import { Sparkles, Search, CheckCircle2, Play, Video, Loader2, Cpu, ShieldCheck } from 'lucide-react';

export const DeepSearchModal = ({ lessonData, onClose }) => {
  const { appTheme, setIsRecording, setFlappySpeech } = useStudioStore();
  const theme = getThemeClasses(appTheme);

  const [countdown, setCountdown] = useState(6);
  const [currentPhase, setCurrentPhase] = useState(1);

  useEffect(() => {
    // Phase 1 to 3 simulation during initial load
    const p1 = setTimeout(() => setCurrentPhase(2), 700);
    const p2 = setTimeout(() => setCurrentPhase(3), 1500);
    const p3 = setTimeout(() => setCurrentPhase(4), 2200);

    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
    };
  }, []);

  useEffect(() => {
    if (currentPhase < 4) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleStartPlayback();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPhase]);

  const handleStartPlayback = () => {
    onClose();
    if (lessonData) {
      engineInstance.start(lessonData);
    }
  };

  const handleRecordAndStart = () => {
    recorderInstance.startRecording();
    setIsRecording(true);
    setFlappySpeech(`Session recording active for '${lessonData?.title || 'Lesson'}'.`, 'idle');
    handleStartPlayback();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
      <div className={`${theme.dropdownBg} rounded-2xl max-w-lg w-full border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left select-none`}>
        {/* Header */}
        <div className={`px-5 py-4 ${theme.headerBg} border-b flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <Cpu className="w-5 h-5 text-rose-600 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight flex items-center space-x-2">
                <span>Phlappy Deep Search & Lesson Architect</span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-500 border border-rose-500/30">
                  AI Deep Search
                </span>
              </h2>
              <p className={`text-[11px] ${theme.textMuted}`}>
                Structuring syllabus & speech synthesis for '{lessonData?.title || 'Programming Topic'}'
              </p>
            </div>
          </div>
        </div>

        {/* Deep Search Checklist */}
        <div className="p-6 space-y-4">
          <div className="space-y-3 font-mono text-xs">
            {/* Step 1 */}
            <div className="flex items-center space-x-3">
              {currentPhase >= 2 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 text-rose-500 animate-spin flex-shrink-0" />
              )}
              <span className={currentPhase >= 2 ? 'text-emerald-500 font-semibold' : 'text-slate-400'}>
                1. Searching TCM Knowledge Base & Pedagogy Standards
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex items-center space-x-3">
              {currentPhase >= 3 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              ) : currentPhase === 2 ? (
                <Loader2 className="w-4 h-4 text-rose-500 animate-spin flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
              )}
              <span className={currentPhase >= 3 ? 'text-emerald-500 font-semibold' : 'text-slate-400'}>
                2. Structuring 5-Module Syllabus & Code Architecture
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex items-center space-x-3">
              {currentPhase >= 4 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              ) : currentPhase === 3 ? (
                <Loader2 className="w-4 h-4 text-rose-500 animate-spin flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
              )}
              <span className={currentPhase >= 4 ? 'text-emerald-500 font-semibold' : 'text-slate-400'}>
                3. Synthesizing ElevenLabs HD Audio Speech Chunks
              </span>
            </div>

            {/* Step 4 */}
            <div className="flex items-center space-x-3">
              {currentPhase >= 4 ? (
                <ShieldCheck className="w-4 h-4 text-rose-500 flex-shrink-0 animate-bounce" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
              )}
              <span className={currentPhase >= 4 ? 'text-rose-500 font-bold' : 'text-slate-400'}>
                4. Studio Recording Ready! Pre-session buffer active.
              </span>
            </div>
          </div>

          {/* Recording Timer Banner */}
          {currentPhase >= 4 && (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-center">
              <div className="text-xs font-bold text-slate-200 flex items-center justify-center space-x-2">
                <Video className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>Start Screen Recording Now or Click Begin Playback</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Auto-starting lesson playback in <span className="text-rose-400 font-bold text-sm">{countdown}s</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={`px-5 py-3.5 ${theme.headerBg} border-t flex items-center justify-end space-x-3`}>
          <button
            onClick={handleRecordAndStart}
            disabled={currentPhase < 4}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-rose-900/30"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Record Session & Start</span>
          </button>

          <button
            onClick={handleStartPlayback}
            disabled={currentPhase < 4}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer border border-slate-700"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Lesson Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
