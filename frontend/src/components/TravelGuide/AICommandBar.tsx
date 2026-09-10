import React, { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { useTripStore } from '../../stores/useTripStore';

export const AICommandBar: React.FC = () => {
  const { currentTrip, setCurrentGuide } = useTripStore();
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const sampleCommands = [
    'Make Day 2 less crowded',
    'Replace expensive dinners with street food',
    'Add more historical places',
    'Reduce overall trip budget'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || !currentTrip || isProcessing) return;

    setIsProcessing(true);
    try {
      const res = await api.sendAICommand(currentTrip.id, command.trim());
      if (res.itinerary) {
        setCurrentGuide(res.itinerary);
      }
      setCommand('');
    } catch {
      // Ignore fallback
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-panel p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-3">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse-subtle" />
        <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Natural Language AI Command Bar</h4>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Ask MyTrip to modify trip e.g. 'Make Day 3 slower', 'Find budget hotels'..."
          className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          disabled={isProcessing}
        />
        <button
          type="submit"
          disabled={isProcessing || !command.trim()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-indigo-500/20"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>{isProcessing ? 'Agent Working...' : 'Apply AI Edit'}</span>
        </button>
      </form>

      {/* Preset Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] text-slate-500">Quick Edits:</span>
        {sampleCommands.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => setCommand(cmd)}
            className="px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};
