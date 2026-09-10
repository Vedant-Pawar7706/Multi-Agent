import asyncio
import time
from typing import Dict, Any, Callable, Optional
from app.agents.state import TravelPlanningState
from app.agents.research_agent import ResearchAgent
from app.agents.activity_agent import ActivityAgent
from app.agents.budget_agent import BudgetAgent
from app.agents.final_agent import FinalAgent

class AgentOrchestrator:
    """
    Multi-Agent Orchestrator Pipeline for MyTrip.
    Executes Research -> Activity -> Budget -> Final Validator sequentially with real-time status callbacks.
    Supports smart selective re-execution when natural language AI commands are issued.
    """
    def __init__(self):
        self.research_agent = ResearchAgent()
        self.activity_agent = ActivityAgent()
        self.budget_agent = BudgetAgent()
        self.final_agent = FinalAgent()

    async def execute_pipeline(
        self,
        state: TravelPlanningState,
        status_callback: Optional[Callable[[Dict[str, Any]], None]] = None
    ) -> Dict[str, Any]:
        """
        Full 4-Agent Sequential Pipeline
        """
        async def notify(event: str, agent_name: str, status: str, message: str, execution_time: float = 0.0, output: Optional[Dict[str, Any]] = None):
            payload = {
                "event": event,
                "agent": agent_name,
                "status": status,
                "message": message,
                "execution_time": execution_time,
                "output": output,
                "trip_id": state.trip_id
            }
            if status_callback:
                if asyncio.iscoroutinefunction(status_callback):
                    await status_callback(payload)
                else:
                    status_callback(payload)

        try:
            # ----------------------------------------------------
            # 1. RESEARCH AGENT
            # ----------------------------------------------------
            start_t = time.time()
            await notify("agent_started", "research", "running", f"Gathering destination intelligence for {state.destination}...")
            await self.research_agent.run(state)
            exec_t_1 = round(time.time() - start_t, 2)
            await notify("agent_completed", "research", "completed", f"Destination intelligence gathered successfully.", exec_t_1, state.research_result)

            # ----------------------------------------------------
            # 2. ACTIVITY AGENT
            # ----------------------------------------------------
            start_t = time.time()
            await notify("agent_started", "activity", "running", f"Building personalized {state.duration_days}-day itinerary...")
            await self.activity_agent.run(state)
            exec_t_2 = round(time.time() - start_t, 2)
            await notify("agent_completed", "activity", "completed", f"Daily itinerary generated.", exec_t_2, state.itinerary_result)

            # ----------------------------------------------------
            # 3. BUDGET AGENT
            # ----------------------------------------------------
            start_t = time.time()
            await notify("agent_started", "budget", "running", f"Calculating financial trip estimates ({state.currency} {state.budget:,.2f})...")
            await self.budget_agent.run(state)
            exec_t_3 = round(time.time() - start_t, 2)
            await notify("agent_completed", "budget", "completed", f"Financial budget calculation complete.", exec_t_3, state.budget_result)

            # ----------------------------------------------------
            # 4. FINAL WRITER & VALIDATOR AGENT
            # ----------------------------------------------------
            start_t = time.time()
            await notify("agent_started", "final", "running", "Validating constraints and compiling master travel guide...")
            await self.final_agent.run(state)
            exec_t_4 = round(time.time() - start_t, 2)
            await notify("agent_completed", "final", "completed", "Master travel guide successfully created.", exec_t_4, state.final_result)

            await notify("planning_completed", "orchestrator", "completed", "Your travel guide is ready!", 0.0, state.final_result)
            return state.final_result

        except Exception as e:
            state.status = "failed"
            state.errors.append(str(e))
            state.log("Orchestrator", f"Pipeline failed: {e}", level="ERROR")
            await notify("agent_failed", "orchestrator", "failed", f"Planning pipeline encountered an error: {e}")
            raise e

    async def execute_command(
        self,
        state: TravelPlanningState,
        command: str,
        status_callback: Optional[Callable[[Dict[str, Any]], None]] = None
    ) -> Dict[str, Any]:
        """
        Executes natural language edits intelligently by identifying which agent needs to re-run.
        """
        cmd_lower = command.lower()
        state.custom_instructions = command

        async def notify(agent_name: str, message: str):
            payload = {"event": "agent_progress", "agent": agent_name, "message": message, "trip_id": state.trip_id}
            if status_callback:
                if asyncio.iscoroutinefunction(status_callback):
                    await status_callback(payload)
                else:
                    status_callback(payload)

        # Determine target agents based on natural language analysis
        if "budget" in cmd_lower or "price" in cmd_lower or "cheap" in cmd_lower or "cost" in cmd_lower:
            await notify("budget", f"Re-calculating budget for command: '{command}'...")
            await self.budget_agent.run(state)
            await notify("final", "Updating final travel guide...")
            await self.final_agent.run(state)

        elif "day" in cmd_lower or "itinerary" in cmd_lower or "pace" in cmd_lower or "crowd" in cmd_lower or "relax" in cmd_lower:
            await notify("activity", f"Re-planning itinerary for command: '{command}'...")
            await self.activity_agent.run(state)
            await notify("final", "Updating final travel guide...")
            await self.final_agent.run(state)

        else:
            # Default: Re-run activity & final
            await notify("activity", f"Processing instruction: '{command}'...")
            await self.activity_agent.run(state)
            await notify("final", "Updating final travel guide...")
            await self.final_agent.run(state)

        return state.final_result
