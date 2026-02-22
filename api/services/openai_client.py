"""Lightweight OpenAI client using httpx instead of the heavy openai SDK."""
import os
import json
from typing import List, AsyncIterator

import httpx

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_BASE = "https://api.openai.com/v1"


def _headers():
    return {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }


class OpenAIClient:
    """Wrapper for OpenAI API interactions using httpx."""

    def __init__(self):
        self.embedding_model = "text-embedding-3-small"
        self.chat_model = "gpt-4o-mini"

    async def create_embedding(self, text: str) -> List[float]:
        """Create an embedding for the given text."""
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{OPENAI_BASE}/embeddings",
                headers=_headers(),
                json={"model": self.embedding_model, "input": text},
            )
            resp.raise_for_status()
            return resp.json()["data"][0]["embedding"]

    async def create_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Create embeddings for multiple texts."""
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                f"{OPENAI_BASE}/embeddings",
                headers=_headers(),
                json={"model": self.embedding_model, "input": texts},
            )
            resp.raise_for_status()
            data = resp.json()["data"]
            return [item["embedding"] for item in data]

    async def chat_completion(
        self,
        messages: List[dict],
        temperature: float = 0.7,
        max_tokens: int = 1000,
    ) -> str:
        """Generate a chat completion."""
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                f"{OPENAI_BASE}/chat/completions",
                headers=_headers(),
                json={
                    "model": self.chat_model,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                },
            )
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"]

    async def chat_completion_stream(
        self,
        messages: List[dict],
        temperature: float = 0.7,
        max_tokens: int = 1000,
    ) -> AsyncIterator[str]:
        """Generate a streaming chat completion."""
        async with httpx.AsyncClient(timeout=60) as client:
            async with client.stream(
                "POST",
                f"{OPENAI_BASE}/chat/completions",
                headers=_headers(),
                json={
                    "model": self.chat_model,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                    "stream": True,
                },
            ) as resp:
                resp.raise_for_status()
                async for line in resp.aiter_lines():
                    if line.startswith("data: ") and line != "data: [DONE]":
                        chunk = json.loads(line[6:])
                        content = chunk["choices"][0]["delta"].get("content")
                        if content:
                            yield content
