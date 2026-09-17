const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function fetcher<T>(path: string, opts?: RequestInit): Promise<T> {
  const r = await fetch(`${API}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...opts?.headers },
  });
  if (!r.ok) throw new Error(`API ${r.status}: ${await r.text()}`);
  return r.json();
}

export type Caso = {
  id: string;
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
};

export type CasoDetalhe = Caso & {
  historia: string;
  fontes_historicas: { tipo: string; titulo?: string; veiculo?: string; url?: string }[];
  impacto_estimado: Record<string, unknown>;
  nivel_1_pronto: { tempo?: string; custo?: string; passos?: string[] };
  nivel_2_simples: { tempo?: string; custo?: string; passos?: string[] };
  nivel_3_completo: { tempo?: string; custo?: string; passos?: string[] };
};

export type Clima = {
  temperatura_c: number;
  umidade_pct: number;
  vento_kmh: number;
  condicao: string;
  risco_queimada: string;
  risco_enchente: string;
  pm25: number | null;
};

export type Foco = {
  latitude: number;
  longitude: number;
  data: string;
  hora: string;
  satelite: string;
  confianca: string;
  frp: number;
};

export type FocosResp = {
  total: number;
  focos: Foco[];
};

export type Dashboard = {
  total_casos: number;
  total_medicoes: number;
  total_noticias: number;
  total_usuarios: number;
  casos_por_categoria: Record<string, number>;
  casos_por_uf: Record<string, number>;
  casos_com_hardware: number;
};

export const api = {
  casos: (params?: { categoria?: string; uf?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return fetcher<Caso[]>(`/casos${q ? `?${q}` : ""}`);
  },
  casoDetalhe: (numero: number) => fetcher<CasoDetalhe>(`/casos/${numero}`),
  clima: (lat: number, lon: number) =>
    fetcher<Clima>(`/clima?lat=${lat}&lon=${lon}`),
  queimadas: (lat: number, lon: number, raio = 200) =>
    fetcher<FocosResp>(`/queimadas?lat=${lat}&lon=${lon}&raio_km=${raio}&dias=1`),
  dashboard: () => fetcher<Dashboard>("/dashboard"),
  perguntar: (pergunta: string, uf?: string) =>
    fetcher<{
      texto: string;
      provedor: string;
      fontes: { tipo: string; titulo: string }[];
      sugestoes: string[];
    }>("/ia/perguntar", {
      method: "POST",
      body: JSON.stringify({ pergunta, uf }),
    }),
  casosBuscar: (consulta: string) =>
    fetcher<{ caso: Caso; similaridade: number }[]>("/casos/buscar", {
      method: "POST",
      body: JSON.stringify({ consulta, limite: 5 }),
    }),
};
