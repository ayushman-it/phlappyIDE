import React, { useState } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { engineInstance } from '../../teaching-engine/Engine';
import { recorderInstance } from '../../services/recorderService';
import { aiAudioService } from '../../services/aiAudioService';
import { getThemeClasses, THEME_OPTIONS } from '../../utils/themeStyles';
import { Play, Pause, RotateCcw, Video, Layers, FileCode, Palette, ChevronDown, Sun, Coffee, Moon, Sparkles, CircleDot } from 'lucide-react';

export const StudioHeader = () => {
  const {
    isPlaying,
    isPaused,
    currentStepIndex,
    lessonTitle,
    isRecording,
    setIsRecording,
    recordDuration,
    setRecordDuration,
    activeLessonData,
    appTheme,
    setAppTheme
  } = useStudioStore();

  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const theme = getThemeClasses(appTheme);

  const totalSteps = activeLessonData?.steps?.length || 0;
  const progressPercent = totalSteps > 0 ? Math.min(100, Math.round(((currentStepIndex + 1) / totalSteps) * 100)) : 0;

  const handlePlayPause = () => {
    if (!activeLessonData) return;
    aiAudioService.init();
    if (!isPlaying) {
      engineInstance.start(activeLessonData);
    } else if (isPaused) {
      engineInstance.resume(activeLessonData);
    } else {
      engineInstance.pause();
    }
  };

  const handleReset = () => {
    engineInstance.stop();
  };

  const handleToggleRecording = async () => {
    aiAudioService.init();
    if (isRecording) {
      recorderInstance.stopRecording(lessonTitle);
      setIsRecording(false);
    } else {
      try {
        await recorderInstance.startRecording((sec) => setRecordDuration(sec));
        setIsRecording(true);
      } catch (err) {
        console.error('Recording start failed:', err);
        setIsRecording(false);
      }
    }
  };

  const currentThemeObj = THEME_OPTIONS.find((t) => t.id === appTheme) || THEME_OPTIONS[0];

  const renderThemeIcon = (iconName) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-3.5 h-3.5 text-amber-500" />;
      case 'Coffee': return <Coffee className="w-3.5 h-3.5 text-amber-700" />;
      case 'Moon': return <Moon className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Sparkles': return <Sparkles className="w-3.5 h-3.5 text-sky-500" />;
      default: return <Sun className="w-3.5 h-3.5" />;
    }
  };

  return (
    <header className={`h-12 ${theme.headerBg} border-b px-4 flex items-center justify-between select-none shadow-2xs relative z-30 transition-colors`}>
      {/* Left Window Lockup & Brand */}
      <div className="flex items-center space-x-3">
        {/* macOS Window Dots */}
        <div className="flex items-center space-x-1.5 opacity-80 hover:opacity-100 transition-opacity">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/90 border border-rose-600/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/90 border border-amber-600/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 border border-emerald-600/30" />
        </div>

        <div className="h-4 w-px bg-slate-300/50" />

        {/* Brand Lockup */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-white border border-slate-200 p-0.5 shadow-2xs">
            <img
              src="https://thecodemunk.in/assets/logo.png"
              alt="TheCodeMunk Logo"
              className="h-full w-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          <h1 className="font-black text-xs tracking-tight leading-none flex items-center gap-1 font-sans">
            TCM<span className="text-rose-600">One</span>
            <span className="text-[9px] font-mono font-bold tracking-wider opacity-80 bg-slate-200/70 border border-slate-300/70 px-1.5 py-0.5 rounded uppercase">
              Phlappy AI
            </span>
          </h1>
        </div>

        <div className="h-4 w-px bg-slate-300/50 hidden md:block" />

        {/* Active Lesson Topic Breadcrumb Pill */}
        <div className={`hidden md:flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 rounded-lg border ${theme.badgeBg} shadow-2xs`}>
          <Layers className="w-3 h-3 text-rose-600" />
          <span className="truncate max-w-[200px] font-bold text-[11px]">{lessonTitle}</span>
          {isPlaying && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600" />
            </span>
          )}
        </div>
      </div>

      {/* Center Sequencer Controls & Step Bar */}
      <div className="flex items-center space-x-2.5">
        <div className={`flex items-center p-0.5 rounded-lg space-x-1 border ${theme.pillBg}`}>
          <button
            onClick={handlePlayPause}
            disabled={!activeLessonData}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-[11px] font-black transition-all disabled:opacity-40 cursor-pointer shadow-2xs ${
              isPlaying && !isPaused
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>{isPaused ? 'RESUME' : 'PLAY LESSON'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            disabled={!activeLessonData}
            title="Reset Lesson Session"
            className="p-1 opacity-70 hover:opacity-100 hover:bg-black/10 rounded transition-colors disabled:opacity-40 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {totalSteps > 0 && (
          <div className={`hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-lg border text-[10px] font-mono ${theme.pillBg}`}>
            <span>Step <strong className="text-rose-600">{Math.min(currentStepIndex + 1, totalSteps)}</strong>/{totalSteps}</span>
            <div className="w-16 bg-slate-300/60 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-600 to-amber-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-bold text-rose-600">{progressPercent}%</span>
          </div>
        )}
      </div>

      {/* Right Controls & Theme Dropdown */}
      <div className="flex items-center space-x-2">
        {/* Theme Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${theme.pillBg}`}
            title="Change Studio Theme"
          >
            {renderThemeIcon(currentThemeObj.iconName)}
            <span>{currentThemeObj.name}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {isThemeDropdownOpen && (
            <div className={`absolute right-0 top-10 z-50 w-52 rounded-xl border shadow-2xl p-1.5 animate-in fade-in slide-in-from-top-2 duration-150 ${theme.dropdownBg}`}>
              <div className={`px-2 py-1 border-b mb-1 text-[9px] font-extrabold uppercase tracking-wider ${theme.textMuted}`}>
                Select IDE Theme
              </div>
              {THEME_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setAppTheme(t.id);
                    setIsThemeDropdownOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                    appTheme === t.id
                      ? `${theme.badgeBg} font-extrabold`
                      : `hover:opacity-100 ${theme.textMuted}`
                  }`}
                >
                  {renderThemeIcon(t.iconName)}
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Custom Script Button */}
        <button
          onClick={() => useStudioStore.getState().setIsGenerateModalOpen(true)}
          className={`hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${theme.pillBg}`}
          title="Import or Edit Custom 3-Min Script JSON"
        >
          <FileCode className="w-3 h-3 text-rose-600" />
          <span>Custom Script</span>
        </button>

        {/* Studio Recorder Button */}
        <button
          onClick={handleToggleRecording}
          className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-[11px] font-extrabold border transition-all cursor-pointer ${
            isRecording
              ? 'bg-red-600 text-white border-red-700 animate-pulse shadow-2xs'
              : `${theme.pillBg}`
          }`}
        >
          {isRecording ? (
            <CircleDot className="w-3 h-3 text-white animate-ping" />
          ) : (
            <Video className="w-3 h-3 text-rose-600" />
          )}
          <span>
            {isRecording
              ? `REC (${Math.floor(recordDuration / 60)}:${String(recordDuration % 60).padStart(2, '0')})`
              : 'Record'}
          </span>
        </button>
      </div>
    </header>
  );
};
