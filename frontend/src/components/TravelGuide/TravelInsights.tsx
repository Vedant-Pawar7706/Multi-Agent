import React from 'react';
import { Sun, DollarSign, Globe, Clock, ShieldAlert, HeartHandshake, PhoneCall, AlertOctagon } from 'lucide-react';
import { TravelGuide } from '../../types';

interface Props {
  guide: TravelGuide;
}

export const TravelInsights: React.FC<Props> = ({ guide }) => {
  const snap = guide.destination_snapshot || {};
  const culture = guide.cultural_tips || snap.culture || [];
  const safety = guide.safety_tips || [];
  const sources = guide.sources || [];

  const cards = [
    { title: 'Best Time to Visit', desc: snap.best_time_to_visit || 'Spring & Autumn', icon: Sun, color: 'text-amber-400' },
    { title: 'Local Currency', desc: `${guide.meta.currency} (${guide.meta.currency_symbol})`, icon: DollarSign, color: 'text-emerald-400' },
    { title: 'Primary Language', desc: 'Local & English widely spoken', icon: Globe, color: 'text-indigo-400' },
    { title: 'Time Zone', desc: 'Standard Local Time', icon: Clock, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top 4 Quick Fact Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <Icon className={`w-5 h-5 ${c.color}`} />
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{c.title}</p>
              <p className="text-sm font-bold text-slate-100">{c.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Cultural Etiquette */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
          <HeartHandshake className="w-4 h-4" />
          Cultural Etiquette & Customs
        </h4>
        <ul className="space-y-2 text-xs text-slate-300">
          {culture.map((tip, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="text-indigo-400 font-bold">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Safety & Emergency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-xs font-extrabold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            Safety Considerations
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {safety.map((s, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <PhoneCall className="w-4 h-4" />
            Emergency & Essential Contact Numbers
          </h4>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between p-2 rounded-lg bg-slate-950">
              <span>Emergency Services / Police</span>
              <strong className="text-amber-400 font-mono">112 / 110</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950">
              <span>Ambulance & Fire</span>
              <strong className="text-amber-400 font-mono">119</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-950">
              <span>Tourist Helpline</span>
              <strong className="text-amber-400 font-mono">24/7 Assistance</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Research Sources */}
      {sources.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Research Sources & References</h4>
          <div className="flex flex-wrap gap-3">
            {sources.map((src, idx) => (
              <a
                key={idx}
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-400 hover:underline bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
              >
                {src.title} ({src.source_type})
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
