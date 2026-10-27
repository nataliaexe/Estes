"use client";

import { useEffect, useState } from "react";
import { useI18n } from "../../lib/i18n/useI18n";
import { api } from "../../lib/api";
import type { Evidence } from "../../lib/types";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function EvidenceDetail() {
  const { t } = useI18n();
  const params = useParams();
  const evidenceId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [evidence, setEvidence] = useState<Evidence | null>(null);

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const data = await api.evidence.get(evidenceId);
        setEvidence(data);
      } catch (error) {
        console.error("Error fetching evidence:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvidence();
  }, [evidenceId]);

  if (loading) {
    return <div className="p-6">{t.common.loading}</div>;
  }

  if (!evidence) {
    return <div className="p-6">{t.common.error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/investigar/${evidence.case_id}`}
          className="inline-block mb-6 text-green-600 dark:text-green-400 hover:underline"
        >
          {t.evidence.detail.backToCase}
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-slate-100">
          {t.evidence.detail.title}
        </h1>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">
              {evidence.title}
            </h2>
            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
              {evidence.source_type}
            </span>
          </div>

          {evidence.authors && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.evidence.detail.authors}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">{evidence.authors}</p>
            </div>
          )}

          {evidence.year && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.evidence.detail.year}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">{evidence.year}</p>
            </div>
          )}

          {evidence.doi && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.evidence.doi}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">{evidence.doi}</p>
            </div>
          )}

          {evidence.excerpt && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.evidence.excerpt}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">{evidence.excerpt}</p>
            </div>
          )}

          {evidence.url && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.evidence.detail.url}
              </h3>
              <a
                href={evidence.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 dark:text-green-400 hover:underline"
              >
                {evidence.url}
              </a>
            </div>
          )}

          {evidence.evidence_level && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.evidence.evidenceLevel}
              </h3>
              <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                {evidence.evidence_level}
              </span>
            </div>
          )}

          {evidence.confidence !== undefined && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.evidence.detail.confidence}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {(evidence.confidence * 100).toFixed(0)}%
              </p>
            </div>
          )}

          {evidence.notes && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.evidence.detail.notes}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">{evidence.notes}</p>
            </div>
          )}

          {evidence.limitations && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.evidence.detail.limitations}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {evidence.limitations}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
