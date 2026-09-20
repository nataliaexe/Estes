"use client";

import { useState } from "react";
import { StoryScroll } from "./componentes/story/StoryScroll";
import { LoginModal } from "./componentes/ui/LoginModal";
import { ScrollReveal } from "./componentes/efeitos/ScrollReveal";
import Link from "next/link";
import { ArrowRight, MapPin, Flame, Users, BookOpen } from "lucide-react";

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  return (
    <div className="relative">
      {/* STORY SCROLL — A EXPERIÊNCIA PRINCIPAL */}
      <StoryScroll manualMode={true} />

      {/* HERO SECTION — PÓS-STORY */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-elfo-verde-escuro text-elfo-off-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
                Transform local waste
                <br />
                <span className="text-elfo-verde-vivo">into urgent solutions</span>
              </h1>
              <p className="text-xl md:text-2xl text-elfo-off-white/70 max-w-3xl mx-auto leading-relaxed">
                A plataforma de cidadania ambiental que usa evidência científica aberta 
                para resolver problemas reais com materiais locais.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-elfo-verde-vivo/20 flex items-center justify-center mb-4">
                  <BookOpen className="text-elfo-verde-vivo" size={24} />
                </div>
                <h3 className="font-display font-bold text-2xl mb-3">22 Casos Postados</h3>
                <p className="text-elfo-off-white/60">
                  Soluções validadas pela comunidade em 5 regiões do Brasil
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
                  <Flame className="text-orange-400" size={24} />
                </div>
                <h3 className="font-display font-bold text-2xl mb-3">Focos em Tempo Real</h3>
                <p className="text-elfo-off-white/60">
                  Monitoramento de queimadas e clima via NASA FIRMS
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                  <Users className="text-purple-400" size={24} />
                </div>
                <h3 className="font-display font-bold text-2xl mb-3">Rede Social</h3>
                <p className="text-elfo-off-white/60">
                  Contribua, vote e corrija soluções da comunidade
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="text-center">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-elfo-verde-vivo text-elfo-verde-escuro font-display font-bold text-xl hover:bg-white transition-all group"
              >
                Começar Agora
                <ArrowRight
                  size={24}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </button>
              <p className="text-sm text-elfo-off-white/50 mt-4">
                Gratuito e aberto para todos
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-display font-black text-4xl md:text-5xl text-elfo-verde-escuro mb-4">
                Como funciona
              </h2>
              <p className="text-lg text-elfo-cinza max-w-2xl mx-auto">
                Em 3 passos simples, transforme seu problema ambiental em solução
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-elfo-verde-vivo text-elfo-verde-escuro font-display font-black text-2xl flex items-center justify-center mx-auto mb-6">
                  1
                </div>
                <h3 className="font-display font-bold text-xl mb-3 text-elfo-verde-escuro">
                  Descreva seu problema
                </h3>
                <p className="text-elfo-cinza">
                  Conte que material você tem e qual problema ambiental enfrenta
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-elfo-verde-vivo text-elfo-verde-escuro font-display font-black text-2xl flex items-center justify-center mx-auto mb-6">
                  2
                </div>
                <h3 className="font-display font-bold text-xl mb-3 text-elfo-verde-escuro">
                  Receba evidências
                </h3>
                <p className="text-elfo-cinza">
                  Nossa IA busca em 250M papers e gera protocolos reproduzíveis
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-elfo-verde-vivo text-elfo-verde-escuro font-display font-black text-2xl flex items-center justify-center mx-auto mb-6">
                  3
                </div>
                <h3 className="font-display font-bold text-xl mb-3 text-elfo-verde-escuro">
                  Aplique e compartilhe
                </h3>
                <p className="text-elfo-cinza">
                  Siga o protocolo, documente e compartilhe com a comunidade
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* MAPA INTERATIVO */}
      <section className="py-24 px-6 bg-elfo-off-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-elfo-dourado font-bold mb-4">
                Atlas em Tempo Real
              </p>
              <h2 className="font-display font-black text-4xl md:text-5xl text-elfo-verde-escuro mb-4 leading-tight">
                O Brasil que precisa de respostas
              </h2>
              <p className="text-lg text-elfo-cinza max-w-2xl mx-auto">
                Investigações, medições e focos de queimada em tempo real
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="aspect-video bg-gradient-to-br from-elfo-verde-escuro to-elfo-verde-vivo flex items-center justify-center">
                <div className="text-center text-white">
                  <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Mapa Interativo</p>
                  <p className="text-sm opacity-70">Casos • Medições • Focos de Queimada</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="text-center mt-8">
              <Link
                href="/atlas"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-elfo-verde-escuro text-elfo-verde-escuro font-display font-bold text-lg hover:bg-elfo-verde-escuro hover:text-white transition-all"
              >
                Ver Atlas Completo
                <ArrowRight size={20} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-6 bg-elfo-verde-escuro text-elfo-off-white">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl mb-6">
              Comece do seu bioma
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-xl text-elfo-off-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Traga um material local. Traga um problema real. 
              Receba uma investigação baseada em evidências.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-elfo-verde-vivo text-elfo-verde-escuro font-display font-bold text-lg hover:bg-white transition-all group"
              >
                Abrir Investigação
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <Link
                href="/atlas"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-elfo-off-white text-elfo-off-white font-display font-bold text-lg hover:bg-elfo-off-white hover:text-elfo-verde-escuro transition-all"
              >
                Ver Casos Postados
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* LOGIN MODAL */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
}
