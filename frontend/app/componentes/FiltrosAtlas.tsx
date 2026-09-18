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
          placeholder="Buscar por material, problema ou título..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full max-w-xl px-4 py-3 rounded-xl border border-elfo-dourado/30 bg-white focus:outline-none focus:ring-2 focus:ring-elfo-verde-vivo/50 text-sm"
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
                  ? "bg-elfo-verde-escuro text-elfo-off-white shadow-md"
                  : "bg-white text-elfo-cinza border border-elfo-dourado/20 hover:border-elfo-verde-escuro/40"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contador */}
      <p className="text-sm text-elfo-cinza mb-6">
        {casosFiltrados.length}{" "}
        {casosFiltrados.length === 1 ? "caso" : "casos"} encontrado
        {casosFiltrados.length === 1 ? "" : "s"}
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
          <p className="text-elfo-cinza">
            Nenhum caso encontrado com esses filtros.
          </p>
        </div>
      )}
    </>
  );
}
