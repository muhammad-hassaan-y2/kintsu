import time
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import db

router = APIRouter(prefix="/api/participants", tags=["Participants"])

class NoteRequest(BaseModel):
    note: str

@router.get("")
def get_participants(block: Optional[str] = None, stage: Optional[str] = None):
    participants = db.get_collection("participants")
    filtered = participants
    if block:
        filtered = [p for p in filtered if block.lower() in p.get("block", "").lower()]
    if stage:
        filtered = [p for p in filtered if p.get("rehabilitationStage", "").lower() == stage.lower()]
    return {"success": True, "count": len(filtered), "data": filtered}

@router.get("/{participant_id}")
def get_participant(participant_id: str):
    p = db.find_by_id("participants", participant_id)
    if not p:
        raise HTTPException(status_code=404, detail="Participant not found")
    return {"success": True, "data": p}

@router.post("/{participant_id}/notes")
def add_note(participant_id: str, req: NoteRequest):
    p = db.find_by_id("participants", participant_id)
    if not p:
        raise HTTPException(status_code=404, detail="Participant not found")

    notes = p.get("caseWorkerNotes", [])
    notes.append(req.note)
    updated = db.update("participants", participant_id, {
        "caseWorkerNotes": notes,
        "lastActiveDate": time.strftime("%Y-%m-%d")
    })
    return {"success": True, "message": "Case worker note added successfully", "data": updated}
