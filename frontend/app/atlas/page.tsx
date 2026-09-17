import Link from "next/link";

async function getCasos(categoria?: string) {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/casos`);
  if (categoria) url.searchParams.set("categoria", categoria);
  const r = await fetch(url.toString(), { cache: "no-store" });
  if (!r.ok) return [];
  return r.json();
}

const CORES_CATEGORIA: Record<string, string> = {
  agua: "bg-blue-100 text-blue-800",
  solo: "bg-amber-100 text-amber-800",
  ar: "bg-sky-100 text-sky-800",
  queimada: "bg-red-100 text-red-800",
  desmatamento: "bg-lime-100 text-lime-800",
  residuos: "bg-orange-100 text-orange-800",
  mercurio: "bg-purple-100 text-purple-800",
  agrotoxico: "bg-yellow-100 text-yellow-800",
  enchente: "bg-cyan-100 text-cyan-800",
  terras_raras: "bg-fuchsia-100 text-fuchsia-800",
};

const CORES_EVIDENCIA: Record<string, string> = {
  demonstrado: "bg-green-600",
  suportado: "bg-yellow-500",
  modelado: "bg-orange-500",
  hipotese: "bg-blue-500",
  insuficiente: "bg-gray-400",
};

export default async function AtlasPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const params = await searchParams;
  const categoria = params.categoria;
  const casos = await getCasos(categoria);

  const categorias = [
    "agua", "solo", "ar", "queimada", "desmatamento",
    "residuos", "mercurio", "agrotoxico", "enchente",
  ];

  return (
    <div className="min-h-screen bg-terra-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-verde-900">
            Atlas Brasileiro
          </h1>
          <p className="text-gray-600 mt-1">
            {casos.length} soluções que transformam recursos locais em
            respostas ambientais.
          </p>
        </header>

        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href="/atlas"
            className={`px-3 py-1 rounded-full text-sm ${
              !categoria
                ? "bg-verde-900 text-white"
                : "bg-white text-gray-700 border"
            }`}
          >
            Todos
          </Link>
          {categorias.map((cat) => (
            <Link
              key={cat}
              href={`/atlas?categoria=${cat}`}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                categoria === cat
                  ? "bg-verde-900 text-white"
                  : "bg-white text-gray-700 border"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {casos.map((c: any) => (
            <Link
              key={c.id}
              href={`/caso/${c.numero}`}
              className="bg-white rounded-xl p-5 shadow hover:shadow-xl transition flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    CORES_CATEGORIA[c.categoria] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {c.categoria}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    CORES_EVIDENCIA[c.evidencia] || "bg-gray-400"
                  }`}
                  title={c.evidencia}
                ></span>
                {c.precisa_hardware && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-verde-100 text-verde-900">
                    hardware
                  </span>
                )}
              </div>
              <h3 className="font-bold text-verde-900 mb-1">
                #{c.numero} — {c.titulo}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">
                {c.problema}
              </p>
              <p className="text-xs text-gray-500">
                <strong>Recurso:</strong> {c.recurso_local}
              </p>
            </Link>
          ))}
        </div>

        {casos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhum caso nessa categoria.
          </div>
        )}
      </div>
    </div>
  );
}
