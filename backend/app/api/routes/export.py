from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Trip, Itinerary
from app.services.pdf_service import PDFGuideGenerator

router = APIRouter(prefix="/trips", tags=["Export & Downloads"])

@router.get("/{trip_id}/export/pdf")
def export_trip_pdf(trip_id: str, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found.")

    itinerary = db.query(Itinerary).filter(Itinerary.trip_id == trip.id).order_by(Itinerary.version.desc()).first()
    if not itinerary:
        raise HTTPException(status_code=400, detail="Itinerary must be generated before exporting PDF.")

    pdf_bytes = PDFGuideGenerator.generate_pdf(itinerary.content)
    
    filename = f"MyTrip_Travel_Guide_{trip.destination.replace(' ', '_')}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
