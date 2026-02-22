import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { sendChatMessage, askAboutSelectedText } from "../../services/api";
import type { ChatResponse, ChapterReference } from "../../services/api";
import styles from "./styles.module.css";

interface Message {
  role: "user" | "assistant";
  content: string;
  references?: ChapterReference[];
}

interface ChatWidgetProps {
  onClose: () => void;
  initialSelectedText?: string | null;
}

export default function ChatWidget({
  onClose,
  initialSelectedText,
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your Physical AI textbook assistant. Ask me anything about robotics, ROS 2, simulation, or any topic from the book.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`sess_${Date.now()}`);
  const hasHandledSelection = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle initial selected text from "Explain this" button
  useEffect(() => {
    if (initialSelectedText && !hasHandledSelection.current) {
      hasHandledSelection.current = true;
      const truncated =
        initialSelectedText.length > 200
          ? initialSelectedText.slice(0, 200) + "..."
          : initialSelectedText;
      setMessages((prev) => [
        ...prev,
        { role: "user", content: `Explain this: "${truncated}"` },
      ]);
      setIsLoading(true);

      const chapterSlug = window.location.pathname.split("/").pop() || "";
      askAboutSelectedText({
        selected_text: initialSelectedText,
        question: "Explain this in simpler terms",
        chapter_slug: chapterSlug,
      })
        .then((response) => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: response.response,
              references: response.references,
            },
          ]);
        })
        .catch(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Sorry, I couldn't explain that text. Please try again.",
            },
          ]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [initialSelectedText]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response: ChatResponse = await sendChatMessage({
        message: userMessage,
        session_id: sessionId.current,
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.response,
          references: response.references,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error. Please make sure the API server is running and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.chatPanel}>
      <div className={styles.chatHeader}>
        <h3>Textbook Assistant</h3>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close chat"
        >
          &#x2715;
        </button>
      </div>
      <div className={styles.messages}>
        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            role={msg.role}
            content={msg.content}
            references={msg.references}
          />
        ))}
        {isLoading && (
          <div className={styles.loading}>
            <span />
            <span />
            <span />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about the textbook..."
          disabled={isLoading}
        />
        <button
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
        >
          &#x27A4;
        </button>
      </div>
    </div>
  );
}
