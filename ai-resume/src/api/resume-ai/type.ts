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

// ==================== SSE 实时生成 ====================

/** AI 生成 SSE 消息的模块中文标签映射（11 个模块） */
export const SSE_MODULE_LABEL_MAP: Record<string, string> = {
  basicInfo: "基础信息",
  jobIntention: "求职意向",
  globalStyle: "全局样式",
  skills: "技能",
  certificates: "证书",
  selfEvaluation: "自我评价",
  educationBackground: "教育经历",
  workExperience: "工作经历",
  projectExperience: "项目经历",
  campusExperience: "校园经历",
  internshipExperience: "实习经历",
};

/** 获取模块中文标签，未知模块回退为原始 moduleName */
export const getSseModuleLabel = (moduleName: string): string => {
  return SSE_MODULE_LABEL_MAP[moduleName] ?? moduleName;
};

/** 进度帧：单个模块生成进度 */
export interface SseProgressMessage {
  type: "progress";
  moduleName: string;
  status: "processing" | "completed" | "retrying";
  message?: string;
  totalModules: number;
  currentModule: number;
  retryCount?: number;
}

/** 完成帧：整体生成完成，携带 resumeId 用于跳转 */
export interface SseCompleteMessage {
  type: "complete";
  status: "completed";
  message?: string;
  totalModules: number;
  currentModule: number;
  resumeId: string;
}

/** 错误帧：生成失败 */
export interface SseErrorMessage {
  type: "error";
  status: "failed";
  message: string;
  totalModules: number;
  currentModule: number;
}

/** 心跳帧：仅保活，业务侧忽略 */
export interface SseHeartbeatMessage {
  type: "heartbeat";
}

/** SSE 消息判别联合 */
export type SseMessage =
  | SseProgressMessage
  | SseCompleteMessage
  | SseErrorMessage
  | SseHeartbeatMessage;
