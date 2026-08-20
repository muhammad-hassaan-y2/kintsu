from typing import Optional
from fastapi import APIRouter
from database import db
from schemas.models import BookSchema

router = APIRouter(prefix="/api/books", tags=["Books"])

@router.get("")
def get_books(category: Optional[str] = None):
    books = db.get_collection("books")
    filtered = books
    if category:
        filtered = [b for b in filtered if b.get("category", "").lower() == category.lower()]
    return {"success": True, "count": len(filtered), "data": filtered}

@router.post("")
def create_book(req: BookSchema):
    book_dict = req.model_dump()
    book_dict["id"] = f"book-custom"
    db.insert("books", book_dict)
    return {"success": True, "message": "Book added successfully", "data": book_dict}
