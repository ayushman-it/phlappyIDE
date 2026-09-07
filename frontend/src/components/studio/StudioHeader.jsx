import React from 'react';
import { useStudioStore } from '../../store/studioStore';
import { engineInstance } from '../../teaching-engine/Engine';
import { recorderInstance } from '../../services/recorderService';
import { aiAudioService } from '../../services/aiAudioService';
import { Play, Pause, RotateCcw, Video, Layers, FileCode, Sparkles, Cpu } from 'lucide-react';

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
    activeLessonData
  } = useStudioStore();

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

  return (
    <header className="h-14 bg-slate-950 border-b border-slate-800 px-5 flex items-center justify-between select-none text-slate-100 shadow-md relative z-20">
      {/* Left Brand Lockup & Topic Breadcrumb */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          {/* Logo Badge Container */}
          <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-slate-900 border border-slate-800 p-1 shadow-inner">
            <img
              src="https://thecodemunk.in/assets/logo.png"
              alt="TheCodeMunk Logo"
              className="h-full w-full object-contain rounded-lg transition-transform hover:scale-105"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Official TCM One Studio Brand Lockup */}
          <div className="flex flex-col">
            <h1 className="font-black text-white text-base tracking-tight leading-none flex items-center gap-1">
              TCM<span className="text-rose-500">One</span>
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded ml-1 uppercase">
                Studio
              </span>
            </h1>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        {/* Active Lesson Topic Breadcrumb Pill */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800/90 shadow-2xs">
          <Layers className="w-3.5 h-3.5 text-rose-500" />
          <span className="truncate max-w-[260px] font-bold text-slate-100">{lessonTitle}</span>
          {isPlaying && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
          )}
        </div>
      </div>

      {/* Center Sequencer Controls & Progress Bar */}
      <div className="flex items-center space-x-3">
        {/* Playback Button Group */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl space-x-1 border border-slate-800 shadow-inner">
          <button
            onClick={handlePlayPause}
            disabled={!activeLessonData}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-black transition-all disabled:opacity-40 cursor-pointer shadow-sm ${
              isPlaying && !isPaused
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
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
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step Progress Bar Pill */}
        {totalSteps > 0 && (
          <div className="flex flex-col space-y-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] min-w-[120px]">
            <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
              <span>Step <strong className="text-white">{Math.min(currentStepIndex + 1, totalSteps)}</strong>/{totalSteps}</span>
              <span className="text-rose-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-600 to-amber-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center space-x-2.5">
        {/* Environment Tech Pill */}
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
          <Cpu className="w-3 h-3 text-rose-500" />
          {environment}
        </span>

        {/* Custom Script Modal Trigger */}
        <button
          onClick={() => useStudioStore.getState().setIsGenerateModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all cursor-pointer shadow-xs hover:border-slate-700"
          title="Import or Edit Custom 3-Min Script JSON"
        >
          <FileCode className="w-3.5 h-3.5 text-rose-400" />
          <span>Custom Script</span>
        </button>

        {/* Studio Recorder Toggle Button */}
        <button
          onClick={handleToggleRecording}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
            isRecording
              ? 'bg-red-600 text-white border-red-500 animate-pulse shadow-lg shadow-red-600/30'
              : 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 border-rose-800/80 shadow-xs'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
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
