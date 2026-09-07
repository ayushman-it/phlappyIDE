import React from 'react';
import { useStudioStore } from '../../store/studioStore';
import { Volume2, Sparkles, MessageSquare, Minimize2, Maximize2, X, Eye } from 'lucide-react';

export const FlappyWidget = () => {
  const {
    flappyState,
    isPlaying,
    isFlappyCollapsed,
    setIsFlappyCollapsed,
    isFlappyHidden,
    setIsFlappyHidden
  } = useStudioStore();

  const isSpeaking = flappyState.status === 'speaking' && isPlaying;

  if (isFlappyHidden) {
    return (
      <button
        onClick={() => setIsFlappyHidden(false)}
        className="fixed bottom-4 right-6 z-40 bg-slate-900 text-white p-2.5 rounded-full shadow-2xl border border-slate-700 hover:bg-slate-800 transition-all flex items-center space-x-1.5 text-xs font-bold cursor-pointer"
        title="Show Phlappy AI Speech"
      >
        <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-900 p-0.5 flex items-center justify-center border border-slate-700">
          <img src="https://thecodemunk.in/assets/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full" />
        </div>
        <span>Show Phlappy AI</span>
      </button>
    );
  }

  // COLLAPSED COMPACT BADGE VIEW
  if (isFlappyCollapsed) {
    return (
      <div className="fixed bottom-4 right-6 z-40">
        <button
          onClick={() => setIsFlappyCollapsed(false)}
          className={`relative group bg-slate-900 border border-slate-700 p-2 rounded-full shadow-2xl transition-all cursor-pointer flex items-center space-x-2 ${
            isSpeaking ? 'ring-4 ring-rose-500/50 animate-pulse scale-105' : 'hover:scale-105'
          }`}
          title="Expand Phlappy AI Speech"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-950 p-1 flex items-center justify-center border border-slate-800">
            <img
              src="https://thecodemunk.in/assets/logo.png"
              alt="Phlappy Logo"
              className={`w-full h-full object-cover rounded-full ${
                isSpeaking ? 'animate-bounce [animation-duration:1s]' : ''
              }`}
            />
          </div>

          {isSpeaking ? (
            <div className="flex items-center space-x-0.5 h-3 pr-1">
              <span className="w-0.5 h-full bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-0.5 h-full bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-0.5 h-full bg-rose-500 rounded-full animate-bounce"></span>
            </div>
          ) : (
            <span className="text-white text-[11px] font-bold pr-1">Phlappy AI</span>
          )}

          <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />

          {isSpeaking && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
            </span>
          )}
        </button>
      </div>
    );
  }

  // EXPANDED FULL SPEECH CARD VIEW
  return (
    <div className="fixed bottom-4 right-6 z-40 max-w-[420px]">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-2.5 border border-slate-200 shadow-2xl flex flex-col space-y-2 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200">
        {/* Top Action Bar with Minimize and Close Controls */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
          <div className="flex items-center space-x-1.5">
            <span className="font-extrabold text-[11px] text-slate-900 tracking-tight flex items-center gap-1">
              Phlappy AI Teacher
              <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
            </span>

            {isSpeaking && (
              <div className="flex items-center space-x-0.5 h-2.5">
                <span className="w-0.5 h-full bg-rose-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-0.5 h-full bg-rose-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-0.5 h-full bg-rose-600 rounded-full animate-bounce"></span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsFlappyCollapsed(true)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              title="Minimize / Collapse"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsFlappyHidden(true)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              title="Close / Hide"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex items-center space-x-2.5 pt-0.5">
          {/* Circular Logo Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className={`w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center p-0.5 overflow-hidden shadow-xs transition-all ${
                isSpeaking ? 'ring-2 ring-rose-500/50 scale-105 animate-pulse' : ''
              }`}
            >
              <img
                src="https://thecodemunk.in/assets/logo.png"
                alt="TCM Flappy Logo"
                className={`w-full h-full object-cover rounded-full ${
                  isSpeaking ? 'animate-bounce [animation-duration:1s]' : ''
                }`}
              />
            </div>
          </div>

          {/* Speech Text */}
          <p className="flex-1 text-[11px] font-semibold text-slate-700 leading-relaxed line-clamp-3">
            "{flappyState.speechText}"
          </p>

          {/* Audio Indicator Icon */}
          <div className="flex-shrink-0 text-slate-400 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
            {isSpeaking ? (
              <Volume2 className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            ) : (
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
