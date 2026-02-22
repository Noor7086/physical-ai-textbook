"""RAG service for chatbot with Qdrant vector search via REST API."""
import os
import uuid
from typing import List, Dict, Any, AsyncIterator

import httpx

from .openai_client import OpenAIClient

QDRANT_URL = os.getenv("QDRANT_URL", "")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "")


def _qdrant_headers():
    return {
        "api-key": QDRANT_API_KEY,
        "Content-Type": "application/json",
    }


class RAGService:
    """RAG service for answering questions using textbook content."""

    def __init__(self):
        self.openai = OpenAIClient()
        self.collection_name = os.getenv("QDRANT_COLLECTION", "textbook_chunks")

    async def search_similar(
        self,
        query: str,
        limit: int = 5,
    ) -> List[Dict[str, Any]]:
        """Search for similar content chunks via Qdrant REST API."""
        if not QDRANT_URL or not QDRANT_API_KEY:
            return []

        try:
            query_embedding = await self.openai.create_embedding(query)

            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.post(
                    f"{QDRANT_URL}/collections/{self.collection_name}/points/search",
                    headers=_qdrant_headers(),
                    json={
                        "vector": query_embedding,
                        "limit": limit,
                        "with_payload": True,
                    },
                )
                if resp.status_code != 200:
                    return []
                results = resp.json().get("result", [])

            return [
                {
                    "content": hit.get("payload", {}).get("content", ""),
                    "chapter_slug": hit.get("payload", {}).get("chapter_slug", ""),
                    "chapter_title": hit.get("payload", {}).get("chapter_title", ""),
                    "module_slug": hit.get("payload", {}).get("module_slug", ""),
                    "relevance_score": hit.get("score", 0),
                }
                for hit in results
            ]
        except Exception:
            return []

    async def chat(
        self,
        message: str,
        session_id: str,
        chapter_context: str = None,
    ) -> Dict[str, Any]:
        """Generate a chat response using RAG."""
        relevant_chunks = await self.search_similar(message, limit=5)

        context = "\n\n".join([
            f"From {chunk['chapter_title']}:\n{chunk['content']}"
            for chunk in relevant_chunks
        ])

        system_prompt = """You are a helpful teaching assistant for the Physical AI & Humanoid Robotics textbook.
Your role is to help students understand concepts about ROS 2, Gazebo simulation, NVIDIA Isaac, and humanoid robotics.

Use the provided context from the textbook to answer questions accurately.
If the context doesn't contain enough information, say so and provide general guidance.
Always be encouraging and educational in your responses.

Context from the textbook:
{context}
""".format(context=context if context else "No specific context available.")

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message},
        ]

        response = await self.openai.chat_completion(messages)

        references = [
            {
                "chapter_slug": chunk["chapter_slug"],
                "chapter_title": chunk["chapter_title"],
                "module_slug": chunk["module_slug"],
                "relevance_score": chunk["relevance_score"],
            }
            for chunk in relevant_chunks[:3]
        ]

        return {
            "response": response,
            "references": references,
            "session_id": session_id,
        }

    async def chat_stream(
        self,
        message: str,
        session_id: str,
        chapter_context: str = None,
    ) -> AsyncIterator[Dict[str, Any]]:
        """Generate a streaming chat response using RAG."""
        relevant_chunks = await self.search_similar(message, limit=5)

        context = "\n\n".join([
            f"From {chunk['chapter_title']}:\n{chunk['content']}"
            for chunk in relevant_chunks
        ])

        system_prompt = """You are a helpful teaching assistant for the Physical AI & Humanoid Robotics textbook.
Use the provided context to answer questions accurately.

Context:
{context}
""".format(context=context if context else "No specific context available.")

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message},
        ]

        async for chunk in self.openai.chat_completion_stream(messages):
            yield {"type": "content", "content": chunk}

        references = [
            {
                "chapter_slug": chunk["chapter_slug"],
                "chapter_title": chunk["chapter_title"],
                "module_slug": chunk["module_slug"],
                "relevance_score": chunk["relevance_score"],
            }
            for chunk in relevant_chunks[:3]
        ]
        yield {"type": "references", "references": references}

    async def explain_selected_text(
        self,
        selected_text: str,
        question: str,
        chapter_slug: str,
    ) -> Dict[str, Any]:
        """Explain selected text from a chapter."""
        system_prompt = """You are a helpful teaching assistant.
The user has selected the following text from a chapter and has a question about it.

Selected text:
"{selected_text}"

Please answer their question clearly and helpfully, providing additional context if needed.
""".format(selected_text=selected_text)

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": question},
        ]

        response = await self.openai.chat_completion(messages)

        return {
            "response": response,
            "references": [{
                "chapter_slug": chapter_slug,
                "chapter_title": chapter_slug.replace("-", " ").title(),
                "module_slug": chapter_slug.split("-")[0] if "-" in chapter_slug else "",
                "relevance_score": 1.0,
            }],
        }

    async def index_content(
        self,
        chunks: List[Dict[str, Any]],
    ) -> int:
        """Index content chunks into Qdrant via REST API."""
        if not QDRANT_URL or not QDRANT_API_KEY:
            return 0

        texts = [chunk["content"] for chunk in chunks]
        embeddings = await self.openai.create_embeddings(texts)

        points = [
            {
                "id": str(uuid.uuid4()),
                "vector": embedding,
                "payload": {
                    "content": chunk["content"],
                    "chapter_slug": chunk["chapter_slug"],
                    "chapter_title": chunk["chapter_title"],
                    "module_slug": chunk["module_slug"],
                    "heading": chunk.get("heading", ""),
                    "position": chunk.get("position", i),
                },
            }
            for i, (chunk, embedding) in enumerate(zip(chunks, embeddings))
        ]

        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.put(
                f"{QDRANT_URL}/collections/{self.collection_name}/points",
                headers=_qdrant_headers(),
                json={"points": points},
            )
            resp.raise_for_status()

        return len(points)
