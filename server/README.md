# Kintsu - Project ReStart FastAPI Backend API

FastAPI + Python 3.12 RESTful API server for the **Kintsu Project ReStart** rehabilitation platform.

## 🎯 Purpose & Core Features
This Python FastAPI backend powers group-based rehabilitation classroom sessions inside correctional facilities led by counselors, psychologists, and rehabilitation officers.

### API Endpoints Overview

| Base Endpoint | Domain / Feature | Key Functionality |
| :--- | :--- | :--- |
| `GET /api/health` | System Health | Health check status & framework info |
| `POST /api/auth/login` | Authentication | Instructor & Case worker JWT login |
| `GET /api/sessions` | Session Management | List all rehabilitation sessions |
| `GET /api/sessions/today` | Today's Sessions | Classroom dashboard for today's active sessions |
| `GET /api/session-builder/templates` | Session Builder | Pre-made rehabilitation templates (De-escalation, Re-entry, Family) |
| `POST /api/session-builder/draft` | Session Builder | Save draft sessions in progress |
| `POST /api/session-builder/generate-ai` | Session Builder | Auto-generate structured steps using Gemini AI |
| `POST /api/session-builder/publish` | Session Builder | Finalize & publish session to active classroom schedule |
| `GET /api/roleplay/scenarios` | Roleplay Simulator | List interactive de-escalation scenarios |
| `POST /api/roleplay/start` | Roleplay Simulator | Start a roleplay simulation session |
| `POST /api/roleplay/turn` | Roleplay Simulator | Process user dialogue with Gemini AI actor feedback |
| `POST /api/roleplay/complete` | Roleplay Simulator | Finalize roleplay session & calculate scores |
| `GET /api/progress/summary` | Progress Tracking | Global facility progress summary & stage distribution |
| `GET /api/progress/participants/:id` | Progress Tracking | Full participant report, timeline, & certificates |
| `POST /api/progress/participants/:id/log` | Progress Tracking | Log milestone entry for session, book, or benchmark |
| `PATCH /api/progress/participants/:id/stage` | Progress Tracking | Advance inmate rehabilitation stage |
| `GET /api/stories` | Story Library | Motivational & transformation story database |
| `GET /api/books` | Reading Initiative | Approved books, summaries, & reading incentives |

## 🚀 Development & Running

```bash
# 1. Install dependencies
python -m pip install -r requirements.txt

# 2. Start development server (with Uvicorn hot-reload on port 8000)
python -m uvicorn main:app --reload --port 8000

# Interactive OpenAPI Docs available at http://localhost:8000/docs
```
