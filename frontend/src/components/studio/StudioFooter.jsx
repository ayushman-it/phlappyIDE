import React from 'react';
import { useStudioStore } from '../../store/studioStore';
import { getThemeClasses } from '../../utils/themeStyles';
import { Terminal, GitBranch, CheckCircle2, Sparkles, Cpu, Video } from 'lucide-react';

export const StudioFooter = () => {
  const {
    appTheme,
    environment,
    activeFile,
    files,
    isPlaying,
    currentStepIndex,
    activeLessonData,
    editorFontSize,
    isRecording,
    recordDuration
  } = useStudioStore();

  const theme = getThemeClasses(appTheme);

  const totalSteps = activeLessonData?.steps?.length || 0;
  const currentLineCount = (activeFile && files[activeFile]) ? files[activeFile].split('\n').length : 1;
  const getLanguageName = (fileName) => {
    if (!fileName) return 'PLAINTEXT';
    if (fileName.endsWith('.html')) return 'HTML5';
    if (fileName.endsWith('.css')) return 'CSS3';
    if (fileName.endsWith('.js')) return 'JAVASCRIPT';
    if (fileName.endsWith('.py')) return 'PYTHON 3';
    if (fileName.endsWith('.c')) return 'C (GCC)';
    if (fileName.endsWith('.cpp') || fileName.endsWith('.cc') || fileName.endsWith('.h')) return 'C++ (GCC)';
    return 'PLAINTEXT';
  };

  return (
    <footer className={`h-6 ${theme.statusBarBg} px-3 flex items-center justify-between text-[11px] font-mono select-none flex-shrink-0 z-30 transition-colors border-t border-black/10`}>
      {/* Left Footer Badges */}
      <div className="flex items-center space-x-3 overflow-x-auto">
        {/* Remote Host Badge */}
        <button
          className="bg-black/20 hover:bg-black/30 px-2 py-0.5 rounded flex items-center space-x-1 cursor-pointer transition-colors text-[10px] font-bold"
          title="Phlappy AI Sandbox Connected"
        >
          <span className="text-emerald-300 font-extrabold text-[12px] leading-none">＞＜</span>
          <span className="font-sans font-extrabold">Phlappy AI</span>
        </button>

        {/* Git Branch Badge */}
        <div className="flex items-center space-x-1 opacity-90 hover:opacity-100 transition-opacity">
          <GitBranch className="w-3 h-3 text-rose-300" />
          <span className="font-semibold text-[10px]">main*</span>
        </div>

        {/* AI Status Badge */}
        <div className="flex items-center space-x-1.5 opacity-90">
          {isPlaying ? (
            <span className="flex items-center text-amber-200 font-bold animate-pulse text-[10px]">
              <Sparkles className="w-3 h-3 mr-1 text-amber-300 fill-amber-300" />
              Teaching Step {Math.min(currentStepIndex + 1, totalSteps)}/{totalSteps}
            </span>
          ) : (
            <span className="flex items-center text-emerald-200 font-bold text-[10px]">
              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-300" />
              IDE Ready
            </span>
          )}
        </div>

        {/* Recording Status (if recording) */}
        {isRecording && (
          <div className="flex items-center space-x-1 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-extrabold animate-pulse">
            <Video className="w-3 h-3" />
            <span>REC ({Math.floor(recordDuration / 60)}:{String(recordDuration % 60).padStart(2, '0')})</span>
          </div>
        )}
      </div>

      {/* Right Footer Environment & Code Details */}
      <div className="flex items-center space-x-4 opacity-90 text-[10px]">
        <div className="flex items-center space-x-1">
          <Terminal className="w-3 h-3 opacity-80" />
          <span className="font-bold">{getLanguageName(activeFile)}</span>
        </div>

        <div className="hidden sm:flex items-center space-x-2">
          <span>Ln {currentLineCount}, Col 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
        </div>

        <div className="flex items-center space-x-1 bg-white/10 px-1.5 py-0.5 rounded text-white font-bold">
          <Cpu className="w-3 h-3" />
          <span>{environment}</span>
        </div>

        <div className="flex items-center space-x-1 font-bold text-amber-200">
          <span>Font: {editorFontSize}px</span>
        </div>
      </div>
    </footer>
  );
};
