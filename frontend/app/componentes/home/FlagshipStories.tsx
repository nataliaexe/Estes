"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "../efeitos/ScrollReveal";

const STORIES = [
  {
    id: "maxakali",
    povo: "Maxakali (Tikmũ'ũn)",
    local: "Vale do Mucuri, Minas Gerais",
    citacao:
      "The Maxakali emerged from the clay. That's why territory is so important to us. Every place has a story and a chant.",
    numero: "4x",
    descricao: "higher child mortality than the Brazilian average (Fiocruz, 2026)",
    historia:
      "Forced into small islands of land by cattle farms and deforestation. No forest, no game. No forest, no water. In July 2026, the Federal Court declared a 'state of unconstitutional things'.",
    cor: "#4BF98D",
    bg: "linear-gradient(135deg, #114224 0%, #1a5c33 100%)",
    foto: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200&auto=format",
    caso: 15,
  },
  {
    id: "yanomami",
    povo: "Yanomami",
    local: "Roraima and Amazonas",
    citacao:
      "The mercury from the gold mines is inside our fish. We can no longer trust the river that fed us for centuries.",
    numero: "570",
    descricao: "children died in 4 years from malnutrition and contamination (Ministry of Health, 2023)",
    historia:
      "Illegal gold mining dumped tons of mercury into the rivers. The mercury accumulated in fish — the base of Yanomami diet. Communities that fished for centuries now depend on government food baskets.",
    cor: "#A68A42",
    bg: "linear-gradient(135deg, #3d2418 0%, #8b5a3c 100%)",
    foto: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&auto=format",
    caso: 3,
  },
  {
    id: "waimiri",
    povo: "Waimiri Atroari",
    local: "Rio Alalaú, AM/RR",
    citacao:
      "We found dead dolphins and turtles floating in the river that always fed us.",
    numero: "2026",
    descricao: "IBAMA confirmed illegal mining waste in the river",
    historia:
      "Dozens of dead animals found in the river that cuts through their territory. Mining tailings dumped upstream. Their food security and access to clean water are compromised.",
    cor: "#29E7F2",
    bg: "linear-gradient(135deg, #0e3a4a 0%, #1a5f75 100%)",
    foto: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format",
    caso: 21,
  },
  {
    id: "rs-flood",
    povo: "Rio Grande do Sul communities",
    local: "Porto Alegre and surroundings",
    citacao:
      "The water came. And when it left, it took everything. Including our trust in the water we drink.",
    numero: "2024+2026",
    descricao: "two catastrophic floods remobilized industrial contaminants",
    historia:
      "Floods remobilized buried contaminants — heavy metals, industrial waste, sewage. Communities received portable biochar filters to have any safe water at all.",
    cor: "#4BF98D",
    bg: "linear-gradient(135deg, #114224 0%, #1a5c33 100%)",
    foto: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1200&auto=format",
    caso: 11,
  },
  {
    id: "pantanal",
    povo: "Pantanal and Cerrado",
    local: "Mato Grosso and Mato Grosso do Sul",
    citacao:
      "The sky turned orange. The lungs turned black. And nobody had numbers to prove it.",
    numero: "4.553",
    descricao: "fire outbreaks in Mato Grosso in 2026 alone",
    historia:
      "Mato Grosso leads Brazil in fires. Communities lack low-cost air quality sensors. The Estes network of sensors fills that gap.",
    cor: "#7F1D1D",
    bg: "linear-gradient(135deg, #3d0a0a 0%, #7f1d1d 100%)",
    foto: "https://images.unsplash.com/photo-1615092426067-8aa5a9d4d3c9?w=1200&auto=format",
    caso: 7,
  },
];

export function FlagshipStories() {
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado) return;
    const t = setInterval(() => {
      setAtual((a) => (a + 1) % STORIES.length);
    }, 7000);
    return () => clearInterval(t);
  }, [pausado]);

  const s = STORIES[atual];

  return (
    <section
      className="py-24 px-6 relative overflow-hidden"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      {/* Fundo animado */}
      <AnimatePresence mode="wait">
        <motion.div
          key={s.id + "-bg"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
          style={{ background: s.bg }}
        />
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50 font-bold mb-4">
              Five real stories
            </p>
            <h2 className="font-display font-black text-5xl md:text-6xl text-white leading-tight">
              Who protects the forest
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 items-stretch min-h-[520px]">
          {/* Foto */}
          <AnimatePresence mode="wait">
            <motion.div
              key={s.id + "-foto"}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src={s.foto}
                alt={s.povo}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, transparent 40%, ${s.bg.split(",")[0].replace("linear-gradient(135deg, ", "")} 100%)`,
                  opacity: 0.5,
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Texto */}
          <AnimatePresence mode="wait">
            <motion.div
              key={s.id + "-texto"}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-center text-white"
            >
              <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
                <MapPin size={14} />
                <span className="font-medium tracking-wide">{s.local}</span>
              </div>

              <h3 className="font-display font-black text-4xl md:text-5xl mb-6 leading-tight">
                {s.povo}
              </h3>

              <div className="relative pl-6 mb-6">
                <Quote
                  className="absolute left-0 top-0 w-5 h-5"
                  style={{ color: s.cor }}
                  fill="currentColor"
                />
                <p className="italic text-lg leading-relaxed text-white/85">
                  {s.citacao}
                </p>
              </div>

              <p className="text-base text-white/70 mb-8 leading-relaxed">
                {s.historia}
              </p>

              <div className="flex items-baseline gap-4 mb-8">
                <span
                  className="font-display font-black text-6xl"
                  style={{ color: s.cor }}
                >
                  {s.numero}
                </span>
                <span className="text-sm text-white/60 leading-tight max-w-xs">
                  {s.descricao}
                </span>
              </div>

              <Link
                href={`/caso/${s.caso}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:gap-3 transition-all group"
              >
                See the solution
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Indicadores */}
              <div className="flex gap-2 mt-10">
                {STORIES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setAtual(i)}
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: i === atual ? "48px" : "16px",
                      background: i === atual ? s.cor : "rgba(255,255,255,0.3)",
                    }}
                    aria-label={`Story ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
