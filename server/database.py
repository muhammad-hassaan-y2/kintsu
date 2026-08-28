import os
import json
import datetime
import bcrypt
from typing import Dict, Any, List, Optional
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text
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

# 1. User Model for Neon DB
class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="counselor")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)

# 2. Prisoner File Model for Neon DB
class PrisonerFileModel(Base):
    __tablename__ = "prisoner_files"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    inmate_id = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    security_block = Column(String(100), default="Block 4B")
    risk_level = Column(String(50), default="Low Risk")
    rehab_track = Column(String(100), default="Emotional Regulation")
    counselor_notes = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# 3. Case Note Timeline Model for Neon DB
class CaseNoteModel(Base):
    __tablename__ = "case_notes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    inmate_id = Column(String(100), index=True, nullable=False)
    counselor_name = Column(String(255), nullable=False)
    note_text = Column(String(1000), nullable=False)
    category = Column(String(100), default="Counseling Session")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# 4. Session Model for Neon DB
class SessionModel(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    inmate_id = Column(String(100), nullable=True)
    counselor_name = Column(String(255), default="Counselor Officer")
    date = Column(String(100), nullable=False)
    time = Column(String(100), nullable=False)
    location = Column(String(255), default="Block 4B Counseling Unit")
    status = Column(String(50), default="Scheduled")
    rehab_track = Column(String(100), default="Conflict De-escalation")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# 5. Roleplay Scenario Model for Neon DB
class RoleplayScenarioModel(Base):
    __tablename__ = "roleplay_scenarios"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    scenario_id = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(50), default="Intermediate")
    category = Column(String(100), default="Conflict Resolution")
    initial_prompt = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# 6. Educational Story Model for Neon DB
class EducationalStoryModel(Base):
    __tablename__ = "educational_stories"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    author = Column(String(255), default="Kintsu Curriculum")
    category = Column(String(100), default="Rehabilitation Case Study")
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# 7. Educational Book Model for Neon DB
class EducationalBookModel(Base):
    __tablename__ = "educational_books"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    category = Column(String(100), default="Cognitive Behavioral Growth")
    summary = Column(Text, nullable=False)
    cover_color = Column(String(50), default="#C9A227")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# Helper function to hash passwords
