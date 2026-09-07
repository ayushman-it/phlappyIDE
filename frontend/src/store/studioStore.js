import { create } from 'zustand';

export const useStudioStore = create((set, get) => ({
  // Active Environment
  environment: 'HTML_CSS_JS', // 'HTML_CSS_JS' | 'PYTHON_BASIC' | 'C_BASIC' | 'CPP_BASIC'
  setEnvironment: (env) =>
    set(() => ({
      environment: env,
      activeFile:
        env === 'PYTHON_BASIC'
          ? 'main.py'
          : env === 'C_BASIC'
          ? 'main.c'
          : env === 'CPP_BASIC'
          ? 'main.cpp'
          : 'index.html',
      activeRightTab: env === 'HTML_CSS_JS' ? 'preview' : 'terminal'
    })),

  // Virtual Animated Pointer Cursor State
  cursorPosition: { x: 300, y: 150 },
  isCursorVisible: false,
  isClicking: false,
  setCursorPosition: (pos) => set({ cursorPosition: pos }),
  setIsCursorVisible: (visible) => set({ isCursorVisible: visible }),
  triggerCursorClick: () => {
    set({ isClicking: true });
    setTimeout(() => set({ isClicking: false }), 600);
  },

  // Typing Speed Control
  typingSpeed: 'realistic', // 'realistic' | 'medium' | 'fast'
  setTypingSpeed: (speed) => set({ typingSpeed: speed }),

  // Multi-File Virtual Storage
  files: {},
  activeFile: '',
  setActiveFile: (file) => set({ activeFile: file }),
  updateFileContent: (file, content) =>
    set((state) => ({
      files: { ...state.files, [file]: content }
    })),
  addFile: (fileName, defaultContent = '') =>
    set((state) => ({
      files: { ...state.files, [fileName]: defaultContent },
      activeFile: fileName
    })),
  setAllFiles: (newFiles) => set({ files: newFiles }),

  // Right Panel Tabs
  activeRightTab: 'preview', // 'preview' | 'console' | 'terminal'
  setActiveRightTab: (tab) => set({ activeRightTab: tab }),

  // Console Logs Capture
  consoleLogs: [],
  addConsoleLog: (type, message) =>
    set((state) => ({
      consoleLogs: [
        ...state.consoleLogs,
        { id: Date.now() + Math.random(), type, message, timestamp: new Date().toLocaleTimeString() }
      ]
    })),
  clearConsoleLogs: () => set({ consoleLogs: [] }),

  // Terminal Logs Capture
  terminalLogs: [],
  addTerminalLog: (line) =>
    set((state) => ({
      terminalLogs: [...state.terminalLogs, line]
    })),
  clearTerminalLogs: () => set({ terminalLogs: [] }),

  // Phlappy AI Avatar, Speech & Collapse/Hide State
  flappyState: {
    status: 'idle', // 'idle' | 'speaking' | 'thinking'
    speechText: 'Namaste! Main Phlappy hoon. Topic bar me koi bhi topic type kijiye (jaise React useState, CSS Flexbox, Python Loops, JS Click Events) aur main live lesson create karunga!',
    audioPlaying: false
  },
  isFlappyCollapsed: false,
  setIsFlappyCollapsed: (collapsed) => set({ isFlappyCollapsed: collapsed }),
  isFlappyHidden: false,
  setIsFlappyHidden: (hidden) => set({ isFlappyHidden: hidden }),
  setFlappySpeech: (text, status = 'speaking') =>
    set((state) => ({
      flappyState: { ...state.flappyState, speechText: text, status }
    })),

  // ElevenLabs Key & Performance Usage Tracker
  elevenLabsKey: localStorage.getItem('PHLAPPY_ELEVENLABS_KEY') || 'sk_a089bd4c4fbc4d9cb64ef33d7504f076e612987559946483',
  setElevenLabsKey: (key) => {
    localStorage.setItem('PHLAPPY_ELEVENLABS_KEY', key);
    set({ elevenLabsKey: key });
    get().checkKeyQuota(key);
  },
  elevenLabsUsageChars: 0,
  addElevenLabsChars: (count) => set((state) => ({ elevenLabsUsageChars: state.elevenLabsUsageChars + count })),
  elevenLabsQuotaInfo: {
    statusText: 'Checking Quota...',
    remainingQuota: null,
    characterLimit: null,
    characterCount: 0,
    isExceeded: false,
    isValid: true,
    hasFullDetails: false
  },
  setElevenLabsQuotaInfo: (info) => set((state) => ({
    elevenLabsQuotaInfo: typeof info === 'function' ? info(state.elevenLabsQuotaInfo) : { ...state.elevenLabsQuotaInfo, ...info }
  })),
  checkKeyQuota: async (targetKey) => {
    const keyToTest = targetKey || get().elevenLabsKey;
    if (!keyToTest) {
      set({
        elevenLabsQuotaInfo: {
          statusText: 'No Key Configured',
          remainingQuota: 0,
          characterLimit: 0,
          characterCount: 0,
          isExceeded: true,
          isValid: false,
          hasFullDetails: false
        }
      });
      return { ok: false };
    }

    try {
      const subRes = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
        headers: { 'xi-api-key': keyToTest }
      });

      if (subRes.ok) {
        const data = await subRes.json();
        const count = data.character_count || 0;
        const limit = data.character_limit || 0;
        const remaining = Math.max(0, limit - count);
        const isExceeded = remaining <= 0;

        set({
          elevenLabsQuotaInfo: {
            statusText: `${remaining.toLocaleString()} / ${limit.toLocaleString()} Chars`,
            remainingQuota: remaining,
            characterLimit: limit,
            characterCount: count,
            isExceeded,
            isValid: !isExceeded,
            hasFullDetails: true
          }
        });
        return { ok: true, remaining, limit, hasFullDetails: true };
      }

      const ttsRes = await fetch('https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB', {
        method: 'POST',
        headers: {
          'xi-api-key': keyToTest,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: '.',
          model_id: 'eleven_multilingual_v2'
        })
      });

      if (ttsRes.ok) {
        set({
          elevenLabsQuotaInfo: {
            statusText: 'Active Quota Available',
            remainingQuota: null,
            characterLimit: null,
            characterCount: get().elevenLabsUsageChars,
            isExceeded: false,
            isValid: true,
            hasFullDetails: false
          }
        });
        return { ok: true, hasFullDetails: false };
      } else {
        const errText = await ttsRes.text();
        const isQuotaErr = ttsRes.status === 401 && errText.includes('quota_exceeded');
        set({
          elevenLabsQuotaInfo: {
            statusText: isQuotaErr ? 'Quota Exceeded (0 Credits)' : `Error (${ttsRes.status})`,
            remainingQuota: 0,
            characterLimit: 0,
            characterCount: 0,
            isExceeded: isQuotaErr,
            isValid: false,
            hasFullDetails: false
          }
        });
        return { ok: false, error: errText, isQuotaExceeded: isQuotaErr };
      }
    } catch (err) {
      set({
        elevenLabsQuotaInfo: {
          statusText: 'Network Error',
          remainingQuota: 0,
          characterLimit: 0,
          characterCount: 0,
          isExceeded: false,
          isValid: false,
          hasFullDetails: false
        }
      });
      return { ok: false, error: err.message };
    }
  },

  // Topic Bar & Generation State
  currentTopicInput: '',
  setCurrentTopicInput: (topic) => set({ currentTopicInput: topic }),
  isGeneratingAI: false,
  setIsGeneratingAI: (generating) => set({ isGeneratingAI: generating }),
  activeLessonData: null,
  setActiveLessonData: (lesson) => set({ activeLessonData: lesson }),
  deepSearchLesson: null,
  setDeepSearchLesson: (lesson) => set({ deepSearchLesson: lesson }),

  // Syllabus / Subtopic Roadmap State
  syllabus: [],
  activeSyllabusIndex: 0,
  setSyllabus: (syllabusList) => set({ syllabus: syllabusList, activeSyllabusIndex: 0 }),
  updateSyllabusStatus: (index, status) =>
    set((state) => {
      const updated = state.syllabus.map((item, idx) =>
        idx === index ? { ...item, status } : item
      );
      return { syllabus: updated, activeSyllabusIndex: status === 'teaching' ? index : state.activeSyllabusIndex };
    }),

  // Sequencer / Teaching Engine State
  isPlaying: false,
  isPaused: false,
  currentStepIndex: 0,
  lessonTitle: 'Topic Ready for AI Generation',
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setIsPaused: (paused) => set({ isPaused: paused }),
  setCurrentStepIndex: (index) => set({ currentStepIndex: index }),
  setLessonTitle: (title) => set({ lessonTitle: title }),

  // Modals & UI Controls
  isGenerateModalOpen: false,
  setIsGenerateModalOpen: (open) => set({ isGenerateModalOpen: open }),
  isRecording: false,
  recordDuration: 0,
  setIsRecording: (rec) => set({ isRecording: rec, recordDuration: rec ? get().recordDuration : 0 }),
  setRecordDuration: (duration) => set({ recordDuration: duration }),

  // Theme Selector: 'vscode-light' | 'coffee' | 'vscode-dark' | 'ios-glass'
  appTheme: 'vscode-light',
  setAppTheme: (theme) => set({ appTheme: theme }),

  // Welcome / Onboarding Help Modal State
  isWelcomeModalOpen: false,
  setIsWelcomeModalOpen: (open) => set({ isWelcomeModalOpen: open }),

  // Line Highlighting & Font Size in Monaco
  editorFontSize: 16,
  setEditorFontSize: (size) => set({ editorFontSize: size }),
  highlightedLine: null,
  setHighlightedLine: (line) => set({ highlightedLine: line })
}));
