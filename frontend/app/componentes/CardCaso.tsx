"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Cpu } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";

type Caso = {
  numero: number;
  titulo: string;
  uf: string;
  categoria: string;
  tipo_solucao: string;
  precisa_hardware: boolean;
  problema: string;
  recurso_local: string;
  solucao: string;
  evidencia: string;
};

const CORES_CATEGORIA: Record<string, string> = {
  agua: "agua",
  solo: "solo",
  ar: "ar",
  queimada: "queimada",
  desmatamento: "desmatamento",
  residuos: "residuos",
  mercurio: "mercurio",
  agrotoxico: "agrotoxico",
  enchente: "enchente",
};

const CORES_GLOW: Record<string, string> = {
  agua: "#3b82f6",
  solo: "#f59e0b",
  ar: "#0ea5e9",
  queimada: "#dc2626",
  desmatamento: "#84cc16",
  residuos: "#f97316",
  mercurio: "#a855f7",
  agrotoxico: "#eab308",
  enchente: "#06b6d4",
};

export function CardCaso({ caso, index = 0 }: { caso: Caso; index?: number }) {
  const cor = CORES_GLOW[caso.categoria] || "#4BF98D";
  const badgeVariant = (CORES_CATEGORIA[caso.categoria] || "default") as any;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/caso/${caso.numero}`}>
        <motion.article
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 border border-elfo-dourado/10 overflow-hidden h-full flex flex-col"
          style={{
            boxShadow: `0 4px 20px rgba(0,0,0,0.04)`,
          }}
        >
          {/* Glow on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${cor}15 0%, transparent 60%)`,
            }}
          />

          {/* Badges topo */}
          <div className="relative flex items-center gap-2 mb-4 flex-wrap">
            <Badge variant={badgeVariant}>{caso.categoria}</Badge>
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background:
                  caso.evidencia === "demonstrado"
                    ? "#16a34a"
                    : caso.evidencia === "suportado"
                    ? "#eab308"
                    : caso.evidencia === "modelado"
                    ? "#f97316"
                    : "#3b82f6",
              }}
              title={caso.evidencia}
            />
            {caso.precisa_hardware && (
              <Badge variant="verde" className="gap-1">
                <Cpu size={10} /> hardware
              </Badge>
            )}
          </div>

          {/* Título */}
          <h3 className="relative font-display font-bold text-lg text-elfo-verde-escuro mb-3 leading-snug group-hover:text-elfo-verde-vivo transition-colors">
            #{caso.numero} — {caso.titulo}
          </h3>

          {/* Problema */}
          <p className="relative text-sm text-elfo-cinza line-clamp-3 mb-4 flex-1">
            {caso.problema}
          </p>

          {/* Recurso */}
          <div className="relative border-t border-elfo-dourado/20 pt-4 mt-auto">
            <p className="text-xs text-elfo-cinza">
              <span className="font-semibold text-elfo-verde-escuro">
                Recurso:{" "}
              </span>
              {caso.recurso_local}
            </p>
            <p className="text-xs text-elfo-cinza mt-1 flex items-center gap-1">
              <MapPin size={12} />
              {caso.uf}
            </p>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
