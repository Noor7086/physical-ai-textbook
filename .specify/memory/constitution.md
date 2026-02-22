<!--
  SYNC IMPACT REPORT
  ==================
  Version change: 0.0.0 → 1.0.0 (Initial constitution)
  
  Added Principles:
  - I. Content-First Development
  - II. Spec-Driven Workflow
  - III. Bilingual Accessibility
  - IV. AI-Native Integration
  - V. User-Centric Personalization
  - VI. Deployability & Demo-Ready
  
  Added Sections:
  - Technical Standards
  - Quality Gates
  - Governance
  
  Templates Status:
  - .specify/templates/plan-template.md ✅ (compatible, no changes needed)
  - .specify/templates/spec-template.md ✅ (compatible, no changes needed)
  - .specify/templates/tasks-template.md ✅ (compatible, no changes needed)
  
  Follow-up TODOs: None
-->

# Physical AI & Humanoid Robotics Textbook Constitution

## Core Principles

### I. Content-First Development

The textbook content is the primary deliverable. All technical features (chatbot, auth, personalization) exist to enhance the learning experience, not replace it.

- Content MUST follow the official 13-week course syllabus with 4 modules
- Each chapter MUST include learning objectives, core content, code examples, and exercises
- Technical accuracy MUST be verified against official documentation (ROS 2, NVIDIA Isaac, Gazebo)
- Code examples MUST be runnable and tested in the target environment

### II. Spec-Driven Workflow

All features MUST follow the Spec-Driven Development (SDD) workflow using Spec-Kit Plus.

- Every feature begins with a specification (`spec.md`) before implementation
- Implementation plans (`plan.md`) MUST be created before coding
- Tasks (`tasks.md`) MUST be broken down into independently testable units
- Prompt History Records (PHRs) MUST be created for all significant work sessions
- Architecture Decision Records (ADRs) MUST document significant technical choices

### III. Bilingual Accessibility

The textbook MUST be accessible in both English and Urdu to serve the Pakistani developer community.

- Primary content MUST be written in English
- Urdu translation MUST be available via a chapter-level toggle button
- Urdu content MUST display with proper RTL (right-to-left) styling
- Podcasts MUST be generated in both English and Urdu
- Technical terms MAY remain in English with Urdu explanations where helpful

### IV. AI-Native Integration

The textbook MUST leverage AI to enhance the learning experience through intelligent features.

- RAG chatbot MUST be embedded and able to answer questions about book content
- Chatbot MUST support "selected text" queries (answer questions about highlighted content)
- OpenAI Agents SDK MUST be used for chatbot intelligence
- Qdrant Cloud MUST be used for vector storage (Free Tier)
- Neon Serverless Postgres MUST be used for relational data

### V. User-Centric Personalization

Content MUST adapt to the user's background and learning needs when authenticated.

- Signup flow MUST collect user's software background (Python, ROS, ML experience)
- Signup flow MUST collect user's hardware background (Arduino, Jetson, robots)
- Personalization button MUST adapt chapter content based on user profile
- Better-Auth MUST be used for authentication
- User profiles MUST be stored in Neon Postgres

### VI. Deployability & Demo-Ready

The project MUST be deployable and demonstrable at all times.

- Docusaurus MUST be used as the book framework
- Deployment MUST work on GitHub Pages or Vercel
- Demo video MUST be under 90 seconds
- All features MUST be functional in the deployed environment
- Environment variables MUST be properly configured for production

## Technical Standards

### Technology Stack

| Component | Technology | Requirement |
|-----------|------------|-------------|
| Book Framework | Docusaurus 3.x | MUST use |
| Backend API | FastAPI | MUST use |
| AI/Chatbot | OpenAI Agents SDK | MUST use |
| Vector DB | Qdrant Cloud Free Tier | MUST use |
| Database | Neon Serverless Postgres | MUST use |
| Authentication | Better-Auth | MUST use for bonus |
| Deployment | GitHub Pages or Vercel | MUST use |

### Code Quality

- Python code MUST follow PEP 8 style guidelines
- TypeScript/JavaScript MUST use ESLint with recommended rules
- All API endpoints MUST have proper error handling
- Secrets MUST NOT be committed to the repository
- Environment variables MUST be documented in `.env.example`

### Content Structure

```
docs/
├── 01-introduction-to-physical-ai/
├── 02-ros2-fundamentals/
├── 03-gazebo-simulation/
├── 04-unity-visualization/
├── 05-nvidia-isaac-platform/
├── 06-humanoid-development/
├── 07-conversational-robotics/
├── 08-capstone-project/
├── 09-hardware-guide/
└── 10-appendices/
```

## Quality Gates

### Before Merge

- [ ] Content reviewed for technical accuracy
- [ ] Code examples tested and working
- [ ] Urdu translations reviewed for accuracy (when applicable)
- [ ] Chatbot can answer questions about new content
- [ ] No console errors in browser
- [ ] Deployment preview works correctly

### Before Release

- [ ] All 4 course modules have complete content
- [ ] RAG chatbot functional with book content indexed
- [ ] Authentication flow works end-to-end (if implemented)
- [ ] Personalization feature works (if implemented)
- [ ] Translation toggle works (if implemented)
- [ ] Podcasts embedded and playable (if implemented)
- [ ] Demo video created (under 90 seconds)

## Governance

This constitution establishes the foundational principles for the Physical AI & Humanoid Robotics Textbook project. All development work MUST comply with these principles.

### Amendment Process

1. Propose amendment via Pull Request modifying this file
2. Document rationale for change
3. Update version number according to semantic versioning:
   - MAJOR: Principle removal or fundamental redefinition
   - MINOR: New principle or significant expansion
   - PATCH: Clarification or wording improvement
4. Update `LAST_AMENDED_DATE`
5. Review and merge

### Compliance

- All PRs MUST be reviewed against constitutional principles
- Violations MUST be documented with justification if unavoidable
- Plan template includes "Constitution Check" gate for validation

**Version**: 1.0.0 | **Ratified**: 2025-02-06 | **Last Amended**: 2025-02-06
