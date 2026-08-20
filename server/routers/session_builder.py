import time
from typing import Optional
from fastapi import APIRouter, HTTPException
from database import db
from schemas.models import SessionDraftSchema, AIGenerateSessionRequest
from services.ai_service import generate_session_ai

router = APIRouter(prefix="/api/session-builder", tags=["Session Builder"])

templates = [
    {
        "templateId": "tmpl-deescalation",
        "title": "De-escalation & Emotional Control",
        "category": "Anger Management",
        "recommendedBlock": "Block C",
        "defaultDurationMinutes": 55,
        "description": "Structured 6-step module teaching impulse control, 5-4-3-2-1 sensory grounding, and non-violent communication.",
        "suggestedStepsCount": 6
    },
    {
        "templateId": "tmpl-reentry",
        "title": "Re-entry & Modern World Readiness",
        "category": "Life After Prison",
        "recommendedBlock": "Block A & B",
        "defaultDurationMinutes": 60,
        "description": "Preparing participants for release: digital payments, modern workplaces, online services, and social integration.",
        "suggestedStepsCount": 5
    },
    {
        "templateId": "tmpl-family",
        "title": "Restoring Family Trust & Communication",
        "category": "Family & Relationships",
        "recommendedBlock": "All Blocks",
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
    drafts = db.get_collection("sessionDrafts")
    return {"success": True, "data": drafts}

@router.post("/draft")
def save_draft(req: SessionDraftSchema):
    draft_dict = req.model_dump()
    draft_id = draft_dict.get("draftId") or f"draft-{int(time.time() * 1000)}"
    draft_dict["draftId"] = draft_id
    draft_dict["updatedAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ")

    existing = db.find_by_id("sessionDrafts", draft_id)
    if existing:
        db.update("sessionDrafts", draft_id, draft_dict)
    else:
        db.insert("sessionDrafts", draft_dict)

    return {"success": True, "message": "Draft saved successfully", "data": draft_dict}

@router.post("/generate-ai")
def generate_ai(req: AIGenerateSessionRequest):
    ai_session = generate_session_ai(req.topic, req.category, req.block or "Block C")
    return {"success": True, "message": "Session generated via Gemini AI", "data": ai_session}

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
        "block": session_dict.get("block") or "Block C",
        "targetCount": session_dict.get("targetCount", 15),
        "completedCount": 0,
        "instructorId": "usr-1",
        "instructorName": "Priya Rajan",
        "status": "upcoming",
        "description": session_dict.get("description", ""),
        "steps": session_dict.get("steps", []),
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ")
    }

    db.insert("sessions", published)
    if session_dict.get("draftId"):
        db.delete("sessionDrafts", session_dict["draftId"])

    return {"success": True, "message": "Session published to Today's schedule successfully", "data": published}
