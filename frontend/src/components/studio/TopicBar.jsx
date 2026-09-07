import React, { useState } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { generateLessonFromGroq } from '../../services/groqService';
import { engineInstance } from '../../teaching-engine/Engine';
import { Sparkles, Loader2, BookOpen, Zap, Keyboard, ChevronDown, ChevronUp, Search, SlidersHorizontal } from 'lucide-react';

export const TopicBar = () => {
  const {
    currentTopicInput,
    setCurrentTopicInput,
    isGeneratingAI,
    setIsGeneratingAI,
    setActiveLessonData,
    environment,
    setEnvironment,
    setFlappySpeech,
    typingSpeed,
    setTypingSpeed
  } = useStudioStore();

  const [isExpanded, setIsExpanded] = useState(true);
  const [language, setLanguage] = useState('Hinglish');
  const [difficulty, setDifficulty] = useState('Beginner');

  const PRESET_TOPICS = [
    { title: 'JS Variables & Scope (JS)', env: 'HTML_CSS_JS' },
    { title: 'Python Loops & Lists (Python)', env: 'PYTHON_BASIC' },
    { title: 'C++ Classes & OOP (C++)', env: 'CPP_BASIC' },
    { title: 'C Pointers & Memory (C)', env: 'C_BASIC' },
    { title: 'HTML5 Forms & Elements (HTML)', env: 'HTML_CSS_JS' },
    { title: 'CSS Flexbox & Grid (CSS)', env: 'HTML_CSS_JS' }
  ];

  const handleGenerateAndTeach = async (overrideTopic = null) => {
    const topicToUse = overrideTopic || currentTopicInput;
    if (!topicToUse.trim()) return;

    engineInstance.stop();

    setIsGeneratingAI(true);
    setFlappySpeech(`"Searching and planning 3-minute lesson steps for '${topicToUse}' using Phlappy AI..."`, 'thinking');

    try {
      const lessonData = await generateLessonFromGroq({
        topic: topicToUse,
        language,
        difficulty,
        environment
      });

      setActiveLessonData(lessonData);
      setIsGeneratingAI(false);

      if (lessonData.environment) {
        setEnvironment(lessonData.environment);
      }

      engineInstance.start(lessonData);
    } catch (err) {
      console.error(err);
      setIsGeneratingAI(false);
      setFlappySpeech(`Generation failed: ${err.message}. Please try again.`, 'idle');
    }
  };

  const handlePresetClick = (preset) => {
    setCurrentTopicInput(preset.title);
    if (preset.env) {
      setEnvironment(preset.env);
    }
    handleGenerateAndTeach(preset.title);
  };

  // COLLAPSED COMPACT BAR VIEW
  if (!isExpanded) {
    return (
      <div className="bg-slate-900 border-b border-slate-800 text-slate-100 px-6 py-1.5 flex items-center justify-between shadow-xs select-none">
        <div className="flex items-center space-x-3 flex-1 max-w-2xl">
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center space-x-2 bg-slate-950 hover:bg-slate-800 text-slate-300 px-3.5 py-1 rounded-lg border border-slate-800 text-xs font-semibold w-full transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-rose-500" />
            <span className="truncate flex-1 text-left font-medium text-slate-300">
              {currentTopicInput ? `Topic: ${currentTopicInput}` : 'Type any programming topic to learn...'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center space-x-1 text-slate-300 hover:text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 cursor-pointer"
          >
            <SlidersHorizontal className="w-3 h-3 text-rose-500" />
            <span>Options</span>
          </button>

          <button
            onClick={() => handleGenerateAndTeach()}
            disabled={isGeneratingAI}
            className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-3.5 py-1 rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {isGeneratingAI ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
            )}
            <span>GENERATE</span>
          </button>
        </div>
      </div>
    );
  }

  // EXPANDED FULL TOPIC BAR VIEW
  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-100 px-6 py-2.5 shadow-sm select-none transition-all">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Topic Input Box */}
        <div className="flex-1 w-full flex items-center space-x-2.5">
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            title="Collapse Topic Bar"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          <div className="flex-shrink-0 bg-rose-950/60 text-rose-400 p-1.5 rounded-xl border border-rose-800/80 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-rose-400" />
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              value={currentTopicInput}
              onChange={(e) => setCurrentTopicInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateAndTeach()}
              placeholder="Enter ANY topic (e.g. JS Variables, Python Loops, C++ Classes, CSS Flexbox)..."
              disabled={isGeneratingAI}
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs font-semibold rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
            />
          </div>
        </div>

        {/* Options & Typing Speed & Action Button */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5">
            <Keyboard className="w-3.5 h-3.5 text-rose-500" />
            <select
              value={typingSpeed}
              onChange={(e) => setTypingSpeed(e.target.value)}
              className="bg-transparent text-slate-300 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="realistic" className="bg-slate-900 text-slate-200">Realistic Typing (Smooth)</option>
              <option value="medium" className="bg-slate-900 text-slate-200">Medium Speed</option>
              <option value="fast" className="bg-slate-900 text-slate-200">Fast Speed</option>
            </select>
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isGeneratingAI}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
          >
            <option value="Hinglish" className="bg-slate-900 text-slate-200">Hinglish</option>
            <option value="Hindi" className="bg-slate-900 text-slate-200">Hindi</option>
            <option value="English" className="bg-slate-900 text-slate-200">English</option>
          </select>

          <button
            onClick={() => handleGenerateAndTeach()}
            disabled={isGeneratingAI}
            className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-4 py-2 rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {isGeneratingAI ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                <span>GENERATE & TEACH</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="mt-2.5 flex items-center space-x-2 overflow-x-auto text-[11px]">
        <span className="text-slate-400 font-bold flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> Topics:
        </span>
        {PRESET_TOPICS.map((preset) => (
          <button
            key={preset.title}
            onClick={() => handlePresetClick(preset)}
            disabled={isGeneratingAI}
            className="bg-slate-950 hover:bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors whitespace-nowrap font-semibold cursor-pointer"
          >
            {preset.title}
          </button>
        ))}
      </div>
    </div>
  );
};
