"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ArrowUp, Square, X } from "lucide-react";

interface ChatInputProps {
  disabled?: boolean;
  isStreaming: boolean;
  onSend: (text: string, image?: File) => void;
  onStop: () => void;
}

export function ChatInput({
  disabled,
  isStreaming,
  onSend,
  onStop,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Image too large (max 10 MB)");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function submit() {
    const trimmed = text.trim();
    if (!trimmed && !image) return;
    onSend(trimmed, image ?? undefined);
    setText("");
    clearImage();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="border-t border-elfo-verde-escuro/10 bg-elfo-creme/70 px-4 py-3 backdrop-blur-sm sm:px-8">
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 10 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="relative inline-block"
          >
            <img
              src={preview}
              alt="Attached photo preview"
              className="h-20 w-20 rounded-lg border border-elfo-verde-escuro/20 object-cover"
            />
            <button
              onClick={clearImage}
              aria-label="Remove attached photo"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-elfo-verde-escuro text-elfo-off-white shadow transition-transform hover:scale-[1.05]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
          aria-label="Attach photo"
        />
        <button
          type="button"
          aria-label="Attach photo"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-elfo-verde-escuro/20 bg-white text-elfo-verde-escuro transition-transform hover:scale-[1.02] hover:bg-elfo-verde-vivo/15 sm:h-10 sm:w-10"
        >
          <Camera className="h-5 w-5" />
        </button>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          placeholder="Ask something... or describe what you have"
          aria-label="Write message"
          className="max-h-32 min-h-[44px] flex-1 resize-none rounded-2xl border border-elfo-verde-escuro/20 bg-white px-4 py-3 text-[15px] text-elfo-verde-escuro placeholder:text-elfo-verde-escuro/45 focus:outline-none focus:ring-2 focus:ring-elfo-verde-vivo"
        />

        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop answer"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-dir-rubi text-white transition-transform hover:scale-[1.02] sm:h-10 sm:w-10"
          >
            <Square className="h-4 w-4" fill="currentColor" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={disabled || (!text.trim() && !image)}
            aria-label="Send message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-elfo-verde-escuro text-elfo-verde-vivo transition-transform hover:scale-[1.02] hover:bg-elfo-verde-escuro/90 disabled:opacity-40 sm:h-10 sm:w-10"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
