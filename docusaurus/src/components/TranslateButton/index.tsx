import React, { useState, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { translateToUrdu } from '../../services/api';
import styles from './styles.module.css';

interface TranslateButtonProps {
  chapterSlug: string;
}

function TranslateButtonInner({ chapterSlug }: TranslateButtonProps) {
  const [isUrdu, setIsUrdu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [originalContent, setOriginalContent] = useState<string | null>(null);

  const handleTranslate = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const docContent = document.querySelector('.theme-doc-markdown');
      if (!docContent) {
        setError('Could not find page content');
        return;
      }

      if (!originalContent) {
        setOriginalContent(docContent.innerHTML);
      }

      const response = await translateToUrdu({
        content: docContent.textContent || '',
        chapter_slug: chapterSlug,
      });

      // Apply RTL and Urdu content
      docContent.setAttribute('dir', 'rtl');
      docContent.setAttribute('lang', 'ur');
      docContent.classList.add('rtl-content');
      docContent.innerHTML = `<div class="urdu-content">${response.translated_content}</div>`;
      setIsUrdu(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setIsLoading(false);
    }
  }, [chapterSlug, originalContent]);

  const handleRestore = useCallback(() => {
    if (originalContent) {
      const docContent = document.querySelector('.theme-doc-markdown');
      if (docContent) {
        docContent.removeAttribute('dir');
        docContent.removeAttribute('lang');
        docContent.classList.remove('rtl-content');
        docContent.innerHTML = originalContent;
      }
    }
    setIsUrdu(false);
    setError('');
  }, [originalContent]);

  return (
    <div className={styles.container}>
      {!isUrdu ? (
        <button
          className={styles.translateBtn}
          onClick={handleTranslate}
          disabled={isLoading}
        >
          {isLoading ? 'Translating...' : 'اردو'}
        </button>
      ) : (
        <button
          className={`${styles.translateBtn} ${styles.active}`}
          onClick={handleRestore}
        >
          English
        </button>
      )}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default function TranslateButton(props: TranslateButtonProps) {
  return (
    <BrowserOnly fallback={null}>
      {() => <TranslateButtonInner {...props} />}
    </BrowserOnly>
  );
}
