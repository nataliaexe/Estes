"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "./types";

const STORAGE_KEY = "estes_chat_threads";
const SESSION_KEY = "estes_chat_session";

export interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

function safeParse(raw: string | null): ChatThread[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
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
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const writeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = safeParse(window.localStorage.getItem(STORAGE_KEY));
    setThreads(saved);
    if (saved.length > 0) {
      setCurrentId(saved[0].id);
    } else {
      createNewThread();
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (writeTimeout.current) clearTimeout(writeTimeout.current);
    writeTimeout.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
      } catch {}
    }, 120);
    return () => {
      if (writeTimeout.current) clearTimeout(writeTimeout.current);
    };
  }, [threads, hydrated]);

  const current = threads.find((t) => t.id === currentId) || null;

  const setMessages = useCallback(
    (updater: (prev: ChatMessage[]) => ChatMessage[]) => {
      if (!currentId) return;
      setThreads((prev) =>
        prev.map((t) => {
          if (t.id !== currentId) return t;
          const novo = updater(t.messages);
          return {
            ...t,
            messages: novo,
            title: t.title === "New conversation" && novo[0]
              ? novo[0].content.slice(0, 50)
              : t.title,
            updatedAt: Date.now(),
          };
        })
      );
    },
    [currentId]
  );

  const createNewThread = useCallback(() => {
    const newThread: ChatThread = {
      id: `thread-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: "New conversation",
      messages: [],
      updatedAt: Date.now(),
    };
    setThreads((prev) => [newThread, ...prev]);
    setCurrentId(newThread.id);
    return newThread.id;
  }, []);

  const deleteThread = useCallback((id: string) => {
    setThreads((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (next.length === 0) {
        const newThread: ChatThread = {
          id: `thread-${Date.now()}`,
          title: "New conversation",
          messages: [],
          updatedAt: Date.now(),
        };
        setCurrentId(newThread.id);
        return [newThread];
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setThreads([]);
    window.localStorage.removeItem(STORAGE_KEY);
    createNewThread();
  }, [createNewThread]);

  return {
    threads,
    current,
    currentId,
    messages: current?.messages || [],
    setMessages,
    createNewThread,
    setCurrentId,
    deleteThread,
    clear,
    hydrated,
  };
}
