from fastapi import APIRouter

router = APIRouter(prefix="/api/resources", tags=["Resources"])

resources = [
    {
        "id": "res-1",
        "title": "National Prisoner Rehabilitation & Re-entry Manual 2026",
        "type": "Government Standard",
        "description": "Official framework for vocational training, psycho-social support, and community reintegration.",
        "content": "Full official guidelines for correctional counselors and NGO partners."
    }
]

@router.get("")
def get_resources():
    return {"success": True, "count": len(resources), "data": resources}
