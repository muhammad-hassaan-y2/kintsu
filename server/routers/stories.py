from typing import Optional
from fastapi import APIRouter
from database import db
from schemas.models import StorySchema

router = APIRouter(prefix="/api/stories", tags=["Stories"])

@router.get("")
def get_stories(category: Optional[str] = None, search: Optional[str] = None):
    stories = db.get_collection("stories")
    filtered = stories
    if category:
        filtered = [s for s in filtered if s.get("category", "").lower() == category.lower()]
    if search:
        filtered = [s for s in filtered if search.lower() in s.get("title", "").lower() or search.lower() in s.get("summary", "").lower()]
    return {"success": True, "count": len(filtered), "data": filtered}

@router.post("")
def create_story(req: StorySchema):
    story_dict = req.model_dump()
    story_dict["id"] = f"story-{int(time.time() * 1000)}" if 'time' in globals() else f"story-custom"
    db.insert("stories", story_dict)
    return {"success": True, "message": "Story created successfully", "data": story_dict}
