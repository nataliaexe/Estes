"use client";

import { useState } from "react";
import { useI18n } from "../lib/i18n/useI18n";
import Link from "next/link";

interface SimulationResult {
  status: string;
  confidence: number;
  satellite_data?: {
    source: string;
    hotspots: number;
    coordinates: Array<{ lat: number; lon: number }>;
  };
  water_quality?: {
    ph: number;
    heavy_metals: Record<string, string>;
  };
  soil_analysis?: {
    organic_matter: string;
    nitrogen: string;
    phosphorus: string;
    erosion_risk: string;
  };
  air_metrics?: {
    pm25: string;
    pm10: string;
    no2: string;
    o3: string;
  };
  evidence: Array<{
    title: string;
    source: string;
    excerpt: string;
  }>;
  materials: Array<{
    name: string;
    category: string;
    relevance: string;
  }>;
  hypothesis: {
    title: string;
    status: string;
    confidence: number;
  };
}

export default function SimulacaoPage() {
  const { t } = useI18n();
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  const scenarios = [
    {
      id: "amazon_fire",
      name: "Queimada na Amazônia",
      description: "Simula detecção de focos de queimada em área florestal",
      icon: "🔥",
    },
    {
      id: "river_pollution",
      name: "Poluição Química em Rio",
      description: "Simula contaminação por metais pesados em curso d'água",
      icon: "💧",
    },
    {
      id: "soil_degradation",
      name: "Degradação do Solo",
      description: "Simula erosão e perda de fertilidade em área agrícola",
      icon: "🌱",
    },
    {
      id: "air_quality",
      name: "Qualidade do Ar Urbana",
      description: "Simula poluição atmosférica em área industrial",
      icon: "🌫️",
    },
  ] as const;
  type ScenarioId = (typeof scenarios)[number]["id"];

  const runSimulation = async (scenarioId: ScenarioId) => {
    setSimulating(true);
    setResults(null);
    setSelectedScenario(scenarioId);
    setSimulationError(null);

    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 700));
      const mockResults = {
      amazon_fire: {
        status: "detected",
        confidence: 0.87,
        satellite_data: {
          source: "Dado sintético local (nenhuma API consultada)",
          hotspots: 3,
          coordinates: [
            { lat: -3.4653, lon: -62.2159 },
            { lat: -3.4782, lon: -62.2087 },
            { lat: -3.4521, lon: -62.2213 },
          ],
        },
        evidence: [
          {
            title: "Exemplo demonstrativo de observação ambiental",
            source: "Registro fictício, criado apenas para a simulação",
            excerpt: "Trecho sintético; não corresponde a publicação científica.",
          },
        ],
        materials: [
          {
            name: "Carvão ativado local",
            category: "inorganic",
            relevance: "High - can filter smoke particles",
          },
        ],
        hypothesis: {
          title: "Focos de queimada detectados correspondem a desmatamento ilegal",
          status: "hypothesis",
          confidence: 0.75,
        },
      },
      river_pollution: {
        status: "elevated_risk",
        confidence: 0.91,
        water_quality: {
          ph: 5.2,
          heavy_metals: {
            lead: "0.045 mg/L (above safe limit)",
            mercury: "0.002 mg/L (within limits)",
            cadmium: "0.008 mg/L (above safe limit)",
          },
        },
        evidence: [
          {
            title: "Exemplo demonstrativo de qualidade da água",
            source: "Registro fictício, criado apenas para a simulação",
            excerpt: "Trecho sintético; não corresponde a publicação científica.",
          },
        ],
        materials: [
          {
            name: "Casca de arroz carbonizada",
            category: "biomass",
            relevance: "High - effective metal adsorption",
          },
        ],
        hypothesis: {
          title: "Contaminação por chumbo associada a atividades industriais upstream",
          status: "hypothesis",
          confidence: 0.82,
        },
      },
      soil_degradation: {
        status: "moderate",
        confidence: 0.76,
        soil_analysis: {
          organic_matter: "2.1% (low)",
          nitrogen: "low",
          phosphorus: "medium",
          erosion_risk: "high",
        },
        evidence: [
          {
            title: "Exemplo demonstrativo de análise do solo",
            source: "Registro fictício, criado apenas para a simulação",
            excerpt: "Trecho sintético; não corresponde a publicação científica.",
          },
        ],
        materials: [
          {
            name: "Composto orgânico local",
            category: "organic",
            relevance: "High - soil restoration",
          },
        ],
        hypothesis: {
          title: "Uso intensivo de monocultura causou degradação do solo",
          status: "hypothesis",
          confidence: 0.68,
        },
      },
      air_quality: {
        status: "warning",
        confidence: 0.83,
        air_metrics: {
          pm25: "45 µg/m³ (moderate)",
          pm10: "78 µg/m³ (moderate)",
          no2: "32 ppb (moderate)",
          o3: "45 ppb (moderate)",
        },
        evidence: [
          {
            title: "Exemplo demonstrativo de qualidade do ar",
            source: "Registro fictício, criado apenas para a simulação",
            excerpt: "Trecho sintético; não corresponde a publicação científica.",
          },
        ],
        materials: [
          {
            name: "Plantas tropicais (Ficus, Monstera)",
            category: "organic",
            relevance: "Medium - air purification potential",
          },
        ],
        hypothesis: {
          title: "Níveis de poluição estão correlacionados com tráfego industrial",
          status: "hypothesis",
          confidence: 0.71,
        },
      },
      } satisfies Record<ScenarioId, SimulationResult>;

      setResults(mockResults[scenarioId]);
    } catch (error) {
      console.error("Falha ao executar a simulação local", error);
      setSimulationError("Não foi possível gerar a demonstração. Tente novamente.");
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-block mb-4 text-green-600 dark:text-green-400 hover:underline"
          >
            {t.common.back}
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Modo Simulação
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Simule cenários ambientais reais para testar a plataforma de investigação
          </p>
        </div>

        <div role="note" className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            <strong>Aviso — dados sintéticos:</strong> esta demonstração é executada localmente,
            sem consultar APIs. Valores, coordenadas, hipóteses e exemplos de evidência são
            fictícios e não representam medições nem publicações reais.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => runSimulation(s.id)}
              disabled={simulating}
              aria-pressed={selectedScenario === s.id}
              className="p-6 bg-white dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-500 transition-all text-left disabled:opacity-50"
            >
              <div className="text-4xl mb-3">{s.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {s.name}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {s.description}
              </p>
            </button>
          ))}
        </div>

        {simulating && (
          <div role="status" aria-live="polite" className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Simulando cenário...
            </p>
          </div>
        )}

        {simulationError && (
          <p role="alert" className="mb-6 text-red-700 dark:text-red-300">
            {simulationError}
          </p>
        )}

        {results && !simulating && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
              Resultados sintéticos: {scenarios.find((scenario) => scenario.id === selectedScenario)?.name}
            </h2>

            <div className="space-y-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                  Status Detectado
                </h3>
                <p className="text-green-600 dark:text-green-400 font-medium">
                  {results.status.replace("_", " ").toUpperCase()}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Confiança: {(results.confidence * 100).toFixed(0)}%
                </p>
              </div>

              {results.satellite_data && (
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                    Dados de Satélite
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Fonte: {results.satellite_data.source}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Focos detectados: {results.satellite_data.hotspots}
                  </p>
                  {results.satellite_data.coordinates.map(({ lat, lon }, index) => (
                    <p key={`${lat}-${lon}`} className="text-sm text-slate-600 dark:text-slate-400">
                      Coordenada demonstrativa {index + 1}: {lat}, {lon}
                    </p>
                  ))}
                </div>
              )}

              {results.water_quality && (
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                    Qualidade da Água
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    pH demonstrativo: {results.water_quality.ph}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                      Metais Pesados:
                    </p>
                    {Object.entries(results.water_quality.heavy_metals).map(([metal, value]) => (
                      <p key={metal} className="text-sm text-slate-600 dark:text-slate-400">
                        {metal}: {value}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {results.soil_analysis && (
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                    Análise sintética do solo
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Matéria orgânica: {results.soil_analysis.organic_matter}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Nitrogênio: {results.soil_analysis.nitrogen}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Fósforo: {results.soil_analysis.phosphorus}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Risco de erosão: {results.soil_analysis.erosion_risk}
                  </p>
                </div>
              )}

              {results.air_metrics && (
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                    Indicadores sintéticos do ar
                  </h3>
                  {Object.entries(results.air_metrics).map(([metric, value]) => (
                    <p key={metric} className="text-sm text-slate-600 dark:text-slate-400">
                      {metric.toUpperCase()}: {value}
                    </p>
                  ))}
                </div>
              )}

              {results.evidence && (
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                    Exemplo de evidência sintética (não é fonte científica)
                  </h3>
                  {results.evidence.map((e) => (
                    <div key={e.title} className="mb-3 last:mb-0">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {e.title}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {e.source}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {e.excerpt}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {results.materials && (
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                    Materiais Locais Sugeridos
                  </h3>
                  {results.materials.map((m, i) => (
                    <div key={i} className="mb-3 last:mb-0">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {m.name}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Categoria: {m.category}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {m.relevance}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {results.hypothesis && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                    Hipótese de demonstração (não verificada)
                  </h3>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                    {results.hypothesis.title}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Status: {results.hypothesis.status}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Confiança: {(results.hypothesis.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8">
              <Link
                href="/investigar/nova"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Criar investigação (sem importar dados sintéticos)
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
