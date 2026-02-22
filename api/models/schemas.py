"""Pydantic schemas for API request/response validation."""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum


class SkillLevel(str, Enum):
    """Skill level enumeration."""
    none = "none"
    beginner = "beginner"
    intermediate = "intermediate"
    expert = "expert"


# Chat Schemas
class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    message: str
    session_id: str
    chapter_context: Optional[str] = None


class ChapterReference(BaseModel):
    """Reference to a chapter in the response."""
    chapter_slug: str
    chapter_title: str
    module_slug: str
    relevance_score: float


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    response: str
    references: List[ChapterReference]
    session_id: str


class SelectedTextRequest(BaseModel):
    """Request model for selected text endpoint."""
    selected_text: str
    question: str
    chapter_slug: str


# Auth Schemas
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


# Personalization Schemas
class PersonalizeRequest(BaseModel):
    """Request model for content personalization."""
    chapter_slug: str
    content: str


class PersonalizeResponse(BaseModel):
    """Response model for personalized content."""
    personalized_content: str
    adaptations_made: List[str]


# Translation Schemas
class TranslateRequest(BaseModel):
    """Request model for content translation."""
    content: str
    chapter_slug: str


class TranslateResponse(BaseModel):
    """Response model for translated content."""
    translated_content: str
    cached: bool
