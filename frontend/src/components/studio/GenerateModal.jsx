import React, { useState } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { engineInstance } from '../../teaching-engine/Engine';
import { MOCK_LESSON_JS_CLICK, MOCK_LESSON_PYTHON } from '../../teaching-engine/mockLessons';
import { Sparkles, X, CheckCircle, ArrowRight, Clock, Globe, Code, Play } from 'lucide-react';

export const GenerateModal = () => {
  const { isGenerateModalOpen, setIsGenerateModalOpen } = useStudioStore();
  const [course, setCourse] = useState('JavaScript');
  const [topic, setTopic] = useState('Click Events');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [language, setLanguage] = useState('Hinglish');
  const [duration, setDuration] = useState('120');
  const [environment, setEnvironment] = useState('HTML_CSS_JS');

  const [step, setStep] = useState('form'); // 'form' | 'review'

  if (!isGenerateModalOpen) return null;

  const handleGenerate = (e) => {
    e.preventDefault();
    setStep('review');
  };

  const handleStartGeneratedSession = () => {
    setIsGenerateModalOpen(false);
    setStep('form');
    const lesson = environment === 'HTML_CSS_JS' ? MOCK_LESSON_JS_CLICK : MOCK_LESSON_PYTHON;
    engineInstance.start(lesson);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">New Phlappy AI Lesson</h2>
              <p className="text-xs text-slate-500 font-medium">Generate hands-free interactive coding sessions</p>
            </div>
          </div>
          <button
            onClick={() => setIsGenerateModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {step === 'form' ? (
          <form onSubmit={handleGenerate} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course</label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="HTML & CSS">HTML & CSS</option>
                  <option value="React">React</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Topic / Subtopic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  placeholder="e.g. Click Events"
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="90">90 Seconds</option>
                  <option value="120">2 Minutes</option>
                  <option value="180">3 Minutes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Environment Template</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="HTML_CSS_JS">HTML / CSS / JavaScript (Iframe Sandbox)</option>
                <option value="PYTHON_BASIC">Python 3 (Terminal Stdout Runtime)</option>
                <option value="C_BASIC">C Language (GCC Terminal Compiler)</option>
                <option value="CPP_BASIC">C++ Language (G++ Terminal Compiler)</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>GENERATE WITH PHLAPPY</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900">Generated Lesson Plan Ready</h4>
                <p className="text-[11px] text-emerald-700">Phlappy has structured 13 teaching steps for "{topic}".</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 text-xs">
              <div className="font-bold text-slate-800 border-b border-slate-200 pb-1 flex justify-between">
                <span>Proposed Action Plan</span>
                <span className="text-slate-500 text-[11px] font-normal">120 seconds target</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px]">
                <li><strong className="text-slate-800">Speak:</strong> Introduction to Click Event in Hinglish</li>
                <li><strong className="text-slate-800">Create & Open File:</strong> index.html</li>
                <li><strong className="text-slate-800">Write Code:</strong> Add &lt;button id="demoButton"&gt;</li>
                <li><strong className="text-slate-800">Create & Open File:</strong> script.js</li>
                <li><strong className="text-slate-800">Write Code:</strong> Add document.querySelector().onclick handler</li>
                <li><strong className="text-slate-800">Show Preview:</strong> Display sandboxed preview iframe</li>
                <li><strong className="text-slate-800">Click Element:</strong> Trigger synthetic click on #demoButton</li>
                <li><strong className="text-slate-800">Show Console:</strong> Demonstrate "Button clicked!" log output</li>
                <li><strong className="text-slate-800">Conclude:</strong> Recap learning points</li>
              </ol>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setStep('form')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Back to Edit Prompt
              </button>

              <button
                onClick={handleStartGeneratedSession}
                className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START SESSION</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
