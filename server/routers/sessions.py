import time
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db, SessionModel
from schemas.models import RehabilitationSessionSchema

router = APIRouter(prefix="/api/sessions", tags=["Sessions"])

@router.get("")
def get_sessions(status: Optional[str] = None, block: Optional[str] = None, category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(SessionModel)
    if status:
        query = query.filter(SessionModel.status == status)
    if block:
        query = query.filter(SessionModel.location.ilike(f"%{block}%"))
    if category:
        query = query.filter(SessionModel.rehab_track.ilike(f"%{category}%"))
        
    sessions = query.order_by(SessionModel.created_at.desc()).all()

    return {
        "success": True,
        "count": len(sessions),
        "data": [
            {
                "id": str(s.id),
                "title": s.title,
                "inmateId": s.inmate_id,
                "counselorName": s.counselor_name,
                "date": s.date,
                "time": s.time,
                "location": s.location,
                "status": s.status,
                "rehabTrack": s.rehab_track,
                "createdAt": s.created_at.isoformat()
            }
            for s in sessions
        ]
    }

@router.get("/today")
def get_today_sessions(db: Session = Depends(get_db)):
    sessions = db.query(SessionModel).order_by(SessionModel.created_at.desc()).all()
    return {
        "success": True,
        "count": len(sessions),
        "data": [
            {
                "id": str(s.id),
                "title": s.title,
                "inmateId": s.inmate_id,
                "counselorName": s.counselor_name,
                "date": s.date,
                "time": s.time,
                "location": s.location,
                "status": s.status,
                "rehabTrack": s.rehab_track,
                "createdAt": s.created_at.isoformat()
            }
            for s in sessions
        ]
    }

@router.get("/{session_id}")
def get_session(session_id: str, db: Session = Depends(get_db)):
    if session_id.isdigit():
        s = db.query(SessionModel).filter(SessionModel.id == int(session_id)).first()
    else:
        s = db.query(SessionModel).first()

    if not s:
        raise HTTPException(status_code=404, detail="Session not found in Neon DB")

    return {
        "success": True,
        "data": {
            "id": str(s.id),
            "title": s.title,
            "inmateId": s.inmate_id,
            "counselorName": s.counselor_name,
            "date": s.date,
            "time": s.time,
            "location": s.location,
            "status": s.status,
            "rehabTrack": s.rehab_track,
            "createdAt": s.created_at.isoformat()
        }
    }

@router.post("")
def create_session(req: RehabilitationSessionSchema, db: Session = Depends(get_db)):
    new_session = SessionModel(
        title=req.title,
        inmate_id=getattr(req, 'inmateId', None),
        counselor_name=getattr(req, 'counselorName', "Counselor Officer"),
        date=getattr(req, 'date', "Today"),
        time=getattr(req, 'time', "10:00 AM"),
        location=getattr(req, 'location', "Block 4B Counseling Unit"),
        status=getattr(req, 'status', "Scheduled"),
        rehab_track=getattr(req, 'category', "Conflict De-escalation")
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return {
        "success": True,
        "message": "Session scheduled in Neon PostgreSQL",
        "data": {
            "id": str(new_session.id),
            "title": new_session.title,
            "inmateId": new_session.inmate_id,
            "counselorName": new_session.counselor_name,
            "date": new_session.date,
            "time": new_session.time,
            "location": new_session.location,
            "status": new_session.status,
            "rehabTrack": new_session.rehab_track,
            "createdAt": new_session.created_at.isoformat()
        }
    }
