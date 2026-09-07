import React, { useEffect, useRef } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { getThemeClasses } from '../../utils/themeStyles';
import { Play, Terminal, Eye, Trash2 } from 'lucide-react';

export const RightPanel = () => {
  const {
    activeRightTab,
    setActiveRightTab,
    files,
    consoleLogs,
    addConsoleLog,
    clearConsoleLogs,
    terminalLogs,
    clearTerminalLogs,
    appTheme
  } = useStudioStore();

  const theme = getThemeClasses(appTheme);

  const consoleEndRef = useRef(null);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (activeRightTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs, activeRightTab]);

  useEffect(() => {
    if (activeRightTab === 'console') {
      consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs, activeRightTab]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.source === 'FLAPPY_SANDBOX') {
        const { type, logType, message } = event.data;
        if (type === 'CONSOLE_LOG') {
          addConsoleLog(logType || 'log', message);
        } else if (type === 'SANDBOX_ALERT') {
          addConsoleLog('warn', `[Browser Alert]: ${message}`);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [addConsoleLog]);

  const generateIframeContent = () => {
    const html = files['index.html'] || `<div style="font-family: -apple-system, sans-serif; display: flex; height: 80vh; align-items: center; justify-content: center; text-align: center; color: #94a3b8; font-size: 13px;">
      <div style="background: white; padding: 24px 32px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
        <div style="font-size: 28px; margin-bottom: 8px;">🚀</div>
        <h4 style="margin: 0 0 6px 0; color: #334155; font-size: 14px; font-weight: 700;">Sandboxed Preview Ready</h4>
        <p style="margin: 0; font-size: 12px; color: #64748b;">Enter a topic above to generate live HTML/CSS/JS preview!</p>
      </div>
    </div>`;
    const css = files['style.css'] || '';
    const js = files['script.js'] || '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>${css}</style>
          <script>
            (function() {
              function sendToParent(logType, args) {
                const message = Array.from(args).map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                ).join(' ');
                window.parent.postMessage({
                  source: 'FLAPPY_SANDBOX',
                  type: 'CONSOLE_LOG',
                  logType: logType,
                  message: message
                }, '*');
              }

              var origLog = console.log;
              var origWarn = console.warn;
              var origError = console.error;

              console.log = function() { sendToParent('log', arguments); origLog.apply(console, arguments); };
              console.warn = function() { sendToParent('warn', arguments); origWarn.apply(console, arguments); };
              console.error = function() { sendToParent('error', arguments); origError.apply(console, arguments); };

              window.alert = function(msg) {
                window.parent.postMessage({
                  source: 'FLAPPY_SANDBOX',
                  type: 'SANDBOX_ALERT',
                  message: msg
                }, '*');
              };

              window.addEventListener('message', function(event) {
                if (event.data && event.data.type === 'TRIGGER_CLICK') {
                  const el = document.querySelector(event.data.selector);
                  if (el) {
                    el.click();
                  }
                }
              });
            })();
          </script>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
  };

  return (
    <aside className={`w-[420px] ${theme.sidebarBg} border-l border-slate-200/60 flex flex-col h-full select-none transition-colors`}>
      {/* IDE Compact Right Panel Tab Headers */}
      <div className={`flex border-b border-slate-200/60 ${theme.tabsBg} h-8 transition-colors`}>
        <button
          onClick={() => setActiveRightTab('preview')}
          className={`flex-1 h-full text-[11px] font-bold flex items-center justify-center space-x-1 border-b-2 transition-colors cursor-pointer ${
            activeRightTab === 'preview'
              ? 'border-rose-600 text-rose-600 bg-white/40 font-extrabold'
              : 'border-transparent opacity-70 hover:opacity-100'
          }`}
        >
          <Eye className="w-3 h-3" />
          <span>PREVIEW</span>
        </button>

        <button
          onClick={() => setActiveRightTab('console')}
          className={`flex-1 h-full text-[11px] font-bold flex items-center justify-center space-x-1 border-b-2 transition-colors cursor-pointer relative ${
            activeRightTab === 'console'
              ? 'border-rose-600 text-rose-600 bg-white/40 font-extrabold'
              : 'border-transparent opacity-70 hover:opacity-100'
          }`}
        >
          <Terminal className="w-3 h-3" />
          <span>CONSOLE</span>
          {consoleLogs.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 absolute top-2 right-3" />
          )}
        </button>

        <button
          onClick={() => setActiveRightTab('terminal')}
          className={`flex-1 h-full text-[11px] font-bold flex items-center justify-center space-x-1 border-b-2 transition-colors cursor-pointer ${
            activeRightTab === 'terminal'
              ? 'border-rose-600 text-rose-600 bg-white/40 font-extrabold'
              : 'border-transparent opacity-70 hover:opacity-100'
          }`}
        >
          <Play className="w-3 h-3" />
          <span>TERMINAL</span>
        </button>
      </div>

      {/* Tab Content Areas */}
      <div className="flex-1 overflow-hidden relative">
        {/* PREVIEW TAB */}
        {activeRightTab === 'preview' && (
          <div className="h-full flex flex-col bg-white">
            <div className="px-3 py-1.5 bg-slate-100/60 border-b border-slate-200 text-[10px] font-semibold text-slate-500 flex items-center justify-between">
              <span>Sandboxed Preview Document</span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[9px]">
                Live Sync
              </span>
            </div>
            <div className="flex-1 p-2 bg-slate-200/50">
              <iframe
                id="sandbox-preview-iframe"
                title="Sandboxed Preview"
                srcDoc={generateIframeContent()}
                className="w-full h-full bg-white rounded-lg border border-slate-300 shadow-xs"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        )}

        {/* CONSOLE TAB */}
        {activeRightTab === 'console' && (
          <div className="h-full flex flex-col bg-slate-900 text-slate-100 font-mono text-xs">
            <div className="px-3 py-1.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">Captured Output Stream</span>
              <button
                onClick={clearConsoleLogs}
                className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Clear Console"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {consoleLogs.length === 0 ? (
                <div className="text-slate-500 italic text-center py-8 text-[11px]">
                  Console stream empty. Trigger actions to observe output.
                </div>
              ) : (
                consoleLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-start space-x-2 py-1 px-2 rounded border text-[11px] ${
                      log.type === 'error'
                        ? 'bg-red-950/40 border-red-800/50 text-red-300'
                        : log.type === 'warn'
                        ? 'bg-amber-950/40 border-amber-800/50 text-amber-300'
                        : 'bg-slate-800/40 border-slate-800 text-emerald-400'
                    }`}
                  >
                    <span className="text-slate-500 text-[10px] select-none">{log.timestamp}</span>
                    <span className="flex-1 font-semibold">{log.message}</span>
                  </div>
                ))
              )}
              <div ref={consoleEndRef} />
            </div>
          </div>
        )}

        {/* TERMINAL TAB */}
        {activeRightTab === 'terminal' && (
          <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-mono text-xs">
            <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">Python Stdout Stream (Pyodide)</span>
              <button
                onClick={clearTerminalLogs}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Clear Terminal"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1 text-[11px]">
              {terminalLogs.length === 0 ? (
                <div className="text-slate-600 italic">
                  Python terminal ready. Run Python scripts to observe Pyodide output.
                </div>
              ) : (
                terminalLogs.map((line, idx) => (
                  <div key={idx} className="text-slate-300">
                    {line}
                  </div>
                ))
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
