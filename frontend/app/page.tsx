"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StoryScroll } from "./componentes/story/StoryScroll";
import { LoginModal } from "./componentes/ui/LoginModal";
import { RealStories } from "./componentes/home/RealStories";
import { ScrollReveal } from "./componentes/efeitos/ScrollReveal";
import Link from "next/link";
import { ArrowRight, MapPin, Flame, Users, BookOpen } from "lucide-react";

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  return (
    <div className="relative">
      {/* STORY SCROLL — A EXPERIÊNCIA PRINCIPAL */}
      <StoryScroll manualMode={false} />

      {/* HERO SECTION — PÓS-STORY */}
      <section className="py-16 px-6 bg-gradient-to-b from-black via-elfo-verde-escuro to-elfo-verde-escuro text-elfo-off-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
                Transform local waste
                <br />
                <motion.span 
                  className="text-elfo-verde-vivo"
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(75, 249, 141, 0.3)",
                      "0 0 40px rgba(75, 249, 141, 0.6)",
                      "0 0 20px rgba(75, 249, 141, 0.3)",
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  into urgent solutions
                </motion.span>
              </h1>
              <p className="text-xl md:text-2xl text-elfo-off-white/70 max-w-3xl mx-auto leading-relaxed">
                A plataforma de cidadania ambiental que usa evidência científica aberta 
                para resolver problemas reais com materiais locais.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <motion.div
                whileHover={{ scale: 1.05, y: -8 }}
                className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20"
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 rounded-xl bg-elfo-verde-vivo/20 flex items-center justify-center mb-4"
                >
                  <BookOpen className="text-elfo-verde-vivo" size={24} />
                </motion.div>
                <h3 className="font-display font-bold text-2xl mb-3">22 Casos Postados</h3>
                <p className="text-elfo-off-white/60">
                  Soluções validadas pela comunidade em 5 regiões do Brasil
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -8 }}
                className="bg-gradient-to-br from-orange-500/10 to-red-500/5 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20"
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4"
                >
                  <Flame className="text-orange-400" size={24} />
                </motion.div>
                <h3 className="font-display font-bold text-2xl mb-3">Focos em Tempo Real</h3>
                <p className="text-elfo-off-white/60">
                  Monitoramento de queimadas e clima via NASA FIRMS
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -8 }}
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20"
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4"
                >
                  <Users className="text-purple-400" size={24} />
                </motion.div>
                <h3 className="font-display font-bold text-2xl mb-3">Rede Social</h3>
                <p className="text-elfo-off-white/60">
                  Contribua, vote e corrija soluções da comunidade
                </p>
              </motion.div>
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

      {/* HISTÓRIAS REAIS */}
      <RealStories />

      {/* COMO FUNCIONA */}
      <section className="py-24 px-6 bg-gradient-to-br from-white via-green-50 to-emerald-50">
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-elfo-verde-vivo to-emerald-500 text-white font-display font-black text-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  1
                </motion.div>
                <h3 className="font-display font-bold text-xl mb-3 text-elfo-verde-escuro group-hover:text-elfo-verde-vivo transition-colors">
                  Descreva seu problema
                </h3>
                <p className="text-elfo-cinza">
                  Conte que material você tem e qual problema ambiental enfrenta
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-elfo-verde-vivo to-emerald-500 text-white font-display font-black text-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  2
                </motion.div>
                <h3 className="font-display font-bold text-xl mb-3 text-elfo-verde-escuro group-hover:text-elfo-verde-vivo transition-colors">
                  Receba evidências
                </h3>
                <p className="text-elfo-cinza">
                  Nossa IA busca em 250M papers e gera protocolos reproduzíveis
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-elfo-verde-vivo to-emerald-500 text-white font-display font-black text-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  3
                </motion.div>
                <h3 className="font-display font-bold text-xl mb-3 text-elfo-verde-escuro group-hover:text-elfo-verde-vivo transition-colors">
                  Aplique e compartilhe
                </h3>
                <p className="text-elfo-cinza">
                  Siga o protocolo, documente e compartilhe com a comunidade
                </p>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* MAPA INTERATIVO */}
      <section className="py-24 px-6 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
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
            <motion.div
              whileHover={{ scale: 1.02, y: -8 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-green-200"
            >
              <div className="aspect-video bg-gradient-to-br from-elfo-verde-escuro via-emerald-600 to-elfo-verde-vivo flex items-center justify-center relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                  }} />
                </div>
                
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="text-center text-white relative z-10"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <MapPin size={64} className="mx-auto mb-4 opacity-80" />
                  </motion.div>
                  <p className="text-xl font-bold">Mapa Interativo</p>
                  <p className="text-sm opacity-80 mt-2">Casos • Medições • Focos de Queimada</p>
                </motion.div>
              </div>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="text-center mt-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/atlas"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-elfo-verde-vivo to-emerald-500 text-white font-display font-bold text-lg hover:from-emerald-500 hover:to-elfo-verde-vivo transition-all shadow-lg"
                >
                  Ver Atlas Completo
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-6 bg-gradient-to-br from-elfo-verde-escuro via-emerald-900 to-black text-elfo-off-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(75, 249, 141, 0.3) 0%, transparent 50%)`,
            animation: 'pulse 4s ease-in-out infinite'
          }} />
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 80% 50%, rgba(75, 249, 141, 0.3) 0%, transparent 50%)`,
            animation: 'pulse 4s ease-in-out infinite 2s'
          }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display font-black text-4xl md:text-5xl lg:text-6xl mb-6"
            >
              Comece do seu bioma
            </motion.h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-elfo-off-white/80 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Traga um material local. Traga um problema real. 
              Receba uma investigação baseada em evidências.
            </motion.p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-elfo-verde-vivo to-emerald-400 text-elfo-verde-escuro font-display font-bold text-lg hover:from-emerald-400 hover:to-elfo-verde-vivo transition-all shadow-lg group"
              >
                Abrir Investigação
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={20} />
                </motion.div>
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/atlas"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-elfo-off-white text-elfo-off-white font-display font-bold text-lg hover:bg-elfo-off-white hover:text-elfo-verde-escuro transition-all"
                >
                  Ver Casos Postados
                </Link>
              </motion.div>
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
