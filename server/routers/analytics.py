from fastapi import APIRouter
from database import db

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("")
def get_analytics():
    participants = db.get_collection("participants")
    sessions = db.get_collection("sessions")

    total_p = len(participants) or 1
    avg_deesc = round(sum(p.get("deEscalationScore", 80) for p in participants) / total_p)
    avg_emp = round(sum(p.get("empathyScore", 75) for p in participants) / total_p)

    return {
        "success": True,
        "data": {
            "metrics": {
                "activeParticipants": total_p,
                "rehabilitationHours": 340,
                "completedScenarios": len(sessions) * 12,
                "deEscalationRate": f"{avg_deesc}%",
                "empathyRating": f"{avg_emp}%"
            },
            "blockPerformance": [
                { "block": "Block A", "attendance": "92%", "deEscalation": 88 },
                { "block": "Block B", "attendance": "85%", "deEscalation": 74 },
                { "block": "Block C", "attendance": "94%", "deEscalation": 84 }
            ]
        }
    }
