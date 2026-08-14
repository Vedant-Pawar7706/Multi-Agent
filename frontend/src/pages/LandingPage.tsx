import React from 'react';
import { Sparkles, Compass, Shield, Zap, Search, Calendar, Calculator, CheckCircle2, ArrowRight } from 'lucide-react';
import { useUIStore } from '../stores/useUIStore';
import { useTripStore } from '../stores/useTripStore';

export const LandingPage: React.FC = () => {
  const { openWizard, setActiveTab } = useUIStore();
  const { loadDemoTrip } = useTripStore();

  const handleExploreDemo = async () => {
    await loadDemoTrip();
    setActiveTab('planner');
  };

  const featureCards = [
    {
      title: 'Research Agent',
      desc: 'Destination intelligence gathering hidden gems, transport, and safety rules.',
      icon: Search,
      tag: 'Agent 01'
    },
    {
      title: 'Activity Agent',
      desc: 'Human-like daily itineraries grouped geographically with morning/evening breaks.',
      icon: Calendar,
      tag: 'Agent 02'
    },
    {
      title: 'Budget Agent',
      desc: 'Tool-calculated budget tiers (Budget/Comfort/Premium) and category breakdowns.',
      icon: Calculator,
      tag: 'Agent 03'
    },
    {
      title: 'Final Editor & Validator',
      desc: 'Validates timing & constraints up to 3 retry attempts before compiling master guide.',
      icon: Sparkles,
      tag: 'Agent 04'
    }
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto px-6 py-8">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autonomous Multi-Agent System Engine</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
          Plan your next journey with a team of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300">AI travel experts</span>.
        </h1>

        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Research, itinerary planning, budgeting and travel guidance — handled by specialized AI agents working together in a stateful orchestration pipeline.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={openWizard}
            className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/30 transition-all active:scale-95 flex items-center space-x-2"
          >
            <Compass className="w-5 h-5" />
            <span>Plan a Trip</span>
          </button>

          <button
            onClick={handleExploreDemo}
            className="py-3.5 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-sm transition-all flex items-center space-x-2"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Explore Demo</span>
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6">
        {featureCards.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="glass-panel p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3 group">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{f.tag}</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Interactive Workflow Banner */}
      <div className="glass-panel p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-slate-800 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-xl font-extrabold text-white">How VoyageAI Agents Collaborate</h3>
          <p className="text-xs text-slate-400">Instead of one AI doing everything, 4 specialized agents execute in sequence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
          {['User Input', 'Research Agent', 'Activity & Budget', 'Final Travel Guide'].map((step, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] font-bold text-indigo-400">STEP 0{idx + 1}</span>
              <p className="text-xs font-bold text-slate-200">{step}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
