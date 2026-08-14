import React from 'react';
import { DollarSign, PieChart, ShieldAlert, Sparkles, TrendingDown, Users } from 'lucide-react';
import { TravelGuide } from '../../types';

interface Props {
  guide: TravelGuide;
}

export const BudgetDashboard: React.FC<Props> = ({ guide }) => {
  const b = guide.budget_breakdown;
  if (!b) return <div className="p-8 text-center text-slate-400">Budget analysis unavailable.</div>;

  const symbol = b.currency_symbol || '₹';
  const categories = [
    { key: 'flights', label: 'Flights & Long Transit', cost: b.budget.flights, color: 'bg-indigo-500' },
    { key: 'hotel', label: 'Hotels & Accommodation', cost: b.budget.hotel, color: 'bg-purple-500' },
    { key: 'food', label: 'Food & Dining', cost: b.budget.food, color: 'bg-emerald-500' },
    { key: 'transport', label: 'Local Transport & Metro', cost: b.budget.transport, color: 'bg-amber-500' },
    { key: 'activities', label: 'Attractions & Sightseeing', cost: b.budget.activities, color: 'bg-sky-500' },
    { key: 'emergency_buffer', label: 'Emergency Buffer', cost: b.budget.emergency_buffer, color: 'bg-rose-500' },
  ];

  const total = b.estimated_total || 1;

  return (
    <div className="space-y-6">
      
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Total Estimated Trip Cost</p>
          <h3 className="text-2xl font-extrabold text-white mt-1 font-mono">
            {symbol} {b.estimated_total.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Calculated by Budget Agent</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            Per-Person Cost
          </p>
          <h3 className="text-2xl font-extrabold text-slate-100 mt-1 font-mono">
            {symbol} {b.per_person_cost.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">For {guide.meta.travelers} traveler(s)</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Average</p>
          <h3 className="text-2xl font-extrabold text-slate-100 mt-1 font-mono">
            {symbol} {b.daily_average_cost.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Across {guide.meta.duration_days} days</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            Remaining Buffer
          </p>
          <h3 className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">
            {symbol} {Math.max(0, b.user_budget - b.estimated_total).toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">Under target allocation</p>
        </div>
      </div>

      {/* Visual Category Breakdown Progress Bar */}
      <div className="glass-panel p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-400" />
            Expense Category Breakdown
          </h3>
          <span className="text-xs text-slate-400 font-mono">100% Allocated</span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
          {categories.map((c) => {
            const pct = Math.round((c.cost / total) * 100);
            return (
              <div
                key={c.key}
                className={`${c.color} h-full transition-all duration-500`}
                style={{ width: `${pct}%` }}
                title={`${c.label}: ${pct}%`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {categories.map((c) => {
            const pct = Math.round((c.cost / total) * 100);
            return (
              <div key={c.key} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${c.color}`} />
                  <span className="text-xs text-slate-300 font-medium truncate max-w-[120px]">{c.label}</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-100">{symbol} {c.cost.toLocaleString()} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget Tiers Comparison */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Budget Comparison Tiers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(b.budget_tiers || {}).map(([tierName, tierData]) => {
            const isComfort = tierName === 'Comfort';
            return (
              <div
                key={tierName}
                className={`p-5 rounded-2xl border transition-all ${
                  isComfort
                    ? 'bg-slate-900 border-indigo-500/80 ring-2 ring-indigo-500/20 shadow-xl'
                    : 'bg-slate-900/50 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-white">{tierName} Tier</h4>
                  {isComfort && <span className="px-2 py-0.5 rounded bg-indigo-600 text-[10px] font-bold text-white">Recommended</span>}
                </div>

                <div className="mb-3">
                  <span className="text-2xl font-extrabold text-white font-mono">{symbol} {tierData.total.toLocaleString()}</span>
                  <p className="text-xs text-slate-400 mt-0.5">{symbol} {tierData.per_person.toLocaleString()} / person</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">{tierData.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cost Saving Opportunities & Disclaimer */}
      {b.cost_saving_opportunities && (
        <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-900/50 space-y-2">
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Cost-Saving Opportunities Identified by Budget Agent
          </h4>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 leading-relaxed">
            {b.cost_saving_opportunities.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>{b.disclaimer}</span>
      </div>

    </div>
  );
};
