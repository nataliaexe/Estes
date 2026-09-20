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
  title: "Atlas Brasileiro - Rede Social",
  description:
    "Comunidade de soluções ambientais postadas por cidadãos de todo o Brasil.",
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
            {casos.length} casos postados pela comunidade
          </h1>
          <p className="text-lg text-elfo-cinza max-w-3xl">
            Uma rede social de soluções ambientais. Cada caso transforma um 
            recurso local em uma resposta para um problema ambiental concreto. 
            Contribua, vote e corrixa soluções validadas pela comunidade.
          </p>
        </header>

        <FiltrosAtlas casos={casos} />
      </div>
    </div>
  );
}
