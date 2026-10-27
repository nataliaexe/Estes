export interface Case {
  id: string;
  title: string;
  location: string;
  problem_type: string;
  summary: string;
  created_at: string;
  status: string;
}

export interface Evidence {
  id: string;
  case_id: string;
  source_type: string;
  title: string;
  authors?: string;
  year?: number;
  doi?: string;
  excerpt?: string;
  url?: string;
  evidence_level?: string;
  confidence?: number;
  notes?: string;
  limitations?: string;
}

export interface Material {
  id: string;
  case_id: string;
  name: string;
  category: string;
  region?: string;
  availability?: string;
  properties: Record<string, string | number | boolean>;
  relevance?: string;
  source?: string;
}

export interface Hypothesis {
  id: string;
  case_id: string;
  title: string;
  description: string;
  supporting_evidence_ids: string[];
  relevant_material_ids: string[];
  status: string;
  confidence?: number;
  limitations?: string;
}

export interface Protocol {
  id: string;
  case_id: string;
  steps: Array<{ description?: string; duration?: string } | string>;
  materials_needed: string[];
  equipment_needed: string[];
  objectives?: string;
  risks?: string;
  validation_plan?: string;
}
