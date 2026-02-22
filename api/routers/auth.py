"""Authentication router for user signup, login, and profile management."""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, Any
from enum import Enum
from datetime import datetime
import uuid

from services.auth_service import AuthService
from db.neon import get_db_session

router = APIRouter()
security = HTTPBearer(auto_error=False)
auth_service = AuthService()


class SkillLevel(str, Enum):
    """Skill level enumeration."""
    none = "none"
    beginner = "beginner"
    intermediate = "intermediate"
    expert = "expert"


class UserProfileInput(BaseModel):
    """Input model for user profile during signup."""
    python_level: SkillLevel
    ros_level: SkillLevel
    ml_level: SkillLevel
    arduino_experience: bool = False
    jetson_experience: bool = False
    robot_experience: bool = False
    learning_goals: Optional[str] = None


class SignupRequest(BaseModel):
    """Request model for user signup."""
    email: EmailStr
    password: str
    profile: UserProfileInput


class LoginRequest(BaseModel):
    """Request model for user login."""
    email: EmailStr
    password: str


def _str_ids(d: dict) -> dict:
    """Convert any UUID values to strings in a dict."""
    return {k: str(v) if hasattr(v, 'hex') and hasattr(v, 'int') else v for k, v in d.items()}


class User(BaseModel):
    """User model for responses."""
    id: str
    email: str
    created_at: datetime


class UserProfile(BaseModel):
    """User profile model for responses."""
    id: str
    user_id: str
    python_level: SkillLevel
    ros_level: SkillLevel
    ml_level: SkillLevel
    arduino_experience: bool
    jetson_experience: bool
    robot_experience: bool
    learning_goals: Optional[str]
    created_at: datetime


class UserWithProfile(BaseModel):
    """User with profile model for responses."""
    id: str
    email: str
    created_at: datetime
    profile: Optional[UserProfile]


class AuthResponse(BaseModel):
    """Response model for authentication endpoints."""
    user: User
    token: str
    expires_at: datetime


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> Optional[dict]:
    """Dependency to get current authenticated user."""
    if not credentials:
        return None
    try:
        user = await auth_service.verify_token(credentials.credentials)
        return user
    except Exception:
        return None


async def require_auth(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Dependency to require authentication."""
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        user = await auth_service.verify_token(credentials.credentials)
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.post("/signup", response_model=AuthResponse, status_code=201)
async def signup(request: SignupRequest):
    """
    Create a new user account.
    Collects email, password, and background profile for personalization.
    """
    try:
        result = await auth_service.signup(
            email=request.email,
            password=request.password,
            profile=request.profile.model_dump(),
        )
        user_data = _str_ids(result["user"])
        return AuthResponse(
            user=User(
                id=user_data["id"],
                email=user_data["email"],
                created_at=user_data["created_at"],
            ),
            token=result["token"],
            expires_at=result["expires_at"],
        )
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """
    Log in to an existing account.
    Returns a JWT token for authenticated requests.
    """
    try:
        result = await auth_service.login(
            email=request.email,
            password=request.password,
        )
        user_data = _str_ids(result["user"])
        return AuthResponse(
            user=User(
                id=user_data["id"],
                email=user_data["email"],
                created_at=user_data["created_at"],
            ),
            token=result["token"],
            expires_at=result["expires_at"],
        )
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/logout")
async def logout(user: dict = Depends(require_auth)):
    """
    Log out the current user.
    Invalidates the current session token.
    """
    try:
        await auth_service.logout(user["id"])
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/me", response_model=UserWithProfile)
async def get_current_user_profile(user: dict = Depends(require_auth)):
    """
    Get the current user's profile.
    Returns user information with background profile for personalization.
    """
    try:
        profile = await auth_service.get_user_with_profile(user["id"])
        profile = _str_ids(profile)
        if profile.get("profile"):
            profile["profile"] = _str_ids(profile["profile"])
        return UserWithProfile(**profile)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
