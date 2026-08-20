import time
from database import db

def get_participant_progress_report(participant_id: str):
    participants = db.get_collection("participants")
    p = next((item for item in participants if item.get("id") == participant_id), None)

    if not p:
        p = {
            "id": participant_id,
            "nameIdentifier": f"Participant #{participant_id}",
            "block": "Block C",
            "rehabilitationStage": "Active Healing",
            "deEscalationScore": 84,
            "empathyScore": 78,
            "sessionsAttended": 14,
            "booksCompleted": 3,
            "caseWorkerNotes": [],
            "lastActiveDate": "2026-08-20"
        }

    all_entries = db.get_collection("progressEntries")
    timeline = [entry for entry in all_entries if entry.get("participantId") == participant_id]

    certificates = []
    if p.get("booksCompleted", 0) >= 3:
        certificates.append({
            "certificateId": f"cert-read-{p['id']}",
            "title": "Reading Initiative Achievement Certificate",
            "issuedDate": "2026-08-15",
            "issuer": "Kintsu ReStart Library"
        })

    if p.get("deEscalationScore", 0) >= 80:
        certificates.append({
            "certificateId": f"cert-deesc-{p['id']}",
            "title": "De-escalation & Emotional Control Mastery",
            "issuedDate": "2026-08-18",
            "issuer": "Rehabilitation Counseling Dept"
        })

    return {
        "participantId": p["id"],
        "participantName": p.get("nameIdentifier", f"Participant #{p['id']}"),
        "block": p.get("block", "Block C"),
        "rehabilitationStage": p.get("rehabilitationStage", "Active Healing"),
        "overallDeEscalationScore": p.get("deEscalationScore", 84),
        "overallEmpathyScore": p.get("empathyScore", 78),
        "sessionsAttended": p.get("sessionsAttended", 14),
        "booksCompleted": p.get("booksCompleted", 3),
        "totalRehabilitationHours": p.get("sessionsAttended", 14) * 2.5,
        "timeline": timeline,
        "certificates": certificates
    }

def add_progress_entry(participant_id: str, entry_data: dict):
    participants = db.get_collection("participants")
    p = next((item for item in participants if item.get("id") == participant_id), None)
    p_name = p.get("nameIdentifier") if p else f"Participant #{participant_id}"

    new_entry = {
        "entryId": f"prg-{int(time.time() * 1000)}",
        "participantId": participant_id,
        "participantName": p_name,
        "date": entry_data.get("date") or time.strftime("%Y-%m-%d"),
        "milestoneTitle": entry_data.get("milestoneTitle", "Milestone Recorded"),
        "type": entry_data.get("type", "Session Attendance"),
        "deEscalationScore": entry_data.get("deEscalationScore"),
        "empathyScore": entry_data.get("empathyScore"),
        "notes": entry_data.get("notes", "")
    }

    db.insert("progressEntries", new_entry)

    if p:
        if entry_data.get("deEscalationScore"):
            p["deEscalationScore"] = round((p.get("deEscalationScore", 80) + entry_data["deEscalationScore"]) / 2)
        if entry_data.get("empathyScore"):
            p["empathyScore"] = round((p.get("empathyScore", 75) + entry_data["empathyScore"]) / 2)
        if entry_data.get("type") == "Session Attendance":
            p["sessionsAttended"] = p.get("sessionsAttended", 0) + 1
        if entry_data.get("type") == "Book Completed":
            p["booksCompleted"] = p.get("booksCompleted", 0) + 1
        p["lastActiveDate"] = time.strftime("%Y-%m-%d")
        db.update("participants", p["id"], p)

    return new_entry

def update_participant_stage(participant_id: str, stage: str):
    return db.update("participants", participant_id, {"rehabilitationStage": stage})

def get_facility_progress_summary():
    participants = db.get_collection("participants")
    total = len(participants) or 1

    avg_deesc = round(sum(p.get("deEscalationScore", 75) for p in participants) / total)
    avg_emp = round(sum(p.get("empathyScore", 70) for p in participants) / total)
    total_books = sum(p.get("booksCompleted", 0) for p in participants)

    return {
        "totalActiveParticipants": total,
        "facilityAvgDeEscalation": f"{avg_deesc}%",
        "facilityAvgEmpathy": f"{avg_emp}%",
        "totalBooksCompleted": total_books,
        "rehabilitationStagesDistribution": {
            "Orientation": len([p for p in participants if p.get("rehabilitationStage") == "Orientation"]),
            "ActiveHealing": len([p for p in participants if p.get("rehabilitationStage") == "Active Healing"]),
            "SkillsAndGrowth": len([p for p in participants if p.get("rehabilitationStage") == "Skills & Growth"]),
            "ReentryPrep": len([p for p in participants if p.get("rehabilitationStage") == "Re-entry Prep"]),
            "Graduation": len([p for p in participants if p.get("rehabilitationStage") == "Graduation"])
        }
    }
