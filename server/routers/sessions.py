import time
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from database import db
from schemas.models import RehabilitationSessionSchema

router = APIRouter(prefix="/api/sessions", tags=["Sessions"])

@router.get("")
def get_sessions(status: Optional[str] = None, block: Optional[str] = None, category: Optional[str] = None):
    sessions = db.get_collection("sessions")
    filtered = sessions

    if status:
        filtered = [s for s in filtered if s.get("status") == status]
    if block:
        filtered = [s for s in filtered if block.lower() in s.get("block", "").lower()]
    if category:
        filtered = [s for s in filtered if s.get("category", "").lower() == category.lower()]

    return {"success": True, "count": len(filtered), "data": filtered}

@router.get("/today")
def get_today_sessions():
    sessions = db.get_collection("sessions")
    return {"success": True, "count": len(sessions), "data": sessions}

@router.get("/{session_id}")
def get_session(session_id: str):
    session = db.find_by_id("sessions", session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"success": True, "data": session}

@router.post("")
def create_session(req: RehabilitationSessionSchema):
    session_dict = req.model_dump()
    session_dict["id"] = f"sess-{int(time.time() * 1000)}"
    session_dict["createdAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ")
    session_dict["updatedAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ")
    db.insert("sessions", session_dict)
    return {"success": True, "message": "Session created successfully", "data": session_dict}
