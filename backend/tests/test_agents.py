import pytest
from app.agents.state import TravelPlanningState
from app.agents.tools.calculator import FinancialCalculator
from app.agents.tools.currency_converter import CurrencyConverterTool
from app.agents.research_agent import ResearchAgent
from app.agents.budget_agent import BudgetAgent

def test_financial_calculator():
    calc = FinancialCalculator.calculate_budget(
        total_budget=150000.0,
        duration_days=7,
        travelers=2,
        travel_style="Balanced"
    )
    assert calc["total_budget"] == 150000.0
    assert calc["per_person"] == 75000.0
    assert "Budget" in calc["tiers"]
    assert "Comfort" in calc["tiers"]
    assert "Premium" in calc["tiers"]

def test_currency_converter():
    inr_symbol = CurrencyConverterTool.get_symbol("INR")
    assert inr_symbol == "₹"
    converted = CurrencyConverterTool.convert(100, "USD", "INR")
    assert converted > 5000

@pytest.mark.asyncio
async def test_budget_agent():
    state = TravelPlanningState(
        trip_id="test-123",
        destination="Paris, France",
        travelers=2,
        duration_days=5,
        budget=100000.0,
        currency="EUR"
    )
    agent = BudgetAgent()
    res = await agent.run(state)
    assert res["currency"] == "EUR"
    assert res["user_budget"] == 100000.0
    assert state.budget_result is not None
