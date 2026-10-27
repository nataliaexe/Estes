"use client";

/**
 * Raios de luz sutis (versao CSS - leve, funciona em mobile).
 * Gradientes radiais animados no canto superior direito.
 */
export function SideRays({
  origin = "top-right",
  cor1 = "#4BF98D",
  cor2 = "#A68A42",
}: {
  origin?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  cor1?: string;
  cor2?: string;
}) {
  const positions = {
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0",
  };

  return (
    <div
      className={`absolute ${positions[origin]} w-[800px] h-[800px] pointer-events-none overflow-hidden`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(circle at 100% 0%, ${cor1}40 0%, transparent 40%),
                       radial-gradient(circle at 80% 20%, ${cor2}30 0%, transparent 50%)`,
          filter: "blur(60px)",
          animation: "pulse 8s ease-in-out infinite",
        }}
      />
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
