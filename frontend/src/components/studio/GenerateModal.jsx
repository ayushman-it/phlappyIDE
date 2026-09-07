import React, { useState } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { engineInstance } from '../../teaching-engine/Engine';
import { generateLessonFromGroq } from '../../services/groqService';
import {
  PRESET_SCRIPT_JS_VARIABLES,
  PRESET_SCRIPT_PYTHON_LOOPS,
  PRESET_SCRIPT_CPP_OOP
} from '../../teaching-engine/presetScripts';
import { Sparkles, X, CheckCircle, Clock, Code, Play, FileCode, Copy, AlertCircle, FileText } from 'lucide-react';

export const GenerateModal = () => {
  const {
    isGenerateModalOpen,
    setIsGenerateModalOpen,
    setActiveLessonData,
    setEnvironment,
    setFlappySpeech,
    setIsGeneratingAI
  } = useStudioStore();

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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600 border border-rose-200">
              <Sparkles className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">Phlappy AI Studio Session Creator</h2>
              <p className="text-xs text-slate-500 font-medium">Generate via AI or load custom 3-minute lesson scripts</p>
            </div>
          </div>
          <button
            onClick={() => setIsGenerateModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 px-6 pt-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab('ai_prompt')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'ai_prompt'
                ? 'border-rose-600 text-rose-600 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>AI Prompt Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('custom_script')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'custom_script'
                ? 'border-rose-600 text-rose-600 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-4 h-4 text-rose-600" />
            <span>Custom 3-Min Script & Presets</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'ai_prompt' ? (
            <form onSubmit={handleAiGenerateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course / Domain</label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="C Language">C Language</option>
                    <option value="C++ Language">C++ Language</option>
                    <option value="HTML & CSS">HTML & CSS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Topic / Concept</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    placeholder="e.g. JavaScript Variables, Python Loops, C Pointers"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="Hinglish">Hinglish</option>
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Environment</label>
                  <select
                    value={environment}
                    onChange={(e) => setLocalEnvironment(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="HTML_CSS_JS">HTML/CSS/JS</option>
                    <option value="PYTHON_BASIC">Python 3</option>
                    <option value="C_BASIC">C GCC</option>
                    <option value="CPP_BASIC">C++ G++</option>
                  </select>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start space-x-2.5 text-xs text-amber-800">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>3-Minute Session Guarantee:</strong> Phlappy AI will structure intro speech, definition comments, pre-write explanations, exact line-by-line breakdown, and live output execution.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGenerating ? 'GENERATING SCRIPT...' : 'GENERATE & TEACH SESSION'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Preset Scripts Bar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Quick Load Preset 3-Min Scripts</span>
                  <button
                    onClick={handleCopyTemplate}
                    className="text-rose-600 hover:underline flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copySuccess ? 'Copied Template!' : 'Copy Script Template'}</span>
                  </button>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleLoadPresetScript(PRESET_SCRIPT_JS_VARIABLES)}
                    className="p-2.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-xl text-left transition-all group cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-slate-800 group-hover:text-rose-700 truncate">
                      JS Variables & Scope
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">3-Min Master Script</div>
                  </button>

                  <button
                    onClick={() => handleLoadPresetScript(PRESET_SCRIPT_PYTHON_LOOPS)}
                    className="p-2.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-xl text-left transition-all group cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-slate-800 group-hover:text-rose-700 truncate">
                      Python Loops & Lists
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">3-Min Master Script</div>
                  </button>

                  <button
                    onClick={() => handleLoadPresetScript(PRESET_SCRIPT_CPP_OOP)}
                    className="p-2.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-xl text-left transition-all group cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-slate-800 group-hover:text-rose-700 truncate">
                      C++ Classes & OOP
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">3-Min Master Script</div>
                  </button>
                </div>
              </div>

              {/* Custom Script Editor Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Custom Lesson Script JSON (Paste / Edit Your Script)
                </label>
                <textarea
                  value={customJsonText}
                  onChange={(e) => {
                    setCustomJsonText(e.target.value);
                    setJsonError(null);
                  }}
                  rows={10}
                  className="w-full bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed p-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  placeholder="Paste your 3-minute lesson JSON script here..."
                />
              </div>

              {jsonError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center space-x-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{jsonError}</span>
                </div>
              )}

              <div className="pt-2 flex justify-between items-center">
                <span className="text-[11px] text-slate-500 font-medium">
                  Supports "speak", "open_file", "write_code", "show_console", "show_terminal", "run_code"
                </span>

                <button
                  onClick={handleStartCustomScript}
                  className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>START SESSION WITH CUSTOM SCRIPT</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
