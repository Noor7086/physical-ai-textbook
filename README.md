# Physical AI & Humanoid Robotics Textbook

An AI-native interactive textbook for learning Physical AI and Humanoid Robotics, built with Docusaurus and FastAPI.

## Features

- **8-Module Textbook**: Comprehensive course covering ROS 2, Gazebo, NVIDIA Isaac, humanoid development, and more
- **RAG Chatbot**: AI-powered Q&A assistant that answers questions using textbook content with chapter references
- **Text Selection**: Highlight any text and click "Explain this" for instant AI explanations
- **User Authentication**: Sign up with background profile for personalized learning
- **Content Personalization**: Adapt chapter content based on your experience level
- **Urdu Translation**: Translate any chapter to Urdu with proper RTL formatting
- **Podcast Player**: Listen to educational podcasts in English and Urdu

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Docusaurus 3.x, React, TypeScript |
| Backend | FastAPI, Python 3.11 |
| Database | Neon Serverless Postgres |
| Vector DB | Qdrant Cloud |
| AI | OpenAI (GPT-4, Embeddings) |
| Auth | Better-Auth with JWT |
| Deployment | Vercel |

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- OpenAI API key
- Qdrant Cloud account (free tier)
- Neon Postgres account (free tier)

### Frontend (Docusaurus)

```bash
cd docusaurus
npm install
cp .env.example .env  # Configure API URL
npm run start          # http://localhost:3000
```

### Backend (FastAPI)

```bash
cd api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # Add API keys
python -m scripts.init_db
uvicorn main:app --reload  # http://localhost:8000
```

### Index Content for RAG

```bash
cd api
python -m scripts.index_content
```

## Project Structure

```
.
├── docusaurus/          # Docusaurus frontend
│   ├── docs/            # 8 modules of textbook content (MDX)
│   ├── src/
│   │   ├── components/  # ChatBot, PersonalizeButton, TranslateButton, PodcastPlayer
│   │   ├── hooks/       # useAuth, useChat
│   │   ├── services/    # API client
│   │   └── theme/       # Root wrapper, DocItem layout
│   └── static/          # Images, podcasts
├── api/                 # FastAPI backend
│   ├── routers/         # chat, auth, personalize, translate
│   ├── services/        # RAG, OpenAI, auth, personalization, translation
│   ├── db/              # Neon Postgres connection
│   ├── models/          # Pydantic schemas
│   └── scripts/         # DB init, content indexing
└── specs/               # Spec-driven development artifacts
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Send message to RAG chatbot |
| `/api/chat/stream` | POST | Streaming chat response |
| `/api/chat/selected-text` | POST | Explain highlighted text |
| `/api/auth/signup` | POST | Create account with profile |
| `/api/auth/login` | POST | Authenticate user |
| `/api/auth/me` | GET | Get current user profile |
| `/api/personalize` | POST | Personalize chapter content |
| `/api/translate` | POST | Translate to Urdu |

## License

Copyright 2025 Panaversity. All rights reserved.
