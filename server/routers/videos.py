from fastapi import APIRouter
from database import db

router = APIRouter(prefix="/api/videos", tags=["Videos"])

@router.get("")
def get_videos():
    videos = db.get_collection("videos")
    if not videos:
        videos = [
            {
                "id": "vid-1",
                "title": "Understanding Consequences: The Ripple Effect of Actions",
                "category": "Emotional Intelligence",
                "duration": "12:45",
                "thumbnailUrl": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop",
                "videoUrl": "https://cdn.kintsu.org/videos/ripple-effect.mp4",
                "description": "Visual analysis of how a single emotional choice impacts families, victims, communities, and self.",
                "tags": ["Consequences", "Empathy", "Responsibility"]
            }
        ]
    return {"success": True, "count": len(videos), "data": videos}
