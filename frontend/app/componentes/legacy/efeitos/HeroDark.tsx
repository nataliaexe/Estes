"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { ParticleImage } from "./ParticleImage";

const EXEMPLOS = [
  { material: "eucalyptus", problema: "contaminated water" },
  { material: "coffee husk", problema: "heavy metals" },
  { material: "rice husk", problema: "flood contamination" },
];

// Imagem de referência (você pode trocar por uma sua)
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1600&q=80&auto=format";

export function HeroDark() {
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
    <section className="relative min-h-[100vh] flex items-center dark-cinema overflow-hidden">
      {/* Particle Image como fundo */}
      <div className="absolute inset-0 opacity-60">
        <ParticleImage
          imageUrl={HERO_IMAGE}
          particleCount={9000}
          particleSize={1.8}
          speed={0.8}
          cursorStrength={0.25}
          cursorRadius={140}
          width="100%"
          height="100%"
        />
      </div>

      {/* Vinheta escura para contraste */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(6,20,10,0.4) 50%, rgba(3,10,5,0.9) 100%)",
        }}
      />

      {/* Conteúdo */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-elfo-verde-vivo/30 backdrop-blur-sm text-elfo-verde-vivo text-sm font-medium mb-8"
          >
            <Sparkles size={14} />
            <span className="tracking-wider uppercase text-xs">
              Environmental Investigation Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-8"
            style={{ color: "#e8f4ec" }}
          >
            You bring what
            <br />
            you have.
            <br />
            <span className="text-glow-mixed">
              Estes investigates
              <br />
              what can be done.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl max-w-3xl leading-relaxed mb-12"
            style={{ color: "rgba(232, 244, 236, 0.7)" }}
          >
            Bring a local material and an environmental problem. We search 250
            million scientific papers, extract the evidence with DOI, and
            generate a reproducible protocol — with limitations and level of
            evidence.
          </motion.p>

          {/* Investigador */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            onSubmit={investigar}
            className="bg-white/5 backdrop-blur-md rounded-3xl p-4 md:p-6 max-w-3xl border border-elfo-verde-vivo/20 shadow-2xl"
          >
            <div className="grid md:grid-cols-[1fr_1fr_auto] gap-3">
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="What material do you have?"
                className="px-4 py-3 rounded-xl bg-white/5 border border-elfo-verde-vivo/20 text-elfo-off-white placeholder:text-elfo-off-white/40 focus:outline-none focus:ring-2 focus:ring-elfo-verde-vivo focus:bg-white/10 text-sm transition-all"
              />
              <input
                type="text"
                value={problema}
                onChange={(e) => setProblema(e.target.value)}
                placeholder="What problem to solve?"
                className="px-4 py-3 rounded-xl bg-white/5 border border-elfo-verde-vivo/20 text-elfo-off-white placeholder:text-elfo-off-white/40 focus:outline-none focus:ring-2 focus:ring-elfo-verde-vivo focus:bg-white/10 text-sm transition-all"
              />
              <button
                type="submit"
                className="btn-glow px-6 py-3 rounded-xl bg-elfo-verde-vivo text-elfo-verde-escuro font-display font-bold hover:bg-elfo-verde-vivo/90 transition-all flex items-center justify-center gap-2"
              >
                <Search size={18} />
                Investigate
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs text-elfo-off-white/40 self-center">
                Try:
              </span>
              {EXEMPLOS.map((e, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setMaterial(e.material);
                    setProblema(e.problema);
                  }}
                  className="text-xs bg-white/5 hover:bg-elfo-verde-vivo/20 border border-elfo-verde-vivo/20 px-3 py-1.5 rounded-full text-elfo-off-white/80 hover:text-elfo-verde-vivo transition-all"
                >
                  {e.material}
                </button>
              ))}
            </div>
          </motion.form>

          {/* Stats flutuantes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-wrap gap-8 mt-12"
          >
            {[
              { val: "19", label: "Investigated cases" },
              { val: "250M", label: "Papers searched" },
              { val: "100%", label: "Open source" },
            ].map((s, i) => (
              <div key={i}>
                <p className="font-display font-black text-3xl text-glow-green">
                  {s.val}
                </p>
                <p className="text-xs uppercase tracking-wider text-elfo-off-white/40">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-elfo-verde-vivo/40 flex items-start justify-center pt-2"
        >
          <div className="w-1 h-2 rounded-full bg-elfo-verde-vivo" />
        </motion.div>
      </motion.div>
    </section>
  );
}
