"""
Vercel Serverless entry point.
The api/ directory is auto-detected by Vercel as serverless functions.
"""
import os
import sys

# Ensure api/ is on path for sub-module imports
_dir = os.path.dirname(os.path.abspath(__file__))
if _dir not in sys.path:
    sys.path.insert(0, _dir)

from main import app  # noqa: F401 — Vercel auto-detects the `app` ASGI variable
