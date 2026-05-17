export interface GenerationRecord {
  _id: string;
  jobDescription: string;
  status: string;
  templateType: string;
  parseType: "upload" | "select" | "manual";
  detailInfo?: {
    name?: string;
    age?: number;
    education?: string;
    school?: string;
    major?: string;
    targetRole?: string;
    yearsOfExperience?: string;
    supplementary?: string;
  };
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerationRecordResponse {
  total: number;
  list: GenerationRecord[];
}

export interface AiPolishParams {
  resumeId: string;
  key: string;
  index?: number;
  description?: string;
}

export interface AiPolishResult {
  recordId: string;
  beforeContent: string;
  afterContent: string;
}

export interface AnalyzeParams {
  resumeId: string;
  jobDescription: string;
}

export interface DimensionScore {
  name: string;
  score: number;
  max: number;
  weight: number;
}

export interface AnalysisItem {
  category: string;
  title: string;
  description: string;
  suggestion?: string;
}

export interface Suggestion {
  priority: "high" | "medium" | "low";
  action: string;
}

export interface AnalysisResult {
  recordId: string;
  analysisResult: {
    meta: {
      candidate_name: string;
      target_position: string;
      analysis_version: string;
    };
    overall_score: number;
    dimension_scores: DimensionScore[];
    strengths: AnalysisItem[];
    weaknesses: AnalysisItem[];
    suggestions: Suggestion[];
    summary: string;
  };
}

export interface AnalysisDetailResult {
  _id: string;
  resumeId: string;
  jobDescription: string;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  analysisResult: AnalysisResult["analysisResult"];
}
