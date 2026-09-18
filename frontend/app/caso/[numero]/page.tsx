import Link from "next/link";
import { notFound } from "next/navigation";

async function getCaso(numero: number) {
  const r = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/casos/${numero}`,
    { cache: "no-store" }
  );
  if (!r.ok) return null;
  return r.json();
}

const CORES_EVIDENCIA: Record<string, string> = {
  demonstrado: "bg-green-600 text-white",
  suportado: "bg-yellow-500 text-white",
  modelado: "bg-orange-500 text-white",
  hipotese: "bg-blue-500 text-white",
  insuficiente: "bg-gray-400 text-white",
};

export default async function CasoPage({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  const caso = await getCaso(parseInt(numero));
  if (!caso) return notFound();

  const niveis = [
    { numero: 1, dados: caso.nivel_1_pronto, titulo: "Nível 1 — Pronto" },
    { numero: 2, dados: caso.nivel_2_simples, titulo: "Nível 2 — Faça você mesmo" },
    { numero: 3, dados: caso.nivel_3_completo, titulo: "Nível 3 — Cientista" },
  ];

  return (
    <div className="min-h-screen bg-terra-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/atlas" className="text-sm text-verde-700 mb-4 inline-block">
          ← Voltar ao Atlas
        </Link>

        <header className="bg-white rounded-xl p-6 shadow mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full bg-verde-100 text-verde-900">
              {caso.categoria}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              {caso.tipo_solucao}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                CORES_EVIDENCIA[caso.evidencia] || "bg-gray-400"
              }`}
            >
              {caso.evidencia}
            </span>
            {caso.precisa_hardware && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-verde-900 text-white">
                precisa hardware
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-verde-900 mb-2">
            #{caso.numero} — {caso.titulo}
          </h1>
          <p className="text-gray-600">
            <strong>UF:</strong> {caso.uf}
          </p>
        </header>

        {caso.historia && (
          <section className="bg-white rounded-xl p-6 shadow mb-6">
            <h2 className="text-xl font-bold text-verde-900 mb-3">
              A história
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {caso.historia}
            </p>

            {caso.fontes_historicas?.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Fontes:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {caso.fontes_historicas.map((f: any, i: number) => (
                    <li key={i}>
                      {f.url ? (
                        <a
                          href={f.url}
                          target="_blank"
                          className="text-verde-700 underline"
                        >
                          {f.titulo || f.veiculo || f.orgao}
                        </a>
                      ) : (
                        <span>
                          {f.titulo || f.veiculo || f.orgao} ({f.ano || f.data})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        <section className="bg-white rounded-xl p-6 shadow mb-6">
          <h2 className="text-xl font-bold text-verde-900 mb-4">
            Sobre a solução
          </h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-gray-700">Problema</dt>
              <dd className="text-gray-600">{caso.problema}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-700">Recurso local</dt>
              <dd className="text-gray-600">{caso.recurso_local}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-700">Solução</dt>
              <dd className="text-gray-600">{caso.solucao}</dd>
            </div>
          </dl>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-verde-900 mb-4">
            Como fazer — 3 níveis
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {niveis.map((n) => (
              <div key={n.numero} className="bg-white rounded-xl p-5 shadow">
                <h3 className="font-bold text-verde-900 mb-2 text-sm">
                  {n.titulo}
                </h3>
                {n.dados?.tempo && (
                  <p className="text-xs text-gray-500 mb-1">
                    Tempo: {n.dados.tempo}
                  </p>
                )}
                {n.dados?.custo && (
                  <p className="text-xs text-gray-500 mb-3">
                    Custo: {n.dados.custo}
                  </p>
                )}
                {n.dados?.passos && (
                  <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
                    {n.dados.passos.slice(0, 6).map((p: string, i: number) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
        </section>


        {caso.passos_visuais && caso.passos_visuais.length > 0 && (
          <section className="bg-white rounded-xl p-6 shadow mb-6">
            <h2 className="text-xl font-bold text-verde-900 mb-4">
              Passo a passo visual
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {caso.passos_visuais.slice(0, 12).map((p: any, i: number) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  {p.foto_url && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}${p.foto_url}`}
                      alt={p.descricao}
                      className="w-full h-32 object-cover bg-gray-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                  <div className="p-2">
                    <p className="text-xs font-bold text-verde-900">
                      Passo {p.passo}
                    </p>
                    <p className="text-xs text-gray-700">{p.descricao}</p>
                    {p.duracao && (
                      <p className="text-xs text-gray-400 mt-1">{p.duracao}</p>
                    )}
                    {p.alerta && (
                      <p className="text-xs text-red-600 mt-1">⚠ {p.alerta}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {caso.lacunas?.length > 0 && (
          <section className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4 mb-6">
            <p className="text-sm font-semibold text-amber-900 mb-1">
              Limitações conhecidas
            </p>
            <ul className="text-xs text-amber-800 list-disc list-inside">
              {caso.lacunas.map((l: string, i: number) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
