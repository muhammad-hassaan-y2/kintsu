from fastapi import APIRouter
from schemas.models import ProgressLogRequest, StageUpdateRequest
from services.progress_service import (
    get_participant_progress_report,
    add_progress_entry,
    update_participant_stage,
    get_facility_progress_summary
)

router = APIRouter(prefix="/api/progress", tags=["Progress Tracking"])

@router.get("/summary")
def get_summary():
    return {"success": True, "data": get_facility_progress_summary()}

@router.get("/participants/{participant_id}")
def get_report(participant_id: str):
    report = get_participant_progress_report(participant_id)
    return {"success": True, "data": report}

@router.post("/participants/{participant_id}/log")
def log_entry(participant_id: str, req: ProgressLogRequest):
    entry = add_progress_entry(participant_id, req.model_dump())
    return {"success": True, "message": "Progress entry logged successfully", "data": entry}

@router.patch("/participants/{participant_id}/stage")
def update_stage(participant_id: str, req: StageUpdateRequest):
    updated = update_participant_stage(participant_id, req.stage)
    return {"success": True, "message": "Rehabilitation stage updated successfully", "data": updated}
