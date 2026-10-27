"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, MapPin } from "lucide-react";

export type Historia = {
  id: string;
  povo: string;
  local: string;
  citacao: string;
  numero: string;
  descricao: string;
  cor: string;
  foto: string;
};

const HISTORIAS_PADRAO: Historia[] = [
  {
    id: "maxakali",
    povo: "Maxakali (Tikmũ'ũn)",
    local: "Vale do Mucuri, MG",
    citacao:
      "O Maxakali surgiu através da gíria, da gíria do barro. Por isso que o território para nós é muito importante.",
    numero: "4x",
    descricao:
      "mortalidade infantil maior que a média brasileira, segundo a Fiocruz (2026).",
    cor: "#4BF98D",
    foto: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format",
  },
  {
    id: "waimiri",
    povo: "Waimiri Atroari",
    local: "Rio Alalaú, AM/RR",
    citacao:
      "Encontramos botos e tartarugas mortos boiando no rio que sempre nos alimentou.",
    numero: "1",
    descricao:
      "vazamento de rejeito de mineração confirmado pelo IBAMA em 2026.",
    cor: "#A68A42",
    foto: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&auto=format",
  },
  {
    id: "defensores",
    povo: "Defensores ambientais",
    local: "Pará e Rondônia",
    citacao:
      "Defender a terra é defender a vida. E no Brasil isso custa a própria vida.",
    numero: "26",
    descricao:
      "assassinatos de defensores da terra em um ano (Global Witness, 2026).",
    cor: "#7F1D1D",
    foto: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format",
  },
];

export function CardSwap({
  historias = HISTORIAS_PADRAO,
  intervalo = 6000,
}: {
  historias?: Historia[];
  intervalo?: number;
}) {
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAtual((prev) => (prev + 1) % historias.length);
    }, intervalo);
    return () => clearInterval(timer);
  }, [historias.length, intervalo]);

  const h = historias[atual];

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={h.id}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-3xl overflow-hidden shadow-2xl border border-elfo-dourado/20"
        >
          {/* Foto */}
          <div
            className="relative h-[400px] md:h-[500px] overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${h.cor}40, #114224)` }}
          >
            <img
              src={h.foto}
              alt={h.povo}
              className="w-full h-full object-cover opacity-90 mix-blend-luminosity"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, transparent 40%, ${h.cor}30 100%)`,
              }}
            />
          </div>

          {/* Texto */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-sm text-elfo-cinza mb-4">
              <MapPin size={14} />
              <span className="font-medium">{h.local}</span>
            </div>

            <h3 className="font-display font-black text-3xl md:text-4xl text-elfo-verde-escuro mb-6 leading-tight">
              {h.povo}
            </h3>

            <div className="relative pl-6 mb-6">
              <Quote
                className="absolute left-0 top-0 w-5 h-5 text-elfo-dourado"
                fill="currentColor"
              />
              <p className="italic text-elfo-cinza leading-relaxed">
                {h.citacao}
              </p>
            </div>

            <div className="flex items-baseline gap-3">
              <span
                className="font-display font-black text-6xl"
                style={{ color: h.cor }}
              >
                {h.numero}
              </span>
              <span className="text-sm text-elfo-cinza leading-tight">
                {h.descricao}
              </span>
            </div>

            {/* Indicadores */}
            <div className="flex gap-2 mt-8">
              {historias.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setAtual(i)}
                  className="h-1 rounded-full transition-all"
                  style={{
                    width: i === atual ? "32px" : "12px",
                    background: i === atual ? h.cor : "#EAE5D8",
                  }}
                  aria-label={`Historia ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
