import React from 'react';
import { 
  Search, 
  Calendar, 
  Calculator, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  Terminal,
  ArrowRight
} from 'lucide-react';
import { useAgentStore } from '../stores/useAgentStore';
import { useTripStore } from '../stores/useTripStore';

export const AgentWorkspace: React.FC = () => {
  const { agents, isPlanning, logs, currentAgent } = useAgentStore();
  const { currentTrip } = useTripStore();

  const agentConfig = [
    {
      id: 'research',
      name: 'Research Agent',
      role: 'Destination Intelligence',
      icon: Search,
      description: 'Analyzing attractions, local customs, transport & weather',
    },
    {
      id: 'activity',
      name: 'Activity Agent',
      role: 'Itinerary Architecture',
      icon: Calendar,
      description: 'Sequencing human-like daily morning/afternoon/evening schedules',
    },
    {
      id: 'budget',
      name: 'Budget Agent',
      role: 'Financial Planner',
      icon: Calculator,
      description: 'Computing category breakdowns and Budget/Comfort/Premium tiers',
    },
    {
      id: 'final',
      name: 'Final Writer & Validator',
      role: 'Master Guide Editor',
      icon: Sparkles,
      description: 'Synthesizing guide, checking constraints & validating timing',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      
      {/* Header Pipeline Summary Banner */}
      <div className="glass-panel p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span>Autonomous Multi-Agent Pipeline Active</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Planning Journey for {currentTrip?.destination || 'Destination'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {currentTrip?.duration_days || 5} Days • {currentTrip?.travelers || 2} Travelers • {currentTrip?.currency || 'INR'} {currentTrip?.budget.toLocaleString()} Budget
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900/80 px-4 py-3 rounded-xl border border-slate-800">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-slate-400">Current Phase</p>
            <p className="text-xs font-bold text-indigo-400 capitalize">{currentAgent || (isPlanning ? 'Initializing' : 'Completed')}</p>
          </div>
          {isPlanning && <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />}
        </div>
      </div>

      {/* Agents Working Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agentConfig.map((item) => {
          const agentStatus = agents[item.id] || { status: 'waiting', execution_time: 0 };
          const Icon = item.icon;
          const status = agentStatus.status;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                status === 'running'
                  ? 'bg-slate-900/90 border-indigo-500/80 ring-2 ring-indigo-500/20 shadow-xl'
                  : status === 'completed'
                  ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-900/30 border-slate-800/60 opacity-70'
              }`}
            >
              {/* Background Ambient Glow */}
              {status === 'running' && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${
                    status === 'running'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{item.name}</h3>
                    <p className="text-[11px] text-slate-400">{item.role}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {status === 'running' && (
                    <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[11px] font-bold flex items-center gap-1.5 animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Running
                    </span>
                  )}
                  {status === 'completed' && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed ({agentStatus.execution_time}s)
                    </span>
                  )}
                  {status === 'waiting' && (
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[11px] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Waiting
                    </span>
                  )}
                  {status === 'failed' && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Failed
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed">{item.description}</p>

              {/* Progress Summary snippet */}
              {agentStatus.output_summary && (
                <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 font-mono flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{agentStatus.output_summary}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Stream Terminal Logs */}
      <div className="glass-panel p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Live Agent Log Stream</h4>
          </div>
          <span className="text-[10px] text-slate-500">{logs.length} events logged</span>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-xs text-slate-300 pr-2">
          {logs.length === 0 ? (
            <p className="text-slate-500 italic text-[11px]">Initializing real-time stream...</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start space-x-3 p-1 hover:bg-slate-900/50 rounded transition-colors">
                <span className="text-[10px] text-slate-500 shrink-0">{log.timestamp}</span>
                <span className="text-indigo-400 font-bold uppercase text-[10px] shrink-0">[{log.agent}]</span>
                <span className="text-slate-300 leading-tight">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
