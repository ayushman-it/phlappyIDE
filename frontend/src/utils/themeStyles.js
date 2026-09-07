// Phlappy AI IDE Theme Palettes & VS Code Styling Definitions

export const THEME_OPTIONS = [
  { id: 'vscode-light', name: '☀️ VS Code Light (Default)', icon: '☀️' },
  { id: 'coffee', name: '☕ Warm Coffee Theme', icon: '☕' },
  { id: 'vscode-dark', name: '🌙 VS Code Dark+', icon: '🌙' },
  { id: 'ios-glass', name: '🍏 iOS macOS Glass', icon: '🍏' }
];

export const getThemeClasses = (appTheme) => {
  switch (appTheme) {
    case 'coffee':
      return {
        headerBg: 'bg-[#f4efe8] border-[#dfd4c3] text-[#4a3b32]',
        topicBarBg: 'bg-[#faf6f0] border-[#dfd4c3] text-[#4a3b32]',
        activityBg: 'bg-[#e8decb] border-[#d8c8b2] text-[#5c4a3e]',
        sidebarBg: 'bg-[#faf6f0] border-[#dfd4c3] text-[#3d3027]',
        editorBg: 'bg-[#fffdf9]',
        editorMonacoTheme: 'vs-light',
        tabsBg: 'bg-[#e8decb] text-[#5c4a3e]',
        tabActive: 'bg-[#fffdf9] text-[#8b5a2b] font-extrabold border-[#8b5a2b]',
        statusBarBg: 'bg-[#8b5a2b] text-white',
        cardBg: 'bg-[#fffdf9] border-[#dfd4c3]',
        buttonPrimary: 'bg-[#8b5a2b] hover:bg-[#6f4520] text-white',
        textAccent: 'text-[#8b5a2b]',
        pillBg: 'bg-[#e8decb] text-[#5c4a3e] border-[#d8c8b2]'
      };

    case 'vscode-dark':
      return {
        headerBg: 'bg-[#1e1e1e] border-[#2d2d2d] text-[#cccccc]',
        topicBarBg: 'bg-[#252526] border-[#2d2d2d] text-[#cccccc]',
        activityBg: 'bg-[#333333] border-[#252526] text-[#858585]',
        sidebarBg: 'bg-[#252526] border-[#1e1e1e] text-[#cccccc]',
        editorBg: 'bg-[#1e1e1e]',
        editorMonacoTheme: 'vs-dark',
        tabsBg: 'bg-[#2d2d2d] text-[#969696]',
        tabActive: 'bg-[#1e1e1e] text-white font-extrabold border-rose-500',
        statusBarBg: 'bg-[#007acc] text-white',
        cardBg: 'bg-[#2d2d2d] border-[#3c3c3c]',
        buttonPrimary: 'bg-rose-600 hover:bg-rose-700 text-white',
        textAccent: 'text-rose-400',
        pillBg: 'bg-[#333333] text-[#cccccc] border-[#3c3c3c]'
      };

    case 'ios-glass':
      return {
        headerBg: 'bg-white/90 backdrop-blur-md border-slate-200 text-slate-800 shadow-sm',
        topicBarBg: 'bg-white/80 backdrop-blur-md border-slate-200 text-slate-800',
        activityBg: 'bg-slate-100/80 backdrop-blur-md border-slate-200 text-slate-600',
        sidebarBg: 'bg-white/95 backdrop-blur-sm border-slate-200 text-slate-800',
        editorBg: 'bg-white',
        editorMonacoTheme: 'vs-light',
        tabsBg: 'bg-slate-100/80 text-slate-600',
        tabActive: 'bg-rose-600 text-white font-extrabold rounded-lg shadow-sm',
        statusBarBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
        cardBg: 'bg-white border-slate-200 shadow-sm',
        buttonPrimary: 'bg-rose-600 hover:bg-rose-700 text-white',
        textAccent: 'text-rose-600',
        pillBg: 'bg-slate-100 text-slate-700 border-slate-200'
      };

    case 'vscode-light':
    default:
      return {
        headerBg: 'bg-white border-slate-200/90 text-slate-800',
        topicBarBg: 'bg-white border-slate-200 text-slate-800',
        activityBg: 'bg-slate-100 border-slate-200 text-slate-600',
        sidebarBg: 'bg-slate-50 border-slate-200 text-slate-800',
        editorBg: 'bg-white',
        editorMonacoTheme: 'vs-light',
        tabsBg: 'bg-slate-100/90 text-slate-600',
        tabActive: 'bg-white text-rose-600 font-extrabold border-rose-600',
        statusBarBg: 'bg-blue-600 text-white',
        cardBg: 'bg-white border-slate-200',
        buttonPrimary: 'bg-rose-600 hover:bg-rose-700 text-white',
        textAccent: 'text-rose-600',
        pillBg: 'bg-slate-100 text-slate-700 border-slate-200'
      };
  }
};
