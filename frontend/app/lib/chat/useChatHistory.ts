"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "./types";

const STORAGE_KEY = "estes_chat_history";
const SESSION_KEY = "estes_chat_session";

function safeParse(raw: string | null): ChatMessage[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as ChatMessage[];
    return [];
  } catch {
    return [];
  }
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "default";
  let sid = window.localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = `s-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    window.localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export function useChatHistory() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const writeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMessages(safeParse(window.localStorage.getItem(STORAGE_KEY)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (writeTimeout.current) clearTimeout(writeTimeout.current);
    writeTimeout.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch {
        // storage full
      }
    }, 120);
    return () => {
      if (writeTimeout.current) clearTimeout(writeTimeout.current);
    };
  }, [messages, hydrated]);

  const clear = useCallback(() => {
    setMessages([]);
    window.localStorage.removeItem(STORAGE_KEY);
    const newSid = `s-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    window.localStorage.setItem(SESSION_KEY, newSid);
  }, []);

  return { messages, setMessages, clear, hydrated };
}
