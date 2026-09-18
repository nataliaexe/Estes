import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Cpu,
  Beaker,
  AlertTriangle,
  BookOpen,
  Clock,
  DollarSign,
  FileText,
} from "lucide-react";
import { Badge } from "../../componentes/ui/badge";

async function getCaso(numero: string) {
  try {
    const r = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/casos/${numero}`,
      { cache: "no-store" }
    );
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  const caso = await getCaso(numero);
  if (!caso) return { title: "Caso não encontrado" };
  return {
    title: `Caso #${caso.numero} — ${caso.titulo}`,
    description: caso.problema,
  };
}

const NIVEL_CORES: Record<string, string> = {
  demonstrado: "bg-green-100 text-green-800 border-green-300",
  suportado: "bg-yellow-100 text-yellow-800 border-yellow-300",
  modelado: "bg-orange-100 text-orange-800 border-orange-300",
  hipotese: "bg-blue-100 text-blue-800 border-blue-300",
};

export default async function CasoPage({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  const caso = await getCaso(numero);
  if (!caso) notFound();

  const niveis = [
    {
      num: 1,
      titulo: "Nível 1 — Pronto",
      descricao: "Compra o kit pronto e usa em 5 minutos",
      dados: caso.nivel_1_pronto,
      cor: "#4BF98D",
    },
    {
      num: 2,
      titulo: "Nível 2 — Faça você mesmo",
      descricao: "Reproduz em casa com o que tem, sem hardware",
      dados: caso.nivel_2_simples,
      cor: "#A68A42",
    },
    {
      num: 3,
      titulo: "Nível 3 — Cientista",
      descricao: "Protocolo completo, com medições e validação",
      dados: caso.nivel_3_completo,
      cor: "#114224",
    },
  ];

  return (
    <div className="min-h-screen bg-elfo-creme">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Voltar */}
        <Link
          href="/atlas"
          className="inline-flex items-center gap-2 text-sm text-elfo-verde-escuro hover:text-elfo-verde-vivo mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar ao Atlas
        </Link>

        {/* HEADER */}
        <header className="bg-white rounded-3xl p-8 md:p-12 shadow-sm mb-8 border border-elfo-dourado/10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant={caso.categoria as any}>{caso.categoria}</Badge>
            <Badge variant="default">{caso.tipo_solucao}</Badge>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                NIVEL_CORES[caso.evidencia] ||
                "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              {caso.evidencia}
            </span>
            {caso.precisa_hardware && (
              <Badge variant="verde" className="gap-1">
                <Cpu size={12} /> precisa hardware
              </Badge>
            )}
          </div>

          <h1 className="font-display font-black text-3xl md:text-5xl text-elfo-verde-escuro mb-4 leading-tight">
            #{caso.numero} — {caso.titulo}
          </h1>

          <p className="text-sm text-elfo-cinza flex items-center gap-2 mb-6">
            <MapPin size={14} />
            {caso.uf}
          </p>

          <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-elfo-dourado/20">
            <div>
              <p className="text-xs uppercase tracking-wider text-elfo-dourado font-bold mb-1">
                Problema
              </p>
              <p className="text-sm text-elfo-cinza leading-relaxed">
                {caso.problema}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-elfo-dourado font-bold mb-1">
                Recurso local
              </p>
              <p className="text-sm text-elfo-cinza leading-relaxed">
                {caso.recurso_local}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-elfo-dourado font-bold mb-1">
                Solução
              </p>
              <p className="text-sm text-elfo-cinza leading-relaxed">
                {caso.solucao}
              </p>
            </div>
          </div>
        </header>

        {/* HISTÓRIA */}
        {caso.historia && (
          <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm mb-8 border-l-4 border-elfo-verde-vivo">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="text-elfo-verde-vivo" size={24} />
              <h2 className="font-display font-bold text-2xl text-elfo-verde-escuro">
                A história
              </h2>
            </div>
            <p className="text-lg text-elfo-cinza leading-relaxed whitespace-pre-line">
              {caso.historia}
            </p>

            {caso.fontes_historicas && caso.fontes_historicas.length > 0 && (
              <div className="mt-8 pt-6 border-t border-elfo-dourado/20">
                <p className="text-xs uppercase tracking-wider text-elfo-dourado font-bold mb-3">
                  Fontes
                </p>
                <ul className="space-y-2">
                  {caso.fontes_historicas.map((f: any, i: number) => (
                    <li key={i} className="text-sm text-elfo-cinza flex items-start gap-2">
                      <FileText size={14} className="mt-1 flex-shrink-0 text-elfo-dourado" />
                      {f.url ? (
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-elfo-verde-escuro underline hover:text-elfo-verde-vivo"
                        >
                          {f.titulo || f.veiculo || f.orgao} ({f.ano || f.data})
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

        {/* 3 NÍVEIS */}
        <section className="mb-8">
          <h2 className="font-display font-bold text-2xl text-elfo-verde-escuro mb-6">
            Como fazer — 3 níveis
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {niveis.map((n) => (
              <div
                key={n.num}
                className="bg-white rounded-2xl p-6 shadow-sm border border-elfo-dourado/10 flex flex-col"
                style={{ borderTop: `4px solid ${n.cor}` }}
              >
                <h3 className="font-display font-bold text-lg text-elfo-verde-escuro mb-1">
                  {n.titulo}
                </h3>
                <p className="text-xs text-elfo-cinza mb-4">{n.descricao}</p>

                {n.dados?.tempo && (
                  <p className="text-xs text-elfo-cinza flex items-center gap-1 mb-1">
                    <Clock size={12} /> {n.dados.tempo}
                  </p>
                )}
                {n.dados?.custo && (
                  <p className="text-xs text-elfo-cinza flex items-center gap-1 mb-4">
                    <DollarSign size={12} /> {n.dados.custo}
                  </p>
                )}

                {n.dados?.passos && (
                  <ol className="text-xs text-elfo-cinza space-y-2 list-decimal list-inside flex-1">
                    {n.dados.passos.slice(0, 8).map((p: string, i: number) => (
                      <li key={i} className="leading-relaxed">
                        {p}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* EVIDÊNCIA CIENTÍFICA */}
        {caso.evidencias && caso.evidencias.length > 0 && (
          <section className="bg-white rounded-2xl p-8 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Beaker className="text-elfo-verde-escuro" size={22} />
              <h2 className="font-display font-bold text-xl text-elfo-verde-escuro">
                Evidência científica
              </h2>
            </div>
            <div className="space-y-4">
              {caso.evidencias.map((e: any, i: number) => (
                <div
                  key={i}
                  className="border-l-4 border-elfo-dourado pl-4 py-2"
                >
                  <p className="font-semibold text-sm text-elfo-verde-escuro mb-1">
                    {e.claim || e.titulo}
                  </p>
                  {e.trecho && (
                    <p className="text-xs text-elfo-cinza italic mb-2">
                      "{e.trecho}"
                    </p>
                  )}
                  {e.doi && (
                    <a
                      href={`https://doi.org/${e.doi}`}
                      target="_blank"
                      className="text-xs text-elfo-verde-escuro underline"
                    >
                      DOI: {e.doi}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LACUNAS */}
        {caso.lacunas && caso.lacunas.length > 0 && (
          <section className="bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-amber-600" size={20} />
              <h3 className="font-display font-bold text-amber-900">
                Limitações conhecidas
              </h3>
            </div>
            <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
              {caso.lacunas.map((l: string, i: number) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </section>
        )}

        {/* CTA CONTRIBUIR */}
        <div className="text-center py-8">
          <p className="text-elfo-cinza mb-4">
            Você conhece esse problema na sua região?
          </p>
          <Link
            href="/contribuir"
            className="inline-flex items-center gap-2 px-6 py-3 bg-elfo-verde-escuro text-elfo-off-white rounded-xl font-semibold hover:bg-elfo-verde-vivo hover:text-elfo-verde-escuro transition-all"
          >
            Contribuir com conhecimento
          </Link>
        </div>
      </div>
    </div>
  );
}
