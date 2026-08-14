import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Users, 
  Compass, 
  Heart, 
  DollarSign, 
  Sliders, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Check
} from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useTripStore } from '../../stores/useTripStore';
import { useAgentStore } from '../../stores/useAgentStore';

const POPULAR_DESTINATIONS = [
  { name: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80', tag: 'Culture & Tech' },
  { name: 'Paris, France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80', tag: 'Romantic & Art' },
  { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80', tag: 'Luxury & Future' },
  { name: 'Manali, India', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80', tag: 'Mountains & Adventure' },
  { name: 'Switzerland', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=400&q=80', tag: 'Nature & Alps' },
  { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80', tag: 'Beaches & Relaxation' },
];

const TRAVEL_STYLES = [
  'Budget', 'Balanced', 'Luxury', 'Backpacking', 'Adventure', 'Relaxation', 'Cultural', 'Food', 'Romantic', 'Family'
];

const INTEREST_OPTIONS = [
  'History', 'Nature', 'Shopping', 'Food', 'Nightlife', 'Photography', 'Architecture', 'Adventure', 'Museums', 'Beaches', 'Spiritual', 'Local experiences'
];

export const TripWizardModal: React.FC = () => {
  const { isWizardOpen, closeWizard, setActiveTab } = useUIStore();
  const { createTrip, loadTripGuide } = useTripStore();
  const { initAgents, connectWebSocket } = useAgentStore();

  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('Tokyo, Japan');
  const [startDate, setStartDate] = useState('2026-09-10');
  const [endDate, setEndDate] = useState('2026-09-17');
  const [durationDays, setDurationDays] = useState(7);
  const [travelers, setTravelers] = useState(2);
  const [travelType, setTravelType] = useState('Couple');
  const [travelStyle, setTravelStyle] = useState('Balanced');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Culture', 'Food', 'Sightseeing']);
  const [budget, setBudget] = useState(150000);
  const [currency, setCurrency] = useState('INR');
  const [hotelPref, setHotelPref] = useState('3-4 Star Boutique');
  const [foodPref, setFoodPref] = useState('Local & Authentic');
  const [pacing, setPacing] = useState('Balanced');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isWizardOpen) return null;

  const toggleInterest = (item: string) => {
    if (selectedInterests.includes(item)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== item));
    } else {
      setSelectedInterests([...selectedInterests, item]);
    }
  };

  const handleStartPlanning = async () => {
    setIsSubmitting(true);
    try {
      const newTrip = await createTrip({
        destination,
        start_date: startDate,
        end_date: endDate,
        duration_days: durationDays,
        travelers,
        travel_type: travelType,
        travel_style: travelStyle,
        interests: selectedInterests,
        budget,
        currency,
        preferences: {
          hotel_preference: hotelPref,
          food_preference: foodPref,
          pacing,
        }
      });

      closeWizard();
      initAgents();
      setActiveTab('agent-activity');

      // Trigger backend planning pipeline
      const { api } = await import('../../services/api');
      connectWebSocket(newTrip.id, async () => {
        await loadTripGuide(newTrip.id);
        setActiveTab('planner');
      });
      await api.startPlanning(newTrip.id);
    } catch {
      // Fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Create Your Journey</h3>
              <p className="text-xs text-slate-400">Step {step} of 7 — AI Travel Customizer</p>
            </div>
          </div>
          <button onClick={closeWizard} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1 transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: DESTINATION */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                  Where are you going?
                </h4>
                <p className="text-xs text-slate-400 mt-1">Search any destination or select a popular highlight.</p>
              </div>

              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination e.g. Tokyo, Paris, Rome, Bali..."
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm font-medium"
              />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {POPULAR_DESTINATIONS.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => setDestination(item.name)}
                    className={`relative rounded-xl overflow-hidden cursor-pointer border transition-all h-28 group ${
                      destination === item.name ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-3 flex flex-col justify-end">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <span className="text-[10px] text-indigo-300 font-medium">{item.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: DATES */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  When are you travelling?
                </h4>
                <p className="text-xs text-slate-400 mt-1">Specify dates and overall trip duration.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Duration (Days): {durationDays}</label>
                <input
                  type="range"
                  min="2"
                  max="14"
                  value={durationDays}
                  onChange={(e) => setDurationDays(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* STEP 3: TRAVELERS */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  Who is travelling?
                </h4>
                <p className="text-xs text-slate-400 mt-1">Select your group dynamic and traveler count.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {['Solo', 'Couple', 'Family', 'Friends'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTravelType(t)}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold text-left transition-all ${
                      travelType === t
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Number of Travelers: {travelers}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={travelers}
                  onChange={(e) => setTravelers(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* STEP 4: STYLE */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-400" />
                  Travel Style
                </h4>
                <p className="text-xs text-slate-400 mt-1">Select the overall vibe and comfort level of your journey.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {TRAVEL_STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => setTravelStyle(style)}
                    className={`py-2 px-4 rounded-xl border text-xs font-semibold transition-all ${
                      travelStyle === style
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: INTERESTS */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-indigo-400" />
                  Interests & Activities
                </h4>
                <p className="text-xs text-slate-400 mt-1">Select all categories you want the Research Agent to prioritize.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {INTEREST_OPTIONS.map((item) => {
                  const isSelected = selectedInterests.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleInterest(item)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span>{item}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: BUDGET */}
          {step === 6 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-indigo-400" />
                  Total Budget Allocation
                </h4>
                <p className="text-xs text-slate-400 mt-1">Set your total target budget for all travelers.</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {['INR', 'USD', 'EUR'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      currency === c ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Budget ({currency}): {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€'} {budget.toLocaleString()}
                </label>
                <input
                  type="range"
                  min={currency === 'INR' ? 30000 : 500}
                  max={currency === 'INR' ? 1000000 : 15000}
                  step={currency === 'INR' ? 10000 : 250}
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* STEP 7: PREFERENCES */}
          {step === 7 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-400" />
                  Fine-Tune Pacing & Preferences
                </h4>
                <p className="text-xs text-slate-400 mt-1">Help the Activity Agent balance your daily schedule.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Daily Pace</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Slow & Relaxed', 'Balanced', 'Packed & Fast'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPacing(p)}
                        className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                          pacing === p ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Hotel Preference</label>
                  <input
                    type="text"
                    value={hotelPref}
                    onChange={(e) => setHotelPref(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Food Preference</label>
                  <input
                    type="text"
                    value={foodPref}
                    onChange={(e) => setFoodPref(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/90">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center space-x-1 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center space-x-1 py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleStartPlanning}
              disabled={isSubmitting}
              className="flex items-center space-x-2 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-xl shadow-indigo-500/30 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>{isSubmitting ? 'Initializing Agents...' : 'Start AI Planning'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
