"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, ExternalLink, ThumbsUp, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

type Mensagem = {
  role: "user" | "assistant";
  content: string;
  fontes?: { tipo: string; titulo: string; url?: string; doi?: string }[];
  sugestoes?: string[];
  streaming?: boolean;
};

const SUGESTOES_INICIAIS = [
  "I have eucalyptus in my backyard, what can I do?",
  "Is there contamination near me?",
  "How to treat sewage at home?",
  "How to monitor a fire near me?",
];

export default function ChatPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const fimRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  async function enviar(pergunta: string) {
    if (!pergunta.trim() || carregando) return;

    const novaMensagem: Mensagem = { role: "user", content: pergunta };
    setMensagens((m) => [...m, novaMensagem]);
    setInput("");
    setCarregando(true);

    // Cria mensagem placeholder
    const idMsg = Date.now();
    setMensagens((m) => [
      ...m,
      { role: "assistant", content: "", streaming: true },
    ]);

    try {
      abortRef.current = new AbortController();
      const r = await fetch(`${API}/ia/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta }),
        signal: abortRef.current.signal,
      });

      if (!r.ok || !r.body) throw new Error("Erro na conexão");

      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let textoAtual = "";
      let fontes: any[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const linhas = chunk.split("\n");

        for (const linha of linhas) {
          if (!linha.startsWith("data: ")) continue;
          const dados = linha.slice(6);

          try {
            const obj = JSON.parse(dados);

            if (obj.tipo === "fontes") {
              fontes = obj.fontes || [];
            } else if (obj.tipo === "token") {
              textoAtual += obj.texto || "";
              setMensagens((m) => {
                const novo = [...m];
                novo[novo.length - 1] = {
                  role: "assistant",
                  content: textoAtual,
                  fontes,
                  streaming: true,
                };
                return novo;
              });
            }
          } catch {
            // ignora JSON inválido
          }
        }
      }

      // Finaliza streaming
      setMensagens((m) => {
        const novo = [...m];
        novo[novo.length - 1] = {
          role: "assistant",
          content: textoAtual,
          fontes,
          streaming: false,
          sugestoes: ["How can I filter this water?", "Show me the case in the Atlas"],
        };
        return novo;
      });
    } catch (err: any) {
      if (err.name === "AbortError") return;
      toast.error("Erro ao conectar com o assistente");
      setMensagens((m) => {
        const novo = [...m];
        novo[novo.length - 1] = {
          role: "assistant",
          content: "Sorry, I couldn't process your question. Try again.",
          streaming: false,
        };
        return novo;
      });
    } finally {
      setCarregando(false);
      abortRef.current = null;
    }
  }

  function parar() {
    abortRef.current?.abort();
    setCarregando(false);
  }

  function copiar(texto: string) {
    navigator.clipboard.writeText(texto);
    toast.success("Copiado");
  }

  return (
    <div className="min-h-screen bg-elfo-creme flex flex-col">
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col p-4 md:p-6">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="text-elfo-verde-vivo" size={20} />
            <h1 className="font-display font-black text-2xl text-elfo-verde-escuro">
              Estes Assistant
            </h1>
          </div>
          <p className="text-sm text-elfo-cinza">
            Describe your problem. I search the Atlas, scientific literature,
            and the web.
          </p>
        </header>

        <div className="flex-1 bg-white rounded-3xl shadow-sm p-4 md:p-6 overflow-y-auto mb-4 min-h-[500px] border border-elfo-dourado/10">
          {mensagens.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center py-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-8"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-elfo-verde-vivo to-elfo-verde-escuro flex items-center justify-center">
                  <Sparkles className="text-white" size={28} />
                </div>
                <h2 className="font-display font-bold text-xl text-elfo-verde-escuro mb-2">
                  How can I help?
                </h2>
                <p className="text-sm text-elfo-cinza">
                  Ask anything about water, soil, air, or environmental risks.
                </p>
              </motion.div>

              <div className="w-full max-w-xl space-y-2">
                {SUGESTOES_INICIAIS.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => enviar(s)}
                    className="w-full text-left bg-elfo-creme hover:bg-elfo-verde-vivo/10 border border-elfo-dourado/20 rounded-xl p-3 text-sm transition-all group"
                  >
                    <span className="text-elfo-verde-escuro group-hover:text-elfo-verde-vivo">
                      {s}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {mensagens.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      m.role === "user"
                        ? "bg-elfo-verde-escuro text-elfo-off-white"
                        : "bg-elfo-creme text-elfo-preto-suave"
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm leading-relaxed">
                      {m.content}
                      {m.streaming && (
                        <motion.span
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="inline-block w-1.5 h-4 bg-elfo-verde-vivo ml-1 align-middle"
                        />
                      )}
                    </p>
                  </div>
                </div>

                {/* Fontes */}
                {m.fontes && m.fontes.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-3 ml-2"
                  >
                    <p className="text-xs uppercase tracking-wider text-elfo-dourado font-bold mb-2">
                      Sources
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {m.fontes.map((f, j) => (
                        <a
                          key={j}
                          href={f.url || "#"}
                          target={f.url ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs bg-elfo-verde-vivo/10 hover:bg-elfo-verde-vivo/20 text-elfo-verde-escuro px-3 py-1.5 rounded-full transition-all"
                        >
                          {f.tipo === "paper" ? "📄" : f.tipo === "atlas" ? "📚" : "🔗"}{" "}
                          {f.titulo.slice(0, 50)}
                          {f.titulo.length > 50 ? "..." : ""}
                          {f.url && <ExternalLink size={10} />}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Acoes */}
                {!m.streaming && m.role === "assistant" && m.content && (
                  <div className="mt-2 ml-2 flex gap-2">
                    <button
                      onClick={() => copiar(m.content)}
                      className="text-xs text-elfo-cinza hover:text-elfo-verde-escuro flex items-center gap-1 transition-colors"
                    >
                      <Copy size={12} /> Copy
                    </button>
                    <button
                      onClick={() => enviar(mensagens[i - 1]?.content || "")}
                      className="text-xs text-elfo-cinza hover:text-elfo-verde-escuro flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw size={12} /> Retry
                    </button>
                  </div>
                )}

                {/* Sugestoes */}
                {m.sugestoes && m.sugestoes.length > 0 && !m.streaming && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-3 ml-2 flex flex-wrap gap-2"
                  >
                    {m.sugestoes.map((s, j) => (
                      <button
                        key={j}
                        onClick={() => enviar(s)}
                        className="text-xs bg-white border border-elfo-dourado/30 hover:bg-elfo-creme px-3 py-1.5 rounded-full transition-all text-elfo-verde-escuro"
                      >
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {carregando && mensagens[mensagens.length - 1]?.streaming === false && (
            <div className="flex justify-start">
              <div className="bg-elfo-creme rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                      className="w-2 h-2 rounded-full bg-elfo-verde-vivo"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={fimRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (carregando) parar();
            else enviar(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            disabled={carregando}
            className="flex-1 border border-elfo-dourado/30 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-elfo-verde-vivo/50 bg-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() && !carregando}
            className={`px-6 py-4 rounded-2xl font-semibold transition-all ${
              carregando
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-elfo-verde-escuro text-elfo-off-white hover:bg-elfo-verde-vivo hover:text-elfo-verde-escuro"
            } disabled:opacity-30`}
          >
            {carregando ? "Stop" : <Send size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}
