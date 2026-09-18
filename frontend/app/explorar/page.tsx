"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FlaskConical, Loader2, ExternalLink, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const EXEMPLOS = [
  { material: "coffee husk", problema: "water contaminated with heavy metals" },
  { material: "rice husk", problema: "arsenic in groundwater" },
  { material: "banana peel", problema: "mercury contamination" },
  { material: "eucalyptus leaves", problema: "water with pesticides" },
];

export default function ExplorarPage() {
  const [material, setMaterial] = useState("");
  const [problema, setProblema] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState<any>(null);

  async function explorar(e?: React.FormEvent) {
    e?.preventDefault();
    if (!material.trim() || !problema.trim()) {
      toast.error("Fill both fields");
      return;
    }

    setCarregando(true);
    setResultado(null);

    try {
      const r = await fetch(`${API}/explorar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ material, problema }),
      });

      if (!r.ok) throw new Error();
      const dados = await r.json();
      setResultado(dados);
      toast.success(
        `${dados.total_papers_encontrados} papers found, ${dados.total_evidencias} applicable`
      );
    } catch {
      toast.error("Error exploring. Try again.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-elfo-creme">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ia-roxo-neon/10 text-ia-roxo-escuro text-sm font-medium mb-6"
          >
            <FlaskConical size={14} />
            <span>Scientific Engine</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-4xl md:text-6xl text-elfo-verde-escuro mb-4"
          >
            Explore any material
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-elfo-cinza max-w-2xl mx-auto"
          >
            Tell us what local resource you have and what problem you want to
            solve. We search 250 million papers and generate reproducible
            protocols.
          </motion.p>
        </header>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={explorar}
          className="bg-white rounded-3xl shadow-lg p-8 border border-elfo-dourado/10"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-elfo-dourado mb-2">
                What material do you have?
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g., coffee husk"
                className="w-full px-4 py-3 rounded-xl border border-elfo-dourado/30 bg-white focus:outline-none focus:ring-2 focus:ring-ia-roxo-neon/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-elfo-dourado mb-2">
                What problem to solve?
              </label>
              <input
                type="text"
                value={problema}
                onChange={(e) => setProblema(e.target.value)}
                placeholder="e.g., water contamination"
                className="w-full px-4 py-3 rounded-xl border border-elfo-dourado/30 bg-white focus:outline-none focus:ring-2 focus:ring-ia-roxo-neon/50 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs text-elfo-cinza">Try:</span>
            {EXEMPLOS.map((e, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setMaterial(e.material);
                  setProblema(e.problema);
                }}
                className="text-xs bg-elfo-creme hover:bg-ia-roxo-neon/10 px-3 py-1 rounded-full transition-all text-elfo-cinza hover:text-ia-roxo-escuro"
              >
                {e.material}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full py-4 rounded-xl font-display font-bold text-lg transition-all bg-gradient-to-r from-ia-roxo-neon to-ia-roxo-escuro text-white hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {carregando ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Searching scientific literature...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Explore with science
              </>
            )}
          </button>
        </motion.form>

        <AnimatePresence>
          {resultado && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 space-y-6"
            >
              {/* Resumo */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="font-display font-black text-4xl text-ia-roxo-neon">
                    {resultado.total_papers_encontrados}
                  </div>
                  <div className="text-xs text-elfo-cinza uppercase tracking-wider mt-1">
                    papers found
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="font-display font-black text-4xl text-elfo-verde-vivo">
                    {resultado.total_evidencias}
                  </div>
                  <div className="text-xs text-elfo-cinza uppercase tracking-wider mt-1">
                    applicable
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="font-display font-black text-4xl text-elfo-dourado">
                    {resultado.caminhos_possiveis?.length || 0}
                  </div>
                  <div className="text-xs text-elfo-cinza uppercase tracking-wider mt-1">
                    paths
                  </div>
                </div>
              </div>

              {/* Evidencias */}
              {resultado.evidencias?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="font-display font-bold text-xl text-elfo-verde-escuro mb-4 flex items-center gap-2">
                    <CheckCircle2 className="text-elfo-verde-vivo" size={20} />
                    Scientific evidence
                  </h2>
                  <div className="space-y-4">
                    {resultado.evidencias.map((e: any, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="border-l-4 border-elfo-dourado pl-4 py-2"
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <p className="font-semibold text-sm text-elfo-verde-escuro">
                            {e.claim}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${
                              e.nivel === "demonstrado"
                                ? "bg-green-100 text-green-800"
                                : e.nivel === "suportado"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {e.nivel}
                          </span>
                        </div>
                        <p className="text-xs text-elfo-cinza italic mb-2">
                          "{e.trecho}"
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs">
                          <span className="text-elfo-cinza">{e.source.slice(0, 60)}</span>
                          {e.doi && (
                            <a
                              href={`https://doi.org/${e.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-ia-roxo-neon hover:underline inline-flex items-center gap-1"
                            >
                              DOI: {e.doi} <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                        {e.limitacoes && (
                          <p className="text-xs text-amber-700 mt-2 flex items-start gap-1">
                            <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                            {e.limitacoes}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Caminhos */}
              {resultado.caminhos_possiveis?.length > 0 && (
                <div className="bg-gradient-to-br from-ia-roxo-escuro to-ia-roxo-neon/20 text-white rounded-2xl p-6 shadow-lg">
                  <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
                    <Sparkles size={20} />
                    Possible paths
                  </h2>
                  <ol className="space-y-3">
                    {resultado.caminhos_possiveis.map((c: string, i: number) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex gap-3 text-sm leading-relaxed"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <span>{c}</span>
                      </motion.li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Seguranca */}
              {resultado.seguranca?.length > 0 && (
                <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl p-6">
                  <h3 className="font-display font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <AlertTriangle size={18} />
                    Safety alerts
                  </h3>
                  <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                    {resultado.seguranca.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Aviso */}
              {resultado.aviso && (
                <div className="text-center text-sm text-elfo-cinza italic bg-white rounded-2xl p-4 shadow-sm">
                  {resultado.aviso}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
