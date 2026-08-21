import datetime
import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException, Header, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from database import get_db, UserModel
from config import JWT_SECRET

router = APIRouter(prefix="/api/auth", tags=["Auth"])

# Request Schemas
class SignupRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "counselor"

class LoginRequest(BaseModel):
    email: str
    password: str

# Password Hashing Helpers
def hash_password(plain_password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(plain_password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), password_hash.encode("utf-8"))
    except Exception:
        return False

# JWT Helpers
def create_access_token(user_id: int, email: str, role: str) -> str:
    payload = {
        "sub": str(user_id),
        "email": email,
        "role": role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=5)

    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

# 1. Sign Up Endpoint (Exclusively Neon PostgreSQL)
@router.post("/signup")
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    email_clean = req.email.strip().lower()
    
    # Check if user already exists in Neon DB
    existing_user = db.query(UserModel).filter(UserModel.email == email_clean).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Hash password and create User record in Neon DB
    hashed_pwd = hash_password(req.password)
    new_user = UserModel(
        email=email_clean,
        password_hash=hashed_pwd,
        full_name=req.full_name.strip(),
        role=req.role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate JWT token
    token = create_access_token(new_user.id, new_user.email, new_user.role)

    return {
        "success": True,
        "message": "Account created successfully in Neon PostgreSQL",
        "token": token,
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "fullName": new_user.full_name,
            "role": new_user.role,
            "createdAt": new_user.created_at.isoformat()
        }
    }

# 2. Log In Endpoint (Exclusively Neon PostgreSQL)
@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    email_clean = req.email.strip().lower()

    # Query user exclusively from Neon DB
    user = db.query(UserModel).filter(UserModel.email == email_clean).first()
    
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email address or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated."
        )

    # Generate JWT Token
    token = create_access_token(user.id, user.email, user.role)

    return {
        "success": True,
        "message": "Authenticated successfully with Neon DB",
        "token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "fullName": user.full_name,
            "role": user.role,
            "createdAt": user.created_at.isoformat()
        }
    }

# 3. Get Authenticated User Profile Endpoint (Neon PostgreSQL)
@router.get("/me")
def get_profile(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        # Query default demo user from Neon DB
        demo_user = db.query(UserModel).filter(UserModel.email == "demo@kintsu.org").first()
        if demo_user:
            return {
                "success": True,
                "user": {
                    "id": demo_user.id,
                    "email": demo_user.email,
                    "fullName": demo_user.full_name,
                    "role": demo_user.role,
                    "createdAt": demo_user.created_at.isoformat()
                }
            }
        raise HTTPException(status_code=401, detail="Authentication token required")

    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = int(payload.get("sub"))
        user = db.query(UserModel).filter(UserModel.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found in Neon DB")

        return {
            "success": True,
            "user": {
                "id": user.id,
                "email": user.email,
                "fullName": user.full_name,
                "role": user.role,
                "createdAt": user.created_at.isoformat()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
