import React, { useState, useEffect } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { getThemeClasses } from '../../utils/themeStyles';
import { Key, Sparkles, Check, AlertCircle, RefreshCw, X, ShieldCheck, Zap } from 'lucide-react';

export const ElevenLabsKeyModal = ({ isOpen, onClose }) => {
  const {
    elevenLabsKey,
    setElevenLabsKey,
    elevenLabsUsageChars,
    elevenLabsQuotaInfo,
    checkKeyQuota,
    appTheme
  } = useStudioStore();

  const theme = getThemeClasses(appTheme);

  const [inputKey, setInputKey] = useState(elevenLabsKey || '');
  const [status, setStatus] = useState(null); // null | 'testing' | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInputKey(elevenLabsKey || '');
      checkKeyQuota(elevenLabsKey);
    }
  }, [isOpen, elevenLabsKey, checkKeyQuota]);

  if (!isOpen) return null;

  const handleTestAndUpdate = async (e) => {
    e.preventDefault();
    const keyToSave = inputKey.trim();
    if (!keyToSave) return;

    setStatus('testing');
    setStatusMessage('Validating ElevenLabs API key & checking remaining credit quota...');

    const res = await checkKeyQuota(keyToSave);

    if (res.ok) {
      setElevenLabsKey(keyToSave);
      setStatus('success');
      setStatusMessage('Key verified & activated successfully!');
      setTimeout(() => {
        onClose();
        setStatus(null);
      }, 1200);
    } else {
      setStatus('error');
      if (res.isQuotaExceeded) {
        setStatusMessage('Credit Quota Exceeded (0 Remaining). Please enter a key with active credits.');
      } else {
        setStatusMessage(`API Key Error: ${res.error?.slice(0, 100) || 'Verification failed'}`);
      }
    }
  };

  const remainingQuota = elevenLabsQuotaInfo?.remainingQuota;
  const characterLimit = elevenLabsQuotaInfo?.characterLimit;
  const hasFullDetails = elevenLabsQuotaInfo?.hasFullDetails;
  const isExceeded = elevenLabsQuotaInfo?.isExceeded;
  const percentRemaining = (hasFullDetails && characterLimit > 0)
    ? Math.round((remainingQuota / characterLimit) * 100)
    : null;

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
              <h2 className="font-bold text-sm">ElevenLabs Voice & Credit Manager</h2>
              <p className={`text-[10px] ${theme.textMuted}`}>Monitor remaining credits & update active API key</p>
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold">ElevenLabs API Key</label>
              <button
                type="button"
                onClick={() => checkKeyQuota(inputKey.trim())}
                className="text-[10px] font-bold text-rose-500 hover:text-rose-600 flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh Quota</span>
              </button>
            </div>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="sk_..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Real-time Remaining Credit & Usage Stats Card */}
          <div className={`p-3.5 rounded-xl border space-y-2.5 text-xs font-mono ${
            isExceeded
              ? 'bg-rose-950/20 border-rose-800/60 text-rose-300'
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Current Key:</span>
              <span className="text-rose-400 font-bold">
                {elevenLabsKey ? `${elevenLabsKey.slice(0, 8)}...${elevenLabsKey.slice(-4)}` : 'Not Configured'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Quota Status:</span>
              <span className={`font-bold flex items-center space-x-1 ${
                isExceeded ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                <Zap className="w-3 h-3" />
                <span>{elevenLabsQuotaInfo?.statusText || 'Active Quota Available'}</span>
              </span>
            </div>

            {hasFullDetails && (
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Remaining Credit:</span>
                  <span className="font-bold text-emerald-400">{remainingQuota.toLocaleString()} / {characterLimit.toLocaleString()} Chars</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      percentRemaining < 20 ? 'bg-rose-500' : percentRemaining < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percentRemaining}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-400">Session Chars Used:</span>
              <span className="text-amber-400 font-bold">{elevenLabsUsageChars.toLocaleString()} chars</span>
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
              {status === 'success' && <Check className="w-4 h-4 flex-shrink-0 text-emerald-400" />}
              {status === 'error' && <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />}
              {status === 'testing' && <RefreshCw className="w-4 h-4 flex-shrink-0 animate-spin text-amber-400" />}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer text-slate-700 dark:text-slate-200"
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
