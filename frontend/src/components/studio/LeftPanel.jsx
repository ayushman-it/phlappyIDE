import React, { useState, useEffect } from 'react';
import { useStudioStore } from '../../store/studioStore';
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
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const LeftPanel = () => {
  const [activeTab, setActiveTab] = useState('files');
  const { files, activeFile, setActiveFile, addFile, environment } = useStudioStore();
  const [newFileName, setNewFileName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isProjectFolderOpen, setIsProjectFolderOpen] = useState(true);

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
          <span className="w-5 h-4 rounded bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-[9px] tracking-tighter">
            HTML
          </span>
        </div>
      );
    }
    if (fileName.endsWith('.css')) {
      return (
        <div className="flex items-center space-x-1">
          <Palette className="w-3.5 h-3.5 text-sky-500" />
          <span className="w-5 h-4 rounded bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold text-[9px] tracking-tighter">
            CSS
          </span>
        </div>
      );
    }
    if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) {
      return (
        <div className="flex items-center space-x-1">
          <Braces className="w-3.5 h-3.5 text-amber-500" />
          <span className="w-5 h-4 rounded bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-[9px] tracking-tighter">
            JS
          </span>
        </div>
      );
    }
    if (fileName.endsWith('.py')) {
      return (
        <div className="flex items-center space-x-1">
          <Terminal className="w-3.5 h-3.5 text-emerald-500" />
          <span className="w-5 h-4 rounded bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-[9px] tracking-tighter">
            PY
          </span>
        </div>
      );
    }
    if (fileName.endsWith('.c')) {
      return (
        <div className="flex items-center space-x-1">
          <Code2 className="w-3.5 h-3.5 text-blue-500" />
          <span className="w-5 h-4 rounded bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-[9px] tracking-tighter">
            C
          </span>
        </div>
      );
    }
    if (fileName.endsWith('.cpp') || fileName.endsWith('.cc') || fileName.endsWith('.h')) {
      return (
        <div className="flex items-center space-x-1">
          <Code2 className="w-3.5 h-3.5 text-indigo-500" />
          <span className="w-5 h-4 rounded bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-[9px] tracking-tighter">
            C++
          </span>
        </div>
      );
    }
    if (fileName.endsWith('.json')) {
      return (
        <div className="flex items-center space-x-1">
          <FileJson className="w-3.5 h-3.5 text-purple-500" />
          <span className="w-5 h-4 rounded bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-[9px] tracking-tighter">
            JSON
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
    <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-full select-none">
      {/* Sidebar Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white h-8">
        <button
          onClick={() => setActiveTab('files')}
          className={`flex-1 h-full text-[11px] font-bold flex items-center justify-center space-x-1 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'files'
              ? 'border-rose-600 text-rose-600 bg-slate-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Folder className="w-3 h-3" />
          <span>PROJECT FILES</span>
        </button>
        <button
          onClick={() => setActiveTab('lessons')}
          className={`flex-1 h-full text-[11px] font-bold flex items-center justify-center space-x-1 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'lessons'
              ? 'border-rose-600 text-rose-600 bg-slate-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-3 h-3" />
          <span>AI SYLLABUS</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {activeTab === 'files' ? (
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                File Explorer
              </span>
              <button
                onClick={() => setIsAdding(!isAdding)}
                className="p-1 hover:bg-slate-200 rounded-md text-slate-600 transition-colors cursor-pointer"
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

            {/* Folder & Nested Tree Structure with Lines */}
            <div className="space-y-1">
              <div
                onClick={() => setIsProjectFolderOpen(!isProjectFolderOpen)}
                className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 px-2 py-1 hover:bg-slate-200/60 rounded-md cursor-pointer select-none"
              >
                {isProjectFolderOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
                {isProjectFolderOpen ? (
                  <FolderOpen className="w-4 h-4 text-amber-500 fill-amber-400/20" />
                ) : (
                  <Folder className="w-4 h-4 text-amber-500" />
                )}
                <span>src/workspace</span>
              </div>

              {/* Nested Tree Guide Line & Files */}
              {isProjectFolderOpen && (
                <div className="relative pl-6 space-y-1 mt-1">
                  {fileKeys.length === 0 ? (
                    <div className="py-3 pr-2 text-[11px] text-slate-400 italic">
                      No files created yet. Type a topic above to generate code!
                    </div>
                  ) : (
                    <>
                      {/* Vertical Tree Stem Guide Line */}
                      <div className="absolute left-[17px] top-0 bottom-3 w-px bg-slate-300" />

                      {fileKeys.map((file, idx) => {
                        const isActive = activeFile === file;
                        return (
                          <div key={file} className="relative flex items-center">
                            {/* Horizontal Tree Branch Connector Line */}
                            <div className="absolute -left-[7px] top-1/2 -translate-y-1/2 w-2.5 h-px bg-slate-300" />

                            <button
                              onClick={() => setActiveFile(file)}
                              className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-white text-rose-600 shadow-xs border border-slate-200/90 font-extrabold'
                                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 font-semibold'
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
          <div>
            <div className="px-2 mb-2">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Topic Syllabus & Plan
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs text-xs space-y-2">
              <div className="font-bold text-slate-800 flex items-center gap-1.5 text-rose-600">
                <BookOpen className="w-4 h-4" />
                <span>Phlappy AI Interactive Syllabus</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Enter any topic in the top bar (e.g. <span className="font-semibold text-slate-700">HTML Setup</span>, <span className="font-semibold text-slate-700">React useState</span>, <span className="font-semibold text-slate-700">Python Loops</span>, <span className="font-semibold text-slate-700">C Pointers</span>) and Phlappy AI will teach code, explanation, and practical output live from scratch!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 bg-white border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between font-mono">
        <div className="flex items-center space-x-1.5 font-sans">
          <Code2 className="w-3.5 h-3.5 text-rose-600" />
          <span className="font-extrabold text-slate-800 tracking-tight text-[11px]">
            TCM<span className="text-rose-600">One</span> <span className="text-slate-500 font-medium">Code Studio</span>
          </span>
        </div>
        <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 text-[10px]">
          Phlappy AI
        </span>
      </div>
    </aside>
  );
};
