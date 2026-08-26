import time
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db, PrisonerFileModel, CaseNoteModel, db as legacy_db

router = APIRouter(prefix="/api/participants", tags=["Participants"])

class PrisonerIntakeRequest(BaseModel):
    inmate_id: str
    full_name: str
    security_block: str = "Block 4B"
    risk_level: str = "Low Risk"
    rehab_track: str = "Emotional Regulation"
    counselor_notes: Optional[str] = None

class CreateCaseNoteRequest(BaseModel):
    note_text: str
    counselor_name: Optional[str] = "Counselor Officer"
    category: Optional[str] = "Counseling Session"

# 1. Create Prisoner Intake File (Neon PostgreSQL) - Declared BEFORE dynamic routes
@router.post("/intake")
def create_prisoner_intake(req: PrisonerIntakeRequest, db: Session = Depends(get_db)):
    inmate_clean = req.inmate_id.strip().upper()
    
    # Check if inmate ID already exists
    existing = db.query(PrisonerFileModel).filter(PrisonerFileModel.inmate_id == inmate_clean).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Prisoner File with Inmate ID '{inmate_clean}' already exists."
        )

    # Save to Neon DB
    new_file = PrisonerFileModel(
        inmate_id=inmate_clean,
        full_name=req.full_name.strip(),
        security_block=req.security_block,
        risk_level=req.risk_level,
        rehab_track=req.rehab_track,
        counselor_notes=req.counselor_notes
    )

    db.add(new_file)
    db.commit()
    db.refresh(new_file)

    return {
        "success": True,
        "message": "Prisoner Rehabilitation File created in Neon PostgreSQL",
        "data": {
            "id": new_file.id,
            "inmateId": new_file.inmate_id,
            "fullName": new_file.full_name,
            "securityBlock": new_file.security_block,
            "riskLevel": new_file.risk_level,
            "rehabTrack": new_file.rehab_track,
            "counselorNotes": new_file.counselor_notes,
            "createdAt": new_file.created_at.isoformat()
        }
    }

# 2. Get All Prisoner Files (Neon PostgreSQL) - Declared BEFORE dynamic routes
@router.get("/files")
def get_prisoner_files(db: Session = Depends(get_db)):
    files = db.query(PrisonerFileModel).order_by(PrisonerFileModel.created_at.desc()).all()
    return {
        "success": True,
        "count": len(files),
        "data": [
            {
                "id": f.id,
                "inmateId": f.inmate_id,
                "fullName": f.full_name,
                "securityBlock": f.security_block,
                "riskLevel": f.risk_level,
                "rehabTrack": f.rehab_track,
                "counselorNotes": f.counselor_notes,
                "createdAt": f.created_at.isoformat()
            }
            for f in files
        ]
    }

# 3. Case Notes Endpoints (Neon PostgreSQL)
@router.get("/{inmate_id}/case-notes")
def get_case_notes(inmate_id: str, db: Session = Depends(get_db)):
    inmate_clean = inmate_id.strip().upper()
    notes = db.query(CaseNoteModel).filter(CaseNoteModel.inmate_id == inmate_clean).order_by(CaseNoteModel.created_at.desc()).all()
    return {
        "success": True,
        "inmateId": inmate_clean,
        "count": len(notes),
        "data": [
            {
                "id": n.id,
                "inmateId": n.inmate_id,
                "counselorName": n.counselor_name,
                "noteText": n.note_text,
                "category": n.category,
                "createdAt": n.created_at.isoformat()
            }
            for n in notes
        ]
    }

@router.post("/{inmate_id}/case-notes")
def create_case_note(inmate_id: str, req: CreateCaseNoteRequest, db: Session = Depends(get_db)):
    inmate_clean = inmate_id.strip().upper()
    if not req.note_text or not req.note_text.strip():
        raise HTTPException(status_code=400, detail="Case note text cannot be empty.")

    new_note = CaseNoteModel(
        inmate_id=inmate_clean,
        counselor_name=req.counselor_name or "Counselor Officer",
        note_text=req.note_text.strip(),
        category=req.category or "Counseling Session"
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return {
        "success": True,
        "message": "Case note saved to Neon PostgreSQL",
        "data": {
            "id": new_note.id,
            "inmateId": new_note.inmate_id,
            "counselorName": new_note.counselor_name,
            "noteText": new_note.note_text,
            "category": new_note.category,
            "createdAt": new_note.created_at.isoformat()
        }
    }

# 4. General Participants list endpoint
@router.get("")
def get_participants(block: Optional[str] = None, stage: Optional[str] = None):
    participants = legacy_db.get_collection("participants")
    filtered = participants
    if block:
        filtered = [p for p in filtered if block.lower() in p.get("block", "").lower()]
    if stage:
        filtered = [p for p in filtered if p.get("rehabilitationStage", "").lower() == stage.lower()]
    return {"success": True, "count": len(filtered), "data": filtered}

# 5. Dynamic route declared LAST
@router.get("/{participant_id}")
def get_participant(participant_id: str):
    p = legacy_db.find_by_id("participants", participant_id)
    if not p:
        raise HTTPException(status_code=404, detail="Participant not found")
    return {"success": True, "data": p}
