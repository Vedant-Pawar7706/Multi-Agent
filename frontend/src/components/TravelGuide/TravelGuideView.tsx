import React, { useState } from 'react';
import { 
  Download, 
  Share2, 
  Bookmark, 
  Map, 
  Calendar, 
  DollarSign, 
  Utensils, 
  Luggage, 
  Compass, 
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { useTripStore } from '../../stores/useTripStore';
import { api } from '../../services/api';
import { ItineraryTimeline } from './ItineraryTimeline';
import { BudgetDashboard } from './BudgetDashboard';
import { MapView } from './MapView';
import { FoodDiscovery } from './FoodDiscovery';
import { PackingChecklist } from './PackingChecklist';
import { TravelInsights } from './TravelInsights';
import { AICommandBar } from './AICommandBar';

export const TravelGuideView: React.FC = () => {
  const { currentGuide, currentTrip } = useTripStore();
  const [activeSubTab, setActiveSubTab] = useState<'itinerary' | 'budget' | 'map' | 'food' | 'packing' | 'insights'>('itinerary');
  const [isSaved, setIsSaved] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  if (!currentGuide) {
    return <div className="p-8 text-center text-slate-400">Travel guide loading or unavailable...</div>;
  }

  const meta = currentGuide.meta;
  const symbol = meta.currency_symbol || '₹';

  const handleExportPDF = () => {
    if (!currentTrip) return;
    const url = api.getPDFUrl(currentTrip.id);
    window.open(url, '_blank');
  };

  const handleShare = async () => {
    if (!currentTrip) return;
    try {
      const res = await api.toggleShare(currentTrip.id);
      navigator.clipboard.writeText(window.location.origin + res.share_url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      
      {/* Top Banner Header */}
      <div className="glass-panel p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-extrabold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Master AI Travel Guide</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">{meta.destination}</h1>
          <p className="text-xs text-slate-300 mt-1">
            {meta.duration_days} Days • {meta.travelers} Travelers ({meta.travel_type}) • {meta.travel_style} Style
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
              isSaved ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>{isSaved ? 'Saved' : 'Save Trip'}</span>
          </button>

          <button
            onClick={handleShare}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-indigo-400" />}
            <span>{copiedShare ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-500/25 flex items-center space-x-2 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Natural Language AI Edit Bar */}
      <AICommandBar />

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-2 overflow-x-auto">
        {[
          { id: 'itinerary', label: 'Itinerary Timeline', icon: Calendar },
          { id: 'budget', label: 'Financial Budget', icon: DollarSign },
          { id: 'map', label: 'Interactive Map', icon: Map },
          { id: 'food', label: 'Must-Try Culinary', icon: Utensils },
          { id: 'packing', label: 'Packing Checklist', icon: Luggage },
          { id: 'insights', label: 'Travel Insights', icon: Info },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 border ${
                isActive
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-900/40 border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="pt-2">
        {activeSubTab === 'itinerary' && <ItineraryTimeline guide={currentGuide} />}
        {activeSubTab === 'budget' && <BudgetDashboard guide={currentGuide} />}
        {activeSubTab === 'map' && <MapView guide={currentGuide} />}
        {activeSubTab === 'food' && <FoodDiscovery guide={currentGuide} />}
        {activeSubTab === 'packing' && <PackingChecklist guide={currentGuide} />}
        {activeSubTab === 'insights' && <TravelInsights guide={currentGuide} />}
      </div>

    </div>
  );
};
