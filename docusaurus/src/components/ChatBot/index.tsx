import React, { useState, useEffect, useCallback } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import ChatWidget from "./ChatWidget";
import styles from "./styles.module.css";

interface SelectionInfo {
  text: string;
  x: number;
  y: number;
}

function ChatBotInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectionPopup, setSelectionPopup] = useState<SelectionInfo | null>(
    null,
  );

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 10 && text.length < 2000) {
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect) {
        setSelectionPopup({
          text,
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });
      }
    } else {
      setSelectionPopup(null);
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    setSelectionPopup(null);
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleMouseUp, handleMouseDown]);

  const handleExplainThis = () => {
    if (selectionPopup) {
      setSelectedText(selectionPopup.text);
      setIsOpen(true);
      setSelectionPopup(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  return (
    <>
      {selectionPopup && (
        <button
          className={styles.explainBtn}
          style={{
            position: "fixed",
            left: `${selectionPopup.x}px`,
            top: `${selectionPopup.y}px`,
            transform: "translate(-50%, -100%)",
            zIndex: 1100,
          }}
          onClick={handleExplainThis}
        >
          Explain this
        </button>
      )}
      {isOpen && (
        <ChatWidget
          onClose={() => {
            setIsOpen(false);
            setSelectedText(null);
          }}
          initialSelectedText={selectedText}
        />
      )}
      <button
        className={styles.chatToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        title="Ask the AI assistant"
      >
        {isOpen ? "\u2715" : "\uD83D\uDCAC"}
      </button>
    </>
  );
}

export default function ChatBot() {
  return <BrowserOnly fallback={null}>{() => <ChatBotInner />}</BrowserOnly>;
}
