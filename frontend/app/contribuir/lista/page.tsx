"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Lightbulb, Eye, Pencil, ThumbsUp, MessageCircle, MapPin } from "lucide-react";
import { Badge } from "../../componentes/ui/badge";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const ICONES: Record<string, any> = {
  historia: BookOpen,
  solucao: Lightbulb,
  observacao: Eye,
  correcao: Pencil,
};

const CORES: Record<string, string> = {
  historia: "#4BF98D",
  solucao: "#A68A42",
  observacao: "#3b82f6",
  correcao: "#f97316",
};

export default function ListaContribuicoes() {
  const [contribuicoes, setContribuicoes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    fetch(`${API}/contribuicoes?status=validado`)
      .then((r) => r.json())
      .then(setContribuicoes)
      .catch(() => setContribuicoes([]))
      .finally(() => setCarregando(false));
  }, []);

  const filtradas =
    filtro === "todos"
      ? contribuicoes
      : contribuicoes.filter((c) => c.tipo === filtro);

  return (
    <div className="min-h-screen bg-elfo-creme">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-widest text-elfo-dourado font-bold mb-3">
            Comunidade
          </p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-elfo-verde-escuro mb-4">
            Conhecimento compartilhado
          </h1>
          <p className="text-lg text-elfo-cinza mb-6">
            Histórias, soluções e observações validadas por curadores.
          </p>

          <div className="flex gap-2 flex-wrap">
            {[
              { id: "todos", label: "Todas" },
              { id: "historia", label: "Histórias" },
              { id: "solucao", label: "Soluções" },
              { id: "observacao", label: "Observações" },
              { id: "correcao", label: "Correções" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFiltro(f.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filtro === f.id
                    ? "bg-elfo-verde-escuro text-elfo-off-white"
                    : "bg-white text-elfo-cinza border border-elfo-dourado/20"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </header>

        {carregando ? (
          <p className="text-center text-elfo-cinza py-12">Carregando...</p>
        ) : filtradas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-elfo-cinza mb-4">
              Nenhuma contribuição validada ainda.
            </p>
            <Link
              href="/contribuir"
              className="inline-flex items-center gap-2 px-6 py-3 bg-elfo-verde-escuro text-elfo-off-white rounded-xl font-semibold hover:bg-elfo-verde-vivo hover:text-elfo-verde-escuro transition-all"
            >
              Seja o primeiro a contribuir
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtradas.map((c, i) => {
              const Icone = ICONES[c.tipo] || BookOpen;
              const cor = CORES[c.tipo] || "#4BF98D";
              return (
                <motion.article
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border-l-4 hover:shadow-lg transition-all"
                  style={{ borderLeftColor: cor }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${cor}20` }}
                    >
                      <Icone size={20} style={{ color: cor }} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="default">{c.tipo}</Badge>
                        {c.uf && (
                          <span className="text-xs text-elfo-cinza flex items-center gap-1">
                            <MapPin size={10} /> {c.municipio || c.uf}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-bold text-lg text-elfo-verde-escuro mb-2">
                        {c.titulo}
                      </h3>
                      <p className="text-sm text-elfo-cinza leading-relaxed mb-4">
                        {c.conteudo}
                      </p>

                      <div className="flex items-center justify-between text-xs text-elfo-cinza pt-3 border-t border-elfo-dourado/10">
                        <span>
                          Por{" "}
                          <strong className="text-elfo-verde-escuro">
                            {c.autor.nome}
                          </strong>{" "}
                          ({c.autor.perfil})
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <ThumbsUp size={12} /> {c.votos}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle size={12} />{" "}
                            {c.comentarios?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
