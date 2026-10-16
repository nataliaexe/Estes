"use client";

import { useState } from "react";
import { cn } from "../lib/utils";
import { CardCaso } from "./CardCaso";
import { ChromaGrid } from "./efeitos/ChromaGrid";

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

const CATEGORIAS = [
  { id: "todas", label: "Todas" },
  { id: "agua", label: "Água" },
  { id: "solo", label: "Solo" },
  { id: "ar", label: "Ar" },
  { id: "queimada", label: "Queimada" },
  { id: "desmatamento", label: "Desmatamento" },
  { id: "residuos", label: "Resíduos" },
  { id: "mercurio", label: "Mercúrio" },
  { id: "agrotoxico", label: "Agrotóxico" },
  { id: "enchente", label: "Enchente" },
];

export function FiltrosAtlas({ casos }: { casos: Caso[] }) {
  const [categoriaAtiva, setCategoriaAtiva] = useState("todas");
  const [busca, setBusca] = useState("");

  const casosFiltrados = casos.filter((c) => {
    const matchCategoria =
      categoriaAtiva === "todas" || c.categoria === categoriaAtiva;
    const matchBusca =
      !busca ||
      c.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      c.problema.toLowerCase().includes(busca.toLowerCase()) ||
      c.recurso_local.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  return (
    <>
      {/* Filtros */}
      <div className="mb-8 space-y-4">
        {/* Busca */}
        <input
          type="text"
          placeholder="Search by material, problem, or title..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full max-w-xl px-4 py-3 rounded-xl border border-border bg-bg-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-sm text-text-primary placeholder:text-text-muted"
        />

        {/* Chips de categoria */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaAtiva(cat.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                categoriaAtiva === cat.id
                  ? "bg-accent-primary text-bg-primary shadow-md"
                  : "bg-bg-tertiary text-text-secondary border border-border hover:border-accent-primary/40"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contador */}
      <p className="text-sm text-text-secondary mb-6">
        {casosFiltrados.length}{" "}
        {casosFiltrados.length === 1 ? "case" : "cases"} found
      </p>

      {/* Grid com ChromaGrid */}
      <ChromaGrid cor="#4BF98D">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {casosFiltrados.map((caso, i) => (
            <CardCaso key={caso.numero} caso={caso} index={i} />
          ))}
        </div>
      </ChromaGrid>

      {/* Vazio */}
      {casosFiltrados.length === 0 && (
        <div className="text-center py-20">
          <p className="text-text-secondary">
            No cases found with these filters.
          </p>
        </div>
      )}
    </>
  );
}
