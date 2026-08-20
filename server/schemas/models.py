from pydantic import BaseModel, Field
from typing import List, Optional, Any

class SessionStepSchema(BaseModel):
    stepNumber: int
    type: str
    title: str
    durationMinutes: int
    content: str
    mediaUrl: Optional[str] = None
    questions: Optional[List[str]] = None

class RehabilitationSessionSchema(BaseModel):
    id: Optional[str] = None
    title: str
    subtitle: Optional[str] = ""
    category: str
    scheduledDate: Optional[str] = None
    scheduledTime: Optional[str] = "10:00 AM"
    block: Optional[str] = "Block C"
    targetCount: Optional[int] = 15
    completedCount: Optional[int] = 0
    instructorId: Optional[str] = "usr-1"
    instructorName: Optional[str] = "Priya Rajan"
    status: Optional[str] = "upcoming"
    description: Optional[str] = ""
    steps: List[SessionStepSchema] = []

class SessionDraftSchema(BaseModel):
    draftId: Optional[str] = None
    title: Optional[str] = "Untitled Session Draft"
    subtitle: Optional[str] = ""
    category: str
    block: Optional[str] = "Block C"
    scheduledDate: Optional[str] = None
    scheduledTime: Optional[str] = "10:00 AM"
    targetCount: Optional[int] = 15
    description: Optional[str] = ""
    steps: List[SessionStepSchema] = []

class StorySchema(BaseModel):
    id: Optional[str] = None
    title: str
    category: str
    summary: str
    fullText: str
    authorOrSource: Optional[str] = "ReStart Library"
    tags: List[str] = []
    moral: Optional[str] = ""
    estimatedReadTime: Optional[str] = "5 mins"
    featured: Optional[bool] = False

class BookSchema(BaseModel):
    id: Optional[str] = None
    title: str
    author: str
    category: str
    description: Optional[str] = ""
    summaryText: Optional[str] = ""
    audiobookAvailable: Optional[bool] = True
    recommendedForStage: Optional[str] = "Active Healing"
    incentiveEligible: Optional[bool] = True

class ParticipantSchema(BaseModel):
    id: str
    nameIdentifier: str
    block: str
    rehabilitationStage: str
    deEscalationScore: int
    empathyScore: int
    sessionsAttended: int
    booksCompleted: int
    caseWorkerNotes: List[str] = []
    lastActiveDate: Optional[str] = None

class RoleplayTurnSchema(BaseModel):
    turnNumber: int
    userInput: str
    actorResponse: str
    deEscalationScore: int
    empathyFeedback: str

class RoleplayStartRequest(BaseModel):
    scenarioId: Optional[str] = "scen-101"
    participantName: str
    instructorName: Optional[str] = "Priya Rajan"

class RoleplayTurnRequest(BaseModel):
    logId: str
    userInput: str

class RoleplayCompleteRequest(BaseModel):
    logId: str

class ProgressLogRequest(BaseModel):
    date: Optional[str] = None
    milestoneTitle: str
    type: str
    deEscalationScore: Optional[int] = None
    empathyScore: Optional[int] = None
    notes: Optional[str] = ""

class StageUpdateRequest(BaseModel):
    stage: str

class AIGenerateSessionRequest(BaseModel):
    topic: str
    category: str
    block: Optional[str] = "Block C"

class AIAnalyzeParticipantRequest(BaseModel):
    participantName: str
    caseNotes: Optional[List[str]] = []
    recentResponse: Optional[str] = None
