"use client";

import { useI18n } from "../lib/i18n/useI18n";

export default function QuantumCellPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          {t.quantumCell.title}
        </h1>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg mb-6">
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            {t.quantumCell.description}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                {t.quantumCell.materials}
              </h3>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                <li>Celulose de eucalipto</li>
                <li>Nanocelulose</li>
                <li>Filmes de celulose</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                {t.quantumCell.objective}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Desenvolver sensores ópticos e sistemas de filtragem de água
                baseados em materiais de celulose modificados
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
            {t.quantumCell.scientificContext}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            A linha de pesquisa explora as propriedades ópticas e de superfície
            da celulose de eucalipto para aplicações em sensoriamento ambiental.
            O foco é em materiais sustentáveis e de baixo custo para monitoramento
            de qualidade de água em regiões rurais.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
            {t.quantumCell.limitations}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            A pesquisa está em fase inicial. Não há validação experimental
            concluída. Os resultados são hipóteses baseadas em literatura
            científica e precisam de testes de laboratório.
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-8 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-xl font-semibold mb-3 text-yellow-800 dark:text-yellow-200">
            {t.quantumCell.status}
          </h3>
          <p className="text-yellow-700 dark:text-yellow-300">
            {t.quantumCell.statusDevelopment}
          </p>
        </div>
      </div>
    </div>
  );
}
