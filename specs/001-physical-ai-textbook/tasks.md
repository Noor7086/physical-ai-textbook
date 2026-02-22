# Tasks: Physical AI & Humanoid Robotics Textbook

**Input**: Design documents from `/specs/001-physical-ai-textbook/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/api.yaml ✅

## Format: `[ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5, US6)
- Include exact file paths in descriptions

## User Story Mapping

| Story | Priority | Description | Points |
|-------|----------|-------------|--------|
| US1 | P1 | Browse and Read Textbook Content | Base 100 |
| US2 | P1 | Ask Questions via RAG Chatbot | Base 100 |
| US3 | P2 | User Registration and Login | +50 Bonus |
| US4 | P2 | Personalize Chapter Content | +50 Bonus |
| US5 | P2 | Translate Content to Urdu | +50 Bonus |
| US6 | P3 | Listen to Educational Podcasts | Extra |

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize project structure for Docusaurus frontend and FastAPI backend

- [x] T001 Create root project structure with docusaurus/ and api/ directories
- [x] T002 Initialize Docusaurus project in docusaurus/ with TypeScript template
- [x] T003 [P] Configure docusaurus.config.ts with project metadata and theme settings
- [x] T004 [P] Create sidebars.ts with module structure for 4 course modules
- [x] T005 [P] Initialize FastAPI project in api/ with requirements.txt
- [x] T006 [P] Create api/.env.example with all required environment variables
- [x] T007 [P] Create docusaurus/.env.example with API URL configuration
- [x] T008 Configure CORS in api/main.py for frontend-backend communication
- [x] T009 [P] Create api/models/__init__.py and api/routers/__init__.py
- [x] T010 [P] Create api/services/__init__.py and api/db/__init__.py
- [x] T011 Set up GitHub repository with .gitignore for Python and Node.js

**Checkpoint**: Project scaffolding complete. Both `npm run start` and `uvicorn main:app` should run without errors.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T012 Create Pydantic schemas in api/models/schemas.py for all API contracts
- [x] T013 Set up Neon Postgres connection in api/db/neon.py with asyncpg
- [x] T014 Create database migration script in api/scripts/init_db.py
- [x] T015 [P] Set up Qdrant client in api/services/qdrant_client.py
- [x] T016 [P] Set up OpenAI client wrapper in api/services/openai_client.py
- [x] T017 Create base API router structure in api/main.py with health check endpoint
- [x] T018 Configure Vercel deployment for docusaurus/ in vercel.json
- [x] T019 [P] Create custom.css in docusaurus/src/css/custom.css with base styles
- [x] T020 [P] Create API service helper in docusaurus/src/services/api.ts

**Checkpoint**: Foundation ready. Database connects, Qdrant initializes, OpenAI client works. Frontend can call API.

---

## Phase 3: User Story 1 - Browse and Read Textbook Content (Priority: P1) 🎯 MVP

**Goal**: Complete textbook with all 4 modules and chapters accessible via navigation

**Independent Test**: Navigate to deployed URL, click through all modules, verify content renders with code highlighting

### Content Structure

- [x] T021 [P] [US1] Create Module 1 category in docusaurus/docs/01-introduction-to-physical-ai/_category_.json
- [x] T022 [P] [US1] Create Module 2 category in docusaurus/docs/02-ros2-fundamentals/_category_.json
- [x] T023 [P] [US1] Create Module 3 category in docusaurus/docs/03-gazebo-simulation/_category_.json
- [x] T024 [P] [US1] Create Module 4 category in docusaurus/docs/04-nvidia-isaac-platform/_category_.json
- [x] T025 [P] [US1] Create Module 5 category in docusaurus/docs/05-humanoid-development/_category_.json
- [x] T026 [P] [US1] Create Module 6 category in docusaurus/docs/06-conversational-robotics/_category_.json
- [x] T027 [P] [US1] Create Module 7 category in docusaurus/docs/07-capstone-project/_category_.json
- [x] T028 [P] [US1] Create Module 8 category in docusaurus/docs/08-hardware-guide/_category_.json

