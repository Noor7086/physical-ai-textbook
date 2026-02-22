import React from "react";
import type { ReactNode } from "react";
import ChatBot from "../components/ChatBot";
import { AuthProvider } from "../components/AuthProvider";
import { TranslationProvider } from "../contexts/TranslationContext";

interface RootProps {
  children: ReactNode;
}

export default function Root({ children }: RootProps) {
  return (
    <AuthProvider>
      <TranslationProvider>
        {children}
        <ChatBot />
      </TranslationProvider>
    </AuthProvider>
  );
}
