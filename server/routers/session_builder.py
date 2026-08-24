import time
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db, PrisonerFileModel, db as legacy_db
from schemas.models import SessionDraftSchema
from services.agent_orchestrator import agent_orchestrator

router = APIRouter(prefix="/api/session-builder", tags=["Session Builder"])

class LangChainSessionRequest(BaseModel):
    topic: str
    category: Optional[str] = "Emotional Regulation"
    block: Optional[str] = "Block 4B"
    inmate_id: Optional[str] = None

templates = [
    {
        "templateId": "tmpl-deescalation",
        "title": "De-escalation & Emotional Control",
        "category": "Anger Management",
        "recommendedBlock": "Block 4B",
        "defaultDurationMinutes": 55,
        "description": "Structured 6-step module teaching impulse control, 5-4-3-2-1 sensory grounding, and non-violent communication.",
        "suggestedStepsCount": 6
    },
    {
        "templateId": "tmpl-reentry",
        "title": "Re-entry & Modern World Readiness",
        "category": "Life After Prison",
        "recommendedBlock": "Block 1C",
        "defaultDurationMinutes": 60,
        "description": "Preparing participants for release: digital payments, modern workplaces, online services, and social integration.",
        "suggestedStepsCount": 5
    },
    {
        "templateId": "tmpl-family",
        "title": "Restoring Family Trust & Communication",
        "category": "Family & Relationships",
        "recommendedBlock": "Block 2A",
        "defaultDurationMinutes": 50,
        "description": "Navigating post-release family dynamics, rebuild trust through action, and effective parenting.",
        "suggestedStepsCount": 5
    }
]

@router.get("/templates")
def get_templates():
    return {"success": True, "data": templates}

@router.get("/drafts")
def get_drafts():
    drafts = legacy_db.get_collection("sessionDrafts")
    return {"success": True, "data": drafts}

@router.post("/draft")
def save_draft(req: SessionDraftSchema):
    draft_dict = req.model_dump()
    draft_id = draft_dict.get("draftId") or f"draft-{int(time.time() * 1000)}"
    draft_dict["draftId"] = draft_id
    draft_dict["updatedAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ")

    existing = legacy_db.find_by_id("sessionDrafts", draft_id)
    if existing:
        legacy_db.update("sessionDrafts", draft_id, draft_dict)
    else:
        legacy_db.insert("sessionDrafts", draft_dict)

    return {"success": True, "message": "Draft saved successfully", "data": draft_dict}

# LangChain + Google GenAI SDK Agent Orchestration with Neon DB Prisoner Context Memory
@router.post("/generate-ai")
def generate_ai(req: LangChainSessionRequest, db: Session = Depends(get_db)):
    prisoner_profile = None

    # Query Prisoner Profile Context Memory from Neon DB
    if req.inmate_id:
        p_record = db.query(PrisonerFileModel).filter(PrisonerFileModel.inmate_id == req.inmate_id.strip().upper()).first()
        if p_record:
            prisoner_profile = {
                "inmate_id": p_record.inmate_id,
                "full_name": p_record.full_name,
                "security_block": p_record.security_block,
                "risk_level": p_record.risk_level,
                "rehab_track": p_record.rehab_track,
                "counselor_notes": p_record.counselor_notes
            }

    # Execute LangChain Agent Orchestration
    ai_session = agent_orchestrator.orchestrate_session(req.topic, prisoner_profile)
    
    return {
        "success": True, 
        "message": "Session generated via LangChain & Google GenAI Agent Orchestration using Neon DB Context Memory", 
        "data": ai_session
    }

@router.post("/validate")
def validate_session(req: SessionDraftSchema):
    errors = []
    if not req.title:
        errors.append("Session title is required.")
    if not req.steps:
        errors.append("At least one classroom step is required.")

    total_mins = sum(s.durationMinutes for s in req.steps)
    if total_mins > 120:
        errors.append("Total duration exceeds 120 minutes limit.")

    return {"success": True, "validation": {"valid": len(errors) == 0, "errors": errors, "totalMinutes": total_mins}}

@router.post("/publish")
def publish_session(req: SessionDraftSchema):
    session_dict = req.model_dump()
    session_id = f"sess-{int(time.time() * 1000)}"
    published = {
        "id": session_id,
        "title": session_dict.get("title", "Rehabilitation Session"),
        "subtitle": session_dict.get("subtitle", ""),
        "category": session_dict.get("category", "Anger Management"),
        "scheduledDate": session_dict.get("scheduledDate") or time.strftime("%Y-%m-%d"),
        "scheduledTime": session_dict.get("scheduledTime") or "10:00 AM",
        "block": session_dict.get("block") or "Block 4B",
        "targetCount": session_dict.get("targetCount", 15),
        "completedCount": 0,
        "instructorId": "usr-1",
        "instructorName": "Counselor Officer",
        "status": "upcoming",
        "description": session_dict.get("description", ""),
        "steps": session_dict.get("steps", []),
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ")
    }

    legacy_db.insert("sessions", published)
    return {"success": True, "message": "Session published to Today's schedule successfully", "data": published}
