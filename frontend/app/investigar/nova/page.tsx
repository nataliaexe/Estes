"use client";

import { useState } from "react";
import { useI18n } from "../../lib/i18n/useI18n";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function NovaInvestigacao() {
  const { t } = useI18n();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    problem_type: "",
    summary: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.cases.create(formData);
      router.push(`/investigar/${response.id}`);
    } catch (error) {
      console.error("Error creating case:", error);
      alert("Erro ao criar investigação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-slate-100">
          {t.investigation.new.title}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              {t.investigation.new.problemLabel}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t.investigation.new.problemPlaceholder}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              {t.investigation.new.locationLabel}
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder={t.investigation.new.locationPlaceholder}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              {t.investigation.new.impactTypeLabel}
            </label>
            <select
              value={formData.problem_type}
              onChange={(e) =>
                setFormData({ ...formData, problem_type: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              required
            >
              <option value="">Selecione...</option>
              <option value="water_contamination">Contaminação da água</option>
              <option value="soil_degradation">Degradação do solo</option>
              <option value="air_pollution">Poluição do ar</option>
              <option value="deforestation">Desmatamento</option>
              <option value="biodiversity_loss">Perda de biodiversidade</option>
              <option value="other">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              {t.investigation.new.contextLabel}
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              placeholder={t.investigation.new.contextPlaceholder}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Carregando..." : t.investigation.new.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
