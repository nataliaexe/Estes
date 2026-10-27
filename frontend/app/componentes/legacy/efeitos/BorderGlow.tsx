"use client";

import { useRef, useState, ReactNode } from "react";

export function BorderGlow({
  children,
  cor = "#4BF98D",
  radius = 300,
  className = "",
}: {
  children: ReactNode;
  cor?: string;
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative rounded-2xl overflow-hidden transition-shadow duration-300 ${className}`}
      style={{
        background: "#FFFFFF",
        boxShadow: hover
          ? `0 20px 60px -15px ${cor}40, 0 0 0 1px ${cor}40`
          : "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      {hover && (
        <div
          className="absolute pointer-events-none transition-opacity duration-300"
          style={{
            left: pos.x - radius / 2,
            top: pos.y - radius / 2,
            width: radius,
            height: radius,
            background: `radial-gradient(circle, ${cor}30 0%, transparent 70%)`,
            filter: "blur(20px)",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
