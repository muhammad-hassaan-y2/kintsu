from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, EducationalBookModel
from schemas.models import BookSchema

router = APIRouter(prefix="/api/books", tags=["Books"])

@router.get("")
def get_books(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(EducationalBookModel)
    if category:
        query = query.filter(EducationalBookModel.category.ilike(f"%{category}%"))
    books = query.order_by(EducationalBookModel.created_at.desc()).all()
    
    return {
        "success": True,
        "count": len(books),
        "data": [
            {
                "id": str(b.id),
                "title": b.title,
                "author": b.author,
                "category": b.category,
                "summary": b.summary,
                "coverColor": b.cover_color,
                "createdAt": b.created_at.isoformat()
            }
            for b in books
        ]
    }

@router.post("")
def create_book(req: BookSchema, db: Session = Depends(get_db)):
    new_book = EducationalBookModel(
        title=req.title,
        author=req.author,
        category=req.category or "Cognitive Behavioral Growth",
        summary=req.summary,
        cover_color=req.cover_color or "#C9A227"
    )
    db.add(new_book)
    db.commit()
    db.refresh(new_book)

    return {
        "success": True,
        "message": "Book saved to Neon PostgreSQL",
        "data": {
            "id": str(new_book.id),
            "title": new_book.title,
            "author": new_book.author,
            "category": new_book.category,
            "summary": new_book.summary,
            "coverColor": new_book.cover_color,
            "createdAt": new_book.created_at.isoformat()
        }
    }
