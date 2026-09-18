'use client';

import { useState, useEffect, useRef } from 'react';

export function PerformanceMonitor({ onQualityChange }: { onQualityChange?: (quality: 'high' | 'medium' | 'low') => void }) {
  const [fps, setFps] = useState(60);
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');
  const frameTimeRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    const measureFPS = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      frameTimeRef.current.push(delta);
      if (frameTimeRef.current.length > 60) {
        frameTimeRef.current.shift();
      }

      const avgFrameTime = frameTimeRef.current.reduce((a, b) => a + b, 0) / frameTimeRef.current.length;
      const currentFps = Math.round(1000 / avgFrameTime);
      setFps(currentFps);

      // Auto-adjust quality based on performance
      if (currentFps < 30 && quality !== 'low') {
        setQuality('low');
        onQualityChange?.('low');
      } else if (currentFps < 45 && quality === 'high') {
        setQuality('medium');
        onQualityChange?.('medium');
      } else if (currentFps > 55 && quality === 'low') {
        setQuality('medium');
        onQualityChange?.('medium');
      } else if (currentFps > 58 && quality === 'medium') {
        setQuality('high');
        onQualityChange?.('high');
      }

      requestAnimationFrame(measureFPS);
    };

    const animationId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(animationId);
  }, [quality]);

  const qualityColors = {
    high: 'bg-green-500',
    medium: 'bg-yellow-500',
    low: 'bg-red-500'
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-xs font-mono">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${qualityColors[quality]}`} />
        <span>FPS: {fps}</span>
      </div>
      <div className="text-gray-400">Quality: {quality}</div>
      <button
        onClick={() => {
          let newQuality: 'high' | 'medium' | 'low';
          if (quality === 'high') newQuality = 'medium';
          else if (quality === 'medium') newQuality = 'low';
          else newQuality = 'high';
          setQuality(newQuality);
          onQualityChange?.(newQuality);
        }}
        className="mt-2 px-2 py-1 bg-white/10 rounded hover:bg-white/20 transition-colors"
      >
        Adjust Quality
      </button>
    </div>
  );
}