### Module 1: Introduction to Physical AI (Weeks 1-2)

- [x] T029 [P] [US1] Write index.mdx for Module 1 in docusaurus/docs/01-introduction-to-physical-ai/index.mdx
- [x] T030 [P] [US1] Write embodied-intelligence.mdx in docusaurus/docs/01-introduction-to-physical-ai/embodied-intelligence.mdx
- [x] T031 [P] [US1] Write sensor-systems.mdx in docusaurus/docs/01-introduction-to-physical-ai/sensor-systems.mdx
- [x] T032 [P] [US1] Write humanoid-landscape.mdx in docusaurus/docs/01-introduction-to-physical-ai/humanoid-landscape.mdx

### Module 2: ROS 2 Fundamentals (Weeks 3-5)

- [x] T033 [P] [US1] Write index.mdx for Module 2 in docusaurus/docs/02-ros2-fundamentals/index.mdx
- [x] T034 [P] [US1] Write nodes-topics-services.mdx in docusaurus/docs/02-ros2-fundamentals/nodes-topics-services.mdx
- [x] T035 [P] [US1] Write python-packages.mdx in docusaurus/docs/02-ros2-fundamentals/python-packages.mdx
- [x] T036 [P] [US1] Write launch-files.mdx in docusaurus/docs/02-ros2-fundamentals/launch-files.mdx
- [x] T037 [P] [US1] Write urdf-humanoids.mdx in docusaurus/docs/02-ros2-fundamentals/urdf-humanoids.mdx

### Module 3: Gazebo Simulation (Weeks 6-7)

- [x] T038 [P] [US1] Write index.mdx for Module 3 in docusaurus/docs/03-gazebo-simulation/index.mdx
- [x] T039 [P] [US1] Write physics-simulation.mdx in docusaurus/docs/03-gazebo-simulation/physics-simulation.mdx
- [x] T040 [P] [US1] Write sensor-simulation.mdx in docusaurus/docs/03-gazebo-simulation/sensor-simulation.mdx
- [x] T041 [P] [US1] Write unity-integration.mdx in docusaurus/docs/03-gazebo-simulation/unity-integration.mdx

### Module 4: NVIDIA Isaac Platform (Weeks 8-10)

- [x] T042 [P] [US1] Write index.mdx for Module 4 in docusaurus/docs/04-nvidia-isaac-platform/index.mdx
- [x] T043 [P] [US1] Write isaac-sim.mdx in docusaurus/docs/04-nvidia-isaac-platform/isaac-sim.mdx
- [x] T044 [P] [US1] Write perception-manipulation.mdx in docusaurus/docs/04-nvidia-isaac-platform/perception-manipulation.mdx
- [x] T045 [P] [US1] Write reinforcement-learning.mdx in docusaurus/docs/04-nvidia-isaac-platform/reinforcement-learning.mdx
- [x] T046 [P] [US1] Write sim-to-real.mdx in docusaurus/docs/04-nvidia-isaac-platform/sim-to-real.mdx

### Module 5: Humanoid Development (Weeks 11-12)

- [x] T047 [P] [US1] Write index.mdx for Module 5 in docusaurus/docs/05-humanoid-development/index.mdx
- [x] T048 [P] [US1] Write kinematics-dynamics.mdx in docusaurus/docs/05-humanoid-development/kinematics-dynamics.mdx
- [x] T049 [P] [US1] Write bipedal-locomotion.mdx in docusaurus/docs/05-humanoid-development/bipedal-locomotion.mdx
- [x] T050 [P] [US1] Write manipulation-grasping.mdx in docusaurus/docs/05-humanoid-development/manipulation-grasping.mdx

### Module 6: Conversational Robotics (Week 13)

