# Implementation Plan: Physical AI & Humanoid Robotics Textbook

**Branch**: `001-physical-ai-textbook` | **Date**: 2025-02-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-physical-ai-textbook/spec.md`

## Summary

Build an AI-native textbook for Physical AI & Humanoid Robotics with:
- Docusaurus-based book following the 13-week course syllabus (4 modules)
- RAG chatbot using OpenAI Agents SDK + Qdrant for intelligent Q&A
- Better-Auth authentication with user profiling
- AI-powered content personalization based on user background
- Urdu translation with RTL support
- English and Urdu podcasts

## Technical Context

**Language/Version**: Python 3.11 (API), TypeScript 5.x (Frontend)
**Primary Dependencies**: Docusaurus 3.6, FastAPI 0.115, OpenAI Agents SDK, Better-Auth
**Storage**: Neon Serverless Postgres (users, profiles), Qdrant Cloud (vectors)
**Testing**: pytest (API), Jest (frontend components)
**Target Platform**: Web (modern browsers), deployed to Vercel
**Project Type**: Web application (frontend + backend)
**Performance Goals**: Chatbot response < 5s, page load < 3s
**Constraints**: Free tier limits (Qdrant 1GB, Neon limits), 90-second demo video
**Scale/Scope**: Single textbook, ~10 chapters, ~50 users during evaluation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Content-First Development | ✅ PASS | Book content is primary deliverable |
| II. Spec-Driven Workflow | ✅ PASS | Following SDD with spec → plan → tasks |
| III. Bilingual Accessibility | ✅ PASS | Urdu translation + RTL + podcasts planned |
| IV. AI-Native Integration | ✅ PASS | RAG with OpenAI + Qdrant + Neon |
| V. User-Centric Personalization | ✅ PASS | Better-Auth + profile-based content |
| VI. Deployability & Demo-Ready | ✅ PASS | Docusaurus + Vercel deployment |

**All gates pass. Proceeding to implementation.**

## Project Structure

### Documentation (this feature)

```text
specs/001-physical-ai-textbook/
├── spec.md              # Feature specification ✅
├── plan.md              # This file ✅
├── research.md          # Technology decisions ✅
├── data-model.md        # Entity definitions ✅
├── quickstart.md        # Setup guide ✅
├── contracts/           # API contracts ✅
│   └── api.yaml
├── checklists/
│   └── requirements.md  # Quality checklist ✅
└── tasks.md             # Task breakdown (next: /sp.tasks)
```

### Source Code (repository root)

```text
docusaurus/                      # Docusaurus book (frontend)
├── docs/                        # Book content (MDX)
│   ├── 01-introduction-to-physical-ai/
│   │   ├── _category_.json
│   │   ├── index.mdx
│   │   ├── embodied-intelligence.mdx
│   │   └── sensor-systems.mdx
│   ├── 02-ros2-fundamentals/
│   │   ├── _category_.json
│   │   ├── index.mdx
│   │   ├── nodes-topics-services.mdx
│   │   ├── python-packages.mdx
│   │   └── urdf-humanoids.mdx
│   ├── 03-gazebo-simulation/
│   │   ├── _category_.json
│   │   ├── index.mdx
│   │   ├── physics-simulation.mdx
│   │   └── sensor-simulation.mdx
│   ├── 04-unity-visualization/
│   │   └── ...
│   ├── 05-nvidia-isaac-platform/
│   │   └── ...
│   ├── 06-humanoid-development/
│   │   └── ...
│   ├── 07-conversational-robotics/
│   │   └── ...
│   ├── 08-capstone-project/
│   │   └── ...
│   ├── 09-hardware-guide/
│   │   └── ...
│   └── 10-podcasts/
│       └── index.mdx
├── src/
│   ├── components/
│   │   ├── ChatBot/
│   │   │   ├── index.tsx
│   │   │   ├── ChatWidget.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── styles.module.css
│   │   ├── PersonalizeButton/
│   │   │   ├── index.tsx
│   │   │   └── styles.module.css
│   │   ├── TranslateButton/
│   │   │   ├── index.tsx
│   │   │   └── styles.module.css
│   │   ├── PodcastPlayer/
│   │   │   └── index.tsx
│   │   └── AuthProvider/
│   │       ├── index.tsx
│   │       └── context.tsx
│   ├── pages/
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useChat.ts
│   ├── services/
│   │   └── api.ts
│   └── css/
│       ├── custom.css
│       └── rtl.css
├── static/
│   ├── img/
│   └── podcasts/
│       ├── episode-01-en.mp3
│       └── episode-01-ur.mp3
├── docusaurus.config.ts
├── sidebars.ts
├── package.json
└── tsconfig.json

