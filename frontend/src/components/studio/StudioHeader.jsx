import React, { useState } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { engineInstance } from '../../teaching-engine/Engine';
import { recorderInstance } from '../../services/recorderService';
import { aiAudioService } from '../../services/aiAudioService';
import { getThemeClasses, THEME_OPTIONS } from '../../utils/themeStyles';
import { Play, Pause, RotateCcw, Video, Layers, FileCode, Cpu, Palette, ChevronDown } from 'lucide-react';

export const StudioHeader = () => {
  const {
    isPlaying,
    isPaused,
    currentStepIndex,
    lessonTitle,
    environment,
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

  return (
    <header className={`h-14 ${theme.headerBg} border-b px-5 flex items-center justify-between select-none shadow-2xs relative z-30 transition-colors`}>
      {/* Left Brand Lockup & Topic Breadcrumb */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          {/* Logo Container */}
          <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-white border border-slate-200 p-1 shadow-2xs">
            <img
              src="https://thecodemunk.in/assets/logo.png"
              alt="TheCodeMunk Logo"
              className="h-full w-full object-contain transition-transform hover:scale-105"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Official TCM One Studio Brand Lockup */}
          <div className="flex flex-col">
            <h1 className="font-black text-base tracking-tight leading-none flex items-center gap-1">
              TCM<span className="text-rose-600">One</span>
              <span className="text-[10px] font-mono font-bold tracking-wider opacity-70 bg-slate-200/60 border border-slate-300/80 px-1.5 py-0.5 rounded ml-1 uppercase">
                Studio
              </span>
            </h1>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-300/60" />

        {/* Active Lesson Topic Breadcrumb Pill */}
        <div className={`flex items-center space-x-2 text-xs font-semibold px-3 py-1 rounded-xl border ${theme.pillBg} shadow-2xs`}>
          <Layers className="w-3.5 h-3.5 text-rose-600" />
          <span className="truncate max-w-[240px] font-bold">{lessonTitle}</span>
          {isPlaying && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600" />
            </span>
          )}
        </div>
      </div>

      {/* Center Sequencer Controls & Progress Bar */}
      <div className="flex items-center space-x-3">
        {/* Playback Button Group */}
        <div className={`flex items-center p-1 rounded-xl space-x-1 border ${theme.pillBg}`}>
          <button
            onClick={handlePlayPause}
            disabled={!activeLessonData}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-black transition-all disabled:opacity-40 cursor-pointer shadow-xs ${
              isPlaying && !isPaused
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isPaused ? 'RESUME' : 'PLAY LESSON'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            disabled={!activeLessonData}
            title="Reset Lesson Session"
            className="p-1.5 opacity-70 hover:opacity-100 hover:bg-black/10 rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step Progress Bar Pill */}
        {totalSteps > 0 && (
          <div className={`flex flex-col space-y-1 px-3 py-1.5 rounded-xl border text-[11px] min-w-[120px] ${theme.pillBg}`}>
            <div className="flex items-center justify-between opacity-80 font-mono text-[10px]">
              <span>Step <strong>{Math.min(currentStepIndex + 1, totalSteps)}</strong>/{totalSteps}</span>
              <span className="text-rose-600 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-300/60 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-600 to-amber-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Right Action Controls & Theme Selector */}
      <div className="flex items-center space-x-2.5">
        {/* Theme Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${theme.pillBg}`}
            title="Change Studio Theme"
          >
            <Palette className="w-3.5 h-3.5 text-rose-600" />
            <span>{currentThemeObj.name}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {isThemeDropdownOpen && (
            <div className="absolute right-0 top-11 z-50 w-56 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800">
              <div className="px-2.5 py-1 border-b border-slate-100 mb-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Select Studio Theme
              </div>
              {THEME_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setAppTheme(t.id);
                    setIsThemeDropdownOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    appTheme === t.id
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base">{t.icon}</span>
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Environment Tech Pill */}
        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl border flex items-center gap-1 ${theme.pillBg}`}>
          <Cpu className="w-3 h-3 text-rose-600" />
          {environment}
        </span>

        {/* Custom Script Modal Trigger */}
        <button
          onClick={() => useStudioStore.getState().setIsGenerateModalOpen(true)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${theme.pillBg}`}
          title="Import or Edit Custom 3-Min Script JSON"
        >
          <FileCode className="w-3.5 h-3.5 text-rose-600" />
          <span>Custom Script</span>
        </button>

        {/* Studio Recorder Toggle Button */}
        <button
          onClick={handleToggleRecording}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
            isRecording
              ? 'bg-red-600 text-white border-red-700 animate-pulse shadow-xs'
              : `${theme.pillBg}`
          }`}
        >
          <Video className="w-3.5 h-3.5 text-rose-600" />
          <span>
            {isRecording
              ? `🔴 REC (${Math.floor(recordDuration / 60)}:${String(recordDuration % 60).padStart(2, '0')})`
              : 'Record Studio'}
          </span>
        </button>
      </div>
    </header>
  );
};
