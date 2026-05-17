export interface ResumeAnalysisData {
  meta: {
    candidate_name?: string;
    target_position?: string;
    analysis_version: string;
  };
  overall_score: number;
  dimension_scores: DimensionScore[];
  strengths: StrengthItem[];
  weaknesses: WeaknessItem[];
  suggestions: SuggestionItem[];
  summary: string;
}

export interface DimensionScore {
  name: string;
  score: number;
  max: number;
  weight: number;
}

export interface StrengthItem {
  category: string;
  title: string;
  description: string;
}

export interface WeaknessItem {
  category: string;
  title: string;
  description: string;
  suggestion: string;
}

export interface SuggestionItem {
  priority: "high" | "medium" | "low";
  action: string;
}

export const DIMENSION_COLORS = {
  palette: ["#1677ff", "#52c41a", "#722ed1", "#fa8c16", "#13c2c2"],
  score: {
    excellent: "#52c41a",
    normal: "#1677ff",
    warning: "#fa8c16",
  },
  priority: {
    high: "#ff4d4f",
    medium: "#faad14",
    low: "#1677ff",
  },
} as const;

export const PRIORITY_LABELS: Record<string, string> = {
  high: "高优",
  medium: "重要",
  low: "建议",
};

export function getScoreColor(score: number): string {
  if (score >= 80) return DIMENSION_COLORS.score.excellent;
  if (score >= 60) return DIMENSION_COLORS.score.normal;
  return DIMENSION_COLORS.score.warning;
}

export function getScoreLevel(score: number): string {
  if (score >= 90) return "优秀";
  if (score >= 80) return "良好";
  if (score >= 70) return "中等偏上";
  if (score >= 60) return "中等";
  if (score >= 40) return "待提升";
  return "需改进";
}
