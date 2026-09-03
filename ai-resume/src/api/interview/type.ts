// ==================== 枚举 ====================

/** 经验层级 */
export type ExperienceLevel = "junior" | "mid" | "senior" | "expert";

/** 考察侧重 */
export type Focus = "technical" | "project" | "mixed";

/** 会话状态 */
export type SessionStatus = "in_progress" | "completed" | "cancelled";

/** 结束原因 */
export type EndedReason = "completed" | "ai_suggest" | "user_finish" | "user_cancel" | "timeout";

// ==================== 枚举中文映射（未知值兜底） ====================

export const EXPERIENCE_LEVEL_LABEL_MAP: Record<ExperienceLevel, string> = {
  junior: "校招/应届生",
  mid: "1-3 年经验",
  senior: "3-5 年经验",
  expert: "5 年以上经验",
};

export const FOCUS_LABEL_MAP: Record<Focus, string> = {
  technical: "技术面（8 轮）",
  project: "项目深挖面（6 轮）",
  mixed: "技术与项目综合（10 轮）",
};

/** focus 对应的目标轮次 */
export const FOCUS_TARGET_ROUNDS_MAP: Record<Focus, number> = {
  technical: 8,
  project: 6,
  mixed: 10,
};

export const ENDED_REASON_LABEL_MAP: Record<EndedReason, string> = {
  completed: "已完成全部轮次",
  ai_suggest: "AI 建议提前结束",
  user_finish: "用户主动收尾",
  user_cancel: "用户中断面试",
  timeout: "超时自动关闭",
};

/** 获取经验层级中文标签，未知值兜底 */
export const getExperienceLevelLabel = (level: string): string =>
  EXPERIENCE_LEVEL_LABEL_MAP[level as ExperienceLevel] ?? level;

/** 获取考察侧重中文标签，未知值兜底 */
export const getFocusLabel = (focus: string): string => FOCUS_LABEL_MAP[focus as Focus] ?? focus;

/** 获取结束原因中文标签，未知值兜底 */
export const getEndedReasonLabel = (reason: string): string =>
  ENDED_REASON_LABEL_MAP[reason as EndedReason] ?? reason;

// ==================== 数据结构 ====================

export interface LevelConfig {
  experienceLevel: ExperienceLevel;
  focus: Focus;
}

export interface OutlineItem {
  key: string;
  title: string;
  description?: string;
  /** 基础/进阶/高阶 */
  difficulty?: string;
}

export interface InterviewMessage {
  /** interviewer=AI 面试官 / candidate=用户 */
  role: "interviewer" | "candidate";
  content: string;
  round: number;
  /** question / answer */
  kind: "question" | "answer";
  channel?: "text" | "voice";
  askedAt?: string;
  answeredAt?: string;
}

export interface ReportTopic {
  topicKey: string;
  title: string;
  score: number;
  comment?: string;
}

export interface InterviewReport {
  overallScore: number;
  summary: string;
  recommendation: string;
  topics: ReportTopic[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface InterviewSession {
  _id: string;
  userId: string;
  resumeId: string;
  jobDescription: string;
  levelConfig: LevelConfig;
  status: SessionStatus;
  outline: OutlineItem[];
  currentRound: number;
  targetRounds: number;
  askedTopicKeys: string[];
  messages: InterviewMessage[];
  report: InterviewReport | null;
  lastActivityAt: string;
  /** 超过此时间无活动将自动关闭 */
  expiresAt: string;
  startedAt: string;
  endedAt: string | null;
  endedReason?: EndedReason;
}

/** 会话列表项摘要（GET /sessions 返回，不含对话历史与报告正文） */
export type InterviewSessionSummary = Omit<InterviewSession, "messages" | "report"> & {
  /** 是否已生成评价报告（仅 completed 会话为 true） */
  hasReport: boolean;
};

// ==================== 请求参数 ====================

export interface CreateSessionParams {
  resumeId: string;
  jobDescription: string;
  levelConfig: LevelConfig;
}

export interface GetSessionListParams {
  page?: number;
  pageSize?: number;
}

export interface SubmitAnswerParams {
  content: string;
  channel?: "text" | "voice";
}

// ==================== 响应 ====================

export interface CurrentSessionResponse {
  /** false 表示没有进行中的会话 */
  active: boolean;
  session: InterviewSession | null;
}

/** 会话列表响应 */
export interface SessionListResponse {
  list: InterviewSessionSummary[];
  total: number;
  page: number;
  pageSize: number;
}

/** 提交回答响应 —— 未结束（继续对话） */
export interface AnswerContinueResult {
  finished: false;
  nextQuestion: string;
  round: number;
  targetRounds: number;
}

/** 提交回答响应 —— 面试已结束（finished=true，无 nextQuestion） */
export interface AnswerFinishedResult {
  finished: true;
  endedReason: EndedReason;
  targetRounds: number;
}

export type AnswerResult = AnswerContinueResult | AnswerFinishedResult;

// ==================== SSE 事件帧 ====================

/** 连接建立后立即推送一次，无业务数据 */
export interface InterviewSseInitMessage {
  type: "init";
  message?: string;
}

/** 生成完成且面试继续 */
export interface InterviewSseQuestionMessage {
  type: "question";
  data: AnswerContinueResult;
}

/** 本轮回答触发面试结束 */
export interface InterviewSseFinishedMessage {
  type: "finished";
  data: AnswerFinishedResult;
}

/** 服务端处理失败，随后连接关闭 */
export interface InterviewSseErrorMessage {
  type: "error";
  message?: string;
}

export type InterviewSseMessage =
  | InterviewSseInitMessage
  | InterviewSseQuestionMessage
  | InterviewSseFinishedMessage
  | InterviewSseErrorMessage;
