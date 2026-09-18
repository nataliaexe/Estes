'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Play, ChevronDown } from 'lucide-react';
import { LazyEnvironment3D } from './Lazy3DComponent';
import { PerformanceMonitor } from './PerformanceMonitor';
import Link from 'next/link';

export function HeroInteractive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');
  
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.8]);

  const phases = [
    {
      title: "The right to",
      highlight: "keep existing",
      subtitle: "We transform local waste into urgent solutions and guarantee human rights through open scientific evidence."
    },
    {
      title: "Environmental",
      highlight: "Citizenship",
      subtitle: "22 cases across Brazil. 5 regions. 9 categories. One platform connecting science to communities."
    },
    {
      title: "From",
      highlight: "Root to Solution",
      subtitle: "From the Maxakali people to the Amazon rivers — scientific evidence for environmental justice."
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % phases.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* 3D Environment Background */}
      <LazyEnvironment3D quality={quality} />
      
      {/* Performance Monitor */}
      <PerformanceMonitor onQualityChange={setQuality} />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-elfo-creme/30 via-elfo-creme/50 to-elfo-verde-vivo/20 pointer-events-none" />
      
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-50 bg-elfo-creme flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-elfo-verde-escuro border-t-elfo-verde-vivo rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        ref={containerRef}
        style={{ y: y1, opacity, scale }}
        className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full"
      >
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elfo-verde-escuro/80 backdrop-blur-sm text-elfo-off-white text-sm font-medium mb-8 border border-elfo-verde-vivo/30"
          >
            <Sparkles size={14} className="text-elfo-verde-vivo" />
            <span>Environmental citizenship platform</span>
          </motion.div>

          {/* Dynamic Text */}
          <div className="relative h-32 md:h-40 mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhase}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-elfo-verde-escuro leading-[0.95]">
                  {phases[currentPhase].title}{' '}
                  <span className="text-gradient-elfo">{phases[currentPhase].highlight}</span>
                </h1>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xl md:text-2xl text-elfo-cinza max-w-3xl leading-relaxed mb-10"
          >
            {phases[currentPhase].subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/atlas"
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-elfo-verde-escuro text-elfo-off-white font-display font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-elfo-verde-vivo/30"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore the Atlas
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-elfo-verde-vivo to-elfo-dourado"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Link>

            <Link
              href="/explorar"
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-elfo-verde-escuro text-elfo-verde-escuro font-display font-bold text-lg overflow-hidden transition-all hover:bg-elfo-verde-escuro hover:text-elfo-off-white hover:scale-105"
            >
              <Play size={18} />
              See how it works
            </Link>
          </motion.div>

          {/* Phase Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex gap-2 mt-8"
          >
            {phases.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentPhase(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentPhase ? 'bg-elfo-verde-escuro w-8' : 'bg-elfo-cinza/30'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-elfo-verde-escuro"
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>

      {/* Interactive Hotspots */}
      <div className="absolute top-1/4 right-1/4 z-10">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-4 h-4 rounded-full bg-elfo-verde-vivo cursor-pointer"
          whileHover={{ scale: 1.5 }}
        />
      </div>

      <div className="absolute bottom-1/3 left-1/4 z-10">
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="w-3 h-3 rounded-full bg-elfo-dourado cursor-pointer"
          whileHover={{ scale: 1.5 }}
        />
      </div>
    </section>
  );
}