"""RAG service for chatbot with Qdrant vector search."""
import os
from typing import List, Dict, Any, AsyncIterator
from qdrant_client import AsyncQdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

from .openai_client import OpenAIClient


class RAGService:
    """RAG service for answering questions using textbook content."""

    def __init__(self):
        self.openai = OpenAIClient()
        self.collection_name = os.getenv("QDRANT_COLLECTION", "textbook_chunks")
        self._client = None

    async def _get_client(self) -> AsyncQdrantClient:
        """Get or create Qdrant client."""
        if self._client is None:
            qdrant_url = os.getenv("QDRANT_URL")
            qdrant_api_key = os.getenv("QDRANT_API_KEY")

            if qdrant_url and qdrant_api_key:
                try:
                    self._client = AsyncQdrantClient(
                        url=qdrant_url,
                        api_key=qdrant_api_key,
                        timeout=10,
                    )
                except Exception:
                    # Fallback to in-memory if cloud connection fails
                    self._client = AsyncQdrantClient(":memory:")
                    await self._setup_collection()
            else:
                # Use in-memory client for development
                self._client = AsyncQdrantClient(":memory:")
                await self._setup_collection()
        return self._client

    async def _setup_collection(self):
        """Set up Qdrant collection if it doesn't exist."""
        client = await self._get_client()
        collections = await client.get_collections()
        collection_names = [c.name for c in collections.collections]

        if self.collection_name not in collection_names:
            await client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=1536,  # OpenAI text-embedding-3-small dimension
                    distance=Distance.COSINE,
                ),
            )

    async def search_similar(
        self,
        query: str,
        limit: int = 5,
    ) -> List[Dict[str, Any]]:
        """Search for similar content chunks."""
        try:
            client = await self._get_client()

            # Check if collection exists and has points
            try:
                collection_info = await client.get_collection(self.collection_name)
                if collection_info.points_count == 0:
                    return []
            except Exception:
                return []

            # Create query embedding
            query_embedding = await self.openai.create_embedding(query)

            # Search Qdrant
            results = await client.search(
                collection_name=self.collection_name,
                query_vector=query_embedding,
                limit=limit,
            )

            return [
                {
                    "content": hit.payload.get("content", ""),
                    "chapter_slug": hit.payload.get("chapter_slug", ""),
                    "chapter_title": hit.payload.get("chapter_title", ""),
                    "module_slug": hit.payload.get("module_slug", ""),
                    "relevance_score": hit.score,
                }
                for hit in results
            ]
        except Exception:
            # If vector search fails, return empty results
            return []

    async def chat(
        self,
        message: str,
        session_id: str,
        chapter_context: str = None,
    ) -> Dict[str, Any]:
        """Generate a chat response using RAG."""
        # Search for relevant content
        relevant_chunks = await self.search_similar(message, limit=5)

        # Build context from chunks
        context = "\n\n".join([
            f"From {chunk['chapter_title']}:\n{chunk['content']}"
            for chunk in relevant_chunks
        ])

        # Build system prompt
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

        # Generate response
        response = await self.openai.chat_completion(messages)

        # Build references
        references = [
            {
                "chapter_slug": chunk["chapter_slug"],
                "chapter_title": chunk["chapter_title"],
                "module_slug": chunk["module_slug"],
                "relevance_score": chunk["relevance_score"],
            }
            for chunk in relevant_chunks[:3]  # Top 3 references
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
        # Search for relevant content
        relevant_chunks = await self.search_similar(message, limit=5)

        # Build context
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

        # Stream response
        async for chunk in self.openai.chat_completion_stream(messages):
            yield {"type": "content", "content": chunk}

        # Send references at the end
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
        """Index content chunks into Qdrant."""
        client = await self._get_client()
        await self._setup_collection()

        # Create embeddings for all chunks
        texts = [chunk["content"] for chunk in chunks]
        embeddings = await self.openai.create_embeddings(texts)

        # Create points
        points = [
            PointStruct(
                id=i,
                vector=embedding,
                payload={
                    "content": chunk["content"],
                    "chapter_slug": chunk["chapter_slug"],
                    "chapter_title": chunk["chapter_title"],
                    "module_slug": chunk["module_slug"],
                    "heading": chunk.get("heading", ""),
                    "position": chunk.get("position", i),
                },
            )
            for i, (chunk, embedding) in enumerate(zip(chunks, embeddings))
        ]

        # Upsert points
        await client.upsert(
            collection_name=self.collection_name,
            points=points,
        )

        return len(points)
