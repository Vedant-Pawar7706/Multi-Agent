from typing import Dict, Any
from app.agents.state import TravelPlanningState
from app.agents.tools.calculator import FinancialCalculator
from app.agents.tools.currency_converter import CurrencyConverterTool

class BudgetAgent:
    """
    AGENT 3 — BUDGET AGENT
    Role: Travel financial planner.
    Uses the FinancialCalculator tool to perform strict mathematical calculations.
    Generates category breakdowns, budget comparison tiers (Budget, Comfort, Premium), per-person & daily metrics.
    """
    def __init__(self):
        self.calculator = FinancialCalculator()
        self.currency_tool = CurrencyConverterTool()

    async def run(self, state: TravelPlanningState) -> Dict[str, Any]:
        state.status = "budget"
        state.log("Budget Agent", f"Calculating financial budget model for {state.destination} (Budget: {state.currency} {state.budget:,.2f})...")

        # 1. Execute deterministic tool math
        calc_result = self.calculator.calculate_budget(
            total_budget=state.budget,
            duration_days=state.duration_days,
            travelers=state.travelers,
            travel_style=state.travel_style
        )

        b = calc_result["breakdown"]

        output = {
            "currency": state.currency,
            "currency_symbol": self.currency_tool.get_symbol(state.currency),
            "disclaimer": "Estimated prices — actual prices may vary based on seasonal availability and real-time booking rates.",
            "user_budget": state.budget,
            "estimated_total": calc_result["total_budget"],
            "per_person_cost": calc_result["per_person"],
            "daily_average_cost": calc_result["daily_average"],
            "per_person_daily": calc_result["per_person_daily"],
            "budget": {
                "flights": b["flights"],
                "hotel": b["hotel"],
                "food": b["food"],
                "transport": b["transport"],
                "activities": b["activities"],
                "shopping": b["shopping"],
                "miscellaneous": b["miscellaneous"],
                "emergency_buffer": b["emergency_buffer"],
                "total": calc_result["total_budget"],
                "per_person": calc_result["per_person"]
            },
            "category_percentages": {
                "flights": "35%",
                "hotel": "28%",
                "food": "15%",
                "transport": "7%",
                "activities": "7%",
                "shopping": "3%",
                "miscellaneous": "2%",
                "emergency_buffer": "3%"
            },
            "budget_tiers": calc_result["tiers"],
            "cost_saving_opportunities": [
                f"Book flights at least 45 days in advance for up to 25% savings.",
                f"Utilize multi-day metro passes in {state.destination} instead of single taxi rides.",
                f"Combine major sight entrance tickets with a unified tourist city pass.",
                f"Enjoy lunch specials at fine dining spots which offer similar menus to dinner at 40% lower prices."
            ]
        }

        state.budget_result = output
        state.log("Budget Agent", f"Financial analysis complete. Per-person trip estimate: {state.currency} {calc_result['per_person']:,.2f}.")
        return output
