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
import { Badge, type BadgeProps } from "../../componentes/ui/badge";

type CasoPageData = {
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
  historia: string;
  fontes_historicas: { tipo?: string; titulo?: string; veiculo?: string; orgao?: string; url?: string; ano?: string | number; data?: string }[];
  impacto_estimado: Record<string, unknown>;
  composicao: Record<string, unknown>;
  propriedades: Record<string, unknown>;
  aplicacoes: Record<string, unknown>;
  lacunas: string[];
  referencias: string[];
  nivel_1_pronto: NivelData;
  nivel_2_simples: NivelData;
  nivel_3_completo: NivelData;
  evidencias: { claim?: string; titulo?: string; trecho?: string; doi?: string; source?: string; nivel?: string; limitacoes?: string }[];
};

type NivelData = { tempo?: string; custo?: string; passos?: string[] };

const CATEGORIA_VARIANTS: Record<string, NonNullable<BadgeProps["variant"]>> = {
  agua: "agua", solo: "solo", ar: "ar", queimada: "queimada",
  desmatamento: "desmatamento", residuos: "residuos", mercurio: "mercurio",
  agrotoxico: "agrotoxico", enchente: "enchente",
};

async function getCaso(numero: string): Promise<CasoPageData | null> {
  try {
    const r = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/casos/${numero}`,
      { cache: "no-store" }
    );
    if (!r.ok) return null;
    return (await r.json()) as CasoPageData;
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
  hypothesis: "bg-gray-100 text-gray-800 border-gray-300",
  supported: "bg-yellow-100 text-yellow-800 border-yellow-300",
  simulated: "bg-orange-100 text-orange-800 border-orange-300",
  prototype: "bg-blue-100 text-blue-800 border-blue-300",
  "experimentally-evaluated": "bg-green-100 text-green-800 border-green-300",
  "independently-validated": "bg-emerald-100 text-emerald-800 border-emerald-300",
};

// Map Portuguese evidence levels to English
const EVIDENCE_MAP: Record<string, string> = {
  hipotese: "hypothesis",
  suportado: "supported",
  modelado: "simulated",
  demonstrado: "experimentally-evaluated",
};

function normalizeEvidence(evidencia: string): string {
  return EVIDENCE_MAP[evidencia] || evidencia;
}

export default async function CasoPage({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  const caso = await getCaso(numero);
  if (!caso) notFound();

  const normalizedEvidence = normalizeEvidence(caso.evidencia);

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
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Voltar */}
        <Link
          href="/atlas"
          className="inline-flex items-center gap-2 text-sm text-text-primary hover:text-accent-primary mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Atlas
        </Link>

        {/* HEADER */}
        <header className="bg-bg-tertiary rounded-3xl p-8 md:p-12 shadow-sm mb-8 border border-border">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant={CATEGORIA_VARIANTS[caso.categoria] || "default"}>{caso.categoria}</Badge>
            <Badge variant="default">{caso.tipo_solucao}</Badge>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                NIVEL_CORES[normalizedEvidence] ||
                "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              {normalizedEvidence}
            </span>
            {caso.precisa_hardware && (
              <Badge variant="verde" className="gap-1">
                <Cpu size={12} /> hardware required
              </Badge>
            )}
          </div>

          <h1 className="font-display font-black text-3xl md:text-5xl text-text-primary mb-4 leading-tight">
            #{caso.numero} — {caso.titulo}
          </h1>

          <p className="text-sm text-text-secondary flex items-center gap-2 mb-6">
            <MapPin size={14} />
            {caso.uf}
          </p>

          <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-border">
            <div>
              <p className="text-xs uppercase tracking-wider text-accent-secondary font-bold mb-1">
                Problem
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                {caso.problema}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-accent-secondary font-bold mb-1">
                Local Resource
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                {caso.recurso_local}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-accent-secondary font-bold mb-1">
                Solution
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                {caso.solucao}
              </p>
            </div>
          </div>
        </header>

        {/* HISTÓRIA */}
        {caso.historia && (
          <section className="bg-bg-tertiary rounded-3xl p-8 md:p-12 shadow-sm mb-8 border-l-4 border-accent-primary">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="text-accent-primary" size={24} />
              <h2 className="font-display font-bold text-2xl text-text-primary">
                The Story
              </h2>
            </div>
            <p className="text-lg text-text-secondary leading-relaxed whitespace-pre-line">
              {caso.historia}
            </p>

            {caso.fontes_historicas && caso.fontes_historicas.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs uppercase tracking-wider text-accent-secondary font-bold mb-3">
                  Sources
                </p>
                <ul className="space-y-2">
                  {caso.fontes_historicas.map((f, i) => (
                    <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                      <FileText size={14} className="mt-1 flex-shrink-0 text-accent-secondary" />
                      {f.url ? (
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-primary underline hover:text-accent-primary"
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
          <h2 className="font-display font-bold text-2xl text-text-primary mb-6">
            Implementation — 3 Levels
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {niveis.map((n) => (
              <div
                key={n.num}
                className="bg-bg-tertiary rounded-2xl p-6 shadow-sm border border-border flex flex-col"
                style={{ borderTop: `4px solid ${n.cor}` }}
              >
                <h3 className="font-display font-bold text-lg text-text-primary mb-1">
                  {n.titulo}
                </h3>
                <p className="text-xs text-text-secondary mb-4">{n.descricao}</p>

                {n.dados?.tempo && (
                  <p className="text-xs text-text-secondary flex items-center gap-1 mb-1">
                    <Clock size={12} /> {n.dados.tempo}
                  </p>
                )}
                {n.dados?.custo && (
                  <p className="text-xs text-text-secondary flex items-center gap-1 mb-4">
                    <DollarSign size={12} /> {n.dados.custo}
                  </p>
                )}

                {n.dados?.passos && (
                  <ol className="text-xs text-text-secondary space-y-2 list-decimal list-inside flex-1">
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
          <section className="bg-bg-tertiary rounded-2xl p-8 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Beaker className="text-text-primary" size={22} />
              <h2 className="font-display font-bold text-xl text-text-primary">
                Scientific Evidence
              </h2>
            </div>
            <div className="space-y-4">
              {caso.evidencias.map((e, i) => (
                <div
                  key={i}
                  className="border-l-4 border-accent-secondary pl-4 py-2"
                >
                  <p className="font-semibold text-sm text-text-primary mb-1">
                    {e.claim || e.titulo}
                  </p>
                  {e.trecho && (
                    <p className="text-xs text-text-secondary italic mb-2">
                      “{e.trecho}”
                    </p>
                  )}
                  {e.doi && (
                    <a
                      href={`https://doi.org/${e.doi}`}
                      target="_blank"
                      className="text-xs text-text-primary underline"
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
                Known Limitations
              </h3>
            </div>
            <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
              {caso.lacunas.map((l: string, i: number) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </section>
        )}

        {/* INVESTIGATION WORKFLOW */}
        <section className="bg-bg-tertiary rounded-2xl p-8 shadow-sm mb-8 border border-border">
          <h2 className="font-display font-bold text-2xl text-text-primary mb-6">
            Investigation Workflow
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center text-text-primary font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Problem Identified</h3>
                <p className="text-sm text-text-secondary">{caso.problema}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-secondary flex items-center justify-center text-bg-primary font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Local Resource Mapped</h3>
                <p className="text-sm text-text-secondary">{caso.recurso_local}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center text-text-primary font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Evidence Collected</h3>
                <p className="text-sm text-text-secondary">
                  Evidence level: <span className="font-semibold">{normalizedEvidence}</span>
                </p>
                {caso.referencias && caso.referencias.length > 0 && (
                  <p className="text-xs text-text-muted mt-1">
                    {caso.referencias.length} scientific references
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-secondary flex items-center justify-center text-bg-primary font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Solution Proposed</h3>
                <p className="text-sm text-text-secondary">{caso.solucao}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA CONTRIBUIR */}
        <div className="text-center py-8">
          <p className="text-text-secondary mb-4">
            Do you know this problem in your region?
          </p>
          <Link
            href="/contribuir"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary text-bg-primary rounded-xl font-semibold hover:bg-accent-secondary transition-all"
          >
            Contribute Knowledge
          </Link>
        </div>
      </div>
    </div>
  );
}
