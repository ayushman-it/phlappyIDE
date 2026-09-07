import React, { useState } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { getThemeClasses } from '../../utils/themeStyles';
import { Key, Sparkles, Check, AlertCircle, RefreshCw, X, ShieldCheck } from 'lucide-react';

export const ElevenLabsKeyModal = ({ isOpen, onClose }) => {
  const { elevenLabsKey, setElevenLabsKey, elevenLabsUsageChars, appTheme } = useStudioStore();
  const theme = getThemeClasses(appTheme);

  const [inputKey, setInputKey] = useState(elevenLabsKey || '');
  const [status, setStatus] = useState(null); // null | 'testing' | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleTestAndUpdate = async (e) => {
    e.preventDefault();
    if (!inputKey.trim()) return;

    setStatus('testing');
    setStatusMessage('Validating ElevenLabs API key & credit quota...');

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB', {
        method: 'POST',
        headers: {
          'xi-api-key': inputKey.trim(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: 'Key verification',
          model_id: 'eleven_multilingual_v2'
        })
      });

      if (response.ok) {
        setElevenLabsKey(inputKey.trim());
        setStatus('success');
        setStatusMessage('ElevenLabs API Key Verified & Activated Successfully!');
        setTimeout(() => {
          onClose();
          setStatus(null);
        }, 1200);
      } else {
        const errTxt = await response.text();
        setStatus('error');
        if (response.status === 401 && errTxt.includes('quota_exceeded')) {
          setStatusMessage('Credit Quota Exceeded for this key. Please use another active API key.');
        } else {
          setStatusMessage(`API Verification Failed (${response.status}): ${errTxt.slice(0, 100)}`);
        }
      }
    } catch (err) {
      setStatus('error');
      setStatusMessage(`Network error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className={`${theme.dropdownBg} rounded-2xl max-w-md w-full border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left select-none`}>
        {/* Header */}
        <div className={`px-5 py-3.5 ${theme.headerBg} border-b flex items-center justify-between`}>
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
              <Key className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <h2 className="font-bold text-sm">ElevenLabs Voice & Performance Manager</h2>
              <p className={`text-[10px] ${theme.textMuted}`}>Update API Key & track character credit usage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200/50 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleTestAndUpdate} className="p-5 space-y-4">
          {/* Key Input */}
          <div>
            <label className="block text-xs font-bold mb-1.5">ElevenLabs API Key</label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="sk_..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Performance & Usage Stats */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs text-slate-300 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Current Key:</span>
              <span className="text-rose-400 font-bold">
                {elevenLabsKey ? `${elevenLabsKey.slice(0, 8)}...${elevenLabsKey.slice(-4)}` : 'Not Set'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Session Chars Used:</span>
              <span className="text-emerald-400 font-bold">{elevenLabsUsageChars.toLocaleString()} chars</span>
            </div>
          </div>

          {/* Status Alert */}
          {statusMessage && (
            <div
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 border ${
                status === 'success'
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : status === 'error'
                  ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                  : 'bg-amber-950/40 border-amber-800 text-amber-300'
              }`}
            >
              {status === 'success' && <Check className="w-4 h-4 flex-shrink-0" />}
              {status === 'error' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {status === 'testing' && <RefreshCw className="w-4 h-4 flex-shrink-0 animate-spin" />}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === 'testing'}
              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md shadow-rose-900/20"
            >
              {status === 'testing' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>Verify & Save Key</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
