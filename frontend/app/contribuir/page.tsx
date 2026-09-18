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
    label: "História",
    descricao: "Conhecimento tradicional, memória, relato oral",
    icone: BookOpen,
    cor: "#4BF98D",
  },
  {
    id: "solucao",
    label: "Solução",
    descricao: "Método que você testou e funciona",
    icone: Lightbulb,
    cor: "#A68A42",
  },
  {
    id: "observacao",
    label: "Observação",
    descricao: "Algo que você viu no território",
    icone: Eye,
    cor: "#3b82f6",
  },
  {
    id: "correcao",
    label: "Correção",
    descricao: "Corrigir um caso do Atlas",
    icone: Pencil,
    cor: "#f97316",
  },
];

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function ContribuirPage() {
  const router = useRouter();
  const { usuario, token } = useAuth();
  const [tipo, setTipo] = useState("historia");
  const [enviando, setEnviando] = useState(false);
  const [evidencias, setEvidencias] = useState<any[]>([]);

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
    } catch (err: any) {
      toast.error(err.message);
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
    <div className="min-h-screen bg-elfo-creme">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-widest text-elfo-dourado font-bold mb-3">
            Contribuir
          </p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-elfo-verde-escuro mb-4">
            Compartilhe conhecimento
          </h1>
          <p className="text-lg text-elfo-cinza">
            Sua história, sua solução ou sua observação pode ajudar outras
            pessoas. Todo conhecimento será validado por curadores antes de
            entrar no Atlas.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-sm p-8 space-y-6 border border-elfo-dourado/10"
        >
          {/* Tipo */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-elfo-dourado mb-3">
              Tipo de contribuição
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TIPOS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTipo(t.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    tipo === t.id
                      ? "border-elfo-verde-escuro bg-elfo-verde-escuro/5"
                      : "border-elfo-dourado/20 hover:border-elfo-dourado/40"
                  }`}
                >
                  <t.icone
                    size={20}
                    className="mb-2"
                    style={{ color: t.cor }}
                  />
                  <p className="font-semibold text-sm text-elfo-verde-escuro">
                    {t.label}
                  </p>
                  <p className="text-xs text-elfo-cinza mt-1">
                    {t.descricao}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-elfo-dourado mb-2">
              Título
            </label>
            <input
              type="text"
              required
              minLength={5}
              maxLength={300}
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Resuma em uma frase"
              className="w-full px-4 py-3 rounded-xl border border-elfo-dourado/30 bg-white focus:outline-none focus:ring-2 focus:ring-elfo-verde-vivo/50"
            />
          </div>

          {/* Conteúdo */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-elfo-dourado mb-2">
              Conteúdo
            </label>
            <textarea
              required
              minLength={20}
              maxLength={10000}
              rows={8}
              value={form.conteudo}
              onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
              placeholder="Conte a história, descreva a solução, relate a observação..."
              className="w-full px-4 py-3 rounded-xl border border-elfo-dourado/30 bg-white focus:outline-none focus:ring-2 focus:ring-elfo-verde-vivo/50 resize-none"
            />
          </div>

          {/* Localização */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-elfo-dourado mb-2">
                UF
              </label>
              <input
                type="text"
                maxLength={2}
                value={form.uf}
                onChange={(e) =>
                  setForm({ ...form, uf: e.target.value.toUpperCase() })
                }
                placeholder="MG"
                className="w-full px-4 py-3 rounded-xl border border-elfo-dourado/30 bg-white focus:outline-none focus:ring-2 focus:ring-elfo-verde-vivo/50"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-elfo-dourado mb-2">
                Município
              </label>
              <input
                type="text"
                value={form.municipio}
                onChange={(e) =>
                  setForm({ ...form, municipio: e.target.value })
                }
                placeholder="Ouro Preto"
                className="w-full px-4 py-3 rounded-xl border border-elfo-dourado/30 bg-white focus:outline-none focus:ring-2 focus:ring-elfo-verde-vivo/50"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-elfo-dourado mb-2">
                Caso relacionado
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
                className="w-full px-4 py-3 rounded-xl border border-elfo-dourado/30 bg-white focus:outline-none focus:ring-2 focus:ring-elfo-verde-vivo/50"
              />
            </div>
          </div>

          {/* Evidências */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs uppercase tracking-wider font-bold text-elfo-dourado">
                Evidências (opcional)
              </label>
              <button
                type="button"
                onClick={adicionarEvidencia}
                className="text-xs text-elfo-verde-escuro hover:text-elfo-verde-vivo flex items-center gap-1"
              >
                <Plus size={12} /> Adicionar
              </button>
            </div>
            {evidencias.length === 0 ? (
              <p className="text-xs text-elfo-cinza italic">
                Adicione DOI, URL ou trecho de paper para reforçar a
                credibilidade.
              </p>
            ) : (
              <div className="space-y-3">
                {evidencias.map((ev, i) => (
                  <div
                    key={i}
                    className="p-3 bg-elfo-creme rounded-xl border border-elfo-dourado/20 relative"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setEvidencias(evidencias.filter((_, j) => j !== i))
                      }
                      className="absolute top-2 right-2 text-elfo-cinza hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                    <input
                      type="text"
                      placeholder="Título do paper/referência"
                      value={ev.titulo}
                      onChange={(e) => {
                        const novo = [...evidencias];
                        novo[i].titulo = e.target.value;
                        setEvidencias(novo);
                      }}
                      className="w-full mb-2 px-3 py-2 text-xs rounded-lg border border-elfo-dourado/20"
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
                      className="w-full mb-2 px-3 py-2 text-xs rounded-lg border border-elfo-dourado/20"
                    />
                    <textarea
                      placeholder="Trecho literal do paper"
                      rows={2}
                      value={ev.trecho}
                      onChange={(e) => {
                        const novo = [...evidencias];
                        novo[i].trecho = e.target.value;
                        setEvidencias(novo);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-elfo-dourado/20 resize-none"
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
              ? "Faça login para contribuir"
              : enviando
              ? "Publicando..."
              : "Publicar contribuição"}
          </Button>
        </form>
      </div>
    </div>
  );
}
