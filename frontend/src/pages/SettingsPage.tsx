import React from 'react';
import { Settings, Cpu, Shield, Database, Moon, Sun, CheckCircle2 } from 'lucide-react';
import { useUIStore } from '../stores/useUIStore';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useUIStore();

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          System Settings & AI Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure multi-agent pipeline parameters and platform theme.</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        
        {/* LLM Engine Information */}
        <div className="space-y-3">
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
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">Connected</span>
          </div>
        </div>

        {/* Theme */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            Appearance & Theme Mode
          </h3>
          <button
            onClick={toggleTheme}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Toggle Theme (Current: {theme.toUpperCase()})
          </button>
        </div>

      </div>
    </div>
  );
};
