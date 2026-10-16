"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StoryScroll } from "./componentes/story/StoryScroll";
import { MapaReal } from "./componentes/efeitos/MapaReal";
import { LoginModal } from "./componentes/ui/LoginModal";
import { RealStories } from "./componentes/home/RealStories";
import { ScrollReveal } from "./componentes/efeitos/ScrollReveal";
import { useI18n } from "./lib/i18n/useI18n";
import { useAuth } from "./contextos/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MapPin, Flame, FlaskConical } from "lucide-react";

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { t } = useI18n();
  const { usuario } = useAuth();
  const router = useRouter();

  function handleInvestigation() {
    if (usuario) {
      router.push("/explorar");
    } else {
      setIsLoginModalOpen(true);
    }
  }

  return (
    <div className="relative">
      <StoryScroll />

      <section className="py-16 px-6 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-secondary text-text-primary">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
                {t.home.postStory.title1}
                <br />
                <motion.span
                  className="text-accent-primary"
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(167, 201, 160, 0.3)",
                      "0 0 40px rgba(167, 201, 160, 0.6)",
                      "0 0 20px rgba(167, 201, 160, 0.3)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {t.home.postStory.title2}
                </motion.span>
              </h1>
              <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
                {t.home.postStory.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                { Icon: FlaskConical, color: "green", t: t.home.postStory.card1Title, d: t.home.postStory.card1Desc },
                { Icon: Flame, color: "orange", t: t.home.postStory.card2Title, d: t.home.postStory.card2Desc },
                { Icon: MapPin, color: "purple", t: t.home.postStory.card3Title, d: t.home.postStory.card3Desc },
              ].map((c, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="bg-gradient-to-br from-accent-primary/10 to-accent-primary/5 backdrop-blur-sm rounded-2xl p-8 border border-border"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-primary/20 flex items-center justify-center mb-4">
                    <c.Icon className="text-accent-primary" size={24} />
                  </div>
                  <h3 className="font-display font-bold text-2xl mb-3">{c.t}</h3>
                  <p className="text-text-secondary">{c.d}</p>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="text-center">
              <button
                onClick={handleInvestigation}
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-accent-primary text-bg-primary font-display font-bold text-xl hover:bg-accent-secondary transition-all group"
              >
                {t.home.postStory.ctaPrimary}
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <p className="text-sm text-text-muted mt-4">
                {t.home.postStory.ctaSubtitle}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <RealStories />

      <section className="py-24 px-6 bg-gradient-to-br from-bg-secondary via-bg-tertiary to-bg-primary text-text-primary">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl mb-6">
              {t.home.postStory.finalTitle}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
              {t.home.postStory.finalSubtitle}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleInvestigation}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-primary to-accent-secondary text-bg-primary font-display font-bold text-lg transition-all shadow-lg"
              >
                {t.home.postStory.finalCta1}
                <ArrowRight size={20} />
              </button>
              <Link
                href="/atlas"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-text-primary text-text-primary font-display font-bold text-lg hover:bg-text-primary hover:text-bg-primary transition-all"
              >
                {t.home.postStory.finalCta2}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
