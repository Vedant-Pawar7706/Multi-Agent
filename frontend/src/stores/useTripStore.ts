import { create } from 'zustand';
import { Trip, TravelGuide } from '../types';
import { api } from '../services/api';

interface TripState {
  currentTrip: Trip | null;
  currentGuide: TravelGuide | null;
  userTrips: Trip[];
  isLoading: boolean;
  isDemoMode: boolean;
  error: string | null;

  setCurrentTrip: (trip: Trip | null) => void;
  setCurrentGuide: (guide: TravelGuide | null) => void;
  fetchUserTrips: () => Promise<void>;
  createTrip: (tripData: Partial<Trip>) => Promise<Trip>;
  loadDemoTrip: () => Promise<void>;
  loadTripGuide: (tripId: string) => Promise<void>;
}

export const useTripStore = create<TripState>((set, get) => ({
  currentTrip: null,
  currentGuide: null,
  userTrips: [],
  isLoading: false,
  isDemoMode: false,
  error: null,

  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  setCurrentGuide: (guide) => set({ currentGuide: guide }),

  fetchUserTrips: async () => {
    set({ isLoading: true });
    try {
      const trips = await api.getTrips();
      set({ userTrips: trips, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  createTrip: async (tripData) => {
    set({ isLoading: true, error: null, isDemoMode: false });
    try {
      const trip = await api.createTrip(tripData);
      set({ currentTrip: trip, isLoading: false });
      return trip;
    } catch (err: any) {
      set({ isLoading: false, error: err.response?.data?.detail || 'Failed to create trip' });
      throw err;
    }
  },

  loadDemoTrip: async () => {
    set({ isLoading: true, isDemoMode: true });
    try {
      const demoData = await api.getDemoTokyo();
      set({
        currentTrip: demoData.trip,
        currentGuide: demoData.itinerary,
        isLoading: false
      });
    } catch (err: any) {
      set({ isLoading: false, error: 'Failed to load demo data' });
    }
  },

  loadTripGuide: async (tripId: string) => {
    set({ isLoading: true });
    try {
      const [trip, guide] = await Promise.all([
        api.getTrip(tripId),
        api.getItinerary(tripId).catch(() => null)
      ]);
      set({ currentTrip: trip, currentGuide: guide, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: 'Failed to load trip guide' });
    }
  }
}));
