import json
from typing import Dict, Any, List
from app.agents.state import TravelPlanningState
from app.agents.llm_provider import LLMProvider

class ActivityAgent:
    """
    AGENT 2 — ACTIVITY / ITINERARY AGENT
    Role: Expert travel itinerary planner.
    Transforms research into a human-designed, realistic daily itinerary grouped geographically with proper morning/afternoon/evening breakdowns.
    """
    SYSTEM_PROMPT = """You are the Senior Activity & Itinerary Planner Agent for MyTrip.
Your role is to build a human-designed, highly realistic daily travel itinerary.
Do NOT overload days. Group geographically close attractions. Include dedicated meal breaks and rest periods.

Return ONLY a JSON object matching this EXACT schema:
{
  "days": [
    {
      "day": 1,
      "theme": "Theme of the day e.g. Arrival & Historical Exploration",
      "morning": [
        {
          "time": "09:00",
          "activity": "Activity Name",
          "location": "Location / Neighborhood",
          "duration": "2 hrs",
          "cost_estimate": 500,
          "description": "Engaging description...",
          "tips": "Practical tip..."
        }
      ],
      "afternoon": [
        {
          "time": "14:00",
          "activity": "Activity Name",
          "location": "Location / Neighborhood",
          "duration": "2.5 hrs",
          "cost_estimate": 800,
          "description": "Engaging description...",
          "tips": "Practical tip..."
        }
      ],
      "evening": [
        {
          "time": "19:00",
          "activity": "Evening activity / Walk",
          "location": "Location",
          "duration": "2 hrs",
          "cost_estimate": 0,
          "description": "...",
          "tips": "..."
        }
      ],
      "meals": [
        {"type": "Breakfast", "recommendation": "Local Bakery / Hotel", "estimated_cost": 400},
        {"type": "Lunch", "recommendation": "Authentic Restaurant", "estimated_cost": 800},
        {"type": "Dinner", "recommendation": "Popular Dining Spot", "estimated_cost": 1500}
      ],
      "transport": [
        {"route": "Hotel to Morning Spot", "mode": "Metro", "estimated_time": "20 mins", "cost": 100}
      ],
      "estimated_activity_time": "6.5 hrs",
      "notes": ["Rest period planned between 16:30 and 18:30."]
    }
  ]
}
Do not write any markdown text outside the JSON. Return pure JSON.
"""

    def __init__(self):
        self.llm = LLMProvider()

    async def run(self, state: TravelPlanningState) -> Dict[str, Any]:
        state.status = "activity"
        state.log("Activity Agent", f"Building human-designed {state.duration_days}-day itinerary for {state.destination}...")

        user_prompt = f"""
Destination: {state.destination}
Duration: {state.duration_days} Days
Travelers: {state.travelers} ({state.travel_type})
Style: {state.travel_style}
Interests: {', '.join(state.interests)}
Pacing: {state.preferences.get('pacing', 'Balanced')}
Wake Up Preference: {state.preferences.get('wake_up', '08:30 AM')}
Custom Notes/Instructions: {state.custom_instructions or 'None'}

Research Intelligence Summary:
{json.dumps(state.research_result.get('top_attractions', []) if state.research_result else [])}
"""

        llm_output = await self.llm.generate_json(self.SYSTEM_PROMPT, user_prompt)

        if not llm_output or "days" not in llm_output or not isinstance(llm_output["days"], list):
            llm_output = self._generate_fallback_itinerary(state)

        state.itinerary_result = llm_output
        state.log("Activity Agent", f"Successfully generated {len(llm_output['days'])}-day itinerary.")
        return llm_output

    def _generate_fallback_itinerary(self, state: TravelPlanningState) -> Dict[str, Any]:
        dest = state.destination.title()
        days_list = []
        attractions = state.research_result.get("top_attractions", []) if state.research_result else []

        for d in range(1, state.duration_days + 1):
            att1 = attractions[(d - 1) % len(attractions)] if attractions else {"name": f"Historic Center of {dest}", "category": "Culture"}
            att2 = attractions[d % len(attractions)] if attractions else {"name": f"{dest} Sky Tower", "category": "Views"}
            
            day_plan = {
                "day": d,
                "theme": f"Day {d}: {att1['name']} & Highlights of {dest}",
                "morning": [
                    {
                        "time": "09:00 AM",
                        "activity": f"Hotel Check-in & Morning Refreshment",
                        "location": f"Central {dest}",
                        "duration": "1.5 hrs",
                        "cost_estimate": 0,
                        "description": "Start the day with a relaxed breakfast and get ready for city exploration.",
                        "tips": "Keep hotel booking details easily accessible."
                    } if d == 1 else {
                        "time": "09:00 AM",
                        "activity": att1.get("name", f"Morning Exploration in {dest}"),
                        "location": "Historic Center",
                        "duration": "2.5 hrs",
                        "cost_estimate": 600,
                        "description": f"Immerse yourself in {att1.get('name')}. Experience the local architecture, heritage, and photography spots.",
                        "tips": "Arrive early to avoid peak ticket counter queues."
                    }
                ],
                "afternoon": [
                    {
                        "time": "01:30 PM",
                        "activity": f"Local Lunch & Rest Break",
                        "location": "Old Town Market Square",
                        "duration": "1.5 hrs",
                        "cost_estimate": 800,
                        "description": "Savor authentic regional cuisine at a highly-rated local bistro.",
                        "tips": "Try the recommended seasonal chef's special."
                    },
                    {
                        "time": "03:30 PM",
                        "activity": att2.get("name", f"Cultural Discovery in {dest}"),
                        "location": "Museum Quarter",
                        "duration": "2.0 hrs",
                        "cost_estimate": 1000,
                        "description": f"Discover {att2.get('name')}. Explore interactive exhibits and iconic galleries.",
                        "tips": "Audio guides are available at the main entrance."
                    }
                ],
                "evening": [
                    {
                        "time": "06:30 PM",
                        "activity": f"Sunset Promenade & Evening Stroll",
                        "location": "Waterfront / City Boulevard",
                        "duration": "1.5 hrs",
                        "cost_estimate": 0,
                        "description": f"Enjoy scenic twilight views and the evening vibe of {dest}.",
                        "tips": "Great lighting for memorable travel photos."
                    },
                    {
                        "time": "08:00 PM",
                        "activity": "Dinner & Night Market Exploration",
                        "location": "Arts District",
                        "duration": "2.0 hrs",
                        "cost_estimate": 1400,
                        "description": "Experience local night markets and dining under city lights.",
                        "tips": "Reservations recommended for peak dinner hours."
                    }
                ],
                "meals": [
                    {"type": "Breakfast", "recommendation": "Artisan Bakery & Cafe", "estimated_cost": 400},
                    {"type": "Lunch", "recommendation": "Local Heritage Bistro", "estimated_cost": 900},
                    {"type": "Dinner", "recommendation": "Atmospheric Izakaya / Dining Room", "estimated_cost": 1600}
                ],
                "transport": [
                    {"route": "Hotel to Historic Center", "mode": "Metro Rail", "estimated_time": "15 mins", "cost": 150},
                    {"route": "Afternoon Spot to Evening District", "mode": "Taxi / Walk", "estimated_time": "20 mins", "cost": 250}
                ],
                "estimated_activity_time": "6.0 hrs",
                "notes": [f"Mid-day rest period allocated at 3:00 PM to ensure comfortable pacing for {state.travel_type} travelers."]
            }
            days_list.append(day_plan)

        return {"days": days_list}
