"use client";

import { useEffect, useState } from "react";
import { useI18n } from "../../lib/i18n/useI18n";
import { api } from "../../lib/api";
import type { Material } from "../../lib/types";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function MaterialDetail() {
  const { t } = useI18n();
  const params = useParams();
  const materialId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [material, setMaterial] = useState<Material | null>(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const data = await api.materials.get(materialId);
        setMaterial(data);
      } catch (error) {
        console.error("Error fetching material:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [materialId]);

  if (loading) {
    return <div className="p-6">{t.common.loading}</div>;
  }

  if (!material) {
    return <div className="p-6">{t.common.error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/investigar/${material.case_id}`}
          className="inline-block mb-6 text-green-600 dark:text-green-400 hover:underline"
        >
          {t.materials.detail.backToCase}
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-slate-100">
          {t.materials.detail.title}
        </h1>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              {material.name}
            </h2>
            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
              {material.category}
            </span>
          </div>

          {material.region && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.materials.origin}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">{material.region}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
              {t.materials.detail.category}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">{material.category}</p>
          </div>

          {material.availability && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.materials.detail.availability}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {material.availability}
              </p>
            </div>
          )}

          {Object.keys(material.properties).length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.materials.properties}
              </h3>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                {Object.entries(material.properties).map(([key, value]) => (
                  <li key={key}>
                    <span className="font-medium">{key}:</span> {String(value)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {material.relevance && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.materials.detail.relevance}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">{material.relevance}</p>
            </div>
          )}

          {material.source && (
            <div>
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {t.materials.detail.source}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">{material.source}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
