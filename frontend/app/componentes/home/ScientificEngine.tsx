"use client";

import Link from "next/link";
import { Search, BookOpen, FlaskConical, ArrowRight, ExternalLink } from "lucide-react";
import { ScrollReveal } from "../efeitos/ScrollReveal";
import { StaggerContainer, StaggerItem } from "../efeitos/StaggerContainer";

export function ScientificEngine() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-ia-roxo-escuro via-ia-roxo-escuro to-ia-roxo-neon/30 relative overflow-hidden">
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#C26BFA 1px, transparent 1px), linear-gradient(90deg, #C26BFA 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ia-roxo-neon/20 text-ia-cyan text-xs font-bold uppercase tracking-wider mb-6">
                <Search size={14} />
                <span>Scientific Engine</span>
              </div>

              <h2 className="font-display font-black text-5xl md:text-6xl text-white mb-6 leading-tight">
                Any material.
                <br />
                <span className="text-ia-cyan">Any problem.</span>
              </h2>

              <p className="text-lg text-white/75 leading-relaxed mb-8">
                The 22 cases are examples. The real product is the engine:
                it searches 250 million scientific papers, extracts
                evidence with DOI, and generates a reproducible protocol
                for <strong className="text-white">any local material</strong>.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  { icone: BookOpen, txt: "250M papers indexed" },
                  { icone: FlaskConical, txt: "Evidence with DOI + limitations" },
                  { icone: Search, txt: "Reproducible protocols in minutes" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-ia-roxo-neon/20 flex items-center justify-center">
                      <item.icone size={18} className="text-ia-cyan" />
                    </div>
                    <span className="text-white/85">{item.txt}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/explorar"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-ia-roxo-neon text-white font-display font-bold text-lg hover:bg-ia-cyan hover:text-ia-roxo-escuro transition-all group"
              >
                Try the engine
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          {/* Terminal-like demo */}
          <ScrollReveal direction="right" delay={0.2}>
            <div className="rounded-2xl bg-black/40 backdrop-blur-sm border border-ia-roxo-neon/30 p-6 shadow-2xl">
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>

              <div className="font-mono text-sm space-y-3 text-white/80">
                <div>
                  <span className="text-ia-cyan">$</span> estes explore
                </div>
                <div className="text-white/50">
                  material: <span className="text-white">"coffee husk"</span>
                </div>
                <div className="text-white/50">
                  problem: <span className="text-white">"heavy metals in water"</span>
                </div>
                <div className="pt-3 text-ia-cyan">→ searching 250M papers...</div>
                <div className="text-elfo-verde-vivo">✓ 13 papers found</div>
                <div className="text-elfo-verde-vivo">✓ 5 applicable</div>
                <div className="pt-3 text-white/50 border-t border-white/10">
                  <div className="text-white/80 mb-2">EVIDENCE #1</div>
                  <div className="text-xs leading-relaxed">
                    "Coffee husk biochar removes up to 40% of heavy metals"
                  </div>
                  <div className="text-xs text-ia-cyan mt-1 flex items-center gap-1">
                    DOI: 10.xxxx/yyyy <ExternalLink size={10} />
                  </div>
                </div>
                <div className="text-white/50 pt-3 border-t border-white/10">
                  <div className="text-elfo-verde-vivo text-xs">
                    ✓ Generated 4 reproducible paths
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    ⚠ 3 safety warnings
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
