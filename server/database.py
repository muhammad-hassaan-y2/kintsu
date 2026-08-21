import os
import json
import datetime
import bcrypt
from typing import Dict, Any, List, Optional
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import sessionmaker, declarative_base
from config import DATABASE_URL

# SQLAlchemy Setup for Neon PostgreSQL
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# SQLAlchemy User Model for Neon DB
class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="counselor")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)

# Helper function to hash passwords
def _hash_pwd(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

# Create tables and seed demo user automatically in Neon PostgreSQL
try:
    Base.metadata.create_all(bind=engine)
    print("[Database] Connected to Neon PostgreSQL & initialized tables.")

    # Seed Demo User automatically if not present
    seed_db = SessionLocal()
    demo_user = seed_db.query(UserModel).filter(UserModel.email == "demo@kintsu.org").first()
    if not demo_user:
        new_demo = UserModel(
            email="demo@kintsu.org",
            password_hash=_hash_pwd("demo123"),
            full_name="Demo Counselor",
            role="counselor"
        )
        seed_db.add(new_demo)
        seed_db.commit()
        print("[Database] Seeded demo user: demo@kintsu.org (Password: demo123)")
    seed_db.close()
except Exception as e:
    print(f"[Database Warning] Could not initialize Neon PostgreSQL tables or seed demo user: {e}")

# Database Session Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Legacy JsonDatabase for local fallback & mock collections
DB_FILE_PATH = os.path.join(os.path.dirname(__file__), "data", "db.json")

class JsonDatabase:
    def __init__(self):
        self.data: Dict[str, List[Any]] = self._load_db()

    def _load_db(self) -> Dict[str, List[Any]]:
        try:
            if os.path.exists(DB_FILE_PATH):
                with open(DB_FILE_PATH, "r", encoding="utf-8") as f:
                    return json.load(f)
        except Exception as e:
            print(f"Warning: Failed to load db.json, using defaults: {e}")

        return {
            "users": [],
            "sessions": [],
            "stories": [],
            "books": [],
            "participants": [],
            "roleplayScenarios": [],
            "roleplayLogs": [],
            "progressEntries": []
        }

    def _save_db(self) -> None:
        try:
            os.makedirs(os.path.dirname(DB_FILE_PATH), exist_ok=True)
            with open(DB_FILE_PATH, "w", encoding="utf-8") as f:
                json.dump(self.data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error: Failed to save db.json: {e}")

    def get_collection(self, collection_name: str) -> List[Dict[str, Any]]:
        return self.data.get(collection_name, [])

    def find_by_id(self, collection_name: str, id_value: str) -> Optional[Dict[str, Any]]:
        items = self.get_collection(collection_name)
        for item in items:
            if item.get("id") == id_value or item.get("draftId") == id_value or item.get("scenarioId") == id_value or item.get("logId") == id_value:
                return item
        return None

    def insert(self, collection_name: str, item: Dict[str, Any]) -> Dict[str, Any]:
        if collection_name not in self.data:
            self.data[collection_name] = []
        self.data[collection_name].insert(0, item)
        self._save_db()
        return item

    def update(self, collection_name: str, id_value: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        items = self.get_collection(collection_name)
        for i, item in enumerate(items):
            if item.get("id") == id_value or item.get("draftId") == id_value or item.get("scenarioId") == id_value or item.get("logId") == id_value:
                updated_item = {**item, **update_data}
                self.data[collection_name][i] = updated_item
                self._save_db()
                return updated_item
        return None

db = JsonDatabase()
