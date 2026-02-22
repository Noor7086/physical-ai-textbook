# Research: Physical AI & Humanoid Robotics Textbook

**Feature Branch**: `001-physical-ai-textbook`
**Created**: 2025-02-06
**Status**: Complete

## Technology Decisions

### 1. Book Framework: Docusaurus 3.x

**Decision**: Use Docusaurus 3.x as the static site generator for the textbook.

**Rationale**:
- Constitution mandates Docusaurus (Principle VI)
- Excellent MDX support for interactive content
- Built-in sidebar navigation, search, and versioning
- Easy deployment to GitHub Pages/Vercel
- Strong ecosystem for documentation sites
- Supports custom React components for chatbot, personalization, translation

**Alternatives Considered**:
- GitBook: Less customizable, proprietary
- VuePress: Smaller ecosystem
- Next.js: Overkill for documentation, more complex setup
- Astro: Good but less mature for documentation

**Version**: Docusaurus 3.6.x (latest stable)

---

### 2. Backend API: FastAPI

**Decision**: Use FastAPI for the backend API serving chatbot, auth, personalization, and translation.

**Rationale**:
- Constitution mandates FastAPI (Technical Standards)
- Async-first design for handling concurrent requests
- Excellent OpenAPI documentation generation
- Type hints with Pydantic for validation
- Easy integration with OpenAI SDK and database clients

**Alternatives Considered**:
- Flask: Synchronous, less modern
- Django: Too heavy for API-only service
- Express.js: Would require separate language stack

**Version**: FastAPI 0.115.x

---

### 3. AI/Chatbot: OpenAI Agents SDK

**Decision**: Use OpenAI Agents SDK for RAG chatbot implementation.

**Rationale**:
- Constitution mandates OpenAI Agents SDK (Principle IV)
- Built-in conversation management
- Easy integration with custom tools/functions
- Supports streaming responses
- Works well with RAG pattern

**Implementation Pattern**:
- Use Qdrant as retriever for book content
- Create custom tool for "selected text" queries
- Stream responses for better UX

**Version**: openai-agents 0.0.x (latest)

---

### 4. Vector Database: Qdrant Cloud Free Tier

**Decision**: Use Qdrant Cloud Free Tier for storing and searching book content embeddings.

**Rationale**:
- Constitution mandates Qdrant Cloud (Principle IV)
- Free tier supports up to 1GB storage
- Excellent for semantic search on textbook content
- REST and gRPC APIs
- Easy Python client integration

**Embedding Strategy**:
- Split chapters into chunks (~500 tokens)
- Use OpenAI text-embedding-3-small for embeddings
- Store metadata: chapter, module, section

**Version**: qdrant-client 1.12.x

---

### 5. Database: Neon Serverless Postgres

**Decision**: Use Neon Serverless Postgres for relational data (users, profiles, chat history).

**Rationale**:
- Constitution mandates Neon (Principle IV, V)
- Serverless scaling for hackathon workload
- Free tier available
- Standard PostgreSQL compatibility
- Works well with SQLAlchemy/asyncpg

**Schema Coverage**:
- Users table: auth credentials
- UserProfiles table: software/hardware background
- ChatMessages table: conversation history (optional)

**Version**: Neon Free Tier, asyncpg 0.29.x

---

### 6. Authentication: Better-Auth

**Decision**: Use Better-Auth for user authentication.

**Rationale**:
- Constitution mandates Better-Auth (Principle V)
- Modern auth library with session management
- Supports email/password authentication
- Easy integration with React/Next.js
- Built-in security best practices

**Integration Points**:
- Signup form with background questions
- Login/logout flows
- Session token management
- Protected routes for personalization

**Version**: better-auth latest

---

### 7. Translation Strategy: OpenAI GPT-4

**Decision**: Use OpenAI GPT-4 for English to Urdu translation.

**Rationale**:
- High-quality translations for educational content
- Already using OpenAI for chatbot (single vendor)
- Handles technical terminology well
- Can preserve code blocks and formatting

**Caching Strategy**:
- Cache translated chapters in memory/database
- Invalidate on content update
- Pre-translate high-priority chapters

**Alternatives Considered**:
- Google Translate API: Good but adds vendor
- Azure Translator: Similar to Google
- Local models: Quality concerns for Urdu

---

### 8. Podcast Generation: NotebookLM + TTS

**Decision**: Use NotebookLM for English podcast generation, TTS for Urdu.

**Rationale**:
- NotebookLM creates engaging conversational podcasts
- Specifically recommended in hackathon requirements
- For Urdu: Use Azure Speech or ElevenLabs TTS

**Workflow**:
1. Export chapter content to NotebookLM
2. Generate English podcast
3. Translate script to Urdu
4. Generate Urdu audio via TTS
5. Host as static audio files

---

### 9. Deployment: Vercel + Separate API

**Decision**: Deploy Docusaurus to Vercel, FastAPI to Vercel Serverless or Railway.

**Rationale**:
- Vercel has excellent Docusaurus support
- Free tier sufficient for hackathon
- Easy GitHub integration for CI/CD
- API can be deployed as serverless functions or separate service

**Architecture**:
```
┌─────────────────┐     ┌─────────────────┐
│   Docusaurus    │────▶│   FastAPI API   │
│   (Vercel)      │     │   (Vercel/Railway)│
└─────────────────┘     └─────────────────┘
         │                       │
         │                       ├──▶ Qdrant Cloud
         │                       ├──▶ Neon Postgres
         │                       └──▶ OpenAI API
         │
         └──▶ Static Assets (Podcasts)
```

---

### 10. Frontend Components: React + TypeScript

**Decision**: Build custom React components for chatbot, personalization, and translation.

**Rationale**:
- Docusaurus is React-based
- TypeScript for type safety
- Can use existing React component patterns

**Components to Build**:
- `<ChatBot />` - Floating widget, chat interface
- `<PersonalizeButton />` - Chapter header button
- `<TranslateButton />` - Language toggle
- `<AuthProvider />` - Context for user state
- `<PodcastPlayer />` - Audio player component

---

## Content Structure Research

### Course Module Mapping

Based on the 13-week syllabus:

| Module | Weeks | Chapters |
|--------|-------|----------|
| 1. ROS 2 Fundamentals | 1-5 | Introduction, Physical AI, Nodes/Topics, URDF |
| 2. Gazebo & Unity | 6-7 | Simulation, Physics, Sensors |
| 3. NVIDIA Isaac | 8-10 | Isaac Sim, Perception, RL, Sim-to-Real |
| 4. VLA & Capstone | 11-13 | Whisper, LLM Planning, Final Project |

### Chapter Template

Each chapter should include:
1. Learning Objectives
2. Prerequisites
3. Core Content (theory + examples)
4. Code Examples (runnable)
5. Exercises
6. Summary
7. Further Reading

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| OpenAI API rate limits | Implement caching, use efficient prompts |
| Qdrant free tier limits | Optimize chunk size, monitor usage |
| Translation quality | Human review of key chapters |
| Podcast generation time | Pre-generate before deadline |
| Better-Auth learning curve | Follow official docs, simple flow first |

---

## Research Complete

All technology decisions align with constitution requirements. Ready to proceed to Phase 1: Design.
