# Quickstart: Physical AI & Humanoid Robotics Textbook

**Feature Branch**: `001-physical-ai-textbook`
**Created**: 2025-02-06

## Prerequisites

- Node.js 18+ and npm/pnpm
- Python 3.11+
- Git
- OpenAI API key
- Qdrant Cloud account (free tier)
- Neon Postgres account (free tier)

## Quick Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/physical-ai-textbook.git
cd physical-ai-textbook

# Install Docusaurus dependencies
cd docusaurus
npm install

# Install API dependencies
cd ../api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

Create `.env` files:

**docusaurus/.env**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**api/.env**
```env
# OpenAI
OPENAI_API_KEY=sk-your-key-here

# Qdrant Cloud
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your-qdrant-key

# Neon Postgres
DATABASE_URL=postgresql://user:pass@your-neon-host.neon.tech/textbook

# Better-Auth
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:8000

# Optional
ENVIRONMENT=development
```

### 3. Initialize Database

```bash
cd api
python -m scripts.init_db
```

### 4. Index Book Content (RAG)

```bash
cd api
python -m scripts.index_content
```

### 5. Start Development Servers

**Terminal 1 - Docusaurus:**
```bash
cd docusaurus
npm run start
# Opens http://localhost:3000
```

**Terminal 2 - FastAPI:**
```bash
cd api
source venv/bin/activate
uvicorn main:app --reload
# API at http://localhost:8000
```

## Verify Setup

### Check Docusaurus
1. Open http://localhost:3000
2. Navigate through modules and chapters
3. Verify code highlighting works

### Check API
1. Open http://localhost:8000/docs (Swagger UI)
2. Test `/api/chat` with: `{"message": "What is ROS 2?", "session_id": "test"}`
3. Verify response includes relevant chapter references

### Check RAG
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Explain URDF format", "session_id": "test"}'
```

## Project Structure

```
physical-ai-textbook/
├── docusaurus/              # Docusaurus book
│   ├── docs/                # Chapter content (MDX)
│   │   ├── 01-intro/
│   │   ├── 02-ros2/
│   │   ├── 03-gazebo/
│   │   ├── 04-isaac/
│   │   └── ...
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ChatBot/
│   │   │   ├── PersonalizeButton/
│   │   │   └── TranslateButton/
│   │   └── pages/
│   ├── static/
│   │   └── podcasts/        # Audio files
│   └── docusaurus.config.js
│
├── api/                     # FastAPI backend
│   ├── main.py
│   ├── routers/
│   │   ├── chat.py
│   │   ├── auth.py
│   │   ├── personalize.py
│   │   └── translate.py
│   ├── services/
│   │   ├── rag.py
│   │   ├── openai_client.py
│   │   └── translation.py
│   ├── models/
│   │   └── schemas.py
│   ├── db/
│   │   └── neon.py
│   └── scripts/
│       ├── init_db.py
│       └── index_content.py
│
├── specs/                   # Spec-driven development artifacts
│   └── 001-physical-ai-textbook/
│
└── history/                 # PHRs and ADRs
```

## Common Tasks

### Add New Chapter

1. Create MDX file in `docusaurus/docs/<module>/`
2. Add frontmatter with learning objectives
3. Run indexing: `python -m scripts.index_content`

### Test Chatbot

```bash
# Interactive test
cd api
python -m scripts.test_chat
```

### Deploy to Vercel

```bash
# Docusaurus
cd docusaurus
vercel

# API (serverless functions or separate project)
cd api
vercel
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Qdrant connection error | Check QDRANT_URL and API key |
| OpenAI rate limit | Add retry logic or reduce request rate |
| Database connection | Verify DATABASE_URL format |
| CORS errors | Check API_URL in frontend env |

## Next Steps

1. Write chapter content for all 4 modules
2. Test RAG accuracy with sample questions
3. Implement auth flow with Better-Auth
4. Add personalization logic
5. Add translation endpoint
6. Generate podcasts with NotebookLM
7. Deploy and create demo video
