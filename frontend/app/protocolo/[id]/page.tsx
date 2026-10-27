"use client";

import { useEffect, useState } from "react";
import { useI18n } from "../../lib/i18n/useI18n";
import { api } from "../../lib/api";
import type { Protocol } from "../../lib/types";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProtocolDetail() {
  const { t } = useI18n();
  const params = useParams();
  const protocolId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [protocol, setProtocol] = useState<Protocol | null>(null);

  useEffect(() => {
    const fetchProtocol = async () => {
      try {
        const data = await api.protocols.get(protocolId);
        setProtocol(data);
      } catch (error) {
        console.error("Error fetching protocol:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProtocol();
  }, [protocolId]);

  if (loading) {
    return <div className="p-6">{t.common.loading}</div>;
  }

  if (!protocol) {
    return <div className="p-6">{t.common.error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/investigar/${protocol.case_id}`}
          className="inline-block mb-6 text-green-600 dark:text-green-400 hover:underline"
        >
          {t.protocols.detail.backToCase}
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-slate-100">
          {t.protocols.detail.title}
        </h1>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg space-y-6">
          {protocol.objectives && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.protocols.objective}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {protocol.objectives}
              </p>
            </div>
          )}

          {protocol.materials_needed.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.protocols.detail.materialsNeeded}
              </h3>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                {protocol.materials_needed.map((material, index) => (
                  <li key={index}>{material}</li>
                ))}
              </ul>
            </div>
          )}

          {protocol.equipment_needed.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.protocols.detail.equipmentNeeded}
              </h3>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                {protocol.equipment_needed.map((equipment, index) => (
                  <li key={index}>{equipment}</li>
                ))}
              </ul>
            </div>
          )}

          {protocol.steps.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.protocols.steps}
              </h3>
              <ol className="list-decimal list-inside text-slate-600 dark:text-slate-400 space-y-2">
                {protocol.steps.map((step, index) => (
                  <li key={index}>
                    <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded">
                      {typeof step === "string" ? (
                        <p>{step}</p>
                      ) : (
                        <div>
                          {step.description && <p>{step.description}</p>}
                          {step.duration && (
                            <p className="text-sm text-slate-500">
                              Duração: {step.duration}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {protocol.risks && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.protocols.risks}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">{protocol.risks}</p>
            </div>
          )}

          {protocol.validation_plan && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.protocols.detail.validationPlan}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {protocol.validation_plan}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
