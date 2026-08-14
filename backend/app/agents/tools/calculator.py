import math
from typing import Dict, Any, List

class FinancialCalculator:
    """
    Deterministic Financial Calculator for Travel Planning.
    Computes exact trip budgets, per-person costs, daily averages, tier ratios, and category allocation.
    """
    
    @staticmethod
    def calculate_budget(
        total_budget: float,
        duration_days: int,
        travelers: int,
        travel_style: str = "Balanced"
    ) -> Dict[str, Any]:
        """
        Calculates category breakdown and tier comparisons using exact mathematical formulas.
        """
        days = max(1, duration_days)
        people = max(1, travelers)
        
        # Base category weightings depending on travel style
        style_lower = travel_style.lower()
        if "budget" in style_lower or "backpacking" in style_lower:
            weights = {"flights": 0.38, "hotel": 0.22, "food": 0.15, "transport": 0.08, "activities": 0.07, "shopping": 0.04, "miscellaneous": 0.02, "emergency_buffer": 0.04}
        elif "luxury" in style_lower:
            weights = {"flights": 0.30, "hotel": 0.35, "food": 0.16, "transport": 0.07, "activities": 0.06, "shopping": 0.03, "miscellaneous": 0.01, "emergency_buffer": 0.02}
        else: # Balanced / Comfort default
            weights = {"flights": 0.35, "hotel": 0.28, "food": 0.15, "transport": 0.07, "activities": 0.07, "shopping": 0.03, "miscellaneous": 0.02, "emergency_buffer": 0.03}
            
        breakdown = {}
        for category, ratio in weights.items():
            breakdown[category] = round(total_budget * ratio, 2)
            
        per_person = round(total_budget / people, 2)
        daily_average = round(total_budget / days, 2)
        per_person_daily = round(total_budget / (people * days), 2)
        
        # Calculate Tiers
        budget_tier_total = round(total_budget * 0.65, 2)
        comfort_tier_total = round(total_budget, 2)
        premium_tier_total = round(total_budget * 1.55, 2)
        
        tiers = {
            "Budget": {
                "total": budget_tier_total,
                "per_person": round(budget_tier_total / people, 2),
                "daily_average": round(budget_tier_total / days, 2),
                "description": "Smart savings with hostels/guesthouses, street food, and local buses/metros."
            },
            "Comfort": {
                "total": comfort_tier_total,
                "per_person": per_person,
                "daily_average": daily_average,
                "description": "3-4 Star boutique hotels, combination of local dining & famous spots, taxis."
            },
            "Premium": {
                "total": premium_tier_total,
                "per_person": round(premium_tier_total / people, 2),
                "daily_average": round(premium_tier_total / days, 2),
                "description": "5-Star luxury resorts, fine dining, private transfers, exclusive guided tours."
            }
        }
        
        return {
            "total_budget": total_budget,
            "duration_days": days,
            "travelers": people,
            "per_person": per_person,
            "daily_average": daily_average,
            "per_person_daily": per_person_daily,
            "breakdown": breakdown,
            "tiers": tiers
        }
