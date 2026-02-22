"""OpenAI client wrapper for chat completions and embeddings."""
import os
from openai import AsyncOpenAI
from typing import List, AsyncIterator

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class OpenAIClient:
    """Wrapper for OpenAI API interactions."""

    def __init__(self):
        self.client = client
        self.embedding_model = "text-embedding-3-small"
        self.chat_model = "gpt-4o-mini"

    async def create_embedding(self, text: str) -> List[float]:
        """Create an embedding for the given text."""
        response = await self.client.embeddings.create(
            model=self.embedding_model,
            input=text,
        )
        return response.data[0].embedding

    async def create_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Create embeddings for multiple texts."""
        response = await self.client.embeddings.create(
            model=self.embedding_model,
            input=texts,
        )
        return [item.embedding for item in response.data]

    async def chat_completion(
        self,
        messages: List[dict],
        temperature: float = 0.7,
        max_tokens: int = 1000,
    ) -> str:
        """Generate a chat completion."""
        response = await self.client.chat.completions.create(
            model=self.chat_model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return response.choices[0].message.content

    async def chat_completion_stream(
        self,
        messages: List[dict],
        temperature: float = 0.7,
        max_tokens: int = 1000,
    ) -> AsyncIterator[str]:
        """Generate a streaming chat completion."""
        stream = await self.client.chat.completions.create(
            model=self.chat_model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            stream=True,
        )
        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
