import os
import datetime
import bcrypt
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Float, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from config import DATABASE_URL

# Fallback SQLite for offline local fallback if Neon DB URL is unreachable
if not DATABASE_URL:
    print("[Database Warning] DATABASE_URL not set in environment. Falling back to local SQLite database.")
    DATABASE_URL = "sqlite:///./kintsu_local.db"

# Create SQLAlchemy engine with SSL pooling for Neon PostgreSQL
connect_args = {}
if "postgresql" in DATABASE_URL:
    connect_args = {"sslmode": "require"}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ═══════════════════════════════════════════════════════════════════════════
# DATABASE MODELS FOR NEON POSTGRESQL
# ═══════════════════════════════════════════════════════════════════════════

# 1. User Account Model (Counselors / Correctional Officers)
class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="counselor")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# 2. Prisoner File Intake Model for Neon DB
class PrisonerFileModel(Base):
    __tablename__ = "prisoner_files"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    inmate_id = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    security_block = Column(String(100), default="Block 4B")
    risk_level = Column(String(50), default="Low Risk")
    rehab_track = Column(String(100), default="Conflict De-escalation")
    counselor_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationship to Case Notes Timeline
    case_notes = relationship("CaseNoteModel", back_populates="prisoner", cascade="all, delete-orphan")

# 3. Interactive Case Notes Timeline Model for Prisoner Profiles
class CaseNoteModel(Base):
    __tablename__ = "case_notes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    inmate_id = Column(String(100), ForeignKey("prisoner_files.inmate_id"), nullable=False)
    counselor_name = Column(String(255), default="Counselor Case Worker")
    note_text = Column(Text, nullable=False)
    category = Column(String(100), default="Counseling Session")  # Counseling Session, Behavioral Check, Rehab Milestone, Incident Report
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationship back to Prisoner File
    prisoner = relationship("PrisonerFileModel", back_populates="case_notes")

# 4. Classroom Session Model for Neon DB
class SessionModel(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    inmate_id = Column(String(100), nullable=True)
    counselor_name = Column(String(255), default="Demo Counselor")
    date = Column(String(100), default="Today")
    time = Column(String(100), default="10:00 AM")
    location = Column(String(100), default="Block 4B Counseling Room")
    status = Column(String(50), default="Scheduled")
    rehab_track = Column(String(100), default="Conflict De-escalation")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# 5. Roleplay Scenario Model for Neon DB
class RoleplayScenarioModel(Base):
    __tablename__ = "roleplay_scenarios"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    scenario_id = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(50), default="Intermediate")
    category = Column(String(100), default="Conflict De-escalation")
    initial_prompt = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# 6. Educational Story Model for Neon DB
class EducationalStoryModel(Base):
    __tablename__ = "educational_stories"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    author = Column(String(255), default="Kintsu Rehabilitation Team")
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
        "counselor_notes": "Demonstrating strong active listening skills and positive peer leadership during weekly group workshops."
    },
    {
        "inmate_id": "K-2847",
        "full_name": "Vikram Sharma",
        "security_block": "Block 2A",
        "risk_level": "Low Risk",
        "rehab_track": "Emotional Regulation",
        "counselor_notes": "Consistent attendance in morning mindfulness; applying 5-4-3-2-1 sensory grounding techniques effectively."
    },
    {
        "inmate_id": "K-3102",
        "full_name": "Arjun Patel",
        "security_block": "Block 4B",
        "risk_level": "High Risk",
        "rehab_track": "Anger Management & Impulse Control",
        "counselor_notes": "Requires structured 1-on-1 cognitive restructuring before participating in open floor group discussions."
    },
    {
        "inmate_id": "K-2555",
        "full_name": "Deepak Kumar",
        "security_block": "Block 1C",
        "risk_level": "Medium Risk",
        "rehab_track": "Vocational & Re-entry Readiness",
        "counselor_notes": "Showing rapid progress in verbal de-escalation drills and peer mentorship communication modules."
    },
    {
        "inmate_id": "K-3208",
        "full_name": "Rahul Singh",
        "security_block": "Block 2A",
        "risk_level": "Medium Risk",
        "rehab_track": "Substance & Behavioral Recovery",
        "counselor_notes": "Engaging actively in roleplay simulators; mastering automatic thought stopping under direct pressure."
    },
    {
        "inmate_id": "K-2719",
        "full_name": "Manoj Nair",
        "security_block": "Block 1C",
        "risk_level": "Low Risk",
        "rehab_track": "Peer Mentorship & Leadership",
        "counselor_notes": "Transition-ready candidate preparing for community re-entry and restorative justice workshops."
    },
    {
        "inmate_id": "K-3301",
        "full_name": "Suresh Krishnan",
        "security_block": "Block 4B",
        "risk_level": "High Risk",
        "rehab_track": "Cognitive Restructuring",
        "counselor_notes": "Newly admitted participant assigned to initial psychological intake and emotional risk evaluation."
    }
]

