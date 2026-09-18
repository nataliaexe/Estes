"use client";

import { useCallback, useRef, useState } from "react";
import { Leaf, RotateCcw } from "lucide-react";
import { useChatHistory, getSessionId } from "../../lib/chat/useChatHistory";
import type { ChatMessage, SavedItem, SourceRef } from "../../lib/chat/types";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { ContextPanel } from "./ContextPanel";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

function id() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ChatInterface() {
  const { messages, setMessages, clear, hydrated } = useChatHistory();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollTargets = useRef<Record<string, HTMLElement | null>>({});

  // Salva mensagem no backend (memória persistente)
  const salvarBackend = useCallback(async (msg: ChatMessage) => {
    try {
      await fetch(`${API_BASE}/conversas/mensagem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: getSessionId(),
          role: msg.role,
          content: msg.content.slice(0, 2000),
          fontes: msg.sources || [],
        }),
      });
    } catch {
      // silencioso — localStorage já guarda
    }
  }, []);

  // Streaming REAL via SSE
  const askStream = useCallback(
    async (question: string, assistantId: string, controller: AbortController) => {
      try {
        const res = await fetch(`${API_BASE}/ia/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({ pergunta: question }),
        });

        if (!res.ok || !res.body) throw new Error("bad response");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let textoAtual = "";
        let fontes: SourceRef[] = [];
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const blocos = buffer.split("\n\n");
          buffer = blocos.pop() || "";

          for (const bloco of blocos) {
            const linhas = bloco.split("\n");
            let tipo = "";
            let dados = "";
            for (const l of linhas) {
              if (l.startsWith("event: ")) tipo = l.slice(7);
              else if (l.startsWith("data: ")) dados = l.slice(6);
            }
            if (!dados) continue;

            try {
              const obj = JSON.parse(dados);

              if (tipo === "fontes") {
                fontes = (obj.fontes || []).map((f: any) => ({
                  title: f.titulo || "Source",
                  url: f.url,
                  doi: f.doi,
                  kind: f.tipo === "atlas" ? "atlas" : f.tipo === "paper" ? "paper" : "web",
                  score: f.score,
                }));
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, sources: fontes } : m
                  )
                );
              } else if (tipo === "token") {
                textoAtual += obj.texto || "";
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: textoAtual, sources: fontes }
                      : m
                  )
                );
              } else if (tipo === "fim") {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, streaming: false } : m
                  )
                );
              }
            } catch {
              // JSON parcial
            }
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, streaming: false, content: textoAtual, sources: fontes }
              : m
          )
        );
        setIsStreaming(false);
      } catch (err: any) {
        if (err.name === "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, streaming: false } : m
            )
          );
          setIsStreaming(false);
          return;
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  streaming: false,
                  content:
                    "I couldn't reach the scientific engine. Make sure the backend is running and try again.",
                }
              : m
          )
        );
        setIsStreaming(false);
      }
    },
    [setMessages]
  );

  // Visão (foto + pergunta)
  const askVision = useCallback(
    async (
      question: string,
      image: File,
      assistantId: string,
      controller: AbortController
    ) => {
      try {
        const form = new FormData();
        form.append("arquivo", image);
        form.append("pergunta", question || "What do you see? What should I do?");

        const res = await fetch(`${API_BASE}/ia/vision`, {
          method: "POST",
          signal: controller.signal,
          body: form,
        });
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        const text: string = data.texto ?? data.resposta ?? "";
        if (!text) throw new Error("empty response");

        // Revela palavra por palavra (mantém sensação de streaming)
        const words = text.split(" ");
        for (let i = 0; i < words.length; i++) {
          if (controller.signal.aborted) break;
          await new Promise((r) => setTimeout(r, 22));
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: words.slice(0, i + 1).join(" ") }
                : m
            )
          );
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, streaming: false, content: text } : m
          )
        );
        setIsStreaming(false);
      } catch (err: any) {
        if (err.name === "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, streaming: false } : m
            )
          );
          setIsStreaming(false);
          return;
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  streaming: false,
                  content:
                    "I couldn't analyze the image. Try again or check the backend.",
                }
              : m
          )
        );
        setIsStreaming(false);
      }
    },
    [setMessages]
  );

  const handleSend = useCallback(
    (text: string, image?: File) => {
      const userMessage: ChatMessage = {
        id: id(),
        role: "user",
        content: text,
        createdAt: Date.now(),
        imageUrl: image ? URL.createObjectURL(image) : undefined,
      };
      salvarBackend(userMessage);

      const assistantId = id();
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: Date.now(),
        streaming: true,
        isVision: Boolean(image),
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      if (image) {
        askVision(text, image, assistantId, controller);
      } else {
        askStream(text, assistantId, controller);
      }
    },
    [askStream, askVision, setMessages, salvarBackend]
  );

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const handleSave = useCallback((message: ChatMessage) => {
    setSavedItems((prev) => [
      {
        id: id(),
        type: "conversation",
        title: message.content.slice(0, 60) || "Saved answer",
        subtitle: new Date(message.createdAt).toLocaleDateString("en-US"),
        savedAt: Date.now(),
      },
      ...prev,
    ]);
  }, []);

  const handleJumpTo = useCallback((messageId: string) => {
    scrollTargets.current[messageId]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, []);

  if (!hydrated) return null;

  return (
    <div className="grid h-dvh grid-rows-[auto_1fr] bg-elfo-creme md:grid-cols-[70%_30%] md:grid-rows-1">
      <div className="flex min-h-0 flex-col border-elfo-verde-escuro/10 md:border-r">
        <header className="flex items-center justify-between border-b border-elfo-verde-escuro/10 bg-white/70 px-5 py-3.5 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-elfo-verde-escuro">
              <Leaf className="h-4 w-4 text-elfo-verde-vivo" aria-hidden="true" />
            </span>
            <div>
              <h1 className="font-display text-sm font-bold text-elfo-verde-escuro">
                Estes Assistant
              </h1>
              <p className="hidden text-xs text-elfo-verde-escuro/60 sm:block">
                Describe your problem. Attach a photo. I search the Atlas,
                scientific literature, and the web.
              </p>
            </div>
          </div>
          <button
            onClick={clear}
            aria-label="Start new conversation"
            className="flex items-center gap-1.5 rounded-full border border-elfo-verde-escuro/15 px-3 py-1.5 text-xs font-medium text-elfo-verde-escuro transition-transform hover:scale-[1.02] hover:bg-elfo-verde-escuro/5"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            New conversation
          </button>
        </header>

        <div className="min-h-0 flex-1">
          <MessageList
            messages={messages}
            onPickSuggestion={(prompt) => handleSend(prompt)}
            onSave={handleSave}
          />
        </div>

        <ChatInput
          isStreaming={isStreaming}
          onSend={handleSend}
          onStop={handleStop}
        />
      </div>

      <div className="hidden min-h-0 md:block">
        <ContextPanel
          messages={messages}
          savedItems={savedItems}
          onJumpTo={handleJumpTo}
        />
      </div>

      <details className="border-t border-elfo-verde-escuro/10 bg-white md:hidden">
        <summary className="cursor-pointer px-5 py-3 text-sm font-medium text-elfo-verde-escuro">
          Context & library
        </summary>
        <div className="max-h-80">
          <ContextPanel
            messages={messages}
            savedItems={savedItems}
            onJumpTo={handleJumpTo}
          />
        </div>
      </details>
    </div>
  );
}
