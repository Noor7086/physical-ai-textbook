"""Content indexing script for RAG - chunks and embeds chapter content into Qdrant."""
import asyncio
import os
import re
import glob
from pathlib import Path
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

# Add parent directory to path for imports
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from services.rag_service import RAGService


def parse_mdx_file(file_path: str) -> Dict[str, Any]:
    """Parse an MDX file and extract content and metadata."""
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract frontmatter
    frontmatter = {}
    if content.startswith("---"):
        end = content.index("---", 3)
        fm_text = content[3:end].strip()
        for line in fm_text.split("\n"):
            if ":" in line:
                key, value = line.split(":", 1)
                frontmatter[key.strip()] = value.strip().strip('"').strip("'")
        content = content[end + 3:].strip()

    # Remove import/export statements
    content = re.sub(r'^(import|export)\s+.*$', '', content, flags=re.MULTILINE)

    return {
        "title": frontmatter.get("title", Path(file_path).stem),
        "description": frontmatter.get("description", ""),
        "content": content.strip(),
    }


def chunk_content(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """Split content into overlapping chunks by approximate token count."""
    words = text.split()
    chunks = []
    start = 0

    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        if chunk.strip():
            chunks.append(chunk.strip())
        start = end - overlap

    return chunks


def get_chapter_info(file_path: str) -> Dict[str, str]:
    """Extract module and chapter slugs from file path."""
    parts = Path(file_path).parts
    # Find the docs directory and extract module/chapter from path
    for i, part in enumerate(parts):
        if part == "docs" and i + 1 < len(parts):
            module_slug = parts[i + 1]
            chapter_slug = Path(file_path).stem
            return {
                "module_slug": module_slug,
                "chapter_slug": chapter_slug,
            }
    return {"module_slug": "unknown", "chapter_slug": Path(file_path).stem}


async def index_all_content():
    """Index all MDX content from the Docusaurus docs directory."""
    docs_dir = os.path.join(
        os.path.dirname(__file__), "..", "..", "docusaurus", "docs"
    )
    docs_dir = os.path.abspath(docs_dir)

    if not os.path.exists(docs_dir):
        print(f"Docs directory not found: {docs_dir}")
        return

    # Find all MDX files
    mdx_files = glob.glob(os.path.join(docs_dir, "**", "*.mdx"), recursive=True)
    print(f"Found {len(mdx_files)} MDX files")

    all_chunks = []

    for file_path in mdx_files:
        print(f"Processing: {file_path}")
        parsed = parse_mdx_file(file_path)
        info = get_chapter_info(file_path)

        chunks = chunk_content(parsed["content"])
        for i, chunk_text in enumerate(chunks):
            all_chunks.append({
                "content": chunk_text,
                "chapter_slug": info["chapter_slug"],
                "chapter_title": parsed["title"],
                "module_slug": info["module_slug"],
                "heading": "",
                "position": i,
            })

    print(f"Total chunks to index: {len(all_chunks)}")

    if not all_chunks:
        print("No content to index.")
        return

    # Index into Qdrant
    rag_service = RAGService()
    indexed = await rag_service.index_content(all_chunks)
    print(f"Successfully indexed {indexed} chunks into Qdrant")


if __name__ == "__main__":
    asyncio.run(index_all_content())
