import time
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, EducationalStoryModel
from schemas.models import StorySchema

router = APIRouter(prefix="/api/stories", tags=["Stories"])

@router.get("")
def get_stories(category: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(EducationalStoryModel)
    if category:
        query = query.filter(EducationalStoryModel.category.ilike(f"%{category}%"))
    if search:
        query = query.filter(
            (EducationalStoryModel.title.ilike(f"%{search}%")) |
            (EducationalStoryModel.summary.ilike(f"%{search}%"))
        )
    stories = query.order_by(EducationalStoryModel.created_at.desc()).all()
    
    return {
        "success": True,
        "count": len(stories),
        "data": [
            {
                "id": str(s.id),
                "title": s.title,
                "author": s.author,
                "category": s.category,
                "summary": s.summary,
                "content": s.content,
                "createdAt": s.created_at.isoformat()
            }
            for s in stories
        ]
    }

@router.post("")
def create_story(req: StorySchema, db: Session = Depends(get_db)):
    new_story = EducationalStoryModel(
        title=req.title,
        author=req.author or "Kintsu Curriculum",
        category=req.category or "Rehabilitation Case Study",
        summary=req.summary,
        content=req.content or req.summary
    )
    db.add(new_story)
    db.commit()
    db.refresh(new_story)
    
    return {
        "success": True,
        "message": "Story created in Neon PostgreSQL",
        "data": {
            "id": str(new_story.id),
            "title": new_story.title,
            "author": new_story.author,
            "category": new_story.category,
            "summary": new_story.summary,
            "content": new_story.content,
            "createdAt": new_story.created_at.isoformat()
        }
    }
