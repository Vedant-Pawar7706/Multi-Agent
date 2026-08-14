from app.services.pdf_service import PDFGuideGenerator

def test_pdf_generation():
    dummy_data = {
        "meta": {
            "destination": "Rome, Italy",
            "duration_days": 5,
            "travelers": 2,
            "currency_symbol": "€",
            "estimated_cost": 2500.0
        },
        "trip_overview": "A wonderful Italian getaway.",
        "destination_snapshot": {"overview": "Historic capital.", "best_time_to_visit": "Spring"},
        "itinerary": [
            {
                "day": 1,
                "theme": "Arrival & Colosseum",
                "morning": [{"time": "09:00", "activity": "Colosseum Tour", "location": "Piazza del Colosseo", "duration": "2.5 hrs"}],
                "afternoon": [],
                "evening": []
            }
        ],
        "budget_breakdown": {"budget": {"flights": 800, "hotel": 1000, "food": 400, "transport": 100, "activities": 200, "total": 2500}},
        "packing_checklist": [{"category": "Essentials", "items": ["Passport"]}]
    }
    
    pdf_bytes = PDFGuideGenerator.generate_pdf(dummy_data)
    assert len(pdf_bytes) > 500
    assert pdf_bytes.startswith(b"%PDF")
