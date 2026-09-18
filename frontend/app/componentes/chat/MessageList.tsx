"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import type { ChatMessage } from "../../lib/chat/types";
import { MessageBubble } from "./MessageBubble";
import { EmptyState } from "./EmptyState";

interface MessageListProps {
  messages: ChatMessage[];
  onPickSuggestion: (prompt: string) => void;
  onSave: (message: ChatMessage) => void;
}

export function MessageList({
  messages,
  onPickSuggestion,
  onSave,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastContent = messages[messages.length - 1]?.content;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, lastContent]);

  if (messages.length === 0) {
    return <EmptyState onPick={onPickSuggestion} />;
  }

  return (
    <div
      className="flex h-full flex-col gap-4 overflow-y-auto px-4 py-6 sm:px-8"
      role="log"
      aria-live="polite"
      aria-label="Conversation messages"
    >
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} onSave={onSave} />
        ))}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
