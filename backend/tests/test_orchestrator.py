import pytest
from app.agents.state import TravelPlanningState
from app.agents.orchestrator import AgentOrchestrator

@pytest.mark.asyncio
async def test_full_pipeline_execution():
    state = TravelPlanningState(
        trip_id="test-pipeline-1",
        destination="Dubai, UAE",
        travelers=2,
        duration_days=4,
        budget=120000.0,
        currency="AED"
    )
    orchestrator = AgentOrchestrator()
    final_guide = await orchestrator.execute_pipeline(state)
    
    assert final_guide is not None
    assert state.status == "completed"
    assert "itinerary" in final_guide
    assert "budget_breakdown" in final_guide
    assert "packing_checklist" in final_guide
