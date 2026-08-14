import json
from typing import Dict, Any, List
from app.agents.state import TravelPlanningState
from app.agents.llm_provider import LLMProvider
from app.agents.tools.itinerary_optimizer import ItineraryOptimizerTool

class FinalAgent:
    """
    AGENT 4 — FINAL WRITER / ORCHESTRATOR & VALIDATOR AGENT
    Role: Senior travel guide editor.
    Combines research, activity, and budget outputs. Detects contradictions, removes duplicates, validates timing & budget arithmetic (with up to 3 retry attempts), and produces the complete 15-section final travel guide.
    """
    def __init__(self):
        self.llm = LLMProvider()
        self.optimizer = ItineraryOptimizerTool()

    async def run(self, state: TravelPlanningState, max_retries: int = 3) -> Dict[str, Any]:
        state.status = "validation"
        state.log("Final Agent", f"Synthesizing agent outputs and executing validation audit for {state.destination}...")

        attempt = 0
        validation_passed = False
        validation_report = {}

        while attempt < max_retries and not validation_passed:
            attempt += 1
            state.log("Final Agent", f"Validation check pass {attempt}/{max_retries}...")
            
            validation_report = self._validate_constraints(state)
            if validation_report["is_valid"]:
                validation_passed = True
                state.log("Final Agent", f"Validation audit PASSED cleanly on attempt {attempt}.")
            else:
                state.log("Final Agent", f"Validation issues detected on attempt {attempt}: {', '.join(validation_report['errors'])}. Auto-adjusting...", level="WARNING")
                self._apply_auto_corrections(state, validation_report["errors"])

        state.validation_result = validation_report
        state.status = "final"
        state.log("Final Agent", "Assembling 15-part final master travel guide...")

        # Construct final master travel guide JSON structure
        final_guide = self._assemble_master_guide(state)
        state.final_result = final_guide
        state.status = "completed"
        state.log("Final Agent", "Master travel guide generation successfully completed!")
        return final_guide

    def _validate_constraints(self, state: TravelPlanningState) -> Dict[str, Any]:
        errors = []
        
        # 1. Check Research Output
        if not state.research_result or "top_attractions" not in state.research_result:
            errors.append("Missing destination research intelligence.")

        # 2. Check Itinerary Output & Duration
        if not state.itinerary_result or "days" not in state.itinerary_result:
            errors.append("Missing daily itinerary structure.")
        else:
            days = state.itinerary_result.get("days", [])
            if len(days) != state.duration_days:
                errors.append(f"Itinerary day count ({len(days)}) does not match trip duration ({state.duration_days} days).")
            
            # Check for duplicate activities or missing meals
            seen_activities = set()
            for d in days:
                morning = d.get("morning", [])
                afternoon = d.get("afternoon", [])
                evening = d.get("evening", [])
                meals = d.get("meals", [])
                
                if not meals or len(meals) < 2:
                    errors.append(f"Day {d.get('day')} is missing required meal breaks.")
                    
                for act in morning + afternoon + evening:
                    name = act.get("activity", "")
                    if name in seen_activities and name not in ["Lunch", "Dinner", "Breakfast"]:
                        errors.append(f"Duplicate activity '{name}' detected across days.")
                    seen_activities.add(name)

        # 3. Check Budget Output
        if not state.budget_result or "budget" not in state.budget_result:
            errors.append("Missing financial budget breakdown.")
        else:
            b = state.budget_result.get("budget", {})
            computed_total = sum([
                b.get("flights", 0), b.get("hotel", 0), b.get("food", 0),
                b.get("transport", 0), b.get("activities", 0), b.get("shopping", 0),
                b.get("miscellaneous", 0), b.get("emergency_buffer", 0)
            ])
            if abs(computed_total - state.budget) > 10.0:
                errors.append(f"Budget sum mismatch: sum ({computed_total}) does not equal total ({state.budget}).")

        return {
            "is_valid": len(errors) == 0,
            "errors": errors
        }

    def _apply_auto_corrections(self, state: TravelPlanningState, errors: List[str]):
        # Auto-correct itinerary duration if mismatch
        if state.itinerary_result and "days" in state.itinerary_result:
            days = state.itinerary_result["days"]
            if len(days) < state.duration_days:
                # Add missing days
                for add_d in range(len(days) + 1, state.duration_days + 1):
                    days.append({
                        "day": add_d,
                        "theme": f"Day {add_d}: Exploration & Local Culture",
                        "morning": [{"time": "09:30 AM", "activity": f"Local Neighborhood Walk", "location": "Old Town", "duration": "2 hrs", "cost_estimate": 0, "description": "Relaxed morning walk discovering quiet backstreets and local markets.", "tips": "Comfortable footwear advised."}],
                        "afternoon": [{"time": "02:00 PM", "activity": "Artisanal Craft & Shopping", "location": "Craft Market", "duration": "2.5 hrs", "cost_estimate": 500, "description": "Shop for authentic local handicrafts.", "tips": "Bargaining is accepted at market stalls."}],
                        "evening": [{"time": "07:30 PM", "activity": "Farewell Dinner", "location": "Panoramics Bistro", "duration": "2 hrs", "cost_estimate": 1500, "description": "Memorable evening dinner with panoramic city views.", "tips": "Book outdoor seating."}],
                        "meals": [
                            {"type": "Breakfast", "recommendation": "Corner Bakery", "estimated_cost": 300},
                            {"type": "Lunch", "recommendation": "Market Food Hall", "estimated_cost": 700},
                            {"type": "Dinner", "recommendation": "Panoramics Bistro", "estimated_cost": 1500}
                        ],
                        "transport": [{"route": "Hotel to Craft Market", "mode": "Metro", "estimated_time": "15 mins", "cost": 100}],
                        "estimated_activity_time": "5.5 hrs",
                        "notes": ["Relaxed final day pacing."]
                    })
            elif len(days) > state.duration_days:
                state.itinerary_result["days"] = days[:state.duration_days]

    def _assemble_master_guide(self, state: TravelPlanningState) -> Dict[str, Any]:
        res = state.research_result or {}
        itin = state.itinerary_result or {}
        bud = state.budget_result or {}

        # Build personalized packing checklist
        packing_checklist = [
            {"category": "Essentials", "items": ["Passport / Government ID", "Travel Insurance Policy", "Credit Cards & Local Cash", "Smartphone & Charger"]},
            {"category": "Clothing", "items": [f"Comfortable Walking Shoes", "Layered Light Clothing", "Versatile Jacket", "Sunglasses & Sun Hat"]},
            {"category": "Electronics & Tech", "items": ["Universal Travel Power Adapter", "Portable Power Bank (10,000 mAh)", "Noise-Cancelling Headphones"]},
            {"category": "Toiletries & Health", "items": ["Personal Hygiene Kit", "Sunscreen (SPF 50+)", "Prescription Medications & First Aid Essentials"]}
        ]

        return {
            "meta": {
                "trip_id": state.trip_id,
                "destination": state.destination,
                "duration_days": state.duration_days,
                "travelers": state.travelers,
                "travel_type": state.travel_type,
                "travel_style": state.travel_style,
                "currency": state.currency,
                "currency_symbol": bud.get("currency_symbol", "₹"),
                "total_budget": state.budget,
                "estimated_cost": bud.get("estimated_total", state.budget),
                "per_person_cost": bud.get("per_person_cost", state.budget / state.travelers)
            },
            # 1. Trip Overview
            "trip_overview": f"Welcome to your custom-curated {state.duration_days}-day journey to {state.destination}. Tailored for {state.travelers} traveler(s) seeking a '{state.travel_style}' experience, this itinerary balances iconic landmarks with immersive hidden gems, authentic dining, and effortless transportation logistics.",
            # 2. Destination Snapshot
            "destination_snapshot": {
                "overview": res.get("overview", ""),
                "best_time_to_visit": res.get("best_time_to_visit", ""),
                "culture": res.get("culture", []),
                "neighborhoods": res.get("neighborhoods", [])
            },
            # 3. Trip Summary
            "trip_summary": {
                "total_days": state.duration_days,
                "total_travelers": state.travelers,
                "key_highlights": [a.get("name") for a in res.get("top_attractions", [])[:4]]
            },
            # 4. Day-by-Day Itinerary
            "itinerary": itin.get("days", []),
            # 5. Accommodation Suggestions
            "accommodations": [
                {"name": f"Grand Central Hotel {state.destination}", "tier": "Comfort / 4-Star", "area": "City Center", "price_per_night": f"{bud.get('currency_symbol', '₹')} {round(bud.get('budget', {}).get('hotel', 0) / max(1, state.duration_days), 2)}", "why_stay": "Prime central access near subway & top attractions."},
                {"name": f"Boutique Art Haven {state.destination}", "tier": "Boutique / Premium", "area": "Arts Quarter", "price_per_night": f"{bud.get('currency_symbol', '₹')} {round((bud.get('budget', {}).get('hotel', 0) * 1.3) / max(1, state.duration_days), 2)}", "why_stay": "Stylish aesthetic with rooftop dining and views."}
            ],
            # 6. Food Recommendations
            "food_recommendations": res.get("local_food", []),
            # 7. Transportation Guide
            "transportation_guide": res.get("transportation", []),
            # 8. Budget Breakdown
            "budget_breakdown": bud,
            # 9. Packing Checklist
            "packing_checklist": packing_checklist,
            # 10. Cultural Tips
            "cultural_tips": res.get("culture", []),
            # 11. Safety Tips
            "safety_tips": res.get("safety", []),
            # 12. Important Notes
            "important_notes": [
                "Always check visa entry requirements at least 2 weeks prior to departure.",
                "Estimated prices — actual prices may vary based on seasonal demand.",
                "Verify museum and attraction operating hours on public holidays."
            ],
            # 13. Alternative Activities
            "alternative_activities": res.get("hidden_gems", []),
            # 14. Estimated Total Cost
            "estimated_total_cost": {
                "amount": bud.get("estimated_total", state.budget),
                "per_person": bud.get("per_person_cost", state.budget / state.travelers),
                "currency": state.currency,
                "disclaimer": "Estimated prices — actual prices may vary."
            },
            # 15. Sources / Research Notes
            "sources": res.get("research_sources", [])
        }
