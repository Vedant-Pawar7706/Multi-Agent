import datetime
import uuid
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    trips = relationship("Trip", back_populates="user", cascade="all, delete-orphan")
    saved_trips = relationship("SavedTrip", back_populates="user", cascade="all, delete-orphan")

class Trip(Base):
    __tablename__ = "trips"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    destination = Column(String, nullable=False)
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    duration_days = Column(Integer, default=5)
    travelers = Column(Integer, default=2)
    travel_type = Column(String, default="Couple")  # Solo, Couple, Family, Friends
    travel_style = Column(String, default="Balanced") # Budget, Balanced, Luxury, etc.
    budget = Column(Float, default=100000.0)
    currency = Column(String, default="INR")
    interests = Column(JSON, default=list) # ["History", "Food", ...]
    preferences = Column(JSON, default=dict) # hotel_pref, food_pref, mobility, pacing, etc.
    status = Column(String, default="draft") # draft, planning, completed, failed
    is_public = Column(Boolean, default=False)
    share_code = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="trips")
    agent_runs = relationship("AgentRun", back_populates="trip", cascade="all, delete-orphan")
    itineraries = relationship("Itinerary", back_populates="trip", cascade="all, delete-orphan")

class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(String, primary_key=True, default=generate_uuid)
    trip_id = Column(String, ForeignKey("trips.id"), nullable=False)
    agent_name = Column(String, nullable=False) # research, activity, budget, final
    status = Column(String, default="waiting") # waiting, running, completed, failed, retrying
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    execution_time = Column(Float, default=0.0) # in seconds
    output = Column(JSON, nullable=True)
    error = Column(Text, nullable=True)

    trip = relationship("Trip", back_populates="agent_runs")

class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(String, primary_key=True, default=generate_uuid)
    trip_id = Column(String, ForeignKey("trips.id"), nullable=False)
    version = Column(Integer, default=1)
    content = Column(JSON, nullable=False) # Full structured output from Final Agent
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    trip = relationship("Trip", back_populates="itineraries")

class SavedTrip(Base):
    __tablename__ = "saved_trips"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    trip_id = Column(String, ForeignKey("trips.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="saved_trips")
    trip = relationship("Trip")
