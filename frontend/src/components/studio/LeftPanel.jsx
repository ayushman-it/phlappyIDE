import React, { useState } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { getThemeClasses, THEME_OPTIONS } from '../../utils/themeStyles';
import {
  Folder,
  FolderOpen,
  FileCode2,
  FileText,
  Plus,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Terminal,
  FileJson,
  Braces,
  Palette,
  Code2,
  FileCode,
  CheckCircle2,
  Sparkles,
  Sliders,
  Settings,
  Layers,
  FileText as FileTextIcon,
  HelpCircle
} from 'lucide-react';

export const LeftPanel = () => {
  const [activeActivity, setActiveActivity] = useState('files'); // 'files' | 'syllabus' | 'script'
  const { files, activeFile, setActiveFile, addFile, environment, appTheme, setAppTheme, setIsGenerateModalOpen } = useStudioStore();
  const [newFileName, setNewFileName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isProjectFolderOpen, setIsProjectFolderOpen] = useState(true);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const theme = getThemeClasses(appTheme);

  const handleCreateFile = (e) => {
    e.preventDefault();
    if (newFileName.trim()) {
      addFile(newFileName.trim(), '');
      setNewFileName('');
      setIsAdding(false);
    }
  };

  const getProfessionalFileIcon = (fileName) => {
    if (fileName.endsWith('.html')) {
      return (
        <div className="flex items-center space-x-1">
          <FileCode2 className="w-3.5 h-3.5 text-orange-500" />
          <span className="w-5 h-4 rounded bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-[9px]">
            HTML
          </span>
        </div>
      );
    }
    if (fileName.endsWith('.css')) {
      return (
        <div className="flex items-center space-x-1">
          <Palette className="w-3.5 h-3.5 text-sky-500" />
          <span className="w-5 h-4 rounded bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold text-[9px]">
            CSS
          </span>
        </div>
      );
    }
    if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) {
      return (
        <div className="flex items-center space-x-1">
          <Braces className="w-3.5 h-3.5 text-amber-500" />
          <span className="w-5 h-4 rounded bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-[9px]">
            JS
          </span>
        </div>
      );
    }
    if (fileName.endsWith('.py')) {
      return (
        <div className="flex items-center space-x-1">
          <Terminal className="w-3.5 h-3.5 text-emerald-500" />
          <span className="w-5 h-4 rounded bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-[9px]">
            PY
          </span>
        </div>
      );
    }
    if (fileName.endsWith('.c')) {
      return (
        <div className="flex items-center space-x-1">
          <Code2 className="w-3.5 h-3.5 text-blue-500" />
          <span className="w-5 h-4 rounded bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-[9px]">
            C
          </span>
        </div>
      );
    }
    if (fileName.endsWith('.cpp') || fileName.endsWith('.cc') || fileName.endsWith('.h')) {
      return (
        <div className="flex items-center space-x-1">
          <Code2 className="w-3.5 h-3.5 text-indigo-500" />
          <span className="w-5 h-4 rounded bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-[9px]">
            C++
          </span>
        </div>
      );
    }
    return <FileText className="w-3.5 h-3.5 text-slate-400" />;
  };

  const fileKeys = Object.keys(files).filter((file) => {
    if (environment === 'PYTHON_BASIC' && !file.endsWith('.py')) return false;
    if (environment === 'C_BASIC' && !file.endsWith('.c')) return false;
    if (environment === 'CPP_BASIC' && (!file.endsWith('.cpp') && !file.endsWith('.h'))) return false;
    if (environment === 'HTML_CSS_JS' && (file.endsWith('.py') || file.endsWith('.c') || file.endsWith('.cpp'))) return false;
    return true;
  });

  return (
    <aside className={`flex h-full select-none ${theme.sidebarBg} border-r`}>
      {/* VS Code Left Activity Bar (Narrow 48px Bar) */}
      <div className={`w-12 h-full flex flex-col justify-between items-center py-3 border-r ${theme.activityBg}`}>
        {/* Top Activity Icons */}
        <div className="flex flex-col space-y-3 items-center">
          <button
            onClick={() => setActiveActivity('files')}
            className={`p-2 rounded-xl transition-all cursor-pointer relative ${
              activeActivity === 'files'
                ? 'bg-rose-600 text-white shadow-md'
                : 'hover:bg-slate-200/50 text-slate-500'
            }`}
            title="File Explorer (Ctrl+Shift+E)"
          >
            <Folder className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveActivity('syllabus')}
            className={`p-2 rounded-xl transition-all cursor-pointer relative ${
              activeActivity === 'syllabus'
                ? 'bg-rose-600 text-white shadow-md'
                : 'hover:bg-slate-200/50 text-slate-500'
            }`}
            title="Phlappy AI Syllabus & Roadmap"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="p-2 rounded-xl transition-all cursor-pointer hover:bg-slate-200/50 text-slate-500"
            title="Custom 3-Min Script Importer"
          >
            <FileCode className="w-4 h-4 text-rose-600" />
          </button>

          <button
            onClick={() => useStudioStore.getState().setIsWelcomeModalOpen(true)}
            className="p-2 rounded-xl transition-all cursor-pointer hover:bg-slate-200/50 text-slate-500"
            title="Phlappy AI Studio Welcome Guide (?)"
          >
            <HelpCircle className="w-4 h-4 text-rose-600" />
          </button>
        </div>

        {/* Bottom Settings & Theme Switcher Icon */}
        <div className="relative flex flex-col items-center">
          {/* Theme Selector Popup Menu */}
          {isThemeMenuOpen && (
            <div className={`absolute bottom-10 left-12 z-50 w-56 rounded-2xl border shadow-2xl p-2 animate-in fade-in slide-in-from-bottom-2 duration-150 ${theme.dropdownBg}`}>
              <div className={`px-2 py-1 border-b mb-1 text-[11px] font-extrabold uppercase tracking-wider ${theme.textMuted}`}>
                Select IDE Theme
              </div>
              {THEME_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setAppTheme(t.id);
                    setIsThemeMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    appTheme === t.id
                      ? `${theme.badgeBg} font-extrabold`
                      : `hover:opacity-100 ${theme.textMuted}`
                  }`}
                >
                  <Palette className="w-3.5 h-3.5 text-rose-600" />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-500 transition-all cursor-pointer"
            title="Change Theme (VS Code Light, Coffee, VS Code Dark, iOS Glass)"
          >
            <Palette className="w-4 h-4 text-rose-600" />
          </button>
        </div>
      </div>

      {/* VS Code Main Left Panel Content Area */}
      <div className="w-56 flex flex-col h-full">
        {activeActivity === 'files' ? (
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            <div className="flex items-center justify-between px-2 mb-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                EXPLORER
              </span>
              <button
                onClick={() => setIsAdding(!isAdding)}
                className="p-1 hover:bg-slate-200/60 rounded text-slate-600 transition-colors cursor-pointer"
                title="New File"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {isAdding && (
              <form onSubmit={handleCreateFile} className="mb-2 px-2">
                <input
                  type="text"
                  placeholder="e.g. app.js"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  autoFocus
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                />
              </form>
            )}

            {/* Folder & Nested Tree Structure */}
            <div className="space-y-1">
              <div
                onClick={() => setIsProjectFolderOpen(!isProjectFolderOpen)}
                className="flex items-center space-x-1.5 text-xs font-bold px-2 py-1 hover:bg-slate-200/50 rounded cursor-pointer select-none"
              >
                {isProjectFolderOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
                {isProjectFolderOpen ? (
                  <FolderOpen className="w-4 h-4 text-amber-500" />
                ) : (
                  <Folder className="w-4 h-4 text-amber-500" />
                )}
                <span>src/workspace</span>
              </div>

              {isProjectFolderOpen && (
                <div className="relative pl-6 space-y-1 mt-1">
                  {fileKeys.length === 0 ? (
                    <div className="py-3 pr-2 text-[11px] text-slate-400 italic">
                      No files created yet. Type a topic above!
                    </div>
                  ) : (
                    <>
                      <div className="absolute left-[17px] top-0 bottom-3 w-px bg-slate-300/60" />

                      {fileKeys.map((file) => {
                        const isActive = activeFile === file;
                        return (
                          <div key={file} className="relative flex items-center">
                            <div className="absolute -left-[7px] top-1/2 -translate-y-1/2 w-2.5 h-px bg-slate-300/60" />
                            <button
                              onClick={() => setActiveFile(file)}
                              className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-white text-rose-600 shadow-2xs font-extrabold border border-slate-200'
                                  : 'hover:bg-slate-200/50 font-medium'
                              }`}
                            >
                              {getProfessionalFileIcon(file)}
                              <span className="truncate">{file}</span>
                            </button>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            <div className="px-2 mb-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                AI Syllabus & Roadmap
              </span>
            </div>
            <div className={`p-3 rounded-xl border ${theme.cardBg} text-xs space-y-2`}>
              <div className="font-bold flex items-center gap-1.5 text-rose-600">
                <BookOpen className="w-4 h-4" />
                <span>Phlappy Interactive Syllabus</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Topic bar me koi bhi topic enter kijiye aur Phlappy live lesson code aur line-by-line explanation se sikhayega!
              </p>
            </div>
          </div>
        )}

        {/* Footer Brand Info */}
        <div className={`p-2.5 border-t text-[11px] flex items-center justify-between ${theme.sidebarBg}`}>
          <div className="flex items-center space-x-1.5">
            <Code2 className="w-3.5 h-3.5 text-rose-600" />
            <span className="font-extrabold tracking-tight text-[11px]">
              TCM<span className="text-rose-600">One</span>
            </span>
          </div>
          <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 text-[10px]">
            Phlappy AI
          </span>
        </div>
      </div>
    </aside>
  );
};
