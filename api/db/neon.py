"""Neon Postgres database service with asyncpg."""
import os
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from contextlib import asynccontextmanager

import asyncpg

logger = logging.getLogger(__name__)

# Connection pool (module-level singleton)
_pool: Optional[asyncpg.Pool] = None


async def get_pool() -> Optional[asyncpg.Pool]:
    """Get or create the connection pool."""
    global _pool
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        logger.warning("DATABASE_URL not set — using in-memory fallback")
        return None
    if _pool is None:
        # Neon requires SSL
        _pool = await asyncpg.create_pool(
            database_url,
            min_size=1,
            max_size=5,
            ssl="require",
        )
        logger.info("Database pool created")
    return _pool


async def close_pool():
    """Close the connection pool."""
    global _pool
    if _pool:
        await _pool.close()
        _pool = None
        logger.info("Database pool closed")


def _serialize_row(row) -> Dict[str, Any]:
    """Convert asyncpg Record to dict with UUID/datetime as strings."""
    d = dict(row)
    for k, v in d.items():
        if hasattr(v, 'hex') and hasattr(v, 'int'):  # UUID
            d[k] = str(v)
        elif isinstance(v, datetime):
            d[k] = v
    return d


class DatabaseService:
    """Database service for user and profile management.

    Uses asyncpg with Neon Postgres when DATABASE_URL is set,
    otherwise falls back to in-memory dictionaries for local dev.
    """

    # In-memory fallback stores
    _users: Dict[str, Dict[str, Any]] = {}
    _profiles: Dict[str, Dict[str, Any]] = {}

    def __init__(self, pool: Optional[asyncpg.Pool] = None):
        self._pool = pool

    async def _get_pool(self) -> Optional[asyncpg.Pool]:
        """Lazily get the connection pool (important for serverless)."""
        if self._pool is None:
            self._pool = await get_pool()
        return self._pool

    @property
    def _use_db(self) -> bool:
        # Check if DATABASE_URL is set — pool will be created lazily
        return self._pool is not None or bool(os.getenv("DATABASE_URL"))

    # ── User CRUD ──────────────────────────────────────────────

    async def create_user(
        self,
        user_id: str,
        email: str,
        password_hash: str,
    ) -> Dict[str, Any]:
        """Create a new user."""
        if self._use_db:
            pool = await self._get_pool()
            row = await pool.fetchrow(
                """
                INSERT INTO users (id, email, password_hash)
                VALUES ($1, $2, $3)
                RETURNING id, email, created_at
                """,
                user_id,
                email,
                password_hash,
            )
            return _serialize_row(row)

        # In-memory fallback
        now = datetime.utcnow()
        user = {
            "id": user_id,
            "email": email,
            "password_hash": password_hash,
            "created_at": now,
            "updated_at": now,
        }
        self._users[user_id] = user
        return {"id": user_id, "email": email, "created_at": now}

    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get a user by ID."""
        if self._use_db:
            pool = await self._get_pool()
            row = await pool.fetchrow(
                "SELECT id, email, password_hash, created_at, updated_at FROM users WHERE id = $1",
                user_id,
            )
            return _serialize_row(row) if row else None

        return self._users.get(user_id)

    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get a user by email."""
        if self._use_db:
            pool = await self._get_pool()
            row = await pool.fetchrow(
                "SELECT id, email, password_hash, created_at, updated_at FROM users WHERE email = $1",
                email,
            )
            return _serialize_row(row) if row else None

        for user in self._users.values():
            if user["email"] == email:
                return user
        return None

    # ── Profile CRUD ───────────────────────────────────────────

    async def create_user_profile(
        self,
        profile_id: str,
        user_id: str,
        python_level: str,
        ros_level: str,
        ml_level: str,
        arduino_experience: bool = False,
        jetson_experience: bool = False,
        robot_experience: bool = False,
        learning_goals: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Create a user profile."""
        if self._use_db:
            pool = await self._get_pool()
            row = await pool.fetchrow(
                """
                INSERT INTO user_profiles
                    (id, user_id, python_level, ros_level, ml_level,
                     arduino_experience, jetson_experience, robot_experience, learning_goals)
                VALUES ($1, $2, $3::skill_level, $4::skill_level, $5::skill_level,
                        $6, $7, $8, $9)
                RETURNING *
                """,
                profile_id,
                user_id,
                python_level,
                ros_level,
                ml_level,
                arduino_experience,
                jetson_experience,
                robot_experience,
                learning_goals,
            )
            return _serialize_row(row)

        # In-memory fallback
        now = datetime.utcnow()
        profile = {
            "id": profile_id,
            "user_id": user_id,
            "python_level": python_level,
            "ros_level": ros_level,
            "ml_level": ml_level,
            "arduino_experience": arduino_experience,
            "jetson_experience": jetson_experience,
            "robot_experience": robot_experience,
            "learning_goals": learning_goals,
            "created_at": now,
        }
        self._profiles[user_id] = profile
        return profile

    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get a user's profile."""
        if self._use_db:
            pool = await self._get_pool()
            row = await pool.fetchrow(
                "SELECT * FROM user_profiles WHERE user_id = $1",
                user_id,
            )
            return _serialize_row(row) if row else None

        return self._profiles.get(user_id)

    async def update_user_profile(
        self,
        user_id: str,
        **updates,
    ) -> Optional[Dict[str, Any]]:
        """Update a user's profile."""
        if self._use_db:
            # Build SET clause dynamically from provided updates
            allowed = {
                "python_level", "ros_level", "ml_level",
                "arduino_experience", "jetson_experience",
                "robot_experience", "learning_goals",
            }
            filtered = {k: v for k, v in updates.items() if k in allowed}
            if not filtered:
                return await self.get_user_profile(user_id)

            set_parts = []
            values = []
            for i, (key, val) in enumerate(filtered.items(), start=2):
                if key in ("python_level", "ros_level", "ml_level"):
                    set_parts.append(f"{key} = ${i}::skill_level")
                else:
                    set_parts.append(f"{key} = ${i}")
                values.append(val)

            pool = await self._get_pool()
            query = f"UPDATE user_profiles SET {', '.join(set_parts)} WHERE user_id = $1 RETURNING *"
            row = await pool.fetchrow(query, user_id, *values)
            return _serialize_row(row) if row else None

        # In-memory fallback
        profile = self._profiles.get(user_id)
        if profile:
            profile.update(updates)
            return profile
        return None

    # ── Chat Messages ──────────────────────────────────────────

    async def save_chat_message(
        self,
        message_id: str,
        session_id: str,
        role: str,
        content: str,
        user_id: Optional[str] = None,
        referenced_chapters: Optional[list] = None,
    ) -> Optional[Dict[str, Any]]:
        """Save a chat message (only when DB is available)."""
        if not self._use_db:
            return None

        pool = await self._get_pool()
        row = await pool.fetchrow(
            """
            INSERT INTO chat_messages (id, user_id, session_id, role, content, referenced_chapters)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, session_id, role, created_at
            """,
            message_id,
            user_id,
            session_id,
            role,
            content,
            referenced_chapters or [],
        )
        return _serialize_row(row) if row else None


@asynccontextmanager
async def get_db_session():
    """Get a database session backed by the connection pool."""
    pool = await get_pool()
    db = DatabaseService(pool=pool)
    try:
        yield db
    finally:
        pass  # Pool handles connection lifecycle