- [x] T051 [P] [US1] Write index.mdx for Module 6 in docusaurus/docs/06-conversational-robotics/index.mdx
- [x] T052 [P] [US1] Write speech-recognition.mdx in docusaurus/docs/06-conversational-robotics/speech-recognition.mdx
- [x] T053 [P] [US1] Write voice-to-action.mdx in docusaurus/docs/06-conversational-robotics/voice-to-action.mdx
- [x] T054 [P] [US1] Write multimodal-interaction.mdx in docusaurus/docs/06-conversational-robotics/multimodal-interaction.mdx

### Module 7: Capstone Project

- [x] T055 [P] [US1] Write index.mdx for Capstone in docusaurus/docs/07-capstone-project/index.mdx
- [x] T056 [P] [US1] Write project-requirements.mdx in docusaurus/docs/07-capstone-project/project-requirements.mdx
- [x] T057 [P] [US1] Write implementation-guide.mdx in docusaurus/docs/07-capstone-project/implementation-guide.mdx

### Module 8: Hardware Guide

- [x] T058 [P] [US1] Write index.mdx for Hardware in docusaurus/docs/08-hardware-guide/index.mdx
- [x] T059 [P] [US1] Write workstation-setup.mdx in docusaurus/docs/08-hardware-guide/workstation-setup.mdx
- [x] T060 [P] [US1] Write jetson-kit.mdx in docusaurus/docs/08-hardware-guide/jetson-kit.mdx
- [x] T061 [P] [US1] Write robot-options.mdx in docusaurus/docs/08-hardware-guide/robot-options.mdx

### Deployment

- [x] T062 [US1] Deploy Docusaurus to Vercel and verify all chapters accessible
- [x] T063 [US1] Verify mobile responsiveness on deployed site

**Checkpoint**: US1 complete. All chapters accessible, navigation works, code highlighting works.

---

## Phase 4: User Story 2 - Ask Questions via RAG Chatbot (Priority: P1)

**Goal**: Embedded chatbot that answers questions using textbook content

**Independent Test**: Open chatbot, ask "What is ROS 2?", verify response cites chapter content

### Backend RAG Implementation

- [x] T064 [US2] Create content indexing script in api/scripts/index_content.py to chunk and embed chapters
- [x] T065 [US2] Implement RAG service in api/services/rag_service.py with Qdrant search
- [x] T066 [US2] Create chat router in api/routers/chat.py with /api/chat endpoint
- [x] T067 [US2] Implement streaming endpoint /api/chat/stream in api/routers/chat.py
- [x] T068 [US2] Implement selected-text endpoint /api/chat/selected-text in api/routers/chat.py
- [x] T069 [US2] Run content indexing script to populate Qdrant with chapter embeddings

### Frontend ChatBot Component

- [x] T070 [P] [US2] Create ChatBot component in docusaurus/src/components/ChatBot/index.tsx
- [x] T071 [P] [US2] Create ChatWidget UI in docusaurus/src/components/ChatBot/ChatWidget.tsx
- [x] T072 [P] [US2] Create ChatMessage component in docusaurus/src/components/ChatBot/ChatMessage.tsx
- [x] T073 [P] [US2] Create chatbot styles in docusaurus/src/components/ChatBot/styles.module.css
- [x] T074 [US2] Create useChat hook in docusaurus/src/hooks/useChat.ts for API integration
- [x] T075 [US2] Add ChatBot to Docusaurus theme wrapper for global availability
- [x] T076 [US2] Implement text selection detection for "Explain this" feature

### Integration

- [x] T077 [US2] Deploy API to Vercel/Railway and update frontend API_URL
- [x] T078 [US2] Test chatbot end-to-end with sample questions

**Checkpoint**: US2 complete. Chatbot opens from any page, answers questions with references.

---

## Phase 5: User Story 3 - User Registration and Login (Priority: P2)

**Goal**: Users can sign up with background profile and log in

**Independent Test**: Complete signup, logout, login again successfully

### Backend Auth Implementation

