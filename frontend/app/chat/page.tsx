"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "../lib/api";

type Mensagem = {
  role: "user" | "assistant";
  content: string;
  fontes?: { tipo: string; titulo: string }[];
  sugestoes?: string[];
};

export default function ChatPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const fimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  async function enviar(pergunta: string) {
    if (!pergunta.trim() || carregando) return;

    setMensagens((m) => [...m, { role: "user", content: pergunta }]);
    setInput("");
    setCarregando(true);

    try {
      const r = await api.perguntar(pergunta);
      setMensagens((m) => [
        ...m,
        {
          role: "assistant",
          content: r.texto,
          fontes: r.fontes,
          sugestoes: r.sugestoes,
        },
      ]);
    } catch (e) {
      setMensagens((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Erro ao conectar com o assistente. Verifique se o backend esta rodando.",
        },
      ]);
    } finally {
      setCarregando(false);
    }
  }

  const sugestoesIniciais = [
    "Tenho eucalipto no quintal, o que posso fazer?",
    "Tem contaminação perto de mim?",
    "Como tratar esgoto em casa?",
    "Queimada perto de mim, como monitorar?",
  ];

  return (
    <div className="min-h-screen bg-terra-50 flex flex-col">
      <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col p-4">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-verde-900">
            Assistente Estes
          </h1>
          <p className="text-sm text-gray-600">
            Descreva seu problema. Busco no Atlas e na web.
          </p>
        </header>

        <div className="flex-1 bg-white rounded-xl shadow p-4 overflow-y-auto mb-4 min-h-[400px]">
          {mensagens.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-6">
                Comece com uma pergunta. Alguns exemplos:
              </p>
              <div className="space-y-2">
                {sugestoesIniciais.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => enviar(s)}
                    className="block w-full text-left bg-terra-50 hover:bg-verde-50 border rounded-lg p-3 text-sm transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mensagens.map((m, i) => (
            <div key={i} className="mb-4">
              <div
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    m.role === "user"
                      ? "bg-verde-900 text-white"
                      : "bg-terra-50 text-gray-800"
                  }`}
                >
                  <p className="whitespace-pre-line text-sm leading-relaxed">
                    {m.content}
                  </p>
                </div>
              </div>

              {m.fontes && m.fontes.length > 0 && (
                <div className="mt-2 ml-2">
                  <p className="text-xs text-gray-500 mb-1">Fontes:</p>
                  <div className="flex flex-wrap gap-1">
                    {m.fontes.map((f, j) => (
                      <span
                        key={j}
                        className="text-xs bg-verde-100 text-verde-900 px-2 py-0.5 rounded-full"
                      >
                        {f.titulo}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {m.sugestoes && m.sugestoes.length > 0 && (
                <div className="mt-2 ml-2 flex flex-wrap gap-1">
                  {m.sugestoes.map((s, j) => (
                    <button
                      key={j}
                      onClick={() => enviar(s)}
                      className="text-xs bg-white border hover:bg-terra-50 px-2 py-1 rounded-full transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {carregando && (
            <div className="flex justify-start">
              <div className="bg-terra-50 rounded-2xl px-4 py-2">
                <p className="text-sm text-gray-500 animate-pulse">
                  Pensando...
                </p>
              </div>
            </div>
          )}

          <div ref={fimRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            enviar(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte algo..."
            disabled={carregando}
            className="flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-verde-500 bg-white"
          />
          <button
            type="submit"
            disabled={carregando || !input.trim()}
            className="bg-verde-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-verde-700 disabled:opacity-50 transition"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
