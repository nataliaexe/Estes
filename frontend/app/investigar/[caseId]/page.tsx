"use client";

import { useEffect, useState } from "react";
import { useI18n } from "../../lib/i18n/useI18n";
import { api } from "../../lib/api";
import type { Case, Evidence, Material, Hypothesis, Protocol } from "../../lib/types";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function InvestigacaoDetalhe() {
  const { t } = useI18n();
  const params = useParams();
  const caseId = params.caseId as string;
  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [caseRes, evidenceRes, materialsRes, hypothesesRes, protocolsRes] =
          await Promise.all([
            api.cases.get(caseId),
            api.evidence.listByCase(caseId),
            api.materials.listByCase(caseId),
            api.hypotheses.listByCase(caseId),
            api.protocols.listByCase(caseId),
          ]);

        setCaseData(caseRes);
        setEvidence(evidenceRes);
        setMaterials(materialsRes);
        setHypotheses(hypothesesRes);
        setProtocols(protocolsRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [caseId]);

  if (loading) {
    return <div className="p-6">{t.common.loading}</div>;
  }

  if (!caseData) {
    return <div className="p-6">{t.common.error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-slate-100">
          {t.investigation.dashboard.title}
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
              {t.investigation.dashboard.summary}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">{caseData.summary}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
              {t.investigation.dashboard.status}
            </h2>
            <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
              {caseData.status}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
              {t.investigation.dashboard.evidenceFound}
            </h2>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
              {evidence.length}
            </p>
            {evidence.length > 0 && (
              <ul className="space-y-2">
                {evidence.slice(0, 5).map((e) => (
                  <Link
                    key={e.id}
                    href={`/evidencias/${e.id}`}
                    className="block p-3 bg-slate-50 dark:bg-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                      {e.title}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {e.source_type}
                    </p>
                  </Link>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
              {t.investigation.dashboard.materialsSuggested}
            </h2>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              {materials.length}
            </p>
            {materials.length > 0 && (
              <ul className="space-y-2">
                {materials.slice(0, 5).map((m) => (
                  <Link
                    key={m.id}
                    href={`/materiais/${m.id}`}
                    className="block p-3 bg-slate-50 dark:bg-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                      {m.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {m.category}
                    </p>
                  </Link>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
              {t.investigation.dashboard.hypotheses}
            </h2>
            {hypotheses.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">
                Nenhuma hipótese ainda
              </p>
            ) : (
              <ul className="space-y-2">
                {hypotheses.map((h) => (
                  <li
                    key={h.id}
                    className="p-3 bg-slate-50 dark:bg-slate-700 rounded"
                  >
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {h.title}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {h.status}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
              Protocolos
            </h2>
            {protocols.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">
                Nenhum protocolo ainda
              </p>
            ) : (
              <ul className="space-y-2">
                {protocols.map((p) => (
                  <Link
                    key={p.id}
                    href={`/protocolo/${p.id}`}
                    className="block p-3 bg-slate-50 dark:bg-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {p.objectives || "Sem objetivo definido"}
                    </p>
                  </Link>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
