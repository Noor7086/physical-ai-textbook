"""Chat router for RAG chatbot endpoints."""
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
import json

from services.rag_service import RAGService

router = APIRouter()
rag_service = RAGService()


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


@router.post("", response_model=ChatResponse)
async def send_chat_message(request: ChatRequest):
    """
    Send a message to the chatbot.
    Uses RAG to find relevant textbook content and generate a response.
    """
    try:
        result = await rag_service.chat(
            message=request.message,
            session_id=request.session_id,
            chapter_context=request.chapter_context,
        )
        return ChatResponse(
            response=result["response"],
            references=[
                ChapterReference(**ref) for ref in result.get("references", [])
            ],
            session_id=request.session_id,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/stream")
async def send_chat_message_stream(request: ChatRequest):
    """
    Send a message with streaming response.
    Returns server-sent events for real-time chat experience.
    """
    async def generate():
        try:
            async for chunk in rag_service.chat_stream(
                message=request.message,
                session_id=request.session_id,
                chapter_context=request.chapter_context,
            ):
                yield f"data: {json.dumps(chunk)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
    )


@router.post("/selected-text", response_model=ChatResponse)
async def ask_about_selected_text(request: SelectedTextRequest):
    """
    Ask a question about user-selected text.
    Provides contextual explanation for highlighted content.
    """
    try:
        result = await rag_service.explain_selected_text(
            selected_text=request.selected_text,
            question=request.question,
            chapter_slug=request.chapter_slug,
        )
        return ChatResponse(
            response=result["response"],
            references=[
                ChapterReference(**ref) for ref in result.get("references", [])
            ],
            session_id="selected-text",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
