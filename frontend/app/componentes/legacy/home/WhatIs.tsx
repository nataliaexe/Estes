"use client";

import { Leaf, FlaskConical, Shield } from "lucide-react";
import { ScrollReveal } from "../efeitos/ScrollReveal";
import { StaggerContainer, StaggerItem } from "../efeitos/StaggerContainer";

const PILARES = [
  {
    icone: Leaf,
    titulo: "Turn waste into solutions",
    descricao:
      "Eucalyptus leaves become water sensors. Rice husk becomes a filter. Açaí seeds clean mercury from soil. The solution is in your backyard.",
    cor: "#4BF98D",
    bg: "#114224",
  },
  {
    icone: FlaskConical,
    titulo: "Science, not opinion",
    descricao:
      "Every recipe comes with the paper, the DOI, and the level of evidence. You know exactly what's proven and what's hypothesis.",
    cor: "#C26BFA",
    bg: "#301659",
  },
  {
    icone: Shield,
    titulo: "Rights guaranteed",
    descricao:
      "When data shows a serious violation, the platform generates a legal complaint to the Federal Public Ministry. Automatically. With evidence.",
    cor: "#7F1D1D",
    bg: "#FDFBF7",
  },
];

export function WhatIs() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-elfo-dourado font-bold mb-4">
              What is Estes
            </p>
            <h2 className="font-display font-black text-5xl md:text-6xl text-elfo-verde-escuro mb-6 leading-tight">
              Three things, one mission
            </h2>
            <p className="text-lg text-elfo-cinza max-w-2xl mx-auto leading-relaxed">
              We are building infrastructure for environmental citizenship.
              Open source, always free.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-3 gap-6">
          {PILARES.map((p, i) => (
            <StaggerItem key={i}>
              <div
                className="relative rounded-3xl p-8 h-full overflow-hidden group hover:scale-[1.02] transition-transform duration-500"
                style={{ background: p.bg }}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition-opacity"
                  style={{ background: p.cor }}
                />
                <p.icone
                  size={40}
                  className="mb-6 relative"
                  style={{ color: p.cor }}
                />
                <h3
                  className="font-display font-bold text-2xl mb-3 relative"
                  style={{ color: p.bg === "#FDFBF7" ? "#1C1B1F" : "#FFFFFF" }}
                >
                  {p.titulo}
                </h3>
                <p
                  className="text-sm leading-relaxed relative"
                  style={{
                    color: p.bg === "#FDFBF7" ? "#6B7280" : "rgba(255,255,255,0.75)",
                  }}
                >
                  {p.descricao}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
