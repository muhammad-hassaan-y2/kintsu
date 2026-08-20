from fastapi import APIRouter
from schemas.models import AIGenerateSessionRequest, AIAnalyzeParticipantRequest
from services.ai_service import get_ai_status, generate_session_ai, analyze_participant_ai

router = APIRouter(prefix="/api/ai", tags=["AI Integration"])

@router.get("/status")
def status():
    return {"success": True, "data": get_ai_status()}

@router.post("/generate-session")
def generate_session(req: AIGenerateSessionRequest):
    result = generate_session_ai(req.topic, req.category, req.block or "Block C")
    return {"success": True, "message": "AI Session generated via Gemini", "data": result}

@router.post("/analyze-participant")
def analyze_participant(req: AIAnalyzeParticipantRequest):
    result = analyze_participant_ai(req.participantName, req.caseNotes or [], req.recentResponse)
    return {"success": True, "message": "Participant behavioral analysis completed", "data": result}
