export interface User {
  id: string;
  name: string;
  email: string;
  created_at?: string;
}

export interface TripPreferences {
  hotel_preference?: string;
  food_preference?: string;
  mobility?: string;
  preferred_transport?: string;
  pacing?: string;
  wake_up?: string;
  notes?: string;
}

export interface Trip {
  id: string;
  user_id?: string;
  destination: string;
  start_date?: string;
  end_date?: string;
  duration_days: number;
  travelers: number;
  travel_type: string;
  travel_style: string;
  budget: number;
  currency: string;
  interests: string[];
  preferences: TripPreferences;
  status: 'draft' | 'planning' | 'completed' | 'failed';
  is_public?: boolean;
  share_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AgentStatus {
  id?: string;
  agent_name: 'research' | 'activity' | 'budget' | 'final' | 'orchestrator';
  status: 'waiting' | 'running' | 'completed' | 'failed' | 'retrying';
  started_at?: string;
  completed_at?: string;
  execution_time: number;
  output_summary?: string;
  error?: string;
}

export interface ItineraryDayActivity {
  time: string;
  activity: string;
  location: string;
  duration: string;
  cost_estimate?: number;
  description: string;
  tips?: string;
}

export interface MealRecommendation {
  type: string;
  recommendation: string;
  estimated_cost: number;
}

export interface TransportLeg {
  route: string;
  mode: string;
  estimated_time: string;
  cost: number;
}

export interface ItineraryDay {
  day: number;
  theme: string;
  morning: ItineraryDayActivity[];
  afternoon: ItineraryDayActivity[];
  evening: ItineraryDayActivity[];
  meals: MealRecommendation[];
  transport: TransportLeg[];
  estimated_activity_time: string;
  notes: string[];
}

export interface BudgetTier {
  total: number;
  per_person: number;
  daily_average: number;
  description: string;
}

export interface BudgetBreakdown {
  currency: string;
  currency_symbol: string;
  disclaimer: string;
  user_budget: number;
  estimated_total: number;
  per_person_cost: number;
  daily_average_cost: number;
  budget: {
    flights: number;
    hotel: number;
    food: number;
    transport: number;
    activities: number;
    shopping: number;
    miscellaneous: number;
    emergency_buffer: number;
    total: number;
    per_person: number;
  };
  category_percentages: Record<string, string>;
  budget_tiers: {
    Budget: BudgetTier;
    Comfort: BudgetTier;
    Premium: BudgetTier;
  };
  cost_saving_opportunities?: string[];
}

export interface TravelGuide {
  meta: {
    trip_id: string;
    destination: string;
    duration_days: number;
    travelers: number;
    travel_type: string;
    travel_style: string;
    currency: string;
    currency_symbol: string;
    total_budget: number;
    estimated_cost: number;
    per_person_cost: number;
  };
  trip_overview: string;
  destination_snapshot: {
    overview: string;
    best_time_to_visit: string;
    culture: string[];
    neighborhoods: Array<{ name: string; vibe: string; highlights: string }>;
  };
  trip_summary: {
    total_days: number;
    total_travelers: number;
    key_highlights: string[];
  };
  itinerary: ItineraryDay[];
  accommodations: Array<{ name: string; tier: string; area: string; price_per_night: string; why_stay: string }>;
  food_recommendations: Array<{ dish: string; description: string; price_range: string; must_try_spots: string }>;
  transportation_guide: Array<{ mode: string; tips: string }>;
  budget_breakdown: BudgetBreakdown;
  packing_checklist: Array<{ category: string; items: string[] }>;
  cultural_tips: string[];
  safety_tips: string[];
  important_notes?: string[];
  alternative_activities?: Array<{ name: string; category: string; description: string }>;
  sources: Array<{ title: string; url: string; source_type: string }>;
}
