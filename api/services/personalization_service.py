"""Personalization service for adapting content based on user profile."""
from typing import Dict, Any, List

from .openai_client import OpenAIClient
from db.neon import DatabaseService


class PersonalizationService:
    """Service for personalizing chapter content based on user background."""

    def __init__(self):
        self.openai = OpenAIClient()
        self.db = DatabaseService()

    def _build_personalization_prompt(
        self,
        profile: Dict[str, Any],
    ) -> str:
        """Build a personalization prompt based on user profile."""
        adaptations = []

        # Python level adaptations
        if profile.get("python_level") == "beginner":
            adaptations.append("- Explain Python syntax and concepts in more detail")
            adaptations.append("- Include more code comments")
        elif profile.get("python_level") == "expert":
            adaptations.append("- Assume familiarity with advanced Python concepts")
            adaptations.append("- Focus on robotics-specific Python patterns")

        # ROS level adaptations
        if profile.get("ros_level") == "none":
            adaptations.append("- Explain ROS 2 concepts from scratch")
            adaptations.append("- Provide more background on robotics middleware")
        elif profile.get("ros_level") in ["intermediate", "expert"]:
            adaptations.append("- Skip basic ROS 2 explanations")
            adaptations.append("- Focus on advanced patterns and optimization")

        # ML level adaptations
        if profile.get("ml_level") == "none":
            adaptations.append("- Explain machine learning concepts simply")
            adaptations.append("- Avoid complex mathematical notation")
        elif profile.get("ml_level") in ["intermediate", "expert"]:
            adaptations.append("- Include mathematical formulations where relevant")
            adaptations.append("- Reference advanced ML techniques")

        # Hardware experience adaptations
        if profile.get("arduino_experience"):
            adaptations.append("- Draw parallels to Arduino when discussing embedded systems")
        if profile.get("jetson_experience"):
            adaptations.append("- Reference Jetson-specific optimizations")
        if profile.get("robot_experience"):
            adaptations.append("- Build on existing robotics knowledge")
        else:
            adaptations.append("- Provide more context for physical robotics concepts")

        return "\n".join(adaptations) if adaptations else "- Maintain standard explanation level"

    async def personalize(
        self,
        content: str,
        chapter_slug: str,
        user_id: str,
    ) -> Dict[str, Any]:
        """Personalize content based on user's profile."""
        # Get user profile
        profile = await self.db.get_user_profile(user_id)
        if profile is None:
            raise ValueError("User profile not found")

        # Build personalization instructions
        personalization_instructions = self._build_personalization_prompt(profile)

        system_prompt = f"""You are an expert technical writer adapting educational content about Physical AI and Humanoid Robotics.

Adapt the following content based on these user-specific requirements:
{personalization_instructions}

Guidelines:
1. Preserve all technical accuracy
2. Keep code examples functional with proper fenced code blocks (```python, ```bash, etc.)
3. Maintain the same overall structure and headings using proper Markdown (# ## ### for headings)
4. Adjust explanation depth and terminology based on the requirements
5. Add helpful analogies where appropriate
6. Keep the content roughly the same length
7. Use proper Markdown formatting: **bold**, *italic*, bullet lists, numbered lists, tables, and code blocks

Return only the adapted content in well-formatted Markdown."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Adapt this content:\n\n{content}"},
        ]

        personalized_content = await self.openai.chat_completion(
            messages,
            temperature=0.3,
            max_tokens=4000,
        )

        # Track adaptations made
        adaptations_made = personalization_instructions.split("\n")
        adaptations_made = [a.strip("- ") for a in adaptations_made if a.strip()]

        return {
            "personalized_content": personalized_content,
            "adaptations_made": adaptations_made,
        }
