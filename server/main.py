import os
import sys

# Ensure server directory is in Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import PORT, CORS_ORIGIN

from routers import (
    auth,
    sessions,
    session_builder,
    stories,
    books,
    videos,
    participants,
    discussions,
    resources,
    analytics,
    ai,
    roleplay,
    progress
)

app = FastAPI(
    title="Kintsu (Project ReStart) FastAPI Backend API",
    description="Python FastAPI REST backend for Kintsu rehabilitation platform powered by Google Gemini AI.",
    version="1.0.0"
)

# Configure CORS Middleware
origins = [CORS_ORIGIN, "http://localhost:3000", "http://localhost:8000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check Route
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "framework": "FastAPI (Python 3.12)",
        "project": "Kintsu - Project ReStart Backend API",
        "version": "1.0.0"
    }

# Register Routers
app.include_router(auth.router)
app.include_router(sessions.router)
app.include_router(session_builder.router)
app.include_router(stories.router)
app.include_router(books.router)
app.include_router(videos.router)
app.include_router(participants.router)
app.include_router(discussions.router)
app.include_router(resources.router)
app.include_router(analytics.router)
app.include_router(ai.router)
app.include_router(roleplay.router)
app.include_router(progress.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
