"""Translation service for English to Urdu content translation."""
from typing import Dict, Any
import hashlib

from .openai_client import OpenAIClient


class TranslationService:
    """Service for translating content to Urdu."""

    def __init__(self):
        self.openai = OpenAIClient()
        self._cache: Dict[str, str] = {}  # Simple in-memory cache

    def _get_cache_key(self, content: str, chapter_slug: str) -> str:
        """Generate a cache key for translated content."""
        content_hash = hashlib.md5(content.encode()).hexdigest()[:16]
        return f"{chapter_slug}:{content_hash}"

    async def translate_to_urdu(
        self,
        content: str,
        chapter_slug: str,
    ) -> Dict[str, Any]:
        """Translate content from English to Urdu."""
        # Check cache first
        cache_key = self._get_cache_key(content, chapter_slug)
        if cache_key in self._cache:
            return {
                "translated_content": self._cache[cache_key],
                "cached": True,
            }

        system_prompt = """You are an expert translator specializing in technical education content.
Translate the following educational content from English to Urdu.

Important guidelines:
1. Keep technical terms in English (like ROS 2, NVIDIA Isaac, Python, etc.) with Urdu explanations in parentheses where helpful
2. Preserve all code blocks exactly as they are - do not translate code
3. Preserve Markdown formatting (headings, lists, bold, etc.)
4. Keep URLs and links unchanged
5. Translate in a way that is natural and educational for Urdu readers
6. Use formal Urdu suitable for academic/technical content
7. For technical concepts without direct Urdu equivalents, use transliteration with explanation

Return only the translated content in Markdown format with proper Urdu text direction."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Translate this content to Urdu:\n\n{content}"},
        ]

        translated_content = await self.openai.chat_completion(
            messages,
            temperature=0.3,
            max_tokens=4000,
        )

        # Cache the result
        self._cache[cache_key] = translated_content

        return {
            "translated_content": translated_content,
            "cached": False,
        }
