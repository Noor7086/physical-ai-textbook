import React from 'react';
import styles from './styles.module.css';

interface Reference {
  chapter_slug: string;
  chapter_title: string;
  module_slug: string;
  relevance_score: number;
}

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  references?: Reference[];
}

export default function ChatMessage({ role, content, references }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`${styles.message} ${isUser ? styles.userMessage : styles.assistantMessage}`}>
      <div>{content}</div>
      {!isUser && references && references.length > 0 && (
        <div className={styles.references}>
          <strong>References:</strong>
          {references.map((ref, i) => (
            <a key={i} href={`/${ref.module_slug}/${ref.chapter_slug}`}>
              {ref.chapter_title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
