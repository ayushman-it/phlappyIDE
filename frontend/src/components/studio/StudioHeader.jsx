import React from 'react';
import { useStudioStore } from '../../store/studioStore';
import { engineInstance } from '../../teaching-engine/Engine';
import { recorderInstance } from '../../services/recorderService';
import { aiAudioService } from '../../services/aiAudioService';
import { Play, Pause, RotateCcw, Video, Layers, FileCode } from 'lucide-react';

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
    <header className="h-14 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between select-none text-slate-800 shadow-2xs">
      {/* Brand & Official Logo Lockup */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          {/* Logo Container */}
          <div className="flex items-center justify-center h-8">
            <img
              src="https://thecodemunk.in/assets/logo.png"
              alt="TheCodeMunk Logo"
              className="h-7 w-auto object-contain transition-transform hover:scale-105"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Official TCM One Branding: "TCM" + Red "One" */}
          <h1 className="font-black text-slate-900 text-base tracking-tight flex items-center">
            TCM<span className="text-rose-600">One</span>
          </h1>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* Active Lesson Topic Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200/70">
          <Layers className="w-3.5 h-3.5 text-rose-600" />
          <span className="truncate max-w-[240px] font-bold text-slate-800">{lessonTitle}</span>
        </div>
      </div>

      {/* Center Controls: Sequencer & Player */}
      <div className="flex items-center space-x-3">
        {/* Playback Controls */}
        <div className="flex items-center bg-slate-100/80 p-0.5 rounded-lg space-x-1 border border-slate-200">
          <button
            onClick={handlePlayPause}
            disabled={!activeLessonData}
            className={`flex items-center space-x-1.5 px-3.5 py-1 rounded-md text-xs font-bold transition-all disabled:opacity-40 cursor-pointer ${
              isPlaying && !isPaused
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
            }`}
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isPaused ? 'Resume' : 'Play Lesson'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            disabled={!activeLessonData}
            title="Reset Lesson"
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-md transition-colors disabled:opacity-40 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step Progress Badge */}
        {totalSteps > 0 && (
          <div className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            Step <span className="text-slate-900 font-bold">{Math.min(currentStepIndex + 1, totalSteps)}</span> / {totalSteps}
          </div>
        )}
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center space-x-2.5">
        {/* Environment Pill */}
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200/80 text-slate-600">
          {environment}
        </span>

        <button
          onClick={() => useStudioStore.getState().setIsGenerateModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          title="Import or Edit Custom 3-Min Script JSON"
        >
          <FileCode className="w-3.5 h-3.5 text-rose-600" />
          <span>Custom Script</span>
        </button>

        <button
          onClick={handleToggleRecording}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-bold border transition-colors cursor-pointer ${
            isRecording
              ? 'bg-red-600 text-white border-red-700 animate-pulse shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-2xs'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>
            {isRecording
              ? `🔴 Rec (${Math.floor(recordDuration / 60)}:${String(recordDuration % 60).padStart(2, '0')})`
              : 'Record Studio'}
          </span>
        </button>
      </div>
    </header>
  );
};

