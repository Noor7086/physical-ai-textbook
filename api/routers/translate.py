"""Translation router for English to Urdu content translation."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.translation_service import TranslationService

router = APIRouter()
translation_service = TranslationService()


class TranslateRequest(BaseModel):
    """Request model for content translation."""
    content: str
    chapter_slug: str


class TranslateResponse(BaseModel):
    """Response model for translated content."""
    translated_content: str
    cached: bool


@router.post("", response_model=TranslateResponse)
async def translate_to_urdu(request: TranslateRequest):
    """
    Translate chapter content from English to Urdu.
    Preserves technical terms and code blocks while translating explanatory text.
    """
    try:
        result = await translation_service.translate_to_urdu(
            content=request.content,
            chapter_slug=request.chapter_slug,
        )
        return TranslateResponse(
            translated_content=result["translated_content"],
            cached=result.get("cached", False),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
