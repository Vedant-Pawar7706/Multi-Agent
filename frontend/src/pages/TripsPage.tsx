import React, { useEffect } from 'react';
import { Map, Calendar, DollarSign, ArrowRight, Trash2, Download, Share2, Compass } from 'lucide-react';
import { useTripStore } from '../stores/useTripStore';
import { useUIStore } from '../stores/useUIStore';

export const TripsPage: React.FC = () => {
  const { userTrips, fetchUserTrips, loadTripGuide, isLoading } = useTripStore();
  const { setActiveTab, openWizard } = useUIStore();

  useEffect(() => {
    fetchUserTrips();
  }, []);

  const handleOpenTrip = async (tripId: string) => {
    await loadTripGuide(tripId);
    setActiveTab('planner');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Map className="w-6 h-6 text-indigo-400" />
            My Saved Trips
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage and revisit all your AI-generated travel itineraries.</p>
        </div>

        <button
          onClick={openWizard}
          className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-500/25"
        >
          <Compass className="w-4 h-4" />
          <span>New Journey</span>
        </button>
      </div>

      {userTrips.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Map className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-200">No Trips Created Yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Start planning your first destination and watch specialized AI agents generate a personalized travel guide.
          </p>
          <button
            onClick={openWizard}
            className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
          >
            Plan First Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userTrips.map((trip) => (
            <div
              key={trip.id}
              className="glass-panel p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-4 group cursor-pointer"
              onClick={() => handleOpenTrip(trip.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase">
                    {trip.status}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors">
                    {trip.destination}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{trip.duration_days} Days ({trip.travelers} Travelers)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono text-slate-200">{trip.currency} {trip.budget.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
