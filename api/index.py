"""
Vercel Serverless entry point for FastAPI.
Vercel expects a module-level `app` variable (ASGI/WSGI).
"""
from main import app  # noqa: F401 — Vercel picks this up automatically
