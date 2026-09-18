import type { AtlasCaseMini } from "./types";

export const RECENT_CASES: AtlasCaseMini[] = [
  {
    numero: "01",
    uf: "MG",
    categoria: "agua",
    titulo: "Eucalyptus: sensor and water filter",
    evidencia: "demonstrado",
  },
  {
    numero: "03",
    uf: "RR",
    categoria: "mercurio",
    titulo: "Banana + babassu: mercury filter",
    evidencia: "demonstrado",
  },
  {
    numero: "11",
    uf: "RS",
    categoria: "enchente",
    titulo: "Rice husk: post-flood filter",
    evidencia: "demonstrado",
  },
];

export const SUGGESTED_PROMPTS: string[] = [
  "I have eucalyptus in my backyard and the river has heavy metals",
  "How can I use coffee husk to filter contaminated water?",
  "My region flooded. Can rice husk be useful?",
  "I want to test water with my phone, without buying anything",
];

export const EVIDENCE_LABEL: Record<AtlasCaseMini["evidencia"], string> = {
  demonstrado: "Demonstrated",
  suportado: "Supported",
  modelado: "Modeled",
  hipotese: "Hypothesis",
};

export const EVIDENCE_COLOR: Record<AtlasCaseMini["evidencia"], string> = {
  demonstrado: "#4BF98D",
  suportado: "#A68A42",
  modelado: "#C26BFA",
  hipotese: "#EAE5D8",
};
