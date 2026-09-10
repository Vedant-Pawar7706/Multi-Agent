# MyTrip — Autonomous Multi-Agent Travel Planning Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1.6-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.12+-3776AB.svg?logo=python)](https://www.python.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwindcss)](https://tailwindcss.com/)

**MyTrip** is a production-grade, stateful multi-agent travel planning SaaS platform. Instead of relying on a single monolithic LLM prompt, MyTrip orchestrates four specialized AI agents (**Research**, **Activity**, **Budget**, and **Final Editor/Validator**) coordinated through a centralized execution engine.

---

## 🌟 Key Features

- 🧠 **Multi-Agent Pipeline Architecture**:
  - 🔍 **Research Agent**: Gathers destination intelligence, hidden gems, transport options, safety guidelines, and local customs.
  - 📅 **Activity Agent**: Crafts realistic daily itineraries (Morning, Afternoon, Evening) considering durations and travel rest breaks.
  - 💰 **Budget Agent**: Calculates itemized costs (`calculator.py`), cost distribution, and provides tiered options (Budget, Comfort, Premium).
  - ✅ **Final Writer & Validator Agent**: Synthesizes inputs, validates timing and constraint enforcement (with automatic retry logic up to 3 attempts on validation failure).
- ⚡ **Real-Time Agent Execution & Streaming**: Live updates, step-by-step progress tracking, and execution logs broadcasted via WebSocket / SSE streams.
- 🎨 **Modern & Interactive UI**: Built with React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Leaflet interactive maps, and Framer Motion.
- 📄 **PDF Export**: Generates publication-ready PDF travel guides using ReportLab.
- 💬 **Natural Language Itinerary Editing**: "Make day 3 less crowded" or "Suggest budget options" dynamically triggers targeted agent re-runs.
- 🚀 **Zero-Setup Demo Mode**: Supports local testing out-of-the-box without mandatory external API keys.

---

## 🏗️ Architecture & Agent Pipeline

```
                     ┌───────────────────────────────┐
                     │   User Request & Constraints  │
                     └───────────────┬───────────────┘
                                     │
                                     ▼
                     ┌───────────────────────────────┐
                     │  Orchestration Engine (State) │
                     └───────────────┬───────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│ Research Agent  │────────>│ Activity Agent  │────────>│  Budget Agent   │
│  (Destination)  │         │   (Itinerary)   │         │ (Cost Breakdown)│
└─────────────────┘         └─────────────────┘         └─────────────────┘
                                                                 │
                                                                 ▼
                                                    ┌─────────────────────────┐
                                                    │ Final Editor/Validator  │
                                                    └────────────┬────────────┘
                                                                 │
                                                       [ Pass / Fail Retry ]
                                                                 │
                                                                 ▼
                                                    ┌─────────────────────────┐
                                                    │ Complete Travel Guide   │
                                                    └─────────────────────────┘
```

---

## 📁 Repository Structure

```
VoyageAI/
├── backend/
│   ├── app/
│   │   ├── agents/          # Multi-agent implementations & tools
│   │   │   ├── research_agent.py
│   │   │   ├── activity_agent.py
│   │   │   ├── budget_agent.py
│   │   │   ├── final_agent.py
│   │   │   ├── orchestrator.py
│   │   │   └── tools/        # Calculator, optimizer, search tools
│   │   ├── api/             # FastAPI REST endpoints & routes
│   │   │   ├── routes/      # Auth, planning, trips, demo, export
│   │   ├── core/            # Configuration & JWT security
│   │   ├── database/        # SQLAlchemy models & DB sessions
│   │   └── services/        # PDF generation service
│   ├── tests/               # Pytest suite (agents, auth, orchestrator, pdf)
│   ├── .env.example         # Template for environment variables
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # Agent workspace, trip wizard, guide views
│   │   ├── pages/           # Landing, Trips, Discover, Settings
│   │   ├── services/        # Axios API client
│   │   ├── stores/          # Zustand global state stores
│   │   └── types/           # TypeScript interfaces & types
│   ├── package.json         # Frontend dependencies & scripts
│   └── vite.config.ts       # Vite build configuration
├── docker-compose.yml       # Docker Compose setup
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Python** 3.10+
- **Node.js** 18+ and **npm**
- **Git**

---

### 1. Backend Setup (FastAPI)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate a virtual environment
python -m venv venv

# On Windows (PowerShell):
.\venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Copy environment configuration
cp .env.example .env

# 5. Run automated tests (optional)
pytest

# 6. Launch the FastAPI development server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

> 🌐 Backend API documentation available at: **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

---

### 2. Frontend Setup (React + Vite)

Open a new terminal window:

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

> 💻 Web Application available at: **[http://localhost:5173](http://localhost:5173)**

---

### 3. Running with Docker Compose

Run the complete multi-container stack with a single command:

```bash
docker-compose up --build
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🔐 Environment Variables

Configure backend settings in `backend/.env`:

```env
PROJECT_NAME="VoyageAI Platform"
ENVIRONMENT="development"
DEBUG=True

# Database Configuration (SQLite default, PostgreSQL supported)
DATABASE_URL="sqlite:///./voyageai.db"

# JWT Authentication
JWT_SECRET="voyageai-super-secret-jwt-key-change-in-production-2026"
JWT_ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# LLM Configuration ("gemini", "openai", "demo")
LLM_PROVIDER="gemini"
MODEL_NAME="gemini-2.5-flash"
GOOGLE_API_KEY="your-google-gemini-api-key"
OPENAI_API_KEY=""

# Server Settings
HOST="127.0.0.1"
PORT=8000
CORS_ORIGINS=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]
```

---

## 🧪 Testing

Run backend test suites for all agents, orchestrator, authentication, and PDF exports:

```bash
cd backend
pytest -v
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
