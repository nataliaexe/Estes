"use client";

import { useEffect, useState } from "react";
import { useI18n } from "../lib/i18n/useI18n";
import { api } from "../lib/api";
import type { Case } from "../lib/types";
import Link from "next/link";

export default function CasosPage() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<Case[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 12;

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await api.cases.list({ limit, offset: page * limit });
        setCases(data);
        setTotal(data.length);
      } catch (error) {
        console.error("Error fetching cases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [page]);

  if (loading) {
    return <div className="p-6">{t.common.loading}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-slate-100">
          {t.nav.cases}
        </h1>

        {cases.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Nenhuma investigação ainda
            </p>
            <Link
              href="/investigar/nova"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Criar nova investigação
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {cases.map((caseItem) => (
                <Link
                  key={caseItem.id}
                  href={`/investigar/${caseItem.id}`}
                  className="block bg-white dark:bg-slate-800 p-6 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                    {caseItem.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {caseItem.location}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    {caseItem.problem_type}
                  </p>
                  <span className="inline-block mt-3 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs">
                    {caseItem.status}
                  </span>
                </Link>
              ))}
            </div>

            {total >= limit && (
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg disabled:opacity-50"
                >
                  {t.common.back}
                </button>
                <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg">
                  {page + 1}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={cases.length < limit}
                  className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
