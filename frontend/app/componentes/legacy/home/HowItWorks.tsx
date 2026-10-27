"use client";

import { MapPin, Search, FlaskConical, ShieldCheck } from "lucide-react";
import { ScrollReveal } from "../efeitos/ScrollReveal";
import { StaggerContainer, StaggerItem } from "../efeitos/StaggerContainer";

const PASSOS = [
  {
    num: "01",
    icone: MapPin,
    titulo: "Tell us where you are",
    descricao:
      "The app detects your location, shows real-time news, active fires, and climate risks in your region.",
    cor: "#4BF98D",
    bg: "linear-gradient(135deg, #114224 0%, #1a5c33 100%)",
    texto: "white",
  },
  {
    num: "02",
    icone: Search,
    titulo: "Tell us your problem",
    descricao:
      "Water, soil, air, fire. Describe it in your own words. The assistant searches 250M papers and 22 cases.",
    cor: "#C26BFA",
    bg: "linear-gradient(135deg, #301659 0%, #4c2088 100%)",
    texto: "white",
  },
  {
    num: "03",
    icone: FlaskConical,
    titulo: "Get your recipe",
    descricao:
      "We generate a step-by-step protocol with the exact ingredients, materials, and safety warnings.",
    cor: "#29E7F2",
    bg: "linear-gradient(135deg, #0e3a4a 0%, #1a5f75 100%)",
    texto: "white",
  },
  {
    num: "04",
    icone: ShieldCheck,
    titulo: "Take action",
    descricao:
      "Build the filter. Test the water. Report contamination. Get justice. All from your phone.",
    cor: "#CBB275",
    bg: "linear-gradient(135deg, #FDFBF7 0%, #F5EFE0 100%)",
    texto: "#1C1B1F",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-elfo-creme">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-elfo-dourado font-bold mb-4">
              How it works
            </p>
            <h2 className="font-display font-black text-5xl md:text-6xl text-elfo-verde-escuro mb-6 leading-tight">
              From problem to justice
            </h2>
            <p className="text-lg text-elfo-cinza max-w-2xl mx-auto">
              Four steps. No lab. No technician. Just your phone.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.15}>
          {PASSOS.map((p, i) => (
            <StaggerItem key={i}>
              <div
                className="relative rounded-3xl p-7 h-full min-h-[320px] flex flex-col overflow-hidden group hover:scale-[1.03] transition-all duration-500 cursor-default"
                style={{ background: p.bg, color: p.texto }}
              >
                <div
                  className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-30 blur-3xl group-hover:opacity-60 transition-opacity"
                  style={{ background: p.cor }}
                />

                <div className="relative flex items-start justify-between mb-8">
                  <p.icone size={32} style={{ color: p.cor }} />
                  <span
                    className="font-display font-black text-5xl opacity-30"
                    style={{ color: p.cor }}
                  >
                    {p.num}
                  </span>
                </div>

                <h3 className="relative font-display font-bold text-xl mb-3">
                  {p.titulo}
                </h3>
                <p className="relative text-sm leading-relaxed opacity-90">
                  {p.descricao}
                </p>

                {/* Linha conectora */}
                {i < PASSOS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-0.5 bg-elfo-dourado/30" />
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
