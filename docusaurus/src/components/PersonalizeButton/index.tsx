import React, { useState, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { personalizeContent } from '../../services/api';
import styles from './styles.module.css';

interface PersonalizeButtonProps {
  chapterSlug: string;
}

function PersonalizeButtonInner({ chapterSlug }: PersonalizeButtonProps) {
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [originalContent, setOriginalContent] = useState<string | null>(null);

  const handlePersonalize = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setError('Please log in to personalize content');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Get the main doc content
      const docContent = document.querySelector('.theme-doc-markdown');
      if (!docContent) {
        setError('Could not find page content');
        return;
      }

      if (!originalContent) {
        setOriginalContent(docContent.innerHTML);
      }

      const response = await personalizeContent({
        chapter_slug: chapterSlug,
        content: docContent.textContent || '',
      });

      // Replace content with personalized version
      docContent.innerHTML = `<div class="personalized-content">${response.personalized_content}</div>`;
      setIsPersonalized(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Personalization failed');
    } finally {
      setIsLoading(false);
    }
  }, [chapterSlug, originalContent]);

  const handleReset = useCallback(() => {
    if (originalContent) {
      const docContent = document.querySelector('.theme-doc-markdown');
      if (docContent) {
        docContent.innerHTML = originalContent;
      }
    }
    setIsPersonalized(false);
    setError('');
  }, [originalContent]);

  return (
    <div className={styles.container}>
      <button
        className={`${styles.personalizeBtn} ${isPersonalized ? styles.active : ''}`}
        onClick={handlePersonalize}
        disabled={isLoading || isPersonalized}
      >
        {isLoading ? 'Personalizing...' : isPersonalized ? 'Personalized' : 'Personalize'}
      </button>
      {isPersonalized && (
        <button className={styles.resetBtn} onClick={handleReset}>
          Reset
        </button>
      )}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default function PersonalizeButton(props: PersonalizeButtonProps) {
  return (
    <BrowserOnly fallback={null}>
      {() => <PersonalizeButtonInner {...props} />}
    </BrowserOnly>
  );
}
