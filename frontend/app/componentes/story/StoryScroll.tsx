"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { STORY_STAGES } from "./stages";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from "lucide-react";

interface StoryScrollProps {
  onComplete?: () => void;
  /** Se true, permite navegação manual */
  manualMode?: boolean;
}

/**
 * StoryScroll — "Árvore dos Mundos" - Manual Mode
 *
 * Sistema de story scrolling com navegação manual e transições avançadas.
 * 
 * Características:
 *   - Navegação manual por setas keyboard e UI
 *   - Transições de frames com animações React (framer-motion)
 *   - Suporte a vídeos e imagens
 *   - Controles de play/pause
 *   - Barra de progresso interativa
 *   - Efeitos de partículas e blur
 *   - Narrativa imersiva
 */
export function StoryScroll({ onComplete, manualMode = false }: StoryScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const controls = useAnimation();
  const router = useRouter();

  const stage = STORY_STAGES[currentStage];
  const totalStages = STORY_STAGES.length;
  const progress = ((currentStage + 1) / totalStages) * 100;

  // Navegação manual
  const goToStage = useCallback((index: number) => {
    if (index < 0 || index >= totalStages) return;
    
    setHasInteracted(true);
    controls.start({
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }).then(() => {
      setCurrentStage(index);
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
      });
    });
  }, [controls, totalStages]);

  const nextStage = useCallback(() => {
    goToStage(currentStage + 1);
  }, [currentStage, goToStage]);

  const prevStage = useCallback(() => {
    goToStage(currentStage - 1);
  }, [currentStage, goToStage]);

  // Keyboard navigation
  useEffect(() => {
    if (!manualMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
          e.preventDefault();
          nextStage();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          prevStage();
          break;
        case "Escape":
          if (currentStage === totalStages - 1) {
            onComplete?.();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [manualMode, currentStage, totalStages, nextStage, prevStage, onComplete]);

  // Auto-play se usuário não interagiu
  useEffect(() => {
    if (!isPlaying || hasInteracted) return;

    const interval = setInterval(() => {
      if (currentStage < totalStages - 1) {
        nextStage();
      } else {
        setIsPlaying(false);
      }
    }, 5000); // 5 segundos por frame

    return () => clearInterval(interval);
  }, [isPlaying, hasInteracted, currentStage, totalStages, nextStage]);

  // Detectar se é vídeo
  const isVideo = (src: string) => {
    return src.match(/\.(mp4|webm|ogg|mov)$/i);
  };

  // Animações de entrada e saída
  const textVariants = {
    enter: {
      opacity: 0,
      y: 60,
      scale: 0.95,
    },
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -60,
      scale: 1.05,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const imageVariants = {
    enter: {
      opacity: 0,
      scale: 1.15,
      filter: "blur(10px)",
      rotateY: 15,
      rotateX: 5,
    },
    center: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      rotateY: 0,
      rotateX: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      filter: "blur(5px)",
      rotateY: -15,
      rotateX: -5,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      style={{ perspective: "1000px" }}
    >
      {/* BACKGROUND - Vídeo ou Imagem */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {isVideo(stage.image) ? (
              <video
                autoPlay
                muted={isMuted}
                loop
                playsInline
                className="w-full h-full object-cover"
                poster={stage.fallbackImage || stage.image}
              >
                <source src={stage.image} type="video/mp4" />
              </video>
            ) : (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${stage.image})`,
                  backgroundColor: stage.accent.replace('rgb', 'rgba').replace(')', ', 0.2)'),
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* OVERLAY - Gradientes e Vinheta */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)`
          }}
        />
      </div>

      {/* PARTÍCULAS DE FUNDO */}
      <ParticlesLayer intensity={stage.particles || 0.5} accent={stage.accent} />

      {/* CONTEÚDO PRINCIPAL */}
      <motion.div
        animate={controls}
        className="absolute inset-0 z-20 flex items-center"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage.id}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={`max-w-4xl ${
                stage.align === "right"
                  ? "ml-auto text-right"
                  : stage.align === "center"
                  ? "mx-auto text-center"
                  : ""
              }`}
            >
              {/* Portal - Cena inicial */}
              {stage.id === "portal" && (
                <div className="text-center">
                  <motion.h1
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: 0.3, 
                      duration: 1.2,
                      ease: [0.22, 1, 0.36, 1] 
                    }}
                    className="font-display font-black text-4xl md:text-6xl lg:text-7xl mb-6"
                    style={{ color: "#e8f4ec" }}
                  >
                    There is a tree
                    <br />
                    <motion.span 
                      className="text-glow-mixed"
                      animate={{
                        textShadow: [
                          "0 0 20px rgba(75, 249, 141, 0.3)",
                          "0 0 40px rgba(75, 249, 141, 0.6)",
                          "0 0 20px rgba(75, 249, 141, 0.3)",
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      older than any of us.
                    </motion.span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="text-lg md:text-xl text-white/60 mb-12"
                  >
                    Use arrow keys or click to navigate
                  </motion.p>
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-flex items-center justify-center"
                  >
                    <div className="w-8 h-12 rounded-full border-2 border-elfo-verde-vivo/50 flex items-start justify-center pt-2">
                      <motion.div 
                        className="w-1 h-2 rounded-full bg-elfo-verde-vivo"
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Cenas do meio */}
              {stage.id !== "portal" && stage.id !== "semente" && (
                <div>
                  <motion.h2
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-4"
                    style={{ color: "#e8f4ec" }}
                  >
                    <motion.span
                      style={{ color: stage.accent }}
                      animate={{
                        textShadow: [
                          "0 0 20px rgba(255,255,255,0.1)",
                          "0 0 30px rgba(255,255,255,0.2)",
                          "0 0 20px rgba(255,255,255,0.1)",
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      {stage.title}
                    </motion.span>
                  </motion.h2>
                  {stage.subtitle && (
                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="font-display font-black text-4xl md:text-6xl lg:text-7xl leading-[0.95]"
                      style={{ color: "#e8f4ec" }}
                    >
                      {stage.subtitle}
                    </motion.p>
                  )}
                  {stage.description && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="text-lg md:text-xl text-white/70 mt-6 max-w-2xl leading-relaxed"
                    >
                      {stage.description}
                    </motion.p>
                  )}
                </div>
              )}

              {/* Cena final - CTA */}
              {stage.id === "semente" && (
                <div className="text-center">
                  <motion.h2
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ 
                      duration: 1.2, 
                      ease: [0.22, 1, 0.36, 1] 
                    }}
                    className="font-display font-black text-7xl md:text-9xl lg:text-[12rem] leading-[0.9] mb-8"
                  >
                    <motion.span 
                      style={{ color: stage.accent }}
                      animate={{
                        textShadow: [
                          "0 0 30px rgba(194, 107, 250, 0.4)",
                          "0 0 60px rgba(194, 107, 250, 0.8)",
                          "0 0 30px rgba(194, 107, 250, 0.4)",
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      These
                    </motion.span>
                    <br />
                    <span style={{ color: "#e8f4ec" }}>— you.</span>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed"
                  >
                    Every tree has a thousand stories.
                    <br />
                    Every material has a thousand uses.
                    <br />
                    Yours starts now.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <motion.button
                      onClick={() => {
                        onComplete?.();
                        router.push("/explorar");
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-glow px-8 py-4 rounded-2xl bg-elfo-verde-vivo text-elfo-verde-escuro font-display font-bold text-lg hover:bg-white transition-all"
                    >
                      Start your investigation
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        onComplete?.();
                        router.push("/chat");
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 rounded-2xl border-2 border-white/20 text-white font-display font-bold text-lg hover:bg-white/10 transition-all"
                    >
                      Ask the assistant
                    </motion.button>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* CONTROLES */}
      {manualMode && (
        <>
          {/* Navegação Lateral */}
          <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3">
            {STORY_STAGES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goToStage(i)}
                className="group relative"
                aria-label={`Scene ${i + 1}`}
              >
                <motion.div
                  className="w-2 rounded-full transition-all duration-500"
                  animate={{
                    height: i === currentStage ? "32px" : "16px",
                    background: i === currentStage ? s.accent : "rgba(255,255,255,0.25)",
                  }}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs text-white/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {s.title || "Start"}
                </span>
              </button>
            ))}
          </div>

          {/* Barra de Progresso */}
          <div className="absolute bottom-0 left-0 right-0 z-30">
            <div className="h-1 bg-white/20">
              <motion.div
                className="h-full bg-gradient-to-r from-elfo-verde-vivo to-elfo-dourado"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Controles Inferiores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4"
          >
            <button
              onClick={prevStage}
              disabled={currentStage === 0}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              {isPlaying ? (
                <Pause size={20} className="text-white" />
              ) : (
                <Play size={20} className="text-white" />
              )}
            </button>

            <button
              onClick={nextStage}
              disabled={currentStage === totalStages - 1}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={20} className="text-white" />
            </button>

            {isVideo(stage.image) && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              >
                {isMuted ? (
                  <VolumeX size={20} className="text-white" />
                ) : (
                  <Volume2 size={20} className="text-white" />
                )}
              </button>
            )}
          </motion.div>

          {/* Controles Mobile */}
          <div className="absolute bottom-8 left-4 right-4 z-30 flex justify-between md:hidden">
            <button
              onClick={prevStage}
              disabled={currentStage === 0}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            <button
              onClick={nextStage}
              disabled={currentStage === totalStages - 1}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={24} className="text-white" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Partículas de fundo — Canvas 2D, leve e responsivo.
 * Intensidade vem da cena atual (0-1).
 */
function ParticlesLayer({ intensity, accent }: { intensity: number; accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(intensity);
  const accentRef = useRef(accent);

  useEffect(() => {
    intensityRef.current = intensity;
    accentRef.current = accent;
  }, [intensity, accent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
      targetAlpha: number;
    }> = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5,
        targetAlpha: Math.random() * 0.5,
      });
    }

    function resize() {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener("resize", resize);

    let animId = 0;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      const globalAlpha = intensityRef.current * 0.7;
      
      // Extrair cor RGB do accent
      const accentColor = accentRef.current;
      
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Animar alpha para efeito de cintilação
        p.alpha += (p.targetAlpha - p.alpha) * 0.02;
        if (Math.abs(p.targetAlpha - p.alpha) < 0.01) {
          p.targetAlpha = Math.random() * 0.6;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = accentColor.replace(')', `, ${p.alpha * globalAlpha})`).replace('rgb', 'rgba');
        ctx.shadowBlur = 15;
        ctx.shadowColor = accentColor;
        ctx.fill();
      }

      // Conectar partículas próximas
      ctx.strokeStyle = accentColor.replace(')', `, ${0.1 * globalAlpha})`).replace('rgb', 'rgba');
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      aria-hidden="true"
    />
  );
}