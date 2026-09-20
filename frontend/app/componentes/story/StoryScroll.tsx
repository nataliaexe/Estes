"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { STORY_STAGES } from "./stages";

interface StoryScrollProps {
  onComplete?: () => void;
}

export function StoryScroll({ onComplete }: StoryScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [currentStage, setCurrentStage] = useState(0);
  const router = useRouter();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(
      Math.floor(latest * STORY_STAGES.length),
      STORY_STAGES.length - 1
    );
    setCurrentStage(idx);
  });

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === currentStage) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [currentStage]);

  const stage = STORY_STAGES[currentStage];
  const isVideo = (src: string) => /\.(mp4|webm|ogg|mov)$/i.test(src);

  function goToStage(i: number) {
    if (!containerRef.current) return;
    const top = containerRef.current.offsetTop;
    const total = STORY_STAGES.length * window.innerHeight;
    window.scrollTo({
      top: top + (total * (i + 0.1)) / STORY_STAGES.length,
      behavior: "smooth",
    });
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-black"
      style={{ height: `${STORY_STAGES.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Video/image layers */}
        {STORY_STAGES.map((s, i) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: i === currentStage ? 1 : 0,
              zIndex: i === currentStage ? 2 : 1,
            }}
          >
            {isVideo(s.image) ? (
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={s.image}
                muted
                loop
                playsInline
                preload={i < 2 ? "auto" : "metadata"}
                poster={s.fallbackImage}
                className="w-full h-full object-cover"
                onTimeUpdate={(e) => {
                  if (s.id === "semente" && e.currentTarget.currentTime >= 4) {
                    e.currentTarget.currentTime = 0;
                  }
                }}
              />
            ) : (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${s.image})`,
                  backgroundColor: s.accent,
                }}
              />
            )}
          </div>
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.8) 100%)",
            }}
          />
        </div>

        {/* Text overlay */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`max-w-4xl ${
                  stage.align === "right"
                    ? "ml-auto text-right"
                    : stage.align === "center"
                    ? "mx-auto text-center"
                    : ""
                }`}
              >
                {stage.id === "portal" && (
                  <div className="text-center">
                    <h1
                      className="font-display font-black text-4xl md:text-6xl lg:text-7xl mb-6 text-white"
                    >
                      There is a tree
                      <br />
                      <span className="text-glow-mixed">
                        older than any of us.
                      </span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/60 mb-12">
                      Scroll to enter
                    </p>
                    <div className="inline-flex items-center justify-center">
                      <div className="w-8 h-12 rounded-full border-2 border-elfo-verde-vivo/50 flex items-start justify-center pt-2">
                        <motion.div
                          className="w-1 h-2 rounded-full bg-elfo-verde-vivo"
                          animate={{ y: [0, 12, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {stage.id !== "portal" && stage.id !== "semente" && (
                  <div>
                    <h2
                      className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-4"
                      style={{ color: stage.accent }}
                    >
                      {stage.title}
                    </h2>
                    {stage.subtitle && (
                      <p className="font-display font-black text-4xl md:text-6xl lg:text-7xl leading-[0.95] text-white">
                        {stage.subtitle}
                      </p>
                    )}
                    {stage.description && (
                      <p className="text-lg md:text-xl text-white/70 mt-6 max-w-2xl leading-relaxed">
                        {stage.description}
                      </p>
                    )}

                    {stage.id === "territorios" && (
                      <div className="mt-8 flex flex-wrap gap-3">
                        {["Maxakali", "Waimiri Atroari", "Yanomami"].map(
                          (povo) => (
                            <span
                              key={povo}
                              className="px-4 py-1.5 rounded-full border border-elfo-dourado/40 bg-black/30 backdrop-blur-sm text-elfo-dourado text-sm font-medium"
                            >
                              {povo}
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}

                {stage.id === "semente" && (
                  <div className="text-center">
                    <h2 className="font-display font-black text-7xl md:text-9xl lg:text-[12rem] leading-[0.9] mb-8">
                      <span style={{ color: stage.accent }}>These</span>
                      <br />
                      <span className="text-white">— you.</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
                      Every tree has a thousand stories.
                      <br />
                      Every material has a thousand uses.
                      <br />
                      Yours starts now.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => {
                          onComplete?.();
                          router.push("/explorar");
                        }}
                        className="btn-glow px-8 py-4 rounded-2xl bg-elfo-verde-vivo text-elfo-verde-escuro font-display font-bold text-lg hover:bg-white transition-all"
                      >
                        Start your investigation
                      </button>
                      <button
                        onClick={() => {
                          onComplete?.();
                          router.push("/chat");
                        }}
                        className="px-8 py-4 rounded-2xl border-2 border-white/20 text-white font-display font-bold text-lg hover:bg-white/10 transition-all"
                      >
                        Ask the assistant
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress bar (top) */}
        <div className="absolute top-0 left-0 right-0 z-30">
          <div className="h-[3px] bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-elfo-verde-vivo to-elfo-dourado"
              style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
            />
          </div>
        </div>

        {/* Vertical nav (right) */}
        <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3">
          {STORY_STAGES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goToStage(i)}
              className="group relative"
              aria-label={`Scene ${i + 1}`}
            >
              <div
                className="w-2 rounded-full transition-all duration-500"
                style={{
                  height: i === currentStage ? "32px" : "16px",
                  background:
                    i === currentStage ? s.accent : "rgba(255,255,255,0.25)",
                }}
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs text-white/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {s.title || "Start"}
              </span>
            </button>
          ))}
        </div>

        {/* Credit */}
        {stage.credit && (
          <div className="absolute bottom-4 right-4 z-30 text-white/40 text-[10px]">
            {stage.credit}
          </div>
        )}

        {/* Scroll hint */}
        {currentStage === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
          >
            <div className="flex flex-col items-center gap-2 text-white/50">
              <ArrowDown size={16} className="animate-bounce" />
              <span className="text-xs uppercase tracking-widest">Scroll</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
