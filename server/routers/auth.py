from fastapi import APIRouter
from pydantic import BaseModel
from database import db

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    email: str

@router.post("/login")
def login(req: LoginRequest):
    users = db.get_collection("users")
    user = next((u for u in users if u.get("email", "").lower() == req.email.lower()), users[0] if users else None)
    return {
        "success": True,
        "message": "Authenticated successfully",
        "token": "fastapi_demo_token_2026",
        "user": user
    }

@router.get("/me")
def get_profile():
    users = db.get_collection("users")
    return {
        "success": True,
        "user": users[0] if users else None
    }