def _hash_pwd(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

# Initial prisoner profiles seed data
INITIAL_PRISONER_FILES = [
    {
        "inmate_id": "INM-4092",
        "full_name": "Marcus Vance",
        "security_block": "Block 4B",
        "risk_level": "Low Risk",
        "rehab_track": "Conflict De-escalation",
        "counselor_notes": "Demonstrating strong active listening skills and positive group participation."
    },
    {
        "inmate_id": "K-2847",
        "full_name": "Vikram Sharma",
        "security_block": "Block 2A",
        "risk_level": "Low Risk",
        "rehab_track": "Emotional Regulation",
        "counselor_notes": "Consistent attendance in morning mindfulness and emotional awareness sessions."
    },
    {
        "inmate_id": "K-3102",
        "full_name": "Arjun Patel",
        "security_block": "Block 4B",
        "risk_level": "High Risk",
        "rehab_track": "Anger Management & Impulse Control",
        "counselor_notes": "Requires structured 1-on-1 counseling before joining large group discussions."
    },
    {
        "inmate_id": "K-2555",
        "full_name": "Deepak Kumar",
        "security_block": "Block 1C",
        "risk_level": "Medium Risk",
        "rehab_track": "Vocational & Re-entry Readiness",
        "counselor_notes": "Showing rapid progress in communication modules and peer support groups."
    },
    {
        "inmate_id": "K-3208",
        "full_name": "Rahul Singh",
        "security_block": "Block 2A",
        "risk_level": "Medium Risk",
        "rehab_track": "Substance & Behavioral Recovery",
        "counselor_notes": "Engaging actively in roleplay simulators and stress reduction exercises."
    },
    {
        "inmate_id": "K-2719",
        "full_name": "Manoj Nair",
        "security_block": "Block 1C",
        "risk_level": "Low Risk",
        "rehab_track": "Peer Mentorship & Leadership",
        "counselor_notes": "Transition-ready candidate preparing for community re-entry program."
    },
    {
        "inmate_id": "K-3301",
        "full_name": "Suresh Krishnan",
        "security_block": "Block 4B",
        "risk_level": "High Risk",
        "rehab_track": "Cognitive Restructuring",
        "counselor_notes": "Newly admitted participant assigned to initial intake evaluation."
    }
]

INITIAL_ROLEPLAY_SCENARIOS = [
    {
        "scenario_id": "RP-101",
        "title": "Housing Block Verbal Dispute De-escalation",
        "description": "Practice non-violent communication during a tense dispute over personal belongings in Housing Block B.",
        "difficulty": "Intermediate",
        "category": "Conflict Resolution",
        "initial_prompt": "An inmate accuses you of taking his assigned radio in the common area. How do you respond to de-escalate?"
    },
    {
        "scenario_id": "RP-102",
        "title": "Peer Pressure & Refusal Training",
        "description": "Learn assertive refusal strategies when confronted with contraband requests in the workshop.",
        "difficulty": "Advanced",
        "category": "Impulse & Refusal Control",
        "initial_prompt": "A long-time acquaintance asks you to carry a hidden package across the facility corridor."
    }
]

INITIAL_STORIES = [
    {
        "title": "Pathways to Re-entry: Marcus's Transformation",
        "author": "Dr. Sarah Jenkins, Rehabilitation Specialist",
        "category": "Cognitive Restructuring",
        "summary": "A case study examining emotional regulation milestones and conflict de-escalation techniques in high-security environments.",
        "content": "Marcus Vance successfully completed 24 weeks of cognitive behavioral therapy, demonstrating how active listening reduces recidivism."
    }
]

INITIAL_BOOKS = [
    {
        "title": "Principles of Restorative Justice & Emotional Literacy",
        "author": "Kintsu Rehabilitation Press",
        "category": "Restorative Justice",
        "summary": "Comprehensive guide to accountability, empathy development, and community reintegration.",
        "cover_color": "#C9A227"
    },
    {
        "title": "De-escalation Strategies in Correctional Counseling",
        "author": "Prof. David Miller",
        "category": "Counseling Practice",
        "summary": "Practical frameworks for conflict mediation, active listening, and stress management.",
        "cover_color": "#1E3A5F"
    }
]

# Create tables and seed default models automatically in Neon PostgreSQL
try:
    Base.metadata.create_all(bind=engine)
    print("[Database] Connected to Neon PostgreSQL & initialized all tables.")

    seed_db = SessionLocal()

    # 1. Seed Demo User
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

    # 2. Seed Prisoner Profiles
    for p_data in INITIAL_PRISONER_FILES:
        existing = seed_db.query(PrisonerFileModel).filter(PrisonerFileModel.inmate_id == p_data["inmate_id"]).first()
        if not existing:
            seed_db.add(PrisonerFileModel(**p_data))
            seed_db.commit()

    # 3. Seed Roleplay Scenarios
    for rp in INITIAL_ROLEPLAY_SCENARIOS:
        existing_rp = seed_db.query(RoleplayScenarioModel).filter(RoleplayScenarioModel.scenario_id == rp["scenario_id"]).first()
        if not existing_rp:
            seed_db.add(RoleplayScenarioModel(**rp))
            seed_db.commit()

    # 4. Seed Educational Stories
    if seed_db.query(EducationalStoryModel).count() == 0:
        for st in INITIAL_STORIES:
            seed_db.add(EducationalStoryModel(**st))
        seed_db.commit()

    # 5. Seed Educational Books
    if seed_db.query(EducationalBookModel).count() == 0:
        for bk in INITIAL_BOOKS:
            seed_db.add(EducationalBookModel(**bk))
        seed_db.commit()

    # 6. Seed Sample Sessions
    if seed_db.query(SessionModel).count() == 0:
        seed_db.add(SessionModel(
            title="Emotional Regulation Workshop",
            inmate_id="INM-4092",
            counselor_name="Demo Counselor",
            date="Today",
            time="10:00 AM",
            location="Block 4B Counseling Unit",
            status="Scheduled",
            rehab_track="Conflict De-escalation"
        ))
        seed_db.add(SessionModel(
            title="De-escalation & Refusal Tactics",
            inmate_id="K-2847",
            counselor_name="Demo Counselor",
            date="Today",
            time="02:00 PM",
            location="Block 2A Counseling Unit",
            status="Scheduled",
            rehab_track="Emotional Regulation"
        ))
        seed_db.commit()

    seed_db.close()
except Exception as e:
    print(f"[Database Warning] Could not initialize Neon PostgreSQL tables or seed data: {e}")

# Database Session Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Legacy JsonDatabase for local fallback
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
