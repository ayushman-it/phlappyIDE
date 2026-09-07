import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useStudioStore } from '../../store/studioStore';
import { FileCode, Sparkles } from 'lucide-react';

export const CenterPanel = () => {
  const { files, activeFile, setActiveFile, updateFileContent, environment, isPlaying } = useStudioStore();
  const editorRef = useRef(null);

  const getLanguage = (fileName) => {
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
      if (lineCount > 15) {
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

  return (
    <main className="flex-1 flex flex-col h-full bg-white border-r border-slate-200 overflow-hidden">
      {/* IDE Compact Monaco File Tabs Header */}
      <div className="flex items-center justify-between bg-slate-100/80 border-b border-slate-200 px-1 pt-1 h-8">
        <div className="flex space-x-1 overflow-x-auto h-full items-end flex-1 max-w-md">
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
                className={`flex-1 min-w-[100px] max-w-[140px] flex items-center justify-center space-x-1.5 px-3 py-1 rounded-t text-[11px] font-medium border-t border-x transition-colors cursor-pointer h-7 ${
                  isActive
                    ? 'bg-white border-slate-200/90 text-rose-600 font-bold shadow-2xs'
                    : 'bg-slate-100/50 border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <FileCode className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{file}</span>
              </button>
            );
          })}
        </div>

        {/* Mode Indicator */}
        <div className="px-2 text-[10px] font-bold text-slate-500 flex items-center space-x-1">
          {isPlaying ? (
            <span className="flex items-center text-rose-600 animate-pulse font-extrabold">
              <Sparkles className="w-2.5 h-2.5 mr-1" /> Phlappy Writing...
            </span>
          ) : (
            <span className="text-slate-400 font-mono">Developer Mode</span>
          )}
        </div>
      </div>

      {/* Monaco Code Editor or Empty Studio Welcome Screen */}
      {!activeFile || Object.keys(files).length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50 text-center select-none">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 shadow-xs flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6 text-rose-600 animate-pulse" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-800 mb-1 tracking-tight">
            Welcome to TCM<span className="text-rose-600">One</span> Phlappy AI Studio
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed font-medium">
            Topic bar me koi bhi topic type kijiye (jaise <span className="font-bold text-slate-700">HTML Introduction</span>, <span className="font-bold text-slate-700">CSS Flexbox</span>, <span className="font-bold text-slate-700">Python Loops</span>) aur Phlappy scratch se naye files aur code create karke sikhayega!
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
            theme="vs-light"
            options={{
              fontSize: 13,
              fontFamily: '"SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", monospace',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbers: 'on',
              roundedSelection: true,
              padding: { top: 8 },
              readOnly: false
            }}
          />
        </div>
      )}
    </main>
  );
};
