import React from 'react';
import { Utensils, Star, MapPin } from 'lucide-react';
import { TravelGuide } from '../../types';

interface Props {
  guide: TravelGuide;
}

export const FoodDiscovery: React.FC<Props> = ({ guide }) => {
  const foodList = guide.food_recommendations || [];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Utensils className="w-4 h-4 text-emerald-400" />
          Must-Try Local Culinary Recommendations
        </h3>
        <p className="text-xs text-slate-400 mt-1">Iconic local dishes, street food highlights, and authentic dining spots compiled by Research Agent.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {foodList.map((item, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  {item.price_range || '$$'}
                </span>
                <h4 className="text-base font-bold text-white mt-1">{item.dish}</h4>
              </div>
              <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded-lg">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>4.8</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

            <div className="flex items-center space-x-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Must try at: <strong className="text-slate-200">{item.must_try_spots}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
