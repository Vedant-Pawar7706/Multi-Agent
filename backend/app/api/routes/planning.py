import json
import asyncio
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, BackgroundTasks
from sqlalchemy.orm import Session
from app.database.session import get_db, SessionLocal
from app.database.models import Trip, Itinerary, AgentRun
from app.schemas.schemas import AICommandRequest, PlanResponse, AgentStatusResponse
from app.agents.state import TravelPlanningState
from app.agents.orchestrator import AgentOrchestrator

router = APIRouter(prefix="/trips", tags=["Agent Planning Pipeline"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, trip_id: str, websocket: WebSocket):
        await websocket.accept()
        if trip_id not in self.active_connections:
            self.active_connections[trip_id] = []
        self.active_connections[trip_id].append(websocket)

    def disconnect(self, trip_id: str, websocket: WebSocket):
        if trip_id in self.active_connections:
            if websocket in self.active_connections[trip_id]:
                self.active_connections[trip_id].remove(websocket)

    async def broadcast(self, trip_id: str, message: dict):
        if trip_id in self.active_connections:
            for connection in self.active_connections[trip_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

manager = ConnectionManager()
orchestrator = AgentOrchestrator()

@router.websocket("/{trip_id}/ws")
@router.websocket("/ws/{trip_id}")
async def websocket_endpoint(websocket: WebSocket, trip_id: str):
    await manager.connect(trip_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(trip_id, websocket)

async def _run_pipeline_background(trip_id: str, state: TravelPlanningState):
    db = SessionLocal()
    try:
        trip = db.query(Trip).filter(Trip.id == trip_id).first()
        if not trip:
            return

        async def ws_callback(event_data: dict):
            await manager.broadcast(trip.id, event_data)
            agent_name = event_data.get("agent", "")
            status = event_data.get("status", "")
            exec_t = event_data.get("execution_time", 0.0)
            output = event_data.get("output", {})

            if agent_name and agent_name != "orchestrator":
                run = db.query(AgentRun).filter(AgentRun.trip_id == trip.id, AgentRun.agent_name == agent_name).first()
                if not run:
                    run = AgentRun(trip_id=trip.id, agent_name=agent_name, status=status)
                    db.add(run)
                run.status = status
                run.execution_time = exec_t
                if output:
                    run.output = output
                db.commit()

        final_guide = await orchestrator.execute_pipeline(state, status_callback=ws_callback)
        
        existing_itin = db.query(Itinerary).filter(Itinerary.trip_id == trip.id).order_by(Itinerary.version.desc()).first()
        next_ver = (existing_itin.version + 1) if existing_itin else 1
        
        itinerary_record = Itinerary(
            trip_id=trip.id,
            version=next_ver,
            content=final_guide
        )
        db.add(itinerary_record)
        
        trip.status = "completed"
        db.commit()

    except Exception as e:
        if trip:
            trip.status = "failed"
            db.commit()
        print(f"[Orchestrator Error] Pipeline failed for {trip_id}: {e}")
    finally:
        db.close()

@router.post("/{trip_id}/plan")
async def start_planning(trip_id: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found.")

    trip.status = "planning"
    
    # Pre-seed initial AgentRun records so frontend status polling sees 'running' / 'waiting' immediately
    for agent_name in ["research", "activity", "budget", "final"]:
        run = db.query(AgentRun).filter(AgentRun.trip_id == trip.id, AgentRun.agent_name == agent_name).first()
        if not run:
            run = AgentRun(trip_id=trip.id, agent_name=agent_name, status="waiting")
            db.add(run)
        else:
            run.status = "waiting"
            run.output = None
            run.error = None
    db.commit()

    state = TravelPlanningState(
        trip_id=trip.id,
        destination=trip.destination,
        travelers=trip.travelers,
        duration_days=trip.duration_days,
        start_date=trip.start_date,
        end_date=trip.end_date,
        travel_type=trip.travel_type,
        travel_style=trip.travel_style,
        budget=trip.budget,
        currency=trip.currency,
        interests=trip.interests or [],
        preferences=trip.preferences or {}
    )

    # Launch background task so response returns immediately
    background_tasks.add_task(_run_pipeline_background, trip.id, state)

    return {
        "status": "planning",
        "trip_id": trip.id,
        "message": "Autonomous Multi-Agent planning pipeline launched."
    }

@router.get("/{trip_id}/itinerary")
def get_itinerary(trip_id: str, db: Session = Depends(get_db)):
    itinerary = db.query(Itinerary).filter(Itinerary.trip_id == trip_id).order_by(Itinerary.version.desc()).first()
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not generated yet.")
    return itinerary.content

@router.get("/{trip_id}/agents", response_model=List[AgentStatusResponse])
def get_agent_status(trip_id: str, db: Session = Depends(get_db)):
    agent_runs = db.query(AgentRun).filter(AgentRun.trip_id == trip_id).all()
    return [
        AgentStatusResponse(
            id=r.id,
            agent_name=r.agent_name,
            status=r.status,
            execution_time=r.execution_time or 0.0,
            output_summary=f"Completed {r.agent_name} analysis." if r.status == "completed" else f"Status: {r.status}"
        ) for r in agent_runs
    ]

@router.post("/{trip_id}/command")
async def execute_ai_command(trip_id: str, payload: AICommandRequest, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        if trip_id == "demo-tokyo-7days":
            from app.api.routes.demo import get_tokyo_demo
            demo_data = get_tokyo_demo()
            demo_t = demo_data["trip"]
            trip = Trip(
                id="demo-tokyo-7days",
                destination=demo_t["destination"],
                start_date=demo_t["start_date"],
                end_date=demo_t["end_date"],
                duration_days=demo_t["duration_days"],
                travelers=demo_t["travelers"],
                travel_type=demo_t["travel_type"],
                travel_style=demo_t["travel_style"],
                budget=demo_t["budget"],
                currency=demo_t["currency"],
                interests=demo_t["interests"],
                status="completed"
            )
            db.add(trip)
            db.add(Itinerary(trip_id="demo-tokyo-7days", version=1, content=demo_data["itinerary"]))
            db.commit()
            db.refresh(trip)
        else:
            raise HTTPException(status_code=404, detail="Trip not found.")

    latest_itin = db.query(Itinerary).filter(Itinerary.trip_id == trip.id).order_by(Itinerary.version.desc()).first()
    
    state = TravelPlanningState(
        trip_id=trip.id,
        destination=trip.destination,
        travelers=trip.travelers,
        duration_days=trip.duration_days,
        travel_style=trip.travel_style,
        budget=trip.budget,
        currency=trip.currency,
        interests=trip.interests or []
    )
    if latest_itin:
        state.final_result = latest_itin.content

    async def ws_callback(event_data: dict):
        await manager.broadcast(trip.id, event_data)

    updated_guide = await orchestrator.execute_command(state, payload.command, status_callback=ws_callback)

    next_ver = (latest_itin.version + 1) if latest_itin else 1
    new_record = Itinerary(trip_id=trip.id, version=next_ver, content=updated_guide)
    db.add(new_record)
    db.commit()

    return {"status": "success", "command": payload.command, "itinerary": updated_guide}
