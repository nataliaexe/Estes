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
  title: "Environmental Atlas - ESTES",
  description:
    "Explore documented environmental problems, cases, regions, indicators, and available geospatial data.",
};

export default async function AtlasPage() {
  const casos = await getCasos();

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary text-text-primary">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-widest text-accent-secondary font-bold mb-3">
            Environmental Atlas
          </p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-text-primary mb-4">
            {casos.length} Investigated Cases
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl">
            Documented environmental problems with local materials, scientific
            evidence, and proposed solutions. Each case connects real problems
            to traceable sources and research lines.
          </p>
        </header>

        <FiltrosAtlas casos={casos} />
      </div>
    </div>
  );
}
