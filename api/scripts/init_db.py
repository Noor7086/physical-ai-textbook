"""Database initialization script for Neon Postgres."""
import asyncio
import os
import asyncpg
from dotenv import load_dotenv

load_dotenv()

SCHEMA_SQL = """
-- Create skill_level enum type if not exists
DO $$ BEGIN
    CREATE TYPE skill_level AS ENUM ('none', 'beginner', 'intermediate', 'expert');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
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

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(64) NOT NULL,
    role VARCHAR(16) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    referenced_chapters VARCHAR[] DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);
"""


async def init_database():
    """Initialize the database schema."""
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("DATABASE_URL not set. Skipping database initialization.")
        return

    # Convert SQLAlchemy URL to asyncpg format
    db_url = database_url.replace("postgresql+asyncpg://", "postgresql://")

    print(f"Connecting to database...")
    conn = await asyncpg.connect(db_url)

    try:
        print("Creating tables...")
        await conn.execute(SCHEMA_SQL)
        print("Database initialized successfully.")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(init_database())
