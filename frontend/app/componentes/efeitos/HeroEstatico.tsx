"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Search } from "lucide-react";

const EXEMPLOS = [
  { material: "eucalyptus", problema: "contaminated water" },
  { material: "coffee husk", problema: "heavy metals" },
  { material: "rice husk", problema: "flood contamination" },
];

export function HeroEstatico() {
  const router = useRouter();
  const [material, setMaterial] = useState("");
  const [problema, setProblema] = useState("");

  function investigar(e: React.FormEvent) {
    e.preventDefault();
    if (!material.trim() || !problema.trim()) return;
    router.push(
      `/explorar?material=${encodeURIComponent(material)}&problema=${encodeURIComponent(problema)}`
    );
  }

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-gradient-to-br from-elfo-creme via-elfo-creme to-elfo-verde-vivo/10">
      {/* Fundo animado sutil */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-elfo-verde-vivo/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-elfo-dourado/20 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elfo-verde-escuro text-elfo-off-white text-sm font-medium mb-8"
          >
            <Sparkles size={14} className="text-elfo-verde-vivo" />
            <span>Environmental investigation platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-elfo-verde-escuro leading-[0.95] mb-6"
          >
            You bring what you have.
            <br />
            <span className="text-gradient-elfo">
              Estes investigates what can be done.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-elfo-cinza max-w-3xl leading-relaxed mb-10"
          >
            Bring a local material and an environmental problem. We search 250
            million scientific papers, extract the evidence, and generate a
            reproducible protocol — with DOI, limitations, and level of
            evidence.
          </motion.p>

          {/* Investigador */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={investigar}
            className="bg-white rounded-3xl shadow-2xl p-4 md:p-6 max-w-3xl border border-elfo-dourado/20"
          >
            <div className="grid md:grid-cols-[1fr_1fr_auto] gap-3">
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="What material do you have?"
                className="px-4 py-3 rounded-xl border border-elfo-dourado/30 bg-elfo-creme/50 focus:outline-none focus:ring-2 focus:ring-elfo-verde-vivo text-sm"
              />
              <input
                type="text"
                value={problema}
                onChange={(e) => setProblema(e.target.value)}
                placeholder="What problem to solve?"
                className="px-4 py-3 rounded-xl border border-elfo-dourado/30 bg-elfo-creme/50 focus:outline-none focus:ring-2 focus:ring-elfo-verde-vivo text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-elfo-verde-escuro text-elfo-off-white font-display font-bold hover:bg-elfo-verde-vivo hover:text-elfo-verde-escuro transition-all flex items-center justify-center gap-2"
              >
                <Search size={18} />
                Investigate
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs text-elfo-cinza">Try:</span>
              {EXEMPLOS.map((e, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setMaterial(e.material);
                    setProblema(e.problema);
                  }}
                  className="text-xs bg-elfo-creme hover:bg-elfo-verde-vivo/20 px-3 py-1 rounded-full text-elfo-verde-escuro transition-all"
                >
                  {e.material}
                </button>
              ))}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