api/                             # FastAPI backend
├── main.py                      # App entry point
├── routers/
│   ├── __init__.py
│   ├── chat.py                  # /api/chat endpoints
│   ├── auth.py                  # /api/auth endpoints
│   ├── personalize.py           # /api/personalize endpoint
│   └── translate.py             # /api/translate endpoint
├── services/
│   ├── __init__.py
│   ├── rag_service.py           # RAG with Qdrant + OpenAI
│   ├── openai_client.py         # OpenAI Agents SDK wrapper
│   ├── personalization.py       # Content adaptation logic
│   └── translation.py           # Urdu translation service
├── models/
│   ├── __init__.py
│   └── schemas.py               # Pydantic models
├── db/
│   ├── __init__.py
│   ├── neon.py                  # Neon Postgres connection
│   └── migrations/
├── scripts/
│   ├── init_db.py               # Database initialization
│   ├── index_content.py         # Index chapters to Qdrant
│   └── test_chat.py             # Interactive chat testing
├── requirements.txt
└── .env.example

tests/                           # Test suites
├── api/
│   ├── test_chat.py
│   ├── test_auth.py
│   └── test_personalize.py
└── frontend/
    └── components/
        └── ChatBot.test.tsx
```

**Structure Decision**: Web application pattern with Docusaurus frontend and FastAPI backend. This separation allows:
- Independent deployment of static book content
- Scalable API for AI features
- Clear boundary between content and functionality

## Complexity Tracking

> No constitution violations. All choices align with mandated technologies.

| Decision | Rationale |
|----------|-----------|
| Separate frontend/backend | Docusaurus is static-first; AI features need server |
| Qdrant for vectors | Constitution mandates Qdrant Cloud |
| Neon for users | Constitution mandates Neon Postgres |
| OpenAI for all AI | Single vendor for chat, personalization, translation |

## Phase Artifacts

### Phase 0: Research ✅

- [research.md](./research.md) - Technology decisions and rationale

### Phase 1: Design ✅

- [data-model.md](./data-model.md) - Entity definitions and schema
- [contracts/api.yaml](./contracts/api.yaml) - OpenAPI specification
- [quickstart.md](./quickstart.md) - Development setup guide

### Phase 2: Tasks (Next)

Run `/sp.tasks` to generate task breakdown.

## Architecture Overview

```
┌────────────────────────────────────────────────────────────────┐
│                         User Browser                            │
└────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────┐
│                    Docusaurus (Vercel)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ ChatBot  │  │Personalize│  │Translate │  │ Podcast  │       │
│  │Component │  │ Button   │  │ Button   │  │ Player   │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────────┘       │
│       │             │             │                             │
│       └─────────────┴─────────────┘                             │
│                     │                                           │
└─────────────────────┼───────────────────────────────────────────┘
                      │ HTTPS API Calls
                      ▼
┌────────────────────────────────────────────────────────────────┐
│                  FastAPI (Vercel/Railway)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ /chat    │  │ /auth    │  │/personal-│  │/translate│       │
│  │          │  │          │  │   ize    │  │          │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │             │             │             │               │
│       ▼             ▼             ▼             ▼               │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              Service Layer                           │       │
│  │  RAG Service │ Auth │ Personalization │ Translation │       │
│  └─────────────────────────────────────────────────────┘       │
└────────────────────────────────────────────────────────────────┘
          │              │                        │
          ▼              ▼                        ▼
┌──────────────┐ ┌──────────────┐        ┌──────────────┐
│   Qdrant     │ │    Neon      │        │   OpenAI     │
│   Cloud      │ │   Postgres   │        │     API      │
│  (vectors)   │ │ (users/auth) │        │ (GPT-4, etc) │
└──────────────┘ └──────────────┘        └──────────────┘
```

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Book framework | Docusaurus 3.x | Constitution mandate, excellent MDX support |
| API framework | FastAPI | Constitution mandate, async, auto-docs |
| Vector DB | Qdrant Cloud | Constitution mandate, free tier |
| User DB | Neon Postgres | Constitution mandate, serverless |
| Auth | Better-Auth | Constitution mandate for bonus points |
| AI provider | OpenAI | Agents SDK for chat, GPT-4 for personalization/translation |
| Deployment | Vercel | Free tier, GitHub integration |
| Podcast | NotebookLM + TTS | Hackathon recommended approach |

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| OpenAI rate limits | Medium | High | Implement caching, queue requests |
| Qdrant storage limit | Low | Medium | Optimize chunk size (~500 tokens) |
| Translation quality | Medium | Medium | Human review of key chapters |
| Auth complexity | Medium | Medium | Start with simple email/password |
| Demo time constraint | High | High | Prioritize P1 features first |

## Next Steps

1. Run `/sp.tasks` to generate detailed task breakdown
2. Implement in priority order: P1 → P2 → P3
3. Deploy early and often to catch issues
4. Create demo video before deadline
