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

  // Topic Bar & Generation State
  currentTopicInput: '',
  setCurrentTopicInput: (topic) => set({ currentTopicInput: topic }),
  isGeneratingAI: false,
  setIsGeneratingAI: (generating) => set({ isGeneratingAI: generating }),
  activeLessonData: null,
  setActiveLessonData: (lesson) => set({ activeLessonData: lesson }),

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

  // Line Highlighting & Font Size in Monaco
  editorFontSize: 16,
  setEditorFontSize: (size) => set({ editorFontSize: size }),
  highlightedLine: null,
  setHighlightedLine: (line) => set({ highlightedLine: line })
}));
