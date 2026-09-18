export type Role = "user" | "assistant";

export interface SourceRef {
  title: string;
  url?: string;
  doi?: string;
  kind: "atlas" | "paper" | "web" | "news";
  score?: number;
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  imageUrl?: string;
  sources?: SourceRef[];
  isVision?: boolean;
  streaming?: boolean;
  sugestoes?: string[];
}

export interface SavedItem {
  id: string;
  type: "article" | "case" | "conversation";
  title: string;
  subtitle?: string;
  savedAt: number;
}

export interface AtlasCaseMini {
  numero: string;
  uf: string;
  categoria: string;
  titulo: string;
  evidencia: "demonstrado" | "suportado" | "modelado" | "hipotese";
}
