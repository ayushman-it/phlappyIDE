import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useStudioStore } from '../../store/studioStore';
import { getThemeClasses } from '../../utils/themeStyles';
import { FileCode, Sparkles, ZoomIn, ZoomOut, Terminal, CheckCircle2 } from 'lucide-react';

export const CenterPanel = () => {
  const {
    files,
    activeFile,
    setActiveFile,
    updateFileContent,
    environment,
    isPlaying,
    editorFontSize,
    setEditorFontSize,
    appTheme
  } = useStudioStore();
  const editorRef = useRef(null);

  const theme = getThemeClasses(appTheme);

  const getLanguage = (fileName) => {
    if (!fileName) return 'plaintext';
    if (fileName.endsWith('.html')) return 'html';
    if (fileName.endsWith('.css')) return 'css';
    if (fileName.endsWith('.js')) return 'javascript';
    if (fileName.endsWith('.py')) return 'python';
    if (fileName.endsWith('.c')) return 'c';
    if (fileName.endsWith('.cpp') || fileName.endsWith('.cc') || fileName.endsWith('.h')) return 'cpp';
    return 'plaintext';
  };

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  // Auto-scroll Monaco Editor to active typing line whenever file content changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.getModel()) {
      const lineCount = editorRef.current.getModel().getLineCount();
      if (lineCount > 10) {
        editorRef.current.revealLine(lineCount);
      }
    }
  }, [files, activeFile]);

  const handleEditorChange = (value) => {
    if (value !== undefined) {
      updateFileContent(activeFile, value);
      if (editorRef.current && editorRef.current.getModel()) {
        const lineCount = editorRef.current.getModel().getLineCount();
        editorRef.current.revealLine(lineCount);
      }
    }
  };

  const currentLineCount = (activeFile && files[activeFile]) ? files[activeFile].split('\n').length : 1;

  return (
    <main className={`flex-1 flex flex-col h-full ${theme.editorBg} border-r border-slate-200/50 overflow-hidden select-none transition-colors`}>
      {/* Light Clean IDE Monaco File Tabs Header */}
      <div className={`flex items-center justify-between ${theme.tabsBg} border-b border-slate-200/60 px-2 h-9 flex-shrink-0 transition-colors`}>
        <div className="flex space-x-1 overflow-x-auto h-full items-end flex-1 max-w-xl">
          {Object.keys(files).map((file) => {
            if (environment === 'PYTHON_BASIC' && !file.endsWith('.py')) return null;
            if (environment === 'C_BASIC' && !file.endsWith('.c')) return null;
            if (environment === 'CPP_BASIC' && (!file.endsWith('.cpp') && !file.endsWith('.h'))) return null;
            if (environment === 'HTML_CSS_JS' && (file.endsWith('.py') || file.endsWith('.c') || file.endsWith('.cpp'))) return null;

            const isActive = activeFile === file;
            return (
              <button
                key={file}
                onClick={() => setActiveFile(file)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-t-lg text-xs transition-all cursor-pointer h-8 border-t border-x ${
                  isActive
                    ? `${theme.tabActive} shadow-2xs`
                    : 'opacity-75 hover:opacity-100 hover:bg-black/5 border-transparent'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-rose-600' : 'opacity-60'}`} />
                <span className="truncate max-w-[130px] font-mono tracking-tight">{file}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />}
              </button>
            );
          })}
        </div>

        {/* Font Size & Writing Controls */}
        <div className="flex items-center space-x-2">
          {/* Font Size Controls */}
          <div className="flex items-center bg-white/80 border border-slate-200/80 rounded-lg p-0.5 shadow-2xs text-slate-700">
            <button
              onClick={() => setEditorFontSize(Math.max(12, editorFontSize - 1))}
              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="Decrease Code Font Size"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <span className="px-2 font-mono text-[11px] font-extrabold text-rose-600">
              {editorFontSize}px
            </span>

            <button
              onClick={() => setEditorFontSize(Math.min(24, editorFontSize + 1))}
              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="Increase Code Font Size"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Writing Indicator */}
          <div className="px-2 text-[11px] font-bold flex items-center">
            {isPlaying ? (
              <span className="flex items-center text-rose-600 animate-pulse font-extrabold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                <Sparkles className="w-3 h-3 mr-1 text-amber-500 fill-amber-400" /> Phlappy Writing...
              </span>
            ) : (
              <span className="opacity-50 font-mono text-[10px]">TCM Studio IDE</span>
            )}
          </div>
        </div>
      </div>

      {/* Monaco Code Editor Container */}
      {!activeFile || Object.keys(files).length === 0 ? (
        <div className={`flex-1 flex flex-col items-center justify-center p-8 ${theme.editorBg} text-center select-none`}>
          <div className={`w-14 h-14 rounded-2xl ${theme.badgeBg} shadow-xs flex items-center justify-center mb-4 border`}>
            <Sparkles className="w-7 h-7 text-rose-600 animate-pulse" />
          </div>
          <h3 className={`text-base font-black mb-1.5 tracking-tight ${appTheme === 'vscode-dark' ? 'text-white' : ''}`}>
            Welcome to TCM<span className="text-rose-600">One</span> Phlappy AI Code Studio
          </h3>
          <p className={`text-xs ${theme.textMuted} max-w-sm mb-4 leading-relaxed font-medium`}>
            Topic bar me koi bhi topic type kijiye aur Phlappy HD clean code aur definition comments ke saath sikhayega!
          </p>
        </div>
      ) : (
        <div className="flex-1 relative">
          <Editor
            height="100%"
            language={getLanguage(activeFile)}
            value={files[activeFile] || ''}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
            theme={theme.editorMonacoTheme}
            options={{
              fontSize: editorFontSize,
              lineHeight: Math.round(editorFontSize * 1.6),
              fontFamily: '"Fira Code", "JetBrains Mono", "Cascadia Code", Menlo, Monaco, monospace',
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbers: 'on',
              roundedSelection: true,
              padding: { top: 12, bottom: 12 },
              readOnly: false,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              renderLineHighlight: 'all',
              smoothScrolling: true
            }}
          />
        </div>
      )}
    </main>
  );
};
