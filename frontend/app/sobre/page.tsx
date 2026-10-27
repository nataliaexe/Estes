"use client";

import { useI18n } from "../lib/i18n/useI18n";

export default function SobrePage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          {t.nav.about}
        </h1>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
            O que é o Estes?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
            Estes é uma plataforma aberta para investigar problemas ambientais
            locais a partir de evidências científicas, materiais regionais e
            hipóteses rastreáveis.
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            O foco não é gerar uma resposta final, mas organizar a investigação de
            forma transparente, reproduzível e acessível.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
            Como funciona
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-slate-600 dark:text-slate-400">
            <li>Descreva um problema ambiental</li>
            <li>Busque evidências científicas</li>
            <li>Relacione com materiais locais</li>
            <li>Gere hipóteses baseadas em evidências</li>
            <li>Crie protocolos de teste</li>
            <li>Registre todo o processo</li>
          </ol>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
            Princípios
          </h2>
          <ul className="list-disc list-inside space-y-3 text-slate-600 dark:text-slate-400">
            <li>
              <strong>Evidência vs Hipótese:</strong> Sempre deixe explícito o que
              é evidência científica comprovada e o que é hipótese a ser testada
            </li>
            <li>
              <strong>Transparência:</strong> Todas as fontes e limitações devem
              ser registradas
            </li>
            <li>
              <strong>Reprodutibilidade:</strong> Protocolos devem ser claros e
              passíveis de replicação
            </li>
            <li>
              <strong>Acessibilidade:</strong> A plataforma é aberta e gratuita
            </li>
          </ul>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-lg border border-red-200 dark:border-red-800">
          <h2 className="text-2xl font-semibold mb-4 text-red-800 dark:text-red-200">
            Aviso Importante
          </h2>
          <p className="text-red-700 dark:text-red-300">
            O Estes é um protótipo em desenvolvimento. Não substitui análise
            laboratorial, avaliação profissional ou políticas públicas. Hipóteses
            e resultados precisam de validação independente.
          </p>
        </div>
      </div>
    </div>
  );
}
