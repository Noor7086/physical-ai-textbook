# Data Model: Physical AI & Humanoid Robotics Textbook

**Feature Branch**: `001-physical-ai-textbook`
**Created**: 2025-02-06

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│      User       │───────│   UserProfile   │
└─────────────────┘  1:1  └─────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────┐
│   ChatMessage   │
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│     Module      │───────│     Chapter     │
└─────────────────┘  1:N  └─────────────────┘

┌─────────────────┐
│     Podcast     │
└─────────────────┘

┌─────────────────┐
│  ChapterChunk   │  (Vector DB - Qdrant)
└─────────────────┘
```

## Entities

### User (Neon Postgres)

Stores authentication credentials for registered users.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

**Indexes**: `email` (unique)

---

### UserProfile (Neon Postgres)

Stores background information collected during signup for personalization.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Unique profile identifier |
| user_id | UUID | FK → User.id, UNIQUE | Reference to user |
| python_level | ENUM | NOT NULL | 'beginner', 'intermediate', 'expert' |
| ros_level | ENUM | NOT NULL | 'none', 'beginner', 'intermediate', 'expert' |
| ml_level | ENUM | NOT NULL | 'none', 'beginner', 'intermediate', 'expert' |
| arduino_experience | BOOLEAN | NOT NULL, DEFAULT FALSE | Has Arduino experience |
| jetson_experience | BOOLEAN | NOT NULL, DEFAULT FALSE | Has Jetson experience |
| robot_experience | BOOLEAN | NOT NULL, DEFAULT FALSE | Has worked with robots |
| learning_goals | TEXT | NULLABLE | Free-form learning goals |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Profile creation timestamp |

**Indexes**: `user_id` (unique foreign key)

---

### ChatMessage (Neon Postgres - Optional)

Stores conversation history for analytics and context.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Unique message identifier |
| user_id | UUID | FK → User.id, NULLABLE | Reference to user (null for anonymous) |
| session_id | VARCHAR(64) | NOT NULL | Session identifier for grouping |
| role | ENUM | NOT NULL | 'user' or 'assistant' |
| content | TEXT | NOT NULL | Message content |
| referenced_chapters | VARCHAR[] | NULLABLE | Array of chapter slugs referenced |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Message timestamp |

**Indexes**: `session_id`, `user_id`, `created_at`

---

### Module (Static Content - Docusaurus)

Represents a course module. Stored as Docusaurus category configuration.

| Field | Type | Description |
|-------|------|-------------|
| slug | STRING | URL-safe identifier (e.g., "ros2-fundamentals") |
| title | STRING | Display title |
| description | STRING | Module description |
| position | INTEGER | Display order (1-4) |
| chapters | Chapter[] | List of chapters in module |

**Storage**: `docs/<module-slug>/_category_.json`

---

### Chapter (Static Content - Docusaurus)

Represents a textbook chapter. Stored as MDX files.

| Field | Type | Description |
|-------|------|-------------|
| slug | STRING | URL-safe identifier (e.g., "ros2-nodes-topics") |
| title | STRING | Chapter title |
| module_slug | STRING | Parent module reference |
| position | INTEGER | Display order within module |
| content | MARKDOWN | Full chapter content in MDX |
| code_examples | CodeBlock[] | Embedded code examples |
| learning_objectives | STRING[] | List of learning objectives |

**Storage**: `docs/<module-slug>/<chapter-slug>.mdx`

**Frontmatter Schema**:
```yaml
---
sidebar_position: 1
title: "ROS 2 Nodes and Topics"
description: "Learn about ROS 2 communication patterns"
learning_objectives:
  - "Understand ROS 2 node architecture"
  - "Create publishers and subscribers"
  - "Use topics for inter-node communication"
---
```

---

### ChapterChunk (Qdrant Vector DB)

Stores embedded chunks of chapter content for RAG retrieval.

| Field | Type | Description |
|-------|------|-------------|
| id | STRING | Unique chunk identifier |
| vector | FLOAT[1536] | OpenAI text-embedding-3-small vector |
| chapter_slug | STRING | Source chapter reference |
| module_slug | STRING | Source module reference |
| content | STRING | Chunk text content (~500 tokens) |
| heading | STRING | Section heading if available |
| position | INTEGER | Position within chapter |

**Qdrant Collection**: `textbook_chunks`

**Payload Schema**:
```json
{
  "chapter_slug": "ros2-nodes-topics",
  "module_slug": "ros2-fundamentals",
  "content": "ROS 2 nodes are the fundamental...",
  "heading": "Understanding Nodes",
  "position": 3
}
```

---

### Podcast (Static Content)

Represents a podcast episode. Stored as static audio files with metadata.

| Field | Type | Description |
|-------|------|-------------|
| id | STRING | Unique podcast identifier |
| title | STRING | Episode title |
| description | STRING | Episode description |
| audio_url_en | STRING | URL to English audio file |
| audio_url_ur | STRING | URL to Urdu audio file |
| duration_seconds | INTEGER | Episode duration |
| related_chapters | STRING[] | Related chapter slugs |
| created_at | DATE | Publication date |

**Storage**: 
- Audio files: `static/podcasts/<id>-en.mp3`, `static/podcasts/<id>-ur.mp3`
- Metadata: `src/data/podcasts.json`

---

## Validation Rules

### User
- Email must be valid email format
- Password must be at least 8 characters before hashing

### UserProfile
- All level fields must be valid enum values
- user_id must reference existing User

### ChatMessage
- content must not be empty
- role must be 'user' or 'assistant'

### ChapterChunk
- content must be 100-600 tokens
- vector must be 1536 dimensions (OpenAI embedding size)

---

## State Transitions

### User Registration Flow

```
Anonymous → [Sign Up Form] → User Created → [Profile Form] → Profile Created
```

### Personalization Flow

```
Chapter Loaded → [Click Personalize] → Fetch Profile → Generate Personalized Content → Display
```

### Translation Flow

```
English Content → [Click اردو] → Translate via API → Cache Result → Display RTL
                                       ↓
                               [Click English] → Restore Original
```

---

## Database Schema (SQL)

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- User profiles table
CREATE TYPE skill_level AS ENUM ('none', 'beginner', 'intermediate', 'expert');

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    python_level skill_level NOT NULL DEFAULT 'beginner',
    ros_level skill_level NOT NULL DEFAULT 'none',
    ml_level skill_level NOT NULL DEFAULT 'none',
    arduino_experience BOOLEAN NOT NULL DEFAULT FALSE,
    jetson_experience BOOLEAN NOT NULL DEFAULT FALSE,
    robot_experience BOOLEAN NOT NULL DEFAULT FALSE,
    learning_goals TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Chat messages table (optional)
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(64) NOT NULL,
    role VARCHAR(16) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    referenced_chapters VARCHAR[] DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_user ON chat_messages(user_id);
```
