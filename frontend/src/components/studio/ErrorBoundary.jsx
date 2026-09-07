import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Phlappy Studio React Error Boundary Caught:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('PHLAPPY_STUDIO_STATE');
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-slate-100 p-6 select-none font-sans">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center justify-center gap-1.5">
                <span>TCM</span><span className="text-rose-500">One</span> Phlappy Studio Error Recovered
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                An unexpected UI rendering glitch occurred. Don't worry, your workspace is safe!
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-rose-400 text-left overflow-x-auto max-h-24">
              {this.state.error?.toString() || 'Unknown UI Exception'}
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-rose-900/30"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload & Restore Studio Workspace</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
