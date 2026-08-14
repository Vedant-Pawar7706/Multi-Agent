from typing import Dict, Any, List, Optional
import datetime

class TravelPlanningState:
    """
    Structured multi-agent state object passed across Research, Activity, Budget, and Final Agents.
    """
    def __init__(
        self,
        trip_id: str,
        destination: str,
        travelers: int = 2,
        duration_days: int = 5,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        travel_type: str = "Couple",
        travel_style: str = "Balanced",
        budget: float = 100000.0,
        currency: str = "INR",
        interests: Optional[List[str]] = None,
        preferences: Optional[Dict[str, Any]] = None,
        custom_instructions: Optional[str] = None
    ):
        self.trip_id = trip_id
        self.destination = destination
        self.travelers = travelers
        self.duration_days = duration_days
        self.start_date = start_date or "2026-09-10"
        self.end_date = end_date or "2026-09-15"
        self.travel_type = travel_type
        self.travel_style = travel_style
        self.budget = budget
        self.currency = currency
        self.interests = interests or ["Culture", "Food", "Sightseeing"]
        self.preferences = preferences or {}
        self.custom_instructions = custom_instructions

        # Agent Intermediate & Final Results
        self.research_result: Optional[Dict[str, Any]] = None
        self.itinerary_result: Optional[Dict[str, Any]] = None
        self.budget_result: Optional[Dict[str, Any]] = None
        self.validation_result: Optional[Dict[str, Any]] = None
        self.final_result: Optional[Dict[str, Any]] = None

        # Tracking state execution
        self.errors: List[str] = []
        self.status: str = "initialized" # initialized, research, activity, budget, final, validation, completed, failed
        self.logs: List[Dict[str, Any]] = []

    def log(self, agent_name: str, message: str, level: str = "INFO"):
        entry = {
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "agent": agent_name,
            "message": message,
            "level": level
        }
        self.logs.append(entry)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "trip_id": self.trip_id,
            "destination": self.destination,
            "travelers": self.travelers,
            "duration_days": self.duration_days,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "travel_type": self.travel_type,
            "travel_style": self.travel_style,
            "budget": self.budget,
            "currency": self.currency,
            "interests": self.interests,
            "preferences": self.preferences,
            "status": self.status,
            "errors": self.errors,
            "has_research": self.research_result is not None,
            "has_itinerary": self.itinerary_result is not None,
            "has_budget": self.budget_result is not None,
            "has_final": self.final_result is not None
        }
