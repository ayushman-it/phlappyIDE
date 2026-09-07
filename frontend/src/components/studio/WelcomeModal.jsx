import React, { useEffect } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { getThemeClasses } from '../../utils/themeStyles';
import { engineInstance } from '../../teaching-engine/Engine';
import { PRESET_SCRIPT_JS_VARIABLES } from '../../teaching-engine/presetScripts';
import {
  Sparkles,
  X,
  Play,
  Terminal,
  Volume2,
  Palette,
  Video,
  Code2,
  CheckCircle2,
  HelpCircle,
  Zap,
  Layers,
  BookOpen
} from 'lucide-react';

export const WelcomeModal = () => {
  const {
    isWelcomeModalOpen,
    setIsWelcomeModalOpen,
    setActiveLessonData,
    setEnvironment,
    appTheme
  } = useStudioStore();

  const theme = getThemeClasses(appTheme);

  // Auto-trigger welcome modal on first visit only
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('phlappy_has_seen_welcome');
    if (!hasSeenWelcome) {
      setIsWelcomeModalOpen(true);
    }
  }, [setIsWelcomeModalOpen]);

  // Keyboard Esc key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isWelcomeModalOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWelcomeModalOpen]);

  if (!isWelcomeModalOpen) return null;

  const handleCloseModal = () => {
    localStorage.setItem('phlappy_has_seen_welcome', 'true');
    setIsWelcomeModalOpen(false);
  };

  const handleTrySampleLesson = () => {
    localStorage.setItem('phlappy_has_seen_welcome', 'true');
    setIsWelcomeModalOpen(false);
    setActiveLessonData(PRESET_SCRIPT_JS_VARIABLES);
    setEnvironment('HTML_CSS_JS');
    engineInstance.start(PRESET_SCRIPT_JS_VARIABLES);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 transition-all">
      <div className={`${theme.dropdownBg} rounded-2xl max-w-2xl w-full border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col text-left select-none max-h-[90vh]`}>
        {/* Modal Header */}
        <div className={`px-6 py-4 ${theme.headerBg} border-b flex items-center justify-between flex-shrink-0`}>
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-white border border-slate-200 p-1 shadow-2xs">
              <img
                src="https://thecodemunk.in/assets/logo.png"
                alt="Logo"
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-black text-base tracking-tight">Welcome to TCM<span className="text-rose-600">One</span> Phlappy AI</h2>
                <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${theme.badgeBg}`}>
                  IDE v2.0
                </span>
              </div>
              <p className={`text-xs font-medium ${theme.textMuted}`}>
                World's First Real-Time Interactive AI Code Teaching Studio
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`hidden sm:inline-block text-[10px] font-mono border px-1.5 py-0.5 rounded ${theme.pillBg}`}>
              ESC
            </span>
            <button
              onClick={handleCloseModal}
              className="p-1.5 opacity-60 hover:opacity-100 rounded-lg hover:bg-black/10 transition-all cursor-pointer"
              title="Close Dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 font-sans flex-1">
          {/* Feature Showcase Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={`p-3.5 rounded-xl border ${theme.chipBg} space-y-1.5`}>
              <div className="flex items-center space-x-2 text-rose-600 font-extrabold text-xs">
                <Volume2 className="w-4 h-4" />
                <span>Line-by-Line AI Speech</span>
              </div>
              <p className={`text-[11px] leading-relaxed font-medium ${theme.textMuted}`}>
                Phlappy AI speaks deep, Hinglish explanations before writing each line in Monaco Editor.
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border ${theme.chipBg} space-y-1.5`}>
              <div className="flex items-center space-x-2 text-amber-500 font-extrabold text-xs">
                <Zap className="w-4 h-4" />
                <span>3-Minute Master Lessons</span>
              </div>
              <p className={`text-[11px] leading-relaxed font-medium ${theme.textMuted}`}>
                Instant AI generation for JS, Python, C++, C, HTML & CSS with live stdout execution.
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border ${theme.chipBg} space-y-1.5`}>
              <div className="flex items-center space-x-2 text-indigo-500 font-extrabold text-xs">
                <Palette className="w-4 h-4" />
                <span>4-in-1 Dynamic IDE Themes</span>
              </div>
              <p className={`text-[11px] leading-relaxed font-medium ${theme.textMuted}`}>
                Switch between VS Code Light, Warm Coffee, VS Code Dark+, and iOS macOS Glass anytime.
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border ${theme.chipBg} space-y-1.5`}>
              <div className="flex items-center space-x-2 text-emerald-500 font-extrabold text-xs">
                <Video className="w-4 h-4" />
                <span>Studio Screen Recorder</span>
              </div>
              <p className={`text-[11px] leading-relaxed font-medium ${theme.textMuted}`}>
                Record HD video & audio tutorials directly inside the browser with 1 click.
              </p>
            </div>
          </div>

          {/* Quick Start Tip Banner */}
          <div className={`p-3.5 rounded-xl border ${theme.pillBg} flex items-start space-x-3 text-xs`}>
            <BookOpen className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">How to start learning:</span>
              <p className={`text-[11px] leading-relaxed ${theme.textMuted}`}>
                Top bar me koi bhi programming topic type kijiye (jaise <em>JS Variables</em>, <em>Python Loops</em>, <em>C++ OOP</em>) aur <strong>GENERATE & TEACH</strong> button click kijiye!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className={`px-6 py-3.5 ${theme.headerBg} border-t flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0`}>
          <button
            onClick={handleTrySampleLesson}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${theme.pillBg}`}
          >
            <Play className="w-3.5 h-3.5 text-rose-600 fill-current" />
            <span>TRY SAMPLE LESSON (JS VARIABLES)</span>
          </button>

          <button
            onClick={handleCloseModal}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>EXPLORE PHLAPPY AI STUDIO</span>
          </button>
        </div>
      </div>
    </div>
  );
};