- [x] T079 [US3] Create users and user_profiles tables via api/scripts/init_db.py migration
- [x] T080 [US3] Implement Better-Auth integration in api/routers/auth.py
- [x] T081 [US3] Create /api/auth/signup endpoint with profile collection
- [x] T082 [US3] Create /api/auth/login endpoint with JWT token response
- [x] T083 [US3] Create /api/auth/logout endpoint
- [x] T084 [US3] Create /api/auth/me endpoint to get current user with profile
- [x] T085 [US3] Add authentication middleware in api/middleware/auth.py

### Frontend Auth Implementation

- [x] T086 [P] [US3] Create AuthProvider context in docusaurus/src/components/AuthProvider/context.tsx
- [x] T087 [P] [US3] Create AuthProvider component in docusaurus/src/components/AuthProvider/index.tsx
- [x] T088 [US3] Create useAuth hook in docusaurus/src/hooks/useAuth.ts
- [x] T089 [US3] Create signup page in docusaurus/src/pages/signup.tsx with profile form
- [x] T090 [US3] Create login page in docusaurus/src/pages/login.tsx
- [x] T091 [US3] Add Login/Signup buttons to navbar in docusaurus.config.ts
- [x] T092 [US3] Add user menu dropdown when logged in

**Checkpoint**: US3 complete. Signup collects background, login works, profile persists.

---

## Phase 6: User Story 4 - Personalize Chapter Content (Priority: P2)

**Goal**: Logged-in users can personalize chapter content based on their profile

**Independent Test**: Log in with beginner profile, click Personalize, see simplified content

### Backend Personalization

- [x] T093 [US4] Create personalization service in api/services/personalization.py
- [x] T094 [US4] Implement /api/personalize endpoint in api/routers/personalize.py
- [x] T095 [US4] Create personalization prompts based on user profile levels

### Frontend Personalization

- [x] T096 [P] [US4] Create PersonalizeButton component in docusaurus/src/components/PersonalizeButton/index.tsx
- [x] T097 [P] [US4] Create PersonalizeButton styles in docusaurus/src/components/PersonalizeButton/styles.module.css
- [x] T098 [US4] Integrate PersonalizeButton into MDX chapter template
- [x] T099 [US4] Handle personalized content display with loading state

**Checkpoint**: US4 complete. Personalize button adapts content based on user background.

---

## Phase 7: User Story 5 - Translate Content to Urdu (Priority: P2)

**Goal**: Users can toggle chapter content to Urdu with RTL formatting

**Independent Test**: Click Urdu button, verify RTL text displays correctly

### Backend Translation

- [x] T100 [US5] Create translation service in api/services/translation.py using OpenAI
- [x] T101 [US5] Implement /api/translate endpoint in api/routers/translate.py
- [x] T102 [US5] Add translation caching to avoid repeated API calls

### Frontend Translation

- [x] T103 [P] [US5] Create TranslateButton component in docusaurus/src/components/TranslateButton/index.tsx
- [x] T104 [P] [US5] Create TranslateButton styles in docusaurus/src/components/TranslateButton/styles.module.css
- [x] T105 [P] [US5] Create RTL stylesheet in docusaurus/src/css/rtl.css
- [x] T106 [US5] Integrate TranslateButton into MDX chapter template
- [x] T107 [US5] Handle RTL layout switching when Urdu content displayed

**Checkpoint**: US5 complete. Urdu translation displays with proper RTL formatting.

---

## Phase 8: User Story 6 - Listen to Educational Podcasts (Priority: P3)

**Goal**: Users can access and play podcast episodes in English and Urdu

**Independent Test**: Navigate to podcast page, play English and Urdu audio

### Podcast Generation

- [ ] T108 [P] [US6] Generate English podcast using NotebookLM from chapter content
- [ ] T109 [P] [US6] Create Urdu podcast script by translating English podcast
- [ ] T110 [P] [US6] Generate Urdu audio using TTS service (Azure/ElevenLabs)
- [ ] T111 [US6] Upload podcast files to docusaurus/static/podcasts/

### Frontend Podcast

