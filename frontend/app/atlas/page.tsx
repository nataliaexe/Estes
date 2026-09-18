import { FiltrosAtlas } from "../componentes/FiltrosAtlas";

async function getCasos() {
  try {
    const r = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/casos?limite=100`,
      { cache: "no-store" }
    );
    if (!r.ok) return [];
    return r.json();
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Atlas Brasileiro",
  description:
    "22 soluções que transformam recursos locais em respostas ambientais.",
};

export default async function AtlasPage() {
  const casos = await getCasos();

  return (
    <div className="min-h-screen bg-elfo-creme">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-widest text-elfo-dourado font-bold mb-3">
            Atlas Brasileiro
          </p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-elfo-verde-escuro mb-4">
            Soluções para {casos.length} problemas reais
          </h1>
          <p className="text-lg text-elfo-cinza max-w-3xl">
            Cada caso transforma um recurso local em uma resposta para um
            problema ambiental concreto. Todos têm nível de evidência
            explícito — do demonstrado experimentalmente à hipótese em
            estudo.
          </p>
        </header>

        <FiltrosAtlas casos={casos} />
      </div>
    </div>
  );
}
