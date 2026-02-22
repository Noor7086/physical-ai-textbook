import React, { useState } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { personalizeContent } from "../../services/api";
import { useAuthContext } from "../AuthProvider";
import { marked } from "marked";

function NavbarPersonalizeInner() {
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [originalContent, setOriginalContent] = useState<string | null>(null);
  const { isAuthenticated } = useAuthContext();

  // Only show the button if user is logged in
  if (!isAuthenticated) {
    return null;
  }

  const handleClick = async () => {
    if (isPersonalized) {
      // Reset
      if (originalContent) {
        const docContent = document.querySelector(".theme-doc-markdown");
        if (docContent) {
          docContent.innerHTML = originalContent;
        }
      }
      setIsPersonalized(false);
      return;
    }

    const docContent = document.querySelector(".theme-doc-markdown");
    if (!docContent) return;

    setIsLoading(true);

    try {
      if (!originalContent) {
        setOriginalContent(docContent.innerHTML);
      }

      const path = window.location.pathname;
      const parts = path.split("/").filter(Boolean);
      const chapterSlug = parts[parts.length - 1] || "index";

      const response = await personalizeContent({
        chapter_slug: chapterSlug,
        content: docContent.textContent || "",
      });

      const renderedHtml = await marked.parse(response.personalized_content);
      docContent.innerHTML = `<div class="personalized-content">${renderedHtml}</div>`;
      setIsPersonalized(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Personalization failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="navbar__item navbar__link"
      style={{
        cursor: isLoading ? "wait" : "pointer",
        border: "1px solid var(--ifm-color-primary)",
        borderRadius: 20,
        padding: "4px 12px",
        fontSize: 13,
        fontWeight: 600,
        background: isPersonalized ? "var(--ifm-color-primary)" : "transparent",
        color: isPersonalized ? "#fff" : "var(--ifm-color-primary)",
        transition: "all 0.2s",
      }}
    >
      {isLoading
        ? "Personalizing..."
        : isPersonalized
          ? "Reset"
          : "Personalize"}
    </button>
  );
}

export default function NavbarPersonalizeButton() {
  return (
    <BrowserOnly fallback={null}>
      {() => <NavbarPersonalizeInner />}
    </BrowserOnly>
  );
}
