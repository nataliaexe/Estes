"use client";

import Link from "next/link";
import { Shield, FileText, Building2, MapPin, ArrowRight } from "lucide-react";
import { ScrollReveal } from "../efeitos/ScrollReveal";
import { StaggerContainer, StaggerItem } from "../efeitos/StaggerContainer";

export function RightsShield() {
  return (
    <section className="py-24 px-6 bg-dir-marfim">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-dir-rubi font-bold mb-4">
              Rights Shield
            </p>
            <h2 className="font-display font-black text-5xl md:text-6xl text-dir-preto mb-6 leading-tight">
              When evidence is serious,
              <br />
              <span className="text-dir-rubi">we go to court.</span>
            </h2>
            <p className="text-lg text-elfo-cinza max-w-2xl mx-auto leading-relaxed">
              The platform doesn't just show the problem. It generates a
              formal legal complaint with the evidence, and routes it to
              the right authority.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icone: FileText,
              titulo: "Document",
              desc: "Automatic template with evidence, location, date, and photos.",
            },
            {
              icone: Building2,
              titulo: "Route",
              desc: "To MPF, IBAMA, FUNAI, SESAI, or Defesa Civil — whichever is right.",
            },
            {
              icone: MapPin,
              titulo: "Publish",
              desc: "Anonymous public map. Data open for journalists and researchers.",
            },
          ].map((item, i) => (
            <StaggerItem key={i}>
              <div className="bg-white rounded-3xl p-8 border-t-4 border-dir-rubi shadow-sm h-full">
                <item.icone size={32} className="text-dir-rubi mb-6" />
                <h3 className="font-display font-bold text-2xl text-dir-preto mb-3">
                  {item.titulo}
                </h3>
                <p className="text-elfo-cinza text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal delay={0.4}>
          <div className="text-center mt-12">
            <Link
              href="/contribuir"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-dir-rubi text-white font-display font-bold text-lg hover:bg-dir-preto transition-all group"
            >
              Report contamination
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
