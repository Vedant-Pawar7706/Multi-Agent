import React, { useState, useEffect } from 'react';
import { Settings, Cpu, Database, Globe, CheckCircle2, XCircle, RefreshCw, Save } from 'lucide-react';
import { getApiBase } from '../services/api';
import axios from 'axios';

export const SettingsPage: React.FC = () => {
  const [customApiUrl, setCustomApiUrl] = useState('');
  const [pingStatus, setPingStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [pingMessage, setPingMessage] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mytrip_api_url') || '';
    setCustomApiUrl(saved);
  }, []);

  const currentActiveUrl = getApiBase();

  const handleSaveApiUrl = () => {
    if (customApiUrl.trim()) {
      localStorage.setItem('mytrip_api_url', customApiUrl.trim());
    } else {
      localStorage.removeItem('mytrip_api_url');
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    testConnection(customApiUrl.trim() || currentActiveUrl);
  };

  const testConnection = async (targetUrl?: string) => {
    setPingStatus('checking');
    setPingMessage('Pinging backend service...');
    try {
      const urlToTest = (targetUrl || currentActiveUrl).replace(/\/api\/?$/, '');
      const start = Date.now();
      const res = await axios.get(`${urlToTest}/`, { timeout: 15000 });
      const elapsed = Date.now() - start;
      if (res.data?.status === 'healthy' || res.status === 200) {
        setPingStatus('success');
        setPingMessage(`Connected successfully (${elapsed}ms) • ${res.data?.service || 'MyTrip API'}`);
      } else {
        setPingStatus('success');
        setPingMessage(`Responded with HTTP ${res.status} (${elapsed}ms)`);
      }
    } catch (err: any) {
      setPingStatus('error');
      setPingMessage(err.message || 'Unable to reach backend. Backend may be waking up (30s) or check URL.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          System Settings & Diagnostics
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure multi-agent pipeline parameters and platform connection.</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        
        {/* Backend API Connection Diagnostic */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            Backend API Connection
          </h3>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-slate-400">Active API Endpoint:</span>
                <p className="font-mono text-indigo-300 font-bold mt-0.5">{currentActiveUrl}</p>
              </div>
              <button
                onClick={() => testConnection()}
                disabled={pingStatus === 'checking'}
                className="flex items-center space-x-1.5 py-1.5 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold transition-all active:scale-95 self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${pingStatus === 'checking' ? 'animate-spin' : ''}`} />
                <span>Test Connection</span>
              </button>
            </div>

            {pingStatus !== 'idle' && (
              <div className={`p-2.5 rounded-lg border flex items-center space-x-2 ${
                pingStatus === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : pingStatus === 'error'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}>
                {pingStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {pingStatus === 'error' && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                {pingStatus === 'checking' && <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />}
                <span className="font-medium text-[11px]">{pingMessage}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <label className="text-slate-400 block text-[11px]">
                Custom Render Backend URL (Optional override):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://mytrip-backend.onrender.com"
                  value={customApiUrl}
                  onChange={(e) => setCustomApiUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono focus:border-indigo-500 focus:outline-none"
                />
                <button
                  onClick={handleSaveApiUrl}
                  className="flex items-center space-x-1.5 py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md shadow-indigo-500/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savedSuccess ? 'Saved!' : 'Save'}</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                Tip: If your backend is deployed on Render at e.g. <code className="text-indigo-400">https://mytrip-backend-xxxx.onrender.com</code>, enter it here and click Save.
              </p>
            </div>
          </div>
        </div>

        {/* LLM Engine Information */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            AI Provider Architecture
          </h3>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Primary Provider:</span>
              <span className="font-bold text-indigo-400">Google Gemini 2.5 Flash / Demo Fallback</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Agent Pipeline:</span>
              <span className="font-bold text-emerald-400">4 Stateful Autonomous Agents</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Validation Mode:</span>
              <span className="font-bold text-slate-200">Strict Constraint Checker (Max 3 Retries)</span>
            </div>
          </div>
        </div>

        {/* Database */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            Database & Persistence
          </h3>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-200">SQLAlchemy ORM + SQLite / PostgreSQL</p>
              <p className="text-slate-500 text-[11px]">Stores Trips, Agent Runs, Itineraries & Users.</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">Active</span>
          </div>
        </div>

      </div>
    </div>
  );
};
