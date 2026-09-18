"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, BookmarkPlus, Check, ExternalLink, ScanEye, Leaf, FileText,
} from "lucide-react";
import type { ChatMessage } from "../../lib/chat/types";

interface MessageBubbleProps {
  message: ChatMessage;
  onSave?: (message: ChatMessage) => void;
}

const sourceIcon = {
  atlas: Leaf,
  paper: FileText,
  web: ExternalLink,
  news: ExternalLink,
} as const;

export function MessageBubble({ message, onSave }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex max-w-[85%] flex-col gap-2 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="User attached photo"
            className="h-40 w-40 rounded-xl border border-elfo-verde-escuro/15 object-cover"
          />
        )}

        <div
          className={
            isUser
              ? "rounded-2xl rounded-tr-sm bg-elfo-verde-escuro px-4 py-3 text-elfo-off-white shadow-sm"
              : message.isVision
              ? "rounded-2xl rounded-tl-sm border border-ia-roxo-escuro/20 bg-ia-roxo-escuro px-4 py-3 text-white shadow-sm"
              : "rounded-2xl rounded-tl-sm border border-elfo-verde-escuro/10 bg-white px-4 py-3 text-elfo-verde-escuro shadow-sm"
          }
        >
          {message.isVision && (
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ia-cyan">
              <ScanEye className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Visual analysis</span>
            </div>
          )}

          <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
            {message.content}
            {message.streaming && (
              <motion.span
                aria-hidden="true"
                className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-current align-middle"
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  times: [0, 0.5, 0.5, 1],
                }}
              />
            )}
          </p>
        </div>

        <AnimatePresence>
          {!message.streaming &&
            message.sources &&
            message.sources.length > 0 && (
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex flex-wrap gap-1.5"
                aria-label="Sources used in the answer"
              >
                {message.sources.map((source, i) => {
                  const Icon = sourceIcon[source.kind] || ExternalLink;
                  const href =
                    source.url ||
                    (source.doi ? `https://doi.org/${source.doi}` : undefined);
                  return (
                    <li key={`${source.title}-${i}`}>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-elfo-dourado/40 bg-elfo-creme/60 px-2.5 py-1 text-xs text-elfo-verde-escuro transition-transform hover:scale-[1.02] hover:shadow-sm"
                        >
                          <Icon className="h-3 w-3" aria-hidden="true" />
                          {source.title.slice(0, 50)}
                          {source.title.length > 50 ? "..." : ""}
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-elfo-dourado/40 bg-elfo-creme/60 px-2.5 py-1 text-xs text-elfo-verde-escuro">
                          <Icon className="h-3 w-3" aria-hidden="true" />
                          {source.title}
                        </span>
                      )}
                    </li>
                  );
                })}
              </motion.ul>
            )}
        </AnimatePresence>

        {!isUser && !message.streaming && message.content && (
          <div className="flex gap-1">
            <button
              onClick={handleCopy}
              aria-label="Copy answer"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-elfo-verde-escuro/60 transition-transform hover:scale-[1.02] hover:bg-elfo-verde-escuro/5 hover:text-elfo-verde-escuro"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={() => onSave?.(message)}
              aria-label="Save to library"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-elfo-verde-escuro/60 transition-transform hover:scale-[1.02] hover:bg-elfo-verde-escuro/5 hover:text-elfo-verde-escuro"
            >
              <BookmarkPlus className="h-3.5 w-3.5" />
              Save
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
