"""
Vercel Serverless entry point for FastAPI.
Ensures the api/ directory is on the Python path so all imports resolve.
"""
import os
import sys

# Add the api/ directory to Python path so main.py can import routers, services, db
api_dir = os.path.dirname(os.path.abspath(__file__))
if api_dir not in sys.path:
    sys.path.insert(0, api_dir)

from main import app  # noqa: F401
