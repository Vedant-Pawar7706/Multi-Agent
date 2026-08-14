import React from 'react';
import { Sparkles, ShieldCheck, Cpu } from 'lucide-react';
import { useTripStore } from '../stores/useTripStore';
import { useUIStore } from '../stores/useUIStore';

export const Header: React.FC = () => {
  const { currentTrip, isDemoMode } = useTripStore();
  const { sidebarOpen, openWizard } = useUIStore();

  return (
    <header 
      className={`h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-20'
      }`}
    >
      <div className="flex items-center space-x-4">
        {currentTrip ? (
          <div>
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span>{currentTrip.destination}</span>
              <span className="text-xs font-normal text-slate-400">
                • {currentTrip.duration_days} Days ({currentTrip.travelers} Travelers)
              </span>
            </h2>
            <p className="text-xs text-indigo-400 font-medium">Active Trip Workspace</p>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Autonomous Multi-Agent System Engine
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {isDemoMode && (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5 animate-pulse">
            <ShieldCheck className="w-3.5 h-3.5" />
            DEMO MODE
          </span>
        )}

        <button
          onClick={openWizard}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Plan New Journey</span>
        </button>
      </div>
    </header>
  );
};
