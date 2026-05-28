import type { InjectionKey, Ref } from "vue";

import type {
  DimensionScore,
  AnalysisItem,
  Suggestion,
  AnalysisResultData,
  MarketAnalysis,
  TechnologyAssessment,
  CareerAnalysis,
  KeyFinding,
} from "@/api/resume-ai/type";

export const ContainerWidthKey: InjectionKey<Ref<boolean>> = Symbol("containerWidth");

export type {
  DimensionScore,
  AnalysisItem as StrengthItem,
  AnalysisItem as WeaknessItem,
  Suggestion as SuggestionItem,
  MarketAnalysis,
  TechnologyAssessment,
  CareerAnalysis,
  KeyFinding,
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

export const SEVERITY_COLORS: Record<string, string> = {
  critical: "#ff4d4f",
  major: "#faad14",
  minor: "#1677ff",
  positive: "#52c41a",
};

export const SEVERITY_BG_COLORS: Record<string, string> = {
  critical: "#fff1f0",
  major: "#fffbe6",
  minor: "#e6f4ff",
  positive: "#f6ffed",
};

export const SEVERITY_LABELS: Record<string, string> = {
  critical: "严重",
  major: "重要",
  minor: "一般",
  positive: "亮点",
};

export const COMPETITIVENESS_LABELS: Record<string, string> = {
  excellent: "优秀",
  strong: "强劲",
  moderate: "中等",
  weak: "较弱",
  poor: "不足",
};

export const COMPETITIVENESS_COLORS: Record<string, string> = {
  excellent: "#52c41a",
  strong: "#1677ff",
  moderate: "#faad14",
  weak: "#fa8c16",
  poor: "#ff4d4f",
};

export const COMPETITIVENESS_BG_COLORS: Record<string, string> = {
  excellent: "#f6ffed",
  strong: "#e6f4ff",
  moderate: "#fffbe6",
  weak: "#fff7e6",
  poor: "#fff1f0",
};

export const COMPETITION_INTENSITY_LABELS: Record<string, string> = {
  high: "激烈",
  medium: "中等",
  low: "温和",
};

export const GROWTH_RATE_LABELS: Record<string, string> = {
  fast: "快速",
  steady: "稳步",
  slow: "缓慢",
  stagnant: "停滞",
};

export const TIMELINE_LABELS: Record<string, string> = {
  "短期(1-2周)": "短期",
  "中期(1-3月)": "中期",
  "长期(3-6月)": "长期",
};

export const CATEGORY_COLORS: Record<string, string> = {
  技能提升: "bg-blue-50 text-blue-600",
  项目经验: "bg-green-50 text-green-600",
  简历优化: "bg-purple-50 text-purple-600",
  面试准备: "bg-orange-50 text-orange-600",
  职业规划: "bg-cyan-50 text-cyan-600",
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
