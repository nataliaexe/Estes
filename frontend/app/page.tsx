import Link from "next/link";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { SideRays } from "./componentes/efeitos/SideRays";
import { WhatIs } from "./componentes/home/WhatIs";
import { HowItWorks } from "./componentes/home/HowItWorks";
import { FlagshipStories } from "./componentes/home/FlagshipStories";
import { ScientificEngine } from "./componentes/home/ScientificEngine";
import { RightsShield } from "./componentes/home/RightsShield";
import { Numeros } from "./componentes/efeitos/Numeros";
import { TresPilares } from "./componentes/efeitos/TresPilares";
import { MapaInterativo } from "./componentes/efeitos/MapaInterativo";
import { ScrollReveal } from "./componentes/efeitos/ScrollReveal";

export default function Home() {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-elfo-creme via-elfo-creme to-elfo-verde-vivo/10 min-h-[85vh] flex items-center">
        <SideRays origin="top-right" cor1="#4BF98D" cor2="#A68A42" />
        <SideRays origin="bottom-left" cor1="#114224" cor2="#4BF98D" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="max-w-4xl">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elfo-verde-escuro text-elfo-off-white text-sm font-medium mb-8">
                <Sparkles size={14} className="text-elfo-verde-vivo" />
                <span>Environmental citizenship platform</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-elfo-verde-escuro leading-[0.95] mb-6">
                The right to{" "}
                <span className="text-gradient-elfo">keep existing.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-xl md:text-2xl text-elfo-cinza max-w-3xl leading-relaxed mb-10">
                We transform local waste into urgent solutions and guarantee
                human rights through open scientific evidence.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/atlas"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-elfo-verde-escuro text-elfo-off-white font-display font-bold text-lg hover:bg-elfo-verde-vivo hover:text-elfo-verde-escuro transition-all group"
                >
                  Explore the Atlas
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/explorar"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-elfo-verde-escuro text-elfo-verde-escuro font-display font-bold text-lg hover:bg-elfo-verde-escuro hover:text-elfo-off-white transition-all group"
                >
                  <Play size={18} />
                  See how it works
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* WHAT IS */}
      <WhatIs />

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* FLAGSHIP STORIES */}
      <FlagshipStories />

      {/* SCIENTIFIC ENGINE */}
      <ScientificEngine />

      {/* NUMBERS */}
      <Numeros />

      {/* MAP */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-elfo-dourado font-bold mb-4">
                Real-time map
              </p>
              <h2 className="font-display font-black text-5xl md:text-6xl text-elfo-verde-escuro mb-4 leading-tight">
                The Brazil that needs answers
              </h2>
              <p className="text-lg text-elfo-cinza max-w-2xl mx-auto">
                Cases, measurements, and active fire spots — all in one place.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <MapaInterativo />
          </ScrollReveal>
        </div>
      </section>

      {/* 3 PILLARS */}
      <TresPilares />

      {/* RIGHTS SHIELD */}
      <RightsShield />

      {/* CTA FINAL */}
      <section className="py-24 px-6 bg-elfo-verde-escuro text-elfo-off-white">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-display font-black text-5xl md:text-6xl mb-6">
              Start from your biome.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-xl text-elfo-off-white/80 mb-10 max-w-2xl mx-auto">
              Indigenous, farmer, researcher, or curious — the platform
              speaks your language.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/atlas"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-elfo-verde-vivo text-elfo-verde-escuro font-display font-bold text-lg hover:bg-elfo-off-white transition-all group"
              >
                See the Atlas
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contribuir"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-elfo-off-white text-elfo-off-white font-display font-bold text-lg hover:bg-elfo-off-white hover:text-elfo-verde-escuro transition-all"
              >
                Contribute
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
