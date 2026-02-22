"""Authentication service using Better-Auth patterns."""
import os
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import bcrypt
from jose import jwt, JWTError
import uuid

from db.neon import DatabaseService


class AuthService:
    """Authentication service for user management."""

    def __init__(self):
        self.secret_key = os.getenv("BETTER_AUTH_SECRET", "development-secret-key")
        self.algorithm = "HS256"
        self.access_token_expire_hours = 24
        self.db = DatabaseService()

    def _hash_password(self, password: str) -> str:
        """Hash a password using bcrypt (auto-truncates to 72 bytes)."""
        pw_bytes = password.encode("utf-8")[:72]
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(pw_bytes, salt).decode("utf-8")

    def _verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash."""
        pw_bytes = plain_password.encode("utf-8")[:72]
        return bcrypt.checkpw(pw_bytes, hashed_password.encode("utf-8"))

    def _create_token(self, user_id: str) -> tuple[str, datetime]:
        """Create a JWT token for a user."""
        expires_at = datetime.utcnow() + timedelta(hours=self.access_token_expire_hours)
        payload = {
            "sub": user_id,
            "exp": expires_at,
            "iat": datetime.utcnow(),
        }
        token = jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
        return token, expires_at

    async def verify_token(self, token: str) -> Dict[str, Any]:
        """Verify a JWT token and return user data."""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            user_id = payload.get("sub")
            if user_id is None:
                raise ValueError("Invalid token")

            user = await self.db.get_user_by_id(user_id)
            if user is None:
                raise ValueError("User not found")

            return user
        except JWTError as e:
            raise ValueError(f"Invalid token: {str(e)}")

    async def signup(
        self,
        email: str,
        password: str,
        profile: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Create a new user account with profile."""
        # Check if email already exists
        existing_user = await self.db.get_user_by_email(email)
        if existing_user:
            raise ValueError("Email already registered")

        # Create user
        user_id = str(uuid.uuid4())
        password_hash = self._hash_password(password)

        user = await self.db.create_user(
            user_id=user_id,
            email=email,
            password_hash=password_hash,
        )

        # Create profile
        profile_id = str(uuid.uuid4())
        await self.db.create_user_profile(
            profile_id=profile_id,
            user_id=user_id,
            **profile,
        )

        # Generate token
        token, expires_at = self._create_token(user_id)

        return {
            "user": user,
            "token": token,
            "expires_at": expires_at,
        }

    async def login(
        self,
        email: str,
        password: str,
    ) -> Dict[str, Any]:
        """Log in a user and return a token."""
        user = await self.db.get_user_by_email(email)
        if user is None:
            raise ValueError("Invalid email or password")

        if not self._verify_password(password, user["password_hash"]):
            raise ValueError("Invalid email or password")

        token, expires_at = self._create_token(user["id"])

        return {
            "user": {
                "id": user["id"],
                "email": user["email"],
                "created_at": user["created_at"],
            },
            "token": token,
            "expires_at": expires_at,
        }

    async def logout(self, user_id: str) -> None:
        """Log out a user (invalidate session if using session store)."""
        # For stateless JWT, logout is handled client-side
        # This method exists for future session store implementation
        pass

    async def get_user_with_profile(self, user_id: str) -> Dict[str, Any]:
        """Get user with their profile."""
        user = await self.db.get_user_by_id(user_id)
        if user is None:
            raise ValueError("User not found")

        profile = await self.db.get_user_profile(user_id)

        return {
            "id": user["id"],
            "email": user["email"],
            "created_at": user["created_at"],
            "profile": profile,
        }
