import React, { useState } from 'react';
import { Clock, MapPin, DollarSign, Lightbulb, Navigation, Utensils } from 'lucide-react';
import { TravelGuide, ItineraryDay } from '../../types';

interface Props {
  guide: TravelGuide;
}

export const ItineraryTimeline: React.FC<Props> = ({ guide }) => {
  const [selectedDay, setSelectedDay] = useState(1);
  const itinerary = guide.itinerary || [];
  const currentDayData = itinerary.find((d) => d.day === selectedDay) || itinerary[0];

  if (!currentDayData) {
    return <div className="p-8 text-center text-slate-400">No itinerary data available.</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Day Picker Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {itinerary.map((d) => (
          <button
            key={d.day}
            onClick={() => setSelectedDay(d.day)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-2 border ${
              selectedDay === d.day
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>Day {d.day}</span>
          </button>
        ))}
      </div>

      {/* Selected Day Theme Banner */}
      <div className="glass-panel p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-indigo-400 text-xs font-extrabold uppercase tracking-wider">Day 0{currentDayData.day} Architecture</span>
            <h3 className="text-lg font-bold text-white mt-0.5">{currentDayData.theme}</h3>
          </div>
          <div className="text-right text-xs text-slate-400">
            <span className="font-semibold text-slate-200">{currentDayData.estimated_activity_time}</span> active time
          </div>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
        
        {/* MORNING */}
        {currentDayData.morning.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 relative">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-xs z-10">
                AM
              </div>
              <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Morning Exploration</h4>
            </div>

            {currentDayData.morning.map((act, idx) => (
              <TimelineCard key={idx} activity={act} currencySymbol={guide.meta.currency_symbol} />
            ))}
          </div>
        )}

        {/* AFTERNOON */}
        {currentDayData.afternoon.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 relative">
              <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold text-xs z-10">
                PM
              </div>
              <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Afternoon Discovery</h4>
            </div>

            {currentDayData.afternoon.map((act, idx) => (
              <TimelineCard key={idx} activity={act} currencySymbol={guide.meta.currency_symbol} />
            ))}
          </div>
        )}

        {/* EVENING */}
        {currentDayData.evening.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 relative">
              <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold text-xs z-10">
                EVE
              </div>
              <h4 className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Evening & Atmosphere</h4>
            </div>

            {currentDayData.evening.map((act, idx) => (
              <TimelineCard key={idx} activity={act} currencySymbol={guide.meta.currency_symbol} />
            ))}
          </div>
        )}

        {/* MEALS & TRANSPORT SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8 pt-4">
          {currentDayData.meals.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-emerald-400" />
                Recommended Dining
              </h5>
              <div className="space-y-1.5 text-xs text-slate-400">
                {currentDayData.meals.map((m, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="font-semibold text-slate-300">{m.type}: {m.recommendation}</span>
                    <span className="text-emerald-400 font-mono">{guide.meta.currency_symbol} {m.estimated_cost}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentDayData.transport.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-indigo-400" />
                Transport Transfers
              </h5>
              <div className="space-y-1.5 text-xs text-slate-400">
                {currentDayData.transport.map((t, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{t.route} ({t.mode})</span>
                    <span className="text-indigo-300 font-mono">{t.estimated_time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

const TimelineCard: React.FC<{ activity: any; currencySymbol: string }> = ({ activity, currencySymbol }) => {
  return (
    <div className="ml-8 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-2 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono font-bold text-xs">
            {activity.time}
          </span>
          <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{activity.activity}</h4>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{activity.duration}</span>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">{activity.description}</p>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs">
        <div className="flex items-center space-x-1.5 text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
          <span>{activity.location}</span>
        </div>

        {activity.cost_estimate !== undefined && (
          <div className="flex items-center space-x-1 text-emerald-400 font-mono font-semibold">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{activity.cost_estimate === 0 ? 'Free Entry' : `${currencySymbol} ${activity.cost_estimate}`}</span>
          </div>
        )}
      </div>

      {activity.tips && (
        <div className="mt-2 p-2 rounded-lg bg-indigo-950/30 border border-indigo-900/50 text-[11px] text-indigo-300 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>{activity.tips}</span>
        </div>
      )}
    </div>
  );
};