INITIAL_ROLEPLAY_SCENARIOS = [
    {
        "scenario_id": "RP-101",
        "title": "Housing Unit Verbal Dispute De-escalation",
        "description": "Practice non-violent communication during a tense dispute over personal belongings in Housing Block 4B.",
        "difficulty": "Intermediate",
        "category": "Conflict De-escalation",
        "initial_prompt": "An agitated resident accuses you of taking his assigned radio in the common area. How do you respond to de-escalate without hostility?"
    },
    {
        "scenario_id": "RP-102",
        "title": "Peer Pressure & Refusal Training",
        "description": "Learn assertive refusal strategies when confronted with contraband requests in the vocational workshop.",
        "difficulty": "Advanced",
        "category": "Impulse & Refusal Control",
        "initial_prompt": "A long-time acquaintance asks you to carry a hidden package across the facility corridor. Practice firm refusal without creating conflict."
    },
    {
        "scenario_id": "RP-103",
        "title": "Dining Hall Queue Conflict Mediation",
        "description": "De-escalate verbal provocation and personal space boundary infractions during peak dining hours.",
        "difficulty": "Intermediate",
        "category": "Emotional Regulation",
        "initial_prompt": "A resident cuts ahead of you in line and makes a sarcastic comment. Demonstrate emotional composure and verbal grounding."
    }
]

INITIAL_STORIES = [
    {
        "title": "Pathways to Re-entry: Marcus's Journey of Mindset Mastery",
        "author": "Dr. Sarah Jenkins, Forensic Psychologist",
        "category": "Cognitive Restructuring",
        "summary": "A clinical case study examining emotional regulation milestones and conflict de-escalation techniques in high-security environments.",
        "content": "Marcus Vance successfully completed 24 weeks of intensive cognitive behavioral therapy, demonstrating how active listening and cognitive restructuring significantly reduce conflict triggers."
    },
    {
        "title": "Breaking the Impulse Cycle: A Case Study in Restorative Justice",
        "author": "Counselor David Miller",
        "category": "Restorative Justice",
        "summary": "Documenting behavioral transformation through victim empathy mapping and peer conflict mediation.",
        "content": "Through structured accountability circles, participants learned to map the ripple effects of their actions and develop lasting emotional regulation tools."
    }
]

INITIAL_BOOKS = [
    {
        "title": "Principles of Restorative Justice & Emotional Literacy",
        "author": "Kintsu Rehabilitation Press",
        "category": "Restorative Justice",
        "summary": "Comprehensive guide to accountability, victim empathy development, and community reintegration.",
        "cover_color": "#C9A227"
    },
    {
        "title": "De-escalation Strategies in Correctional Counseling",
        "author": "Prof. David Miller",
        "category": "Counseling Practice",
        "summary": "Practical frameworks for conflict mediation, active listening, and acute stress management.",
        "cover_color": "#1E3A5F"
    },
    {
        "title": "Cognitive Behavioral Therapy for Impulse Control",
        "author": "Dr. Elena Rostova",
        "category": "CBT & Behavioral Growth",
        "summary": "Evidence-based worksheets and cognitive restructuring techniques designed for institutional settings.",
        "cover_color": "#22C55E"
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
            title="De-escalation & Trigger Audit Workshop",
            inmate_id="INM-4092",
            counselor_name="Demo Counselor",
            date="Today",
            time="09:30 AM",
            location="Block 4B Counseling Room",
            status="Scheduled",
            rehab_track="Conflict De-escalation"
        ))
        seed_db.add(SessionModel(
            title="Cognitive Restructuring & Impulse Control",
            inmate_id="K-2847",
            counselor_name="Demo Counselor",
            date="Today",
            time="01:15 PM",
            location="Block 2A Counseling Room",
            status="Scheduled",
            rehab_track="Emotional Regulation"
        ))
        seed_db.add(SessionModel(
            title="Restorative Justice & Victim Empathy Circle",
            inmate_id="K-3102",
            counselor_name="Demo Counselor",
            date="Tomorrow",
            time="10:00 AM",
            location="Block 1C Library",
            status="Scheduled",
            rehab_track="Restorative Justice"
        ))
        seed_db.commit()

    seed_db.close()
except Exception as e:
    print("[Database Warning] Could not initialize Neon PostgreSQL tables or seed data:", e)

# Database Session Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
