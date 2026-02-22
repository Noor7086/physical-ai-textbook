"""Personalization router for content adaptation based on user profile."""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional

from routers.auth import require_auth
from services.personalization_service import PersonalizationService

router = APIRouter()
personalization_service = PersonalizationService()


class PersonalizeRequest(BaseModel):
    """Request model for content personalization."""
    chapter_slug: str
    content: str


class PersonalizeResponse(BaseModel):
    """Response model for personalized content."""
    personalized_content: str
    adaptations_made: List[str]


@router.post("", response_model=PersonalizeResponse)
async def personalize_content(
    request: PersonalizeRequest,
    user: dict = Depends(require_auth),
):
    """
    Personalize chapter content based on user's background profile.
    Adapts technical depth and explanations to match user's experience level.
    """
    try:
        result = await personalization_service.personalize(
            content=request.content,
            chapter_slug=request.chapter_slug,
            user_id=user["id"],
        )
        return PersonalizeResponse(
            personalized_content=result["personalized_content"],
            adaptations_made=result.get("adaptations_made", []),
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
