"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Lightbulb, Eye, Pencil, Plus, X } from "lucide-react";
import { Button } from "../componentes/ui/button";
import { useAuth } from "../contextos/AuthContext";
import { toast } from "sonner";

const TIPOS = [
  {
    id: "historia",
    label: "Story",
    descricao: "Conhecimento tradicional, memória, relato oral",
    icone: BookOpen,
    cor: "#4BF98D",
  },
  {
    id: "solucao",
    label: "Solution",
    descricao: "Método que você testou e funciona",
    icone: Lightbulb,
    cor: "#A68A42",
  },
  {
    id: "observacao",
    label: "Observation",
    descricao: "Algo que você viu no território",
    icone: Eye,
    cor: "#3b82f6",
  },
  {
    id: "correcao",
    label: "Correction",
    descricao: "Corrigir um caso do Atlas",
    icone: Pencil,
    cor: "#f97316",
  },
];

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

type EvidenciaDraft = { tipo: string; titulo: string; doi: string; url: string; trecho: string };

export default function ContribuirPage() {
  const router = useRouter();
  const { usuario, token } = useAuth();
  const [tipo, setTipo] = useState("historia");
  const [enviando, setEnviando] = useState(false);
  const [evidencias, setEvidencias] = useState<EvidenciaDraft[]>([]);

  const [form, setForm] = useState({
    titulo: "",
    conteudo: "",
    uf: usuario?.uf || "",
    municipio: usuario?.municipio || "",
    caso_numero: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      toast.error("Faça login para contribuir");
      router.push("/entrar");
      return;
    }

    setEnviando(true);
    try {
      const r = await fetch(`${API}/contribuicoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tipo,
          titulo: form.titulo,
          conteudo: form.conteudo,
          uf: form.uf || null,
          municipio: form.municipio || null,
          evidencias,
          caso_numero: form.caso_numero
            ? parseInt(form.caso_numero)
            : null,
        }),
      });

      if (!r.ok) {
        const err = await r.json();
        throw new Error(err.detail || "Erro ao publicar");
      }

      toast.success(
        "Contribuição enviada! Aguardando validação de um curador."
      );
      router.push("/contribuir/lista");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao publicar contribuição");
    } finally {
      setEnviando(false);
    }
  }

  function adicionarEvidencia() {
    setEvidencias([
      ...evidencias,
      { tipo: "paper", titulo: "", doi: "", url: "", trecho: "" },
    ]);
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-widest text-accent-secondary font-bold mb-3">
            Contribute
          </p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-text-primary mb-4">
            Share knowledge
          </h1>
          <p className="text-lg text-text-secondary">
            Your story, solution, or observation can help others. All
            contributions will be validated by curators before entering the
            Atlas.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-bg-tertiary rounded-3xl shadow-sm p-8 space-y-6 border border-border"
        >
          {/* Tipo */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-accent-secondary mb-3">
              Type of contribution
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TIPOS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTipo(t.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    tipo === t.id
                      ? "border-accent-primary bg-accent-primary/5"
                      : "border-border hover:border-accent-primary/40"
                  }`}
                >
                  <t.icone
                    size={20}
                    className="mb-2"
                    style={{ color: t.cor }}
                  />
                  <p className="font-semibold text-sm text-text-primary">
                    {t.label}
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    {t.descricao}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-accent-secondary mb-2">
              Title
            </label>
            <input
              type="text"
              required
              minLength={5}
              maxLength={300}
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Summarize in one sentence"
              className="w-full px-4 py-3 rounded-xl border border-border bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-primary placeholder:text-text-muted"
            />
          </div>

          {/* Conteúdo */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-accent-secondary mb-2">
              Content
            </label>
            <textarea
              required
              minLength={20}
              maxLength={10000}
              rows={8}
              value={form.conteudo}
              onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
              placeholder="Tell the story, describe the solution, report the observation..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 resize-none text-text-primary placeholder:text-text-muted"
            />
          </div>

          {/* Localização */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-accent-secondary mb-2">
                State (UF)
              </label>
              <input
                type="text"
                maxLength={2}
                value={form.uf}
                onChange={(e) =>
                  setForm({ ...form, uf: e.target.value.toUpperCase() })
                }
                placeholder="MG"
                className="w-full px-4 py-3 rounded-xl border border-border bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-primary placeholder:text-text-muted"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-accent-secondary mb-2">
                Municipality
              </label>
              <input
                type="text"
                value={form.municipio}
                onChange={(e) =>
                  setForm({ ...form, municipio: e.target.value })
                }
                placeholder="Ouro Preto"
                className="w-full px-4 py-3 rounded-xl border border-border bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-primary placeholder:text-text-muted"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-accent-secondary mb-2">
                Related case
              </label>
              <input
                type="number"
                min={1}
                max={22}
                value={form.caso_numero}
                onChange={(e) =>
                  setForm({ ...form, caso_numero: e.target.value })
                }
                placeholder="Ex: 1"
                className="w-full px-4 py-3 rounded-xl border border-border bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-primary placeholder:text-text-muted"
              />
            </div>
          </div>

          {/* Evidências */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs uppercase tracking-wider font-bold text-accent-secondary">
                Evidence (optional)
              </label>
              <button
                type="button"
                onClick={adicionarEvidencia}
                className="text-xs text-text-primary hover:text-accent-primary flex items-center gap-1"
              >
                <Plus size={12} /> Add
              </button>
            </div>
            {evidencias.length === 0 ? (
              <p className="text-xs text-text-secondary italic">
                Add DOI, URL, or paper excerpt to strengthen credibility.
              </p>
            ) : (
              <div className="space-y-3">
                {evidencias.map((ev, i) => (
                  <div
                    key={i}
                    className="p-3 bg-bg-secondary rounded-xl border border-border relative"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setEvidencias(evidencias.filter((_, j) => j !== i))
                      }
                      className="absolute top-2 right-2 text-text-secondary hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                    <input
                      type="text"
                      placeholder="Paper/reference title"
                      value={ev.titulo}
                      onChange={(e) => {
                        const novo = [...evidencias];
                        novo[i].titulo = e.target.value;
                        setEvidencias(novo);
                      }}
                      className="w-full mb-2 px-3 py-2 text-xs rounded-lg border border-border bg-bg-tertiary text-text-primary placeholder:text-text-muted"
                    />
                    <input
                      type="text"
                      placeholder="DOI (ex: 10.1000/xyz)"
                      value={ev.doi}
                      onChange={(e) => {
                        const novo = [...evidencias];
                        novo[i].doi = e.target.value;
                        setEvidencias(novo);
                      }}
                      className="w-full mb-2 px-3 py-2 text-xs rounded-lg border border-border bg-bg-tertiary text-text-primary placeholder:text-text-muted"
                    />
                    <textarea
                      placeholder="Literal paper excerpt"
                      rows={2}
                      value={ev.trecho}
                      onChange={(e) => {
                        const novo = [...evidencias];
                        novo[i].trecho = e.target.value;
                        setEvidencias(novo);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-bg-tertiary resize-none text-text-primary placeholder:text-text-muted"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={enviando || !usuario}
          >
            {!usuario
              ? "Sign in to contribute"
              : enviando
              ? "Publishing..."
              : "Publish contribution"}
          </Button>
        </form>
      </div>
    </div>
  );
}
