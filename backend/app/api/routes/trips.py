import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Trip, User, SavedTrip, Itinerary, AgentRun
from app.schemas.schemas import TripCreate, TripUpdate, TripResponse
from app.api.routes.auth import get_current_user

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.post("", response_model=TripResponse)
def create_trip(
    payload: TripCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    trip = Trip(
        id=str(uuid.uuid4()),
        user_id=current_user.id if current_user else None,
        destination=payload.destination,
        start_date=payload.start_date,
        end_date=payload.end_date,
        duration_days=payload.duration_days or 5,
        travelers=payload.travelers,
        travel_type=payload.travel_type,
        travel_style=payload.travel_style,
        interests=payload.interests,
        budget=payload.budget,
        currency=payload.currency,
        preferences=payload.preferences.model_dump() if payload.preferences else {},
        status="draft",
        share_code=str(uuid.uuid4())[:8]
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return TripResponse.model_validate(trip)

@router.get("", response_model=List[TripResponse])
def get_trips(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    if current_user:
        trips = db.query(Trip).filter(Trip.user_id == current_user.id).order_by(Trip.created_at.desc()).all()
    else:
        trips = db.query(Trip).order_by(Trip.created_at.desc()).limit(10).all()
    return [TripResponse.model_validate(t) for t in trips]

@router.get("/{trip_id}", response_model=TripResponse)
def get_trip_by_id(trip_id: str, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found.")
    return TripResponse.model_validate(trip)

@router.put("/{trip_id}", response_model=TripResponse)
def update_trip(trip_id: str, payload: TripUpdate, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found.")
    
    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        if val is not None:
            setattr(trip, field, val)
            
    db.commit()
    db.refresh(trip)
    return TripResponse.model_validate(trip)

@router.delete("/{trip_id}")
def delete_trip(trip_id: str, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found.")
    db.delete(trip)
    db.commit()
    return {"message": "Trip successfully deleted."}

@router.post("/{trip_id}/share")
def toggle_share(trip_id: str, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found.")
    trip.is_public = not trip.is_public
    if not trip.share_code:
        trip.share_code = str(uuid.uuid4())[:8]
    db.commit()
    return {"is_public": trip.is_public, "share_url": f"/trip/share/{trip.share_code}"}

@router.get("/share/{share_code}")
def get_shared_trip(share_code: str, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.share_code == share_code, Trip.is_public == True).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Shared trip not found or private.")
    
    itinerary = db.query(Itinerary).filter(Itinerary.trip_id == trip.id).order_by(Itinerary.version.desc()).first()
    return {
        "trip": TripResponse.model_validate(trip),
        "itinerary": itinerary.content if itinerary else None
    }
