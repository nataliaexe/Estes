"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, FileText, FlaskConical, Beaker, Microscope,
  Lightbulb, Users, TrendingUp,
} from "lucide-react";
import { ScrollReveal } from "../efeitos/ScrollReveal";

const BLOCOS = [
  {
    num: "01",
    icone: Lightbulb,
    titulo: "The question",
    cor: "#4BF98D",
    conteudo: (
      <>
        <p className="text-lg text-elfo-verde-escuro leading-relaxed mb-4">
          Can an abundant local plant — <strong>Eucalyptus</strong> — become
          part of a reliable strategy to detect or treat heavy metals in
          water?
        </p>
        <p className="text-sm text-elfo-cinza">
          Opened in September 2026 · Vale do Mucuri, Minas Gerais
        </p>
      </>
    ),
  },
  {
    num: "02",
    icone: Microscope,
    titulo: "What we know",
    cor: "#A68A42",
    conteudo: (
      <ul className="space-y-2 text-elfo-verde-escuro">
        <li>• Eucalyptus has 45% cellulose, 28% lignin, 20% hemicellulose</li>
        <li>• Rich in phenolic compounds — precursor for carbon quantum dots</li>
        <li>• Abundant across Brazil, often considered invasive</li>
      </ul>
    ),
  },
  {
    num: "03",
    icone: FileText,
    titulo: "Scientific evidence",
    cor: "#C26BFA",
    conteudo: (
      <div className="space-y-4">
        <div className="border-l-4 border-ia-roxo-neon pl-4">
          <p className="font-semibold text-sm text-elfo-verde-escuro mb-1">
            Carbon quantum dots from eucalyptus
          </p>
          <p className="text-xs text-elfo-cinza italic mb-2">
            "CQDs extracted from eucalyptus leaves show blue fluorescence at
            395 nm excitation."
          </p>
          <p className="text-xs text-ia-roxo-escuro">
            DOI: 10.1007/s10570-026-07184-z · ● Demonstrated
          </p>
        </div>
        <div className="border-l-4 border-ia-roxo-neon pl-4">
          <p className="font-semibold text-sm text-elfo-verde-escuro mb-1">
            Biochar adsorption of heavy metals
          </p>
          <p className="text-xs text-elfo-cinza italic mb-2">
            "Biochar derived from eucalyptus residues removes up to 40% of
            Cu²⁺, Fe³⁺, Hg²⁺."
          </p>
          <p className="text-xs text-ia-roxo-escuro">
            DOI: 10.1016/j.carpta.2024.100529 · ● Demonstrated
          </p>
        </div>
      </div>
    ),
  },
  {
    num: "04",
    icone: FlaskConical,
    titulo: "Hypotheses",
    cor: "#4BF98D",
    conteudo: (
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-elfo-verde-vivo font-bold">→</span>
          <p className="text-elfo-verde-escuro">
            CQD sensor strip — detects metals via fluorescence
          </p>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-elfo-verde-vivo font-bold">→</span>
          <p className="text-elfo-verde-escuro">
            CNC + biochar filter — removes metals via adsorption
          </p>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-elfo-verde-vivo font-bold">→</span>
          <p className="text-elfo-verde-escuro">
            Combined — sensor + filter = full investigation
          </p>
        </div>
      </div>
    ),
  },
  {
    num: "05",
    icone: Beaker,
    titulo: "Protocol",
    cor: "#A68A42",
    conteudo: (
      <div className="space-y-3 text-sm text-elfo-verde-escuro">
        <p className="mb-3">
          <strong>Ready</strong> (5 min) · <strong>Simple</strong> (1 day) ·{" "}
          <strong>Complete</strong> (1 week)
        </p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Collect eucalyptus leaves</li>
          <li>Boil 15 min, filter extract</li>
          <li>Mix with citric acid + urea</li>
          <li>Microwave 3 min</li>
          <li>Dip filter paper, dry in dark</li>
          <li>Cut into strips</li>
        </ol>
        <p className="text-xs text-elfo-cinza mt-3">
          Each step has an AI-generated illustration.
        </p>
      </div>
    ),
  },
  {
    num: "06",
    icone: TrendingUp,
    titulo: "Prototype",
    cor: "#4BF98D",
    conteudo: (
      <div className="space-y-3">
        <p className="text-elfo-verde-escuro">
          The physical sensor, built and tested.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-elfo-creme rounded-lg p-3 text-center">
            <p className="text-2xl font-display font-black text-elfo-verde-escuro">
              10 ppm
            </p>
            <p className="text-xs text-elfo-cinza">Cu²⁺ detected</p>
          </div>
          <div className="bg-elfo-creme rounded-lg p-3 text-center">
            <p className="text-2xl font-display font-black text-elfo-verde-escuro">
              40%
            </p>
            <p className="text-xs text-elfo-cinza">TDS removal</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    num: "07",
    icone: Users,
    titulo: "Community",
    cor: "#7F1D1D",
    conteudo: (
      <div className="space-y-3">
        <p className="text-elfo-verde-escuro">
          <strong>7 contributions</strong> · 3 votes · 2 corrections applied
        </p>
        <div className="space-y-2 text-sm">
          <div className="border-l-2 border-elfo-dourado pl-3">
            <p className="text-elfo-verde-escuro">
              "My grandfather used coffee husk in the same way."
            </p>
            <p className="text-xs text-elfo-cinza">
              — Maria (citizen, MG) · Validated by Dr. Ana
            </p>
          </div>
          <div className="border-l-2 border-elfo-dourado pl-3">
            <p className="text-elfo-verde-escuro">
              "Tested with babassu, similar results."
            </p>
            <p className="text-xs text-elfo-cinza">— João (farmer, BA)</p>
          </div>
        </div>
      </div>
    ),
  },
];

export function Investigacao001() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-elfo-dourado font-bold mb-4">
              Investigation #001
            </p>
            <h2 className="font-display font-black text-5xl md:text-6xl text-elfo-verde-escuro mb-6 leading-tight">
              Eucalyptus × Contaminated water
            </h2>
            <p className="text-lg text-elfo-cinza max-w-2xl mx-auto">
              A local material, abundant across Brazil, investigated as a
              possible solution for heavy metal contamination in water.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <span className="px-4 py-2 rounded-full bg-elfo-verde-vivo/20 text-elfo-verde-escuro text-sm font-medium">
                🧪 Prototype validated
              </span>
              <span className="px-4 py-2 rounded-full bg-elfo-dourado/20 text-elfo-dourado text-sm font-medium">
                MG · Brazil
              </span>
              <span className="px-4 py-2 rounded-full bg-ia-roxo-neon/20 text-ia-roxo-escuro text-sm font-medium">
                ● Demonstrated
              </span>
            </div>
          </div>
        </ScrollReveal>

        <div className="space-y-6">
          {BLOCOS.map((bloco, i) => (
            <ScrollReveal key={bloco.num} delay={i * 0.05}>
              <div className="flex gap-6 group">
                <div className="flex-shrink-0">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: `${bloco.cor}20` }}
                  >
                    <bloco.icone size={24} style={{ color: bloco.cor }} />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span
                      className="font-display font-black text-3xl opacity-30"
                      style={{ color: bloco.cor }}
                    >
                      {bloco.num}
                    </span>
                    <h3 className="font-display font-bold text-2xl text-elfo-verde-escuro">
                      {bloco.titulo}
                    </h3>
                  </div>
                  <div>{bloco.conteudo}</div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.5}>
          <div className="text-center mt-16 p-8 bg-elfo-creme rounded-3xl">
            <p className="text-elfo-cinza mb-4">
              Every investigation is a starting point for another.
            </p>
            <Link
              href="/explorar"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-elfo-verde-escuro text-elfo-off-white font-display font-bold hover:bg-elfo-verde-vivo hover:text-elfo-verde-escuro transition-all group"
            >
              Open a new investigation
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
