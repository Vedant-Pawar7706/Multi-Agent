# VoyageAI — Autonomous Multi-Agent Travel Planning Platform

**VoyageAI** is a production-grade multi-agent travel planning SaaS platform. Instead of relying on a single AI prompt, VoyageAI coordinates four specialized AI agents (**Research**, **Activity**, **Budget**, and **Final Editor/Validator**) through a stateful orchestration engine.

---

## Key Features

- 🧠 **Multi-Agent Pipeline Architecture**:
  - **Research Agent**: Destination intelligence, hidden gems, transport, safety, local customs.
  - **Activity Agent**: Human-designed daily itineraries (morning/afternoon/evening), duration & rest breaks.
  - **Budget Agent**: Tool-calculated budgets (`calculator.py`), cost breakdown & budget comparison tiers (Budget/Comfort/Premium).
  - **Final Writer & Validator Agent**: Synthesizes inputs, checks constraints & validates timing/budget (retries up to 3 times on validation failure).
- ⚡ **Real-time Agent Visualization**: Live WebSockets & SSE stream broadcasting step updates, progress bars, and execution logs.
- 🎨 **Modern SaaS Interface**: Built with React, Vite, TypeScript, Tailwind CSS, Lucide Icons, and Framer Motion.
- 📄 **PDF Export**: Generates professional PDF travel guides using ReportLab.
- 💬 **Natural Language Editing Bar**: "Make day 3 less crowded", "Find budget hotels" selectively re-runs affected agents.
- 🚀 **Zero-Setup Demo Mode**: Works instantly out-of-the-box without requiring LLM API keys.

---

## Local Development Setup

### 1. Backend (Python + FastAPI)

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate

# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
pytest
uvicorn app.main:app --reload --port 8000
```

Backend API documentation will be available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### 2. Frontend (React + Vite + TypeScript)

```bash
cd frontend
npm install
npm run dev
```

Open your browser at [http://localhost:5173](http://localhost:5173).

---

## Environment Variables Configuration

Copy `.env.example` to `.env` in the `backend/` directory:

```env
PROJECT_NAME="VoyageAI Platform"
DATABASE_URL="sqlite:///./voyageai.db"
JWT_SECRET="voyageai-super-secret-jwt-key-change-in-production-2026"
LLM_PROVIDER="gemini" # Options: "gemini", "openai", "demo"
GOOGLE_API_KEY="your-google-gemini-api-key"
OPENAI_API_KEY=""
```

---

## Docker Support

Run the full stack via Docker Compose:

```bash
docker-compose up --build
```
