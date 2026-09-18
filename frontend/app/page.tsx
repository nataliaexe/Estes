import { HeroEstatico } from "./componentes/efeitos/HeroEstatico";
import { WhatIs } from "./componentes/home/WhatIs";
import { HowItWorks } from "./componentes/home/HowItWorks";
import { Investigacao001 } from "./componentes/home/Investigacao001";
import { ScientificEngine } from "./componentes/home/ScientificEngine";
import { RightsShield } from "./componentes/home/RightsShield";
import { Numeros } from "./componentes/efeitos/Numeros";
import { TresPilares } from "./componentes/efeitos/TresPilares";
import { MapaInterativo } from "./componentes/efeitos/MapaInterativo";
import { ScrollReveal } from "./componentes/efeitos/ScrollReveal";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative">
      {/* HERO - com input de investigacao */}
      <HeroEstatico />

      {/* WHAT IS */}
      <WhatIs />

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* INVESTIGACAO #001 */}
      <Investigacao001 />

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
                Investigations, measurements, and active fire spots.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <MapaInterativo />
          </ScrollReveal>
        </div>
      </section>

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
              Bring a local material. Bring a real problem. Get an evidence-based
              investigation.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/explorar"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-elfo-verde-vivo text-elfo-verde-escuro font-display font-bold text-lg hover:bg-elfo-off-white transition-all group"
              >
                Open an investigation
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/atlas"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-elfo-off-white text-elfo-off-white font-display font-bold text-lg hover:bg-elfo-off-white hover:text-elfo-verde-escuro transition-all"
              >
                See all investigations
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
