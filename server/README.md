# Kintsu - Project ReStart Backend API

Express + Node.js + TypeScript RESTful API server for the **Kintsu Project ReStart** rehabilitation platform.

## 🎯 Purpose & Core Features
This backend powers group-based rehabilitation classroom sessions inside correctional facilities led by counselors, psychologists, and rehabilitation officers.

### API Endpoints Overview

| Base Endpoint | Domain / Feature | Key Functionality |
| :--- | :--- | :--- |
| `GET /api/health` | System Health | Health check status & uptime info |
| `POST /api/auth/login` | Authentication | Instructor & Case worker JWT login |
| `GET /api/sessions` | Session Management | List all rehabilitation sessions |
| `GET /api/sessions/today` | Today's Sessions | Classroom dashboard for today's active sessions |
| `POST /api/sessions` | Session Builder | Construct custom structured classroom sessions |
| `GET /api/stories` | Story Library | Motivational & transformation story database |
| `GET /api/books` | Reading Initiative | Approved books, summaries, & reading incentives |
| `GET /api/videos` | Video Library | Curated documentaries & de-escalation guides |
| `GET /api/participants` | Case Management | Participant roster, de-escalation scores, notes |
| `POST /api/participants/:id/notes` | Case Worker Notes | Add casework notes for individual inmates |
| `GET /api/discussions` | Discussion Guides | Interactive prompts for classroom instructors |
| `GET /api/resources` | Resource Center | Government standards, NGO guides, re-entry guides |
| `GET /api/analytics` | Analytics & AI | Attendance stats, de-escalation growth, AI insights |

## 🚀 Development & Running

```bash
# 1. Install dependencies
npm install

# 2. Start development server (with tsx hot-reload)
npm run dev

# 3. Build for production
npm run build

# 4. Start production server
npm start
```
