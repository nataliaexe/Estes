"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "../efeitos/ScrollReveal";
import { Heart, Droplet, Flame as FlameIcon, AlertTriangle } from "lucide-react";

const realStories = [
  {
    id: "maxakali",
    title: "Povo Maxakali (Tikmũ'ũn)",
    location: "Vale do Mucuri, MG",
    problem: "Confinamento territorial, seca de rios, mortalidade infantil 4x maior",
    solution: "Caso #15 (biochar para solo) + Caso #1 (sensor de eucalipto)",
    icon: "heart",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
  },
  {
    id: "waimiri",
    title: "Waimiri Atroari",
    location: "Rio Alalaú, AM/RR",
    problem: "Rio contaminado por rejeito de mineração, animais mortos",
    solution: "Caso #3 (filtro de banana + babaçu) + Caso #21 (monitoramento com drones)",
    icon: "droplet",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    id: "defensores",
    title: "Defensores Ambientais",
    location: "PA e RO",
    problem: "26 assassinatos em um ano - Brasil é 2º país mais perigoso para ativistas",
    solution: "Caso #20 (reflorestamento com drones) + Caso #22 (eDNA)",
    icon: "alert",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
  },
  {
    id: "queimadas",
    title: "Focos de Queimada",
    location: "Amazônia e Cerrado",
    problem: "Monitoramento em tempo real via NASA FIRMS",
    solution: "Caso #7 (rede de sensores) + Caso #14 (drones com nariz eletrônico)",
    icon: "flame",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
  },
];

const iconMap = {
  heart: Heart,
  droplet: Droplet,
  alert: AlertTriangle,
  flame: FlameIcon,
};

export function RealStories() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-elfo-verde-escuro to-black text-elfo-off-white">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-elfo-dourado font-bold mb-4">
              Histórias Reais
            </p>
            <h2 className="font-display font-black text-4xl md:text-5xl mb-4">
              O Brasil que precisa de respostas
            </h2>
            <p className="text-lg text-elfo-off-white/70 max-w-3xl mx-auto">
              Casos documentados em 2026 que inspiram nossa missão. Cada história 
              representa comunidades reais enfrentando crises ambientais urgentes.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {realStories.map((story, index) => {
            const Icon = iconMap[story.icon as keyof typeof iconMap];
            return (
              <ScrollReveal key={story.id} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className={`relative p-8 rounded-2xl border ${story.borderColor} ${story.bgColor} backdrop-blur-sm overflow-hidden group`}
                >
                  {/* Glow effect on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${story.bgColor.replace('/10', '/20')} 0%, transparent 60%)`,
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-xl ${story.bgColor} ${story.color}`}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-2xl mb-1">
                          {story.title}
                        </h3>
                        <p className={`text-sm ${story.color} font-medium`}>
                          {story.location}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-elfo-off-white/50 mb-2">
                          Problema
                        </p>
                        <p className="text-elfo-off-white/80 leading-relaxed">
                          {story.problem}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/10">
                        <p className="text-xs uppercase tracking-wider text-elfo-dourado mb-2">
                          Solução Estes
                        </p>
                        <p className="text-elfo-verde-vivo text-sm">
                          {story.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="mt-12 text-center">
            <p className="text-sm text-elfo-off-white/50 mb-4">
              Fontes: G1, Fiocruz, Artigo19, Repórter Brasil, Global Witness, NASA FIRMS
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-elfo-off-white/20 text-elfo-off-white font-medium hover:bg-white/10 transition-all">
              Ver todas as histórias
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}