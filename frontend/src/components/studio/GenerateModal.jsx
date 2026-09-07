import React, { useState, useEffect } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { engineInstance } from '../../teaching-engine/Engine';
import { generateLessonFromGroq } from '../../services/groqService';
import { getThemeClasses } from '../../utils/themeStyles';
import {
  PRESET_SCRIPT_JS_VARIABLES,
  PRESET_SCRIPT_PYTHON_LOOPS,
  PRESET_SCRIPT_CPP_OOP
} from '../../teaching-engine/presetScripts';
import { Sparkles, X, Clock, Play, FileCode, Copy, AlertCircle, Terminal, Code2, Sliders } from 'lucide-react';

export const GenerateModal = () => {
  const {
    isGenerateModalOpen,
    setIsGenerateModalOpen,
    setActiveLessonData,
    setEnvironment,
    setFlappySpeech,
    setIsGeneratingAI,
    appTheme
  } = useStudioStore();

  const theme = getThemeClasses(appTheme);

  const [activeTab, setActiveTab] = useState('ai_prompt'); // 'ai_prompt' | 'custom_script'
  const [course, setCourse] = useState('JavaScript');
  const [topic, setTopic] = useState('Click Events');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [language, setLanguage] = useState('Hinglish');
  const [environment, setLocalEnvironment] = useState('HTML_CSS_JS');

  // Custom Script Importer State
  const [customJsonText, setCustomJsonText] = useState(
    JSON.stringify(PRESET_SCRIPT_JS_VARIABLES, null, 2)
  );
  const [jsonError, setJsonError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);

  // Keyboard shortcut listener for Esc key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isGenerateModalOpen) {
        setIsGenerateModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGenerateModalOpen, setIsGenerateModalOpen]);

  if (!isGenerateModalOpen) return null;

  const handleAiGenerateSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setIsGeneratingAI(true);
    setFlappySpeech(`Searching and structuring 3-minute lesson for '${topic}'...`, 'thinking');

    try {
      const lessonData = await generateLessonFromGroq({
        topic,
        language,
        difficulty,
        environment
      });

      setActiveLessonData(lessonData);
      setEnvironment(lessonData.environment || environment);
      setIsGeneratingAI(false);
      setIsGenerating(false);
      setIsGenerateModalOpen(false);

      engineInstance.start(lessonData);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      setIsGeneratingAI(false);
      setFlappySpeech(`Generation failed: ${err.message}`, 'idle');
    }
  };

  const handleLoadPresetScript = (preset) => {
    setCustomJsonText(JSON.stringify(preset, null, 2));
    setJsonError(null);
  };

  const handleStartCustomScript = () => {
    try {
      const parsedLesson = JSON.parse(customJsonText);
      if (!parsedLesson.steps || !Array.isArray(parsedLesson.steps)) {
        throw new Error('Invalid Script JSON: Must contain a "steps" array');
      }

      setJsonError(null);
      setActiveLessonData(parsedLesson);
      if (parsedLesson.environment) {
        setEnvironment(parsedLesson.environment);
      }

      setIsGenerateModalOpen(false);
      engineInstance.start(parsedLesson);
    } catch (err) {
      setJsonError(err.message);
    }
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(JSON.stringify(PRESET_SCRIPT_JS_VARIABLES, null, 2));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-start justify-center pt-12 px-4 transition-all">
      <div className={`${theme.dropdownBg} rounded-2xl max-w-2xl w-full border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] text-left select-none`}>
        {/* VS Code Quick Input Header */}
        <div className={`px-5 py-3.5 ${theme.headerBg} border-b flex items-center justify-between flex-shrink-0`}>
          <div className="flex items-center space-x-3">
            <div className={`p-1.5 rounded-lg ${theme.badgeBg} border`}>
              <Sparkles className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-black text-sm tracking-tight">VS Code AI Session Creator</h2>
                <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${theme.badgeBg}`}>
                  Ctrl+P AI
                </span>
              </div>
              <p className={`text-[11px] font-medium ${theme.textMuted}`}>
                Generate 3-minute lessons via Groq AI or load custom JSON master scripts
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`hidden sm:inline-block text-[10px] font-mono border px-1.5 py-0.5 rounded ${theme.pillBg}`}>
              ESC
            </span>
            <button
              onClick={() => setIsGenerateModalOpen(false)}
              className="p-1.5 opacity-60 hover:opacity-100 rounded-lg hover:bg-black/10 transition-all cursor-pointer"
              title="Close Dialog (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* VS Code Navigation Tabs Bar */}
        <div className={`flex border-b ${theme.tabsBg} px-4 pt-1 flex-shrink-0 text-xs`}>
          <button
            onClick={() => setActiveTab('ai_prompt')}
            className={`flex items-center space-x-2 px-4 py-2 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'ai_prompt'
                ? `${theme.tabActive} shadow-xs`
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>AI Prompt Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('custom_script')}
            className={`flex items-center space-x-2 px-4 py-2 font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'custom_script'
                ? `${theme.tabActive} shadow-xs`
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-rose-600" />
            <span>Custom Script & Presets</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 font-sans">
          {activeTab === 'ai_prompt' ? (
            <form onSubmit={handleAiGenerateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider mb-1 ${theme.textMuted}`}>
                    Course / Language
                  </label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className={`w-full text-xs font-semibold ${theme.inputBg} rounded-xl p-2.5 border focus:outline-none cursor-pointer`}
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="C Language">C Language</option>
                    <option value="C++ Language">C++ Language</option>
                    <option value="HTML & CSS">HTML & CSS</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider mb-1 ${theme.textMuted}`}>
                    Topic / Concept
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className={`w-full text-xs font-semibold ${theme.inputBg} rounded-xl p-2.5 border focus:outline-none`}
                    placeholder="e.g. JS Variables, Python Loops, C++ OOP"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider mb-1 ${theme.textMuted}`}>
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className={`w-full text-xs font-semibold ${theme.inputBg} rounded-xl p-2 border focus:outline-none cursor-pointer`}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider mb-1 ${theme.textMuted}`}>
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className={`w-full text-xs font-semibold ${theme.inputBg} rounded-xl p-2 border focus:outline-none cursor-pointer`}
                  >
                    <option value="Hinglish">Hinglish</option>
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider mb-1 ${theme.textMuted}`}>
                    Environment
                  </label>
                  <select
                    value={environment}
                    onChange={(e) => setLocalEnvironment(e.target.value)}
                    className={`w-full text-xs font-semibold ${theme.inputBg} rounded-xl p-2 border focus:outline-none cursor-pointer`}
                  >
                    <option value="HTML_CSS_JS">HTML/CSS/JS</option>
                    <option value="PYTHON_BASIC">Python 3</option>
                    <option value="C_BASIC">C GCC</option>
                    <option value="CPP_BASIC">C++ G++</option>
                  </select>
                </div>
              </div>

              <div className={`p-3 rounded-xl border ${theme.pillBg} flex items-start space-x-2.5 text-xs`}>
                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">
                  <strong>3-Minute Session Guarantee:</strong> Phlappy AI generates intro speech, definition comments, pre-write explanations, exact line-by-line typing, and stdout execution.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-200/40">
                <span className={`text-[11px] font-mono ${theme.textMuted}`}>
                  Press Enter to start generation
                </span>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGenerating ? 'GENERATING...' : 'GENERATE & TEACH SESSION'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Preset Scripts Bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`text-[10px] font-mono font-extrabold uppercase tracking-wider ${theme.textMuted}`}>
                    Preset 3-Min Scripts
                  </label>
                  <button
                    onClick={handleCopyTemplate}
                    className="text-rose-600 hover:underline flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copySuccess ? 'Copied Template!' : 'Copy Script Template'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleLoadPresetScript(PRESET_SCRIPT_JS_VARIABLES)}
                    className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${theme.chipBg}`}
                  >
                    <div className="text-[11px] font-bold truncate">JS Variables & Scope</div>
                    <div className={`text-[10px] font-medium ${theme.textMuted}`}>3-Min Master Script</div>
                  </button>

                  <button
                    onClick={() => handleLoadPresetScript(PRESET_SCRIPT_PYTHON_LOOPS)}
                    className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${theme.chipBg}`}
                  >
                    <div className="text-[11px] font-bold truncate">Python Loops & Lists</div>
                    <div className={`text-[10px] font-medium ${theme.textMuted}`}>3-Min Master Script</div>
                  </button>

                  <button
                    onClick={() => handleLoadPresetScript(PRESET_SCRIPT_CPP_OOP)}
                    className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${theme.chipBg}`}
                  >
                    <div className="text-[11px] font-bold truncate">C++ Classes & OOP</div>
                    <div className={`text-[10px] font-medium ${theme.textMuted}`}>3-Min Master Script</div>
                  </button>
                </div>
              </div>

              {/* Custom Script Textarea */}
              <div>
                <label className={`block text-[10px] font-mono font-extrabold uppercase tracking-wider mb-1 ${theme.textMuted}`}>
                  Custom Lesson Script JSON
                </label>
                <textarea
                  value={customJsonText}
                  onChange={(e) => {
                    setCustomJsonText(e.target.value);
                    setJsonError(null);
                  }}
                  rows={9}
                  className={`w-full ${theme.inputBg} font-mono text-[11px] leading-relaxed p-3 rounded-xl border focus:outline-none`}
                  placeholder="Paste your 3-minute lesson JSON script here..."
                />
              </div>

              {jsonError && (
                <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-2.5 flex items-center space-x-2 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{jsonError}</span>
                </div>
              )}

              <div className="pt-2 flex justify-between items-center border-t border-slate-200/40">
                <span className={`text-[10px] font-mono ${theme.textMuted}`}>
                  Supports "speak", "open_file", "write_code", "show_console", "run_code"
                </span>

                <button
                  onClick={handleStartCustomScript}
                  className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>START CUSTOM SESSION</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
