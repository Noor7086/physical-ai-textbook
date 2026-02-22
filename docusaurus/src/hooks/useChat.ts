import { useState, useRef, useCallback } from 'react';
import { sendChatMessage, askAboutSelectedText } from '../services/api';
import type { ChatResponse, ChapterReference } from '../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  references?: ChapterReference[];
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionId = useRef(`sess_${Date.now()}`);

  const sendMessage = useCallback(async (message: string, chapterContext?: string) => {
    setError(null);
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setIsLoading(true);

    try {
      const response: ChatResponse = await sendChatMessage({
        message,
        session_id: sessionId.current,
        chapter_context: chapterContext,
      });
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.response,
          references: response.references,
        },
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const askAboutText = useCallback(async (selectedText: string, question: string, chapterSlug: string) => {
    setError(null);
    setMessages((prev) => [...prev, { role: 'user', content: `[About selected text]: ${question}` }]);
    setIsLoading(true);

    try {
      const response = await askAboutSelectedText({
        selected_text: selectedText,
        question,
        chapter_slug: chapterSlug,
      });
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.response,
          references: response.references,
        },
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to explain text';
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I couldn\'t explain that. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    sessionId.current = `sess_${Date.now()}`;
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    askAboutText,
    clearMessages,
  };
}
