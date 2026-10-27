'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Environment3DResponsive = dynamic(
  () => import('./Environment3DResponsive').then(mod => ({ default: mod.Environment3DResponsive })),
  { 
    loading: () => (
      <div className="absolute inset-0 z-0 bg-elfo-creme flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-elfo-verde-escuro border-t-elfo-verde-vivo rounded-full animate-spin" />
      </div>
    ),
    ssr: false
  }
);

export function LazyEnvironment3D({ quality = 'high' }: { quality?: 'high' | 'medium' | 'low' }) {
  return (
    <Suspense fallback={
      <div className="absolute inset-0 z-0 bg-elfo-creme flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-elfo-verde-escuro border-t-elfo-verde-vivo rounded-full animate-spin" />
      </div>
    }>
      <div className="three-container">
        <Environment3DResponsive quality={quality} />
      </div>
    </Suspense>
  );
}