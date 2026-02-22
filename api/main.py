"""
Physical AI Textbook API
FastAPI backend for RAG chatbot, authentication, personalization, and translation.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from routers import chat, auth, personalize, translate


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup and shutdown events."""
    is_serverless = os.getenv("VERCEL", "") == "1"

    if not is_serverless:
        from db.neon import get_pool, close_pool
        # Startup — only create persistent pool for local dev
        print("Starting Physical AI Textbook API...")
        await get_pool()
        yield
        # Shutdown
        print("Shutting down Physical AI Textbook API...")
        await close_pool()
    else:
        # Serverless: pool is created on-demand per request via get_db_session()
        yield


app = FastAPI(
    title="Physical AI Textbook API",
    description="Backend API for RAG chatbot, authentication, personalization, and translation",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(personalize.router, prefix="/api/personalize", tags=["personalization"])
app.include_router(translate.router, prefix="/api/translate", tags=["translation"])


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Physical AI Textbook API",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
