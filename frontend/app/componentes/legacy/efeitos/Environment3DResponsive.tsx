'use client';

import { useState, useEffect } from 'react';
import { Environment3D } from './Environment3D';
import { Environment3DMobile } from './Environment3DMobile';

export function Environment3DResponsive({ quality = 'high' }: { quality?: 'high' | 'medium' | 'low' }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.innerWidth < 1024 && window.innerHeight < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="absolute inset-0 z-0 bg-elfo-creme flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-elfo-verde-escuro border-t-elfo-verde-vivo rounded-full animate-spin" />
      </div>
    );
  }

  return isMobile ? <Environment3DMobile /> : <Environment3D quality={quality} />;
}