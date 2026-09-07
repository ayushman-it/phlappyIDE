// Phlappy AI IDE Theme Palettes & VS Code Styling Definitions

export const THEME_OPTIONS = [
  { id: 'vscode-light', name: 'VS Code Light (Default)', iconName: 'Sun' },
  { id: 'coffee', name: 'Warm Coffee Theme', iconName: 'Coffee' },
  { id: 'vscode-dark', name: 'VS Code Dark+', iconName: 'Moon' },
  { id: 'ios-glass', name: 'iOS macOS Glass', iconName: 'Sparkles' }
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
        textMuted: 'text-[#8c7463]',
        pillBg: 'bg-[#e8decb] text-[#5c4a3e] border-[#d8c8b2] hover:bg-[#dfd4c3]',
        inputBg: 'bg-[#fffdf9] border-[#dfd4c3] text-[#4a3b32] placeholder-[#a69282] focus:border-[#8b5a2b]',
        chipBg: 'bg-[#e8decb] hover:bg-[#dfd4c3] text-[#4a3b32] border-[#d8c8b2]',
        badgeBg: 'bg-[#e8decb] text-[#8b5a2b] border-[#d8c8b2]',
        dropdownBg: 'bg-[#fffdf9] border-[#dfd4c3] text-[#4a3b32] hover:bg-[#e8decb]'
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
        textMuted: 'text-[#858585]',
        pillBg: 'bg-[#333333] text-[#cccccc] border-[#3c3c3c] hover:bg-[#3d3d3d]',
        inputBg: 'bg-[#1e1e1e] border-[#3c3c3c] text-[#cccccc] placeholder-[#666666] focus:border-rose-500',
        chipBg: 'bg-[#333333] hover:bg-[#3d3d3d] text-[#cccccc] border-[#3c3c3c]',
        badgeBg: 'bg-[#333333] text-rose-400 border-[#3c3c3c]',
        dropdownBg: 'bg-[#252526] border-[#3c3c3c] text-[#cccccc] hover:bg-[#333333]'
      };

    case 'ios-glass':
      return {
        headerBg: 'bg-white/90 backdrop-blur-md border-slate-200/90 text-slate-800 shadow-xs',
        topicBarBg: 'bg-white/80 backdrop-blur-md border-slate-200/90 text-slate-800',
        activityBg: 'bg-slate-100/80 backdrop-blur-md border-slate-200/90 text-slate-600',
        sidebarBg: 'bg-white/95 backdrop-blur-sm border-slate-200/90 text-slate-800',
        editorBg: 'bg-white',
        editorMonacoTheme: 'vs-light',
        tabsBg: 'bg-slate-100/80 text-slate-600',
        tabActive: 'bg-rose-600 text-white font-extrabold rounded-lg shadow-xs',
        statusBarBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
        cardBg: 'bg-white/90 border-slate-200 shadow-xs',
        buttonPrimary: 'bg-rose-600 hover:bg-rose-700 text-white',
        textAccent: 'text-rose-600',
        textMuted: 'text-slate-500',
        pillBg: 'bg-slate-100/90 text-slate-700 border-slate-200 hover:bg-slate-200/90',
        inputBg: 'bg-white/90 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-rose-500',
        chipBg: 'bg-slate-100/90 hover:bg-slate-200/90 text-slate-700 border-slate-200',
        badgeBg: 'bg-rose-50 text-rose-600 border-rose-200',
        dropdownBg: 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-800 hover:bg-slate-100'
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
        textMuted: 'text-slate-500',
        pillBg: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
        inputBg: 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:bg-white',
        chipBg: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200',
        badgeBg: 'bg-rose-50 text-rose-600 border-rose-200',
        dropdownBg: 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
      };
  }
};
