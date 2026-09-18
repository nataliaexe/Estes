"use client";

import { motion } from "framer-motion";
import { SUGGESTED_PROMPTS } from "../../lib/chat/mockData";

interface EmptyStateProps {
  onPick: (prompt: string) => void;
}

export function EmptyState({ onPick }: EmptyStateProps) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.15, duration: 1.1, ease: [0.65, 0, 0.35, 1] },
        opacity: { delay: i * 0.15, duration: 0.3 },
      },
    }),
  };

  const paths = [
    "M100 20 V60",
    "M100 60 C 70 75, 55 95, 40 130",
    "M100 60 C 130 75, 145 95, 160 130",
    "M100 60 V150",
    "M40 130 C 30 145, 34 160, 45 172",
    "M40 130 C 48 148, 44 165, 34 178",
    "M160 130 C 170 145, 166 160, 155 172",
    "M160 130 C 152 148, 156 165, 166 178",
    "M100 150 C 92 162, 96 175, 88 185",
    "M100 150 C 108 162, 104 175, 112 185",
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-6 text-center">
      <motion.svg
        viewBox="0 0 200 200"
        className="h-40 w-40"
        initial="hidden"
        animate="visible"
        aria-hidden="true"
      >
        {paths.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            stroke="#4BF98D"
            strokeWidth={i === 0 ? 3 : 2}
            strokeLinecap="round"
            fill="none"
            variants={draw}
            custom={i}
          />
        ))}
        <motion.circle
          cx="100"
          cy="20"
          r="5"
          fill="#4BF98D"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.05, duration: 0.4, ease: "backOut" }}
        />
      </motion.svg>

      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-elfo-verde-escuro">
          What do you have?
        </h2>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-elfo-verde-escuro/70">
          Describe the material and the environmental problem. Estes searches
          the Atlas, scientific literature, and the web — always citing sources.
        </p>
      </div>

      <div className="grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <motion.button
            key={prompt}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 6px 20px -8px rgba(17,66,36,0.35)",
            }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onPick(prompt)}
            className="rounded-xl border border-elfo-verde-escuro/12 bg-white px-4 py-3 text-left text-sm text-elfo-verde-escuro transition-colors hover:border-elfo-verde-vivo/60"
            aria-label={`Use suggestion: ${prompt}`}
          >
            {prompt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
