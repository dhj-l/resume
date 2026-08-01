export interface GenerationRecord {
  _id: string;
  /** 生成成功后对应的简历 ID（后端可能不回传，回传时优先使用） */
  resumeId?: string;
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
  comment: string;
}

export interface AnalysisItem {
  category: string;
  title: string;
  description: string;
  suggestion?: string;
  severity?: "critical" | "major" | "minor";
}

export interface Suggestion {
  priority: "high" | "medium" | "low";
  action: string;
  category: string;
  timeline: string;
}

export interface MarketAnalysis {
  position_demand: string;
  competition_intensity: "high" | "medium" | "low";
  candidate_positioning: string;
  salary_competitiveness_note: string;
}

export interface TechnologyAssessment {
  tech_stack_score: number;
  tech_stack_summary: string;
  matching_skills: string[];
  missing_critical_skills: string[];
  trending_skills_advantage: string[];
  outdated_or_risk_skills: string[];
}

export interface CareerAnalysis {
  career_stage: string;
  trajectory_assessment: string;
  growth_rate: "fast" | "steady" | "slow" | "stagnant";
  red_flags: string[];
  estimated_work_years: string;
}

export interface KeyFinding {
  severity: "critical" | "major" | "minor" | "positive";
  finding: string;
  detail: string;
}

export interface AnalysisResult {
  recordId: string;
  analysisResult: AnalysisResultData;
}

export interface AnalysisResultData {
  meta: {
    candidate_name: string;
    target_position: string;
    analysis_version: string;
    analysis_date: string;
  };
  overall_score: number;
  competitiveness_level: string;
  dimension_scores: DimensionScore[];
  strengths: AnalysisItem[];
  weaknesses: AnalysisItem[];
  suggestions: Suggestion[];
  summary: string;
  market_analysis?: MarketAnalysis;
  technology_assessment?: TechnologyAssessment;
  career_analysis?: CareerAnalysis;
  key_findings?: KeyFinding[];
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
