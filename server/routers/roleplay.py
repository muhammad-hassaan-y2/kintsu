from fastapi import APIRouter
from schemas.models import RoleplayStartRequest, RoleplayTurnRequest, RoleplayCompleteRequest
from services.roleplay_service import (
    get_scenarios,
    start_roleplay_session,
    process_roleplay_turn_ai,
    complete_roleplay_session,
    get_roleplay_history
)

router = APIRouter(prefix="/api/roleplay", tags=["Roleplay Simulator"])

@router.get("/scenarios")
def list_scenarios():
    return {"success": True, "data": get_scenarios()}

@router.post("/start")
def start_session(req: RoleplayStartRequest):
    log = start_roleplay_session(req.scenarioId or "scen-101", req.participantName, req.instructorName or "Priya Rajan")
    return {"success": True, "message": "Roleplay session started", "data": log}

@router.post("/turn")
def submit_turn(req: RoleplayTurnRequest):
    result = process_roleplay_turn_ai(req.logId, req.userInput)
    return {"success": True, "message": "Roleplay turn processed with Gemini AI feedback", "data": result}

@router.post("/complete")
def complete_session(req: RoleplayCompleteRequest):
    completed = complete_roleplay_session(req.logId)
    return {"success": True, "message": "Roleplay session completed and analyzed", "data": completed}

@router.get("/history")
def history():
    return {"success": True, "data": get_roleplay_history()}
