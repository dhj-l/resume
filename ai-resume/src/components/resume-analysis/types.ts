import type {
  DimensionScore,
  AnalysisItem,
  Suggestion,
  AnalysisResultData,
} from "@/api/resume-ai/type";

export type {
  DimensionScore,
  AnalysisItem as StrengthItem,
  AnalysisItem as WeaknessItem,
  Suggestion as SuggestionItem,
};
export type ResumeAnalysisData = AnalysisResultData;

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
  high: "高优先级",
  medium: "中优先级",
  low: "低优先级",
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
