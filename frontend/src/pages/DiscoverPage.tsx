import React from 'react';
import { Sparkles, MapPin, Compass } from 'lucide-react';
import { useUIStore } from '../stores/useUIStore';

export const DiscoverPage: React.FC = () => {
  const { openWizard } = useUIStore();

  const curatedDestinations = [
    { title: 'Tokyo, Japan', desc: 'Blends futuristic tech with sacred Shinto shrines & world-class gastronomy.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80', tag: 'Top Rated' },
    { title: 'Paris, France', desc: 'Iconic architecture, romantic cafes, world-renowned museums, and art quarters.', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', tag: 'Art & Culture' },
    { title: 'Dubai, UAE', desc: 'Futuristic skylines, desert safaris, luxury shopping, and grand resorts.', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80', tag: 'Luxury' },
    { title: 'Manali, India', desc: 'Snow-capped Himalayan peaks, pine forests, adventure sports, and mountain air.', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80', tag: 'Nature' },
    { title: 'Swiss Alps, Switzerland', desc: 'Panoramic mountain railways, pristine lakes, alpine hiking, and chocolate.', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80', tag: 'Scenery' },
    { title: 'Bali, Indonesia', desc: 'Tropical beaches, spiritual temples, terraced rice fields, and spa retreats.', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80', tag: 'Relaxation' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          Discover Destinations
        </h1>
        <p className="text-xs text-slate-400 mt-1">Explore popular global destinations analyzed by Research Agent.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {curatedDestinations.map((d, i) => (
          <div key={i} className="glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all group flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden">
              <img src={d.image} alt={d.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-indigo-300 text-[10px] font-bold">
                {d.tag}
              </span>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  {d.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-2">{d.desc}</p>
              </div>

              <button
                onClick={openWizard}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center justify-center space-x-2 mt-4"
              >
                <Compass className="w-4 h-4" />
                <span>Plan Trip Here</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