- [x] T112 [P] [US6] Create podcast metadata in docusaurus/src/data/podcasts.json
- [x] T113 [P] [US6] Create PodcastPlayer component in docusaurus/src/components/PodcastPlayer/index.tsx
- [x] T114 [US6] Create podcast page in docusaurus/docs/09-podcasts/index.mdx
- [x] T115 [US6] Add podcast section to navigation in sidebars.ts

**Checkpoint**: US6 complete. Podcast page shows episodes, both languages playable.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final polish, testing, and demo preparation

- [x] T116 [P] Review and fix any console errors in browser
- [x] T117 [P] Optimize images and assets for faster loading
- [x] T118 [P] Add error handling for all API endpoints
- [x] T119 [P] Add loading states for all async operations
- [ ] T120 Test complete flow: signup → login → read → chat → personalize → translate
- [ ] T121 Create demo video script covering all features
- [ ] T122 Record demo video (under 90 seconds)
- [x] T123 Update README.md with project description and setup instructions
- [ ] T124 Final deployment verification on production URL

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ─── BLOCKS ALL USER STORIES
    ↓
┌───────────────────────────────────────────┐
│  Phase 3 (US1)  ──→  Phase 4 (US2)       │  P1 Features
│       ↓                   ↓               │
│  Phase 5 (US3)  ──→  Phase 6 (US4)       │  P2 Features (Auth → Personalize)
│       ↓                                   │
│  Phase 7 (US5)                           │  P2 Feature (Translation)
│       ↓                                   │
│  Phase 8 (US6)                           │  P3 Feature (Podcasts)
└───────────────────────────────────────────┘
    ↓
Phase 9 (Polish)
```

### User Story Dependencies

- **US1 (Content)**: No dependencies - can start after Foundational
- **US2 (Chatbot)**: Depends on US1 (needs content to index)
- **US3 (Auth)**: No dependencies on other stories
- **US4 (Personalize)**: Depends on US3 (needs authenticated user)
- **US5 (Translate)**: No dependencies on other stories
- **US6 (Podcasts)**: Depends on US1 (needs content for podcast)

### Parallel Opportunities

**Within Phase 1 (Setup)**:
```
T003, T004, T005, T006, T007, T009, T010 can all run in parallel
```

**Within Phase 3 (US1 Content)**:
```
All chapter writing tasks (T029-T061) can run in parallel
```

**Within Phase 4 (US2 Chatbot)**:
```
T070, T071, T072, T073 (frontend components) can run in parallel with backend tasks
```

**Cross-Story Parallelism (after Foundational)**:
```
US1 and US3 can start in parallel
US5 can run in parallel with US3/US4
```

---

## Implementation Strategy

### MVP First (US1 + US2 Only) - Base 100 Points

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Content)
4. Complete Phase 4: User Story 2 (Chatbot)
5. **STOP and VALIDATE**: Deploy and test end-to-end
6. Create demo video of MVP

### Incremental Delivery for Bonus Points

After MVP verified:
1. Add US3 (Auth) → +50 points potential
2. Add US4 (Personalize) → +50 points potential
3. Add US5 (Translate) → +50 points potential
4. Add US6 (Podcasts) → User-requested feature
5. Update demo video with all features

---

## Task Summary

| Phase | Story | Task Count | Parallel Tasks |
|-------|-------|------------|----------------|
| Phase 1 | Setup | 11 | 7 |
| Phase 2 | Foundational | 9 | 4 |
| Phase 3 | US1 (Content) | 43 | 41 |
| Phase 4 | US2 (Chatbot) | 15 | 4 |
| Phase 5 | US3 (Auth) | 14 | 2 |
| Phase 6 | US4 (Personalize) | 7 | 2 |
| Phase 7 | US5 (Translate) | 8 | 3 |
| Phase 8 | US6 (Podcasts) | 8 | 4 |
| Phase 9 | Polish | 9 | 4 |
| **Total** | | **124** | **71** |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- MVP = Phase 1-4 (Setup + Foundational + US1 + US2)
