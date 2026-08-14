from typing import List, Dict, Any, Optional
from pydantic import BaseModel, EmailStr, Field

# User Schemas
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: Any

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Trip Schemas
class TripPreferences(BaseModel):
    hotel_preference: Optional[str] = "3-4 Star"
    food_preference: Optional[str] = "Local & Authentic"
    mobility: Optional[str] = "Normal Walking"
    preferred_transport: Optional[str] = "Public Transport & Taxis"
    pacing: Optional[str] = "Balanced" # Slow, Balanced, Fast
    wake_up: Optional[str] = "Moderate (8:30 AM)"
    notes: Optional[str] = None

class TripCreate(BaseModel):
    destination: str
    start_date: Optional[str] = "2026-09-10"
    end_date: Optional[str] = "2026-09-17"
    duration_days: Optional[int] = 7
    travelers: int = 2
    travel_type: str = "Couple" # Solo, Couple, Family, Friends
    travel_style: str = "Balanced" # Budget, Balanced, Luxury, Backpacking, Adventure
    interests: List[str] = Field(default_factory=lambda: ["Culture", "Food", "Sightseeing"])
    budget: float = 150000.0
    currency: str = "INR"
    preferences: Optional[TripPreferences] = Field(default_factory=TripPreferences)

class TripUpdate(BaseModel):
    destination: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    duration_days: Optional[int] = None
    travelers: Optional[int] = None
    travel_type: Optional[str] = None
    travel_style: Optional[str] = None
    interests: Optional[List[str]] = None
    budget: Optional[float] = None
    currency: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

class TripResponse(BaseModel):
    id: str
    user_id: Optional[str]
    destination: str
    start_date: Optional[str]
    end_date: Optional[str]
    duration_days: int
    travelers: int
    travel_type: str
    travel_style: str
    budget: float
    currency: str
    interests: List[str]
    preferences: Dict[str, Any]
    status: str
    is_public: bool
    share_code: Optional[str]
    created_at: Any
    updated_at: Any

    class Config:
        from_attributes = True

# Agent Execution & Status Schemas
class AgentStatusResponse(BaseModel):
    id: str
    agent_name: str
    status: str # waiting, running, completed, failed, retrying
    started_at: Optional[Any] = None
    completed_at: Optional[Any] = None
    execution_time: float = 0.0
    output_summary: Optional[str] = None
    error: Optional[str] = None

class AICommandRequest(BaseModel):
    command: str # e.g. "Make day 3 less crowded", "Replace expensive dinners with budget street food"

class PlanResponse(BaseModel):
    trip_id: str
    status: str
    agent_runs: List[AgentStatusResponse]
    itinerary: Optional[Dict[str, Any]] = None
