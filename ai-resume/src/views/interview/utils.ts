/**
 * 模拟面试模块共用常量与纯函数
 *
 * 本文件是模拟面试三个页面（发起 / 对话 / 报告）的单一来源：所有跨页面复用的
 * 数值常量、文案派生与展示口径都集中在此，避免同一规则在多处漂移。
 * 涉及后端契约的数值均在注释中标明 `docs/接口文档.md` 的出处。
 */
import type { Component } from "vue";

import { AppstoreOutlined, CodeOutlined, FolderOpenOutlined } from "@ant-design/icons-vue";

import type { AnswerFeedback, InterviewMessage, InterviewStage } from "@/api/interview/type";
import { INTERVIEW_STAGE_LABEL_MAP } from "@/api/interview/type";

/** 单条回答字数上限；对齐后端 `content` 上限（docs/接口文档.md 提交回答：最长 5000 字） */
export const ANSWER_MAX_LENGTH = 5000;

/**
 * 会话不活动超时窗口（分钟）
 *
 * 后端超过该时长无活动即自动关闭会话（`endedReason=timeout`，不生成报告），
 * 前端仅用于剩余时间倒计时与提示文案，见 docs/接口文档.md「会话超时」。
 */
export const SESSION_IDLE_TIMEOUT_MINUTES = 45;

/** 剩余时间临期提醒阈值（分钟）：进入该区间后倒计时转为告警样式 */
export const EXPIRE_WARN_MINUTES = 5;

/** 打字机每个字符间隔（毫秒） */
export const TYPE_INTERVAL = 18;

/**
 * 打字机最大步数：一次输出的题目按总字数摊分成不超过该步数，
 * 保证长题文的打字段落感一致，同时避免超长题文卡住过久。
 */
export const TYPE_MAX_STEPS = 120;

/** 会话标题截断长度（取 JD 首行前 N 字，过长时保持列表与头部一致） */
const SESSION_TITLE_MAX_LENGTH = 40;

/** 会话标题缺失时的兜底文案 */
const SESSION_TITLE_FALLBACK = "模拟面试";

/** 分数着色阈值：良好 / 及格 / 待提升 */
const SCORE_GOOD = 80;
const SCORE_PASS = 60;
/** 分数着色：良好=绿、及格=琥珀、待提升=红 */
const SCORE_COLOR_GOOD = "#10b981";
const SCORE_COLOR_PASS = "#f59e0b";
const SCORE_COLOR_POOR = "#ef4444";

/** 打分维度标签（逐题反馈与报告总评共用同一口径） */
export const FEEDBACK_DIMENSION_LABELS = {
  completeness: "完整性",
  logic: "逻辑性",
  depth: "技术深度",
} as const;

/** 考察难度标签 → 徽章样式类（未知值由调用方兜底） */
export const DIFFICULTY_CLASS_MAP: Record<string, string> = {
  基础: "bg-emerald-50 text-emerald-600",
  进阶: "bg-sky-50 text-sky-600",
  高阶: "bg-violet-50 text-violet-600",
};

/** 难度标签兜底文案 */
export const DEFAULT_DIFFICULTY_LABEL = "基础";

/** 面试轮次选项（发起页卡片与对话页欢迎页胶囊共用；label 取自已有的标签映射表） */
export interface InterviewStageOption {
  value: InterviewStage;
  label: string;
  /** 该轮次的考察侧重说明（发起页展示） */
  desc: string;
  icon: Component;
}

export const INTERVIEW_STAGE_OPTIONS: InterviewStageOption[] = [
  {
    value: "first",
    label: INTERVIEW_STAGE_LABEL_MAP.first,
    desc: "未来同组资深工程师：项目/实习深挖约 7 成 + 八股基础约 3 成",
    icon: CodeOutlined,
  },
  {
    value: "second",
    label: INTERVIEW_STAGE_LABEL_MAP.second,
    desc: "直属 Leader：项目深挖约 7 成（选型/架构/难点/量化）+ 系统设计约 3 成",
    icon: FolderOpenOutlined,
  },
  {
    value: "third",
    label: INTERVIEW_STAGE_LABEL_MAP.third,
    desc: "总监/交叉面官：项目引申至架构与决策约 6 成 + 技术广度与开放性问题约 4 成",
    icon: AppstoreOutlined,
  },
];

/** 分数 → 着色（0-59 红 / 60-79 琥珀 / 80-100 绿） */
export const scoreColor = (score: number): string =>
  score >= SCORE_GOOD
    ? SCORE_COLOR_GOOD
    : score >= SCORE_PASS
      ? SCORE_COLOR_PASS
      : SCORE_COLOR_POOR;

/**
 * 逐题反馈的三维度展示项（标签顺序与颜色口径统一，供对话页与报告页共用）
 */
export const getAnswerFeedbackDims = (
  feedback: AnswerFeedback,
): { label: string; value: number; color: string }[] => [
  {
    label: FEEDBACK_DIMENSION_LABELS.completeness,
    value: feedback.completeness,
    color: scoreColor(feedback.completeness),
  },
  {
    label: FEEDBACK_DIMENSION_LABELS.logic,
    value: feedback.logic,
    color: scoreColor(feedback.logic),
  },
  {
    label: FEEDBACK_DIMENSION_LABELS.depth,
    value: feedback.depth,
    color: scoreColor(feedback.depth),
  },
];

/**
 * 会话标题：取岗位 JD 首行并截断，侧边栏与对话页头部共用同一规则
 */
export const getSessionTitle = (jobDescription?: string): string => {
  const firstLine = (jobDescription ?? "").split("\n")[0]?.trim() ?? "";
  return firstLine ? firstLine.slice(0, SESSION_TITLE_MAX_LENGTH) : SESSION_TITLE_FALLBACK;
};

/**
 * 面试时长（分钟）：主体考察起止时间的统一口径
 *
 * 对话页与报告页必须使用同一取整方式（向下取整），否则同一会话在两页会差 1 分钟。
 * `endedAt` 允许传入时间戳：对话进行中尚无结束时间，调用方传当前秒级 tick 即可。
 * 时间缺失、非法或倒序时返回 0（由调用方决定是否隐藏展示）。
 */
export const getSessionDurationMinutes = (
  startedAt?: string,
  endedAt?: string | number | null,
): number => {
  if (!startedAt) return 0;
  const start = new Date(startedAt).getTime();
  const end = endedAt ? new Date(endedAt).getTime() : Date.now();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 0;
  return Math.floor((end - start) / 60000);
};

/**
 * 主体考察题数：面试官提问且不属于反问环节（反问环节的候选人提问/面试官回应不计入）
 */
export const countMainQuestions = (messages?: InterviewMessage[]): number =>
  (messages ?? []).filter((msg) => msg.kind === "question" && msg.questionType !== "reverse")
    .length;
