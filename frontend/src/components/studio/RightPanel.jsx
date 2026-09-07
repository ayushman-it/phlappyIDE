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
    environment,
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
    const isDark = appTheme === 'vscode-dark';
    const isCoffee = appTheme === 'coffee';

    const bodyBg = isDark ? '#1e1e1e' : isCoffee ? '#fffdf9' : '#f8fafc';
    const cardBg = isDark ? '#252526' : isCoffee ? '#faf6f0' : '#ffffff';
    const borderColor = isDark ? '#3c3c3c' : isCoffee ? '#dfd4c3' : '#e2e8f0';
    const titleColor = isDark ? '#ffffff' : isCoffee ? '#4a3b32' : '#334155';
    const textColor = isDark ? '#aaaaaa' : isCoffee ? '#6f5a4c' : '#64748b';
    const iconBg = isDark ? '#332025' : isCoffee ? '#f4efe8' : '#fff1f2';

    const html = files['index.html'] || `<div style="font-family: -apple-system, sans-serif; display: flex; height: 80vh; align-items: center; justify-content: center; text-align: center; color: ${textColor}; font-size: 13px; background: ${bodyBg};">
      <div style="background: ${cardBg}; padding: 24px 32px; border-radius: 16px; border: 1px solid ${borderColor}; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        <div style="display: inline-flex; padding: 10px; border-radius: 12px; background: ${iconBg}; margin-bottom: 8px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4-4-4v8z"/><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
        </div>
        <h4 style="margin: 0 0 6px 0; color: ${titleColor}; font-size: 14px; font-weight: 700;">Sandboxed Preview Ready</h4>
        <p style="margin: 0; font-size: 12px; color: ${textColor};">Enter a topic above to generate live HTML/CSS/JS preview!</p>
      </div>
    </div>`;
    const css = files['style.css'] || '';
    const js = files['script.js'] || '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { background: ${bodyBg}; color: ${titleColor}; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
            ${css}

            /* TCM Phlappy Visual Alert / Confirm / Prompt Dialog Overlay */
            .phlappy-dialog-overlay {
              position: fixed;
              top: 0; left: 0; right: 0; bottom: 0;
              background: rgba(15, 23, 42, 0.75);
              backdrop-filter: blur(4px);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 999999;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              animation: phlappyPopIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            }
            @keyframes phlappyPopIn {
              from { opacity: 0; transform: scale(0.92); }
              to { opacity: 1; transform: scale(1); }
            }
            .phlappy-dialog-box {
              background: #ffffff;
              border: 1px solid #cbd5e1;
              border-radius: 18px;
              padding: 22px 24px;
              max-width: 360px;
              width: 90%;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
              text-align: center;
              box-sizing: border-box;
            }
            .phlappy-dialog-header {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              font-size: 14px;
              font-weight: 800;
              color: #0f172a;
              margin-bottom: 10px;
            }
            .phlappy-dialog-msg {
              font-size: 13px;
              color: #334155;
              margin-bottom: 16px;
              line-height: 1.5;
              word-break: break-word;
            }
            .phlappy-dialog-input {
              width: 100%;
              padding: 10px 14px;
              border: 1.5px solid #cbd5e1;
              border-radius: 10px;
              font-size: 13px;
              margin-bottom: 16px;
              outline: none;
              box-sizing: border-box;
              transition: all 0.15s ease;
            }
            .phlappy-dialog-input:focus {
              border-color: #e11d48;
              box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.15);
            }
            .phlappy-dialog-actions {
              display: flex;
              gap: 10px;
              justify-content: center;
            }
            .phlappy-dialog-btn {
              padding: 9px 20px;
              border-radius: 10px;
              font-size: 12px;
              font-weight: 800;
              cursor: pointer;
              border: none;
              transition: all 0.15s ease;
            }
            .phlappy-dialog-btn-primary {
              background: #e11d48;
              color: #ffffff;
              box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
            }
            .phlappy-dialog-btn-primary:hover {
              background: #be123c;
            }
            .phlappy-dialog-btn-secondary {
              background: #f1f5f9;
              color: #475569;
              border: 1px solid #cbd5e1;
            }
            .phlappy-dialog-btn-secondary:hover {
              background: #e2e8f0;
            }
          </style>
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

              function showVisualDialog(type, msg, defaultText, callback) {
                var existing = document.getElementById('phlappy-dialog-overlay');
                if (existing) existing.remove();

                var overlay = document.createElement('div');
                overlay.id = 'phlappy-dialog-overlay';
                overlay.className = 'phlappy-dialog-overlay';

                var iconSvg = type === 'alert'
                  ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
                  : type === 'confirm'
                  ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
                  : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

                var title = type === 'alert' ? 'Browser Alert Popup' : type === 'confirm' ? 'Browser Confirmation Popup' : 'Browser Input Prompt Popup';

                var inputHtml = type === 'prompt'
                  ? '<input type="text" id="phlappy-dialog-input" class="phlappy-dialog-input" value="' + (defaultText || '') + '" placeholder="Type value..." />'
                  : '';

                var buttonsHtml = type === 'alert'
                  ? '<button id="phlappy-dialog-ok" class="phlappy-dialog-btn phlappy-dialog-btn-primary">OK</button>'
                  : '<button id="phlappy-dialog-cancel" class="phlappy-dialog-btn phlappy-dialog-btn-secondary">Cancel</button><button id="phlappy-dialog-ok" class="phlappy-dialog-btn phlappy-dialog-btn-primary">OK</button>';

                overlay.innerHTML = '<div class="phlappy-dialog-box">' +
                  '<div class="phlappy-dialog-header">' + iconSvg + ' <span>' + title + '</span></div>' +
                  '<div class="phlappy-dialog-msg">' + (msg || '') + '</div>' +
                  inputHtml +
                  '<div class="phlappy-dialog-actions">' + buttonsHtml + '</div>' +
                  '</div>';

                document.body.appendChild(overlay);

                var okBtn = overlay.querySelector('#phlappy-dialog-ok');
                var cancelBtn = overlay.querySelector('#phlappy-dialog-cancel');
                var inputEl = overlay.querySelector('#phlappy-dialog-input');

                if (inputEl) {
                  setTimeout(function() { inputEl.focus(); inputEl.select(); }, 50);
                }

                if (okBtn) {
                  okBtn.onclick = function() {
                    var resValue = type === 'prompt' ? (inputEl ? inputEl.value : '') : true;
                    sendToParent(type === 'alert' ? 'warn' : 'log', ['[' + title + ' OK]:', resValue]);
                    overlay.remove();
                    if (callback) callback(resValue);
                  };
                }
                if (cancelBtn) {
                  cancelBtn.onclick = function() {
                    var resValue = type === 'prompt' ? null : false;
                    sendToParent('warn', ['[' + title + ' Cancelled]:', resValue]);
                    overlay.remove();
                    if (callback) callback(resValue);
                  };
                }
              }

              window.alert = function(msg) {
                sendToParent('warn', ['[alert()]', msg]);
                showVisualDialog('alert', String(msg));
              };

              window.confirm = function(msg) {
                sendToParent('warn', ['[confirm()]', msg]);
                showVisualDialog('confirm', String(msg));
                return true;
              };

              window.prompt = function(msg, defaultText) {
                sendToParent('warn', ['[prompt()]', msg]);
                showVisualDialog('prompt', String(msg), defaultText);
                return defaultText || 'Phlappy Student';
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
          <script>
            try {
              ${js}
            } catch (sandboxErr) {
              console.error('[Script Runtime Error]:', sandboxErr.message);
            }
          </script>
        </body>
      </html>
    `;
  };

  return (
    <aside className={`w-[420px] ${theme.sidebarBg} border-l border-slate-200/40 flex flex-col h-full select-none transition-colors`}>
      {/* IDE Compact Right Panel Tab Headers */}
      <div className={`flex border-b border-slate-200/40 ${theme.tabsBg} h-8 transition-colors`}>
        <button
          onClick={() => setActiveRightTab('preview')}
          className={`flex-1 h-full text-[11px] font-bold flex items-center justify-center space-x-1 border-b-2 transition-all cursor-pointer ${
            activeRightTab === 'preview'
              ? `${theme.tabActive}`
              : 'border-transparent opacity-70 hover:opacity-100'
          }`}
        >
          <Eye className="w-3 h-3" />
          <span>PREVIEW</span>
        </button>

        <button
          onClick={() => setActiveRightTab('console')}
          className={`flex-1 h-full text-[11px] font-bold flex items-center justify-center space-x-1 border-b-2 transition-all cursor-pointer relative ${
            activeRightTab === 'console'
              ? `${theme.tabActive}`
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
          className={`flex-1 h-full text-[11px] font-bold flex items-center justify-center space-x-1 border-b-2 transition-all cursor-pointer ${
            activeRightTab === 'terminal'
              ? `${theme.tabActive}`
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
          <div className={`h-full flex flex-col ${theme.editorBg}`}>
            <div className={`px-3 py-1.5 ${theme.topicBarBg} border-b border-slate-200/40 text-[10px] font-semibold flex items-center justify-between`}>
              <span className={theme.textMuted}>Sandboxed Preview Document</span>
              <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${theme.badgeBg}`}>
                Live Sync
              </span>
            </div>
            <div className={`flex-1 p-2 ${theme.sidebarBg}`}>
              <iframe
                id="sandbox-preview-iframe"
                title="Sandboxed Preview"
                srcDoc={generateIframeContent()}
                className={`w-full h-full ${theme.editorBg} rounded-lg border border-slate-200/40 shadow-xs`}
                sandbox="allow-scripts allow-same-origin allow-modals"
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
              <span className="text-[10px] font-bold text-slate-400">
                {environment === 'CPP_BASIC'
                  ? 'C++ Stdout Stream (G++ 13.2)'
                  : environment === 'C_BASIC'
                  ? 'C Stdout Stream (GCC 13.2)'
                  : environment === 'PYTHON_BASIC'
                  ? 'Python Stdout Stream (Python 3.11)'
                  : 'Execution Output Stream'}
              </span>
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
                  {environment === 'CPP_BASIC'
                    ? 'C++ terminal ready. Run main.cpp to observe compiler output.'
                    : environment === 'C_BASIC'
                    ? 'C terminal ready. Run main.c to observe GCC output.'
                    : environment === 'PYTHON_BASIC'
                    ? 'Python terminal ready. Run main.py to observe output.'
                    : 'Terminal ready. Run code to observe output.'}
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
