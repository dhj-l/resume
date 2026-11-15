// ==================== 枚举 ====================

/** 经验层级 */
export type ExperienceLevel = "junior" | "mid" | "senior" | "expert";

/** 面试模式：campus=校招 / experienced=社招 */
export type InterviewMode = "campus" | "experienced";

/** 面试轮次：first=一面 / second=二面 / third=三面 */
export type InterviewStage = "first" | "second" | "third";

/** 题目类型 */
export type QuestionType =
  | "self_intro"
  | "project"
  | "fundamentals"
  | "system_design"
  | "open_question"
  | "reverse";

/** 会话阶段：main=主体考察 / reverse=反问环节 */
export type InterviewPhase = "main" | "reverse";

/** 考察侧重（旧版字段，仅历史会话兼容展示用） */
export type Focus = "technical" | "project" | "mixed";

/** 会话状态 */
export type SessionStatus = "in_progress" | "completed" | "cancelled";

/** 结束原因（ai_suggest 为旧版遗留，仅兼容展示） */
export type EndedReason = "completed" | "ai_suggest" | "user_finish" | "user_cancel" | "timeout";

// ==================== 枚举中文映射（未知值兜底） ====================

export const EXPERIENCE_LEVEL_LABEL_MAP: Record<ExperienceLevel, string> = {
  junior: "校招/应届生",
  mid: "1-3 年经验",
  senior: "3-5 年经验",
  expert: "5 年以上经验",
};

export const INTERVIEW_MODE_LABEL_MAP: Record<InterviewMode, string> = {
  campus: "校招模式",
  experienced: "社招模式",
};

export const INTERVIEW_STAGE_LABEL_MAP: Record<InterviewStage, string> = {
  first: "一面 · 基础技术面",
  second: "二面 · 项目深入面",
  third: "三面 · 综合面",
};

export const INTERVIEW_STAGE_SHORT_LABEL_MAP: Record<InterviewStage, string> = {
  first: "一面",
  second: "二面",
  third: "三面",
};

export const QUESTION_TYPE_LABEL_MAP: Record<QuestionType, string> = {
  self_intro: "自我介绍",
  project: "项目深挖",
  fundamentals: "八股基础",
  system_design: "系统设计",
  open_question: "开放性问题",
  reverse: "反问",
};

export const INTERVIEW_PHASE_LABEL_MAP: Record<InterviewPhase, string> = {
  main: "主体考察",
  reverse: "反问环节",
};

/** 旧版考察侧重标签（仅历史会话兼容展示） */
export const FOCUS_LABEL_MAP: Record<Focus, string> = {
  technical: "技术面",
  project: "项目深挖面",
  mixed: "综合面",
};

export const ENDED_REASON_LABEL_MAP: Record<EndedReason, string> = {
  completed: "反问环节自然结束",
  ai_suggest: "AI 建议提前结束",
  user_finish: "用户主动收尾",
  user_cancel: "用户中断面试",
  timeout: "超时自动关闭",
};

/** 获取经验层级中文标签，未知值兜底 */
export const getExperienceLevelLabel = (level: string): string =>
  EXPERIENCE_LEVEL_LABEL_MAP[level as ExperienceLevel] ?? level;

/** 获取面试模式中文标签，未知值兜底 */
export const getModeLabel = (mode: string): string =>
  INTERVIEW_MODE_LABEL_MAP[mode as InterviewMode] ?? mode;

/** 获取面试轮次中文标签，未知值兜底 */
export const getStageLabel = (stage: string): string =>
  INTERVIEW_STAGE_LABEL_MAP[stage as InterviewStage] ?? stage;

/** 获取面试轮次短标签（一面/二面/三面），未知值兜底 */
export const getStageShortLabel = (stage: string): string =>
  INTERVIEW_STAGE_SHORT_LABEL_MAP[stage as InterviewStage] ?? stage;

/** 获取题目类型中文标签，未知值兜底 */
export const getQuestionTypeLabel = (type: string): string =>
  QUESTION_TYPE_LABEL_MAP[type as QuestionType] ?? type;

/** 获取会话阶段中文标签，未知值兜底 */
export const getPhaseLabel = (phase: string): string =>
  INTERVIEW_PHASE_LABEL_MAP[phase as InterviewPhase] ?? phase;

/** 获取旧版考察侧重中文标签，未知值兜底 */
export const getFocusLabel = (focus: string): string => FOCUS_LABEL_MAP[focus as Focus] ?? focus;

/** 获取结束原因中文标签，未知值兜底 */
export const getEndedReasonLabel = (reason: string): string =>
  ENDED_REASON_LABEL_MAP[reason as EndedReason] ?? reason;

/** 会话级别标签：优先新结构 stage，历史会话兜底 focus */
export const getSessionLevelLabel = (levelConfig?: LevelConfig): string => {
  if (!levelConfig) return "";
  if (levelConfig.stage) return getStageLabel(levelConfig.stage);
  if (levelConfig.focus) return getFocusLabel(levelConfig.focus);
  return "";
};

/** 会话级别短标签：一面/二面/三面，历史会话兜底旧 focus 标签 */
export const getSessionLevelShortLabel = (levelConfig?: LevelConfig): string => {
  if (!levelConfig) return "";
  if (levelConfig.stage) return getStageShortLabel(levelConfig.stage);
  if (levelConfig.focus) return getFocusLabel(levelConfig.focus);
  return "";
};

/** 轮次进度文案：新会话按题数展示，历史会话（有 targetRounds）保持 N/M 轮 */
export const getRoundProgressText = (currentRound?: number, targetRounds?: number): string => {
  if (targetRounds && targetRounds > 0) return `${currentRound ?? 0}/${targetRounds} 轮`;
  const round = currentRound ?? 0;
  return round > 0 ? `已问 ${round} 题` : "";
};

// ==================== 数据结构 ====================

export interface LevelConfig {
  /** 面试模式（历史会话可能缺失） */
  mode?: InterviewMode;
  /** 面试轮次（历史会话可能缺失） */
  stage?: InterviewStage;
  experienceLevel: ExperienceLevel;
  /** 旧版考察侧重，仅历史会话存在 */
  focus?: Focus;
}

/** 创建会话的级别配置：campus 无需传经验层级（服务端归一为 junior） */
export interface CreateSessionLevelConfig {
  mode: InterviewMode;
  stage: InterviewStage;
  experienceLevel?: ExperienceLevel;
}

export interface OutlineItem {
  key: string;
  title: string;
  description?: string;
  /** 基础/进阶/高阶 */
  difficulty?: string;
  /** 主题题型（新版大纲携带） */
  questionType?: QuestionType;
}

/** 逐题即时反馈（完整性/逻辑性/技术深度 0-100） */
export interface AnswerFeedback {
  completeness: number;
  logic: number;
  depth: number;
  comment: string;
}

export interface InterviewMessage {
  /** interviewer=AI 面试官 / candidate=用户 */
  role: "interviewer" | "candidate";
  content: string;
  round: number;
  /** question / answer */
  kind: "question" | "answer";
  channel?: "text" | "voice";
  /** 该条消息的题型（反问环节候选人提问也标 reverse） */
  questionType?: QuestionType;
  /** 逐题反馈，挂在候选人回答消息上 */
  feedback?: AnswerFeedback;
  askedAt?: string;
  answeredAt?: string;
}

/** 反问环节推荐话术 */
export interface ReverseSuggestion {
  /** 主题标签 */
  title: string;
  /** 完整话术，可直接使用 */
  content: string;
  /** 为什么适合现在问 */
  rationale?: string;
}

export interface ReportTopic {
  topicKey: string;
  title: string;
  score: number;
  comment?: string;
}

/** 报告三维度总评（与逐题反馈同口径，旧报告可能缺失） */
export interface ReportDimensionScores {
  completeness: number;
  logic: number;
  depth: number;
}

/** 反问环节表现评价（未发生反问时缺失） */
export interface ReportReverseFeedback {
  score: number;
  comment: string;
}

export interface InterviewReport {
  overallScore: number;
  summary: string;
  recommendation: string;
  dimensionScores?: ReportDimensionScores;
  topics: ReportTopic[];
  reverseFeedback?: ReportReverseFeedback;
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
  /** 当前阶段：main=主体考察 / reverse=反问环节 */
  phase?: InterviewPhase;
  outline: OutlineItem[];
  currentRound: number;
  /** 旧版目标轮次，新会话不再返回（结束由面试时长驱动） */
  targetRounds?: number;
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
  levelConfig: CreateSessionLevelConfig;
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

/** 提交回答响应 —— 未结束（继续对话或进入反问环节） */
export interface AnswerContinueResult {
  finished: false;
  /** 逐题即时反馈（主体考察阶段返回） */
  feedback?: AnswerFeedback;
  nextQuestion: string;
  round: number;
  /** 当前阶段（phase=reverse 时 nextQuestion 为收尾语/反问回应） */
  phase?: InterviewPhase;
  /** 主体考察已进行分钟数 */
  elapsedMinutes?: number;
  /** 累计已问题数（含本次） */
  askedCount?: number;
}

/** 提交回答响应 —— 面试已结束（finished=true，无 nextQuestion） */
export interface AnswerFinishedResult {
  finished: true;
  endedReason: EndedReason;
  phase?: InterviewPhase;
  /** 面试官告别语（反问环节自然收尾时返回，已在 closing 帧提前展示） */
  farewell?: string;
}

export type AnswerResult = AnswerContinueResult | AnswerFinishedResult;

/** 反问环节推荐话术响应 */
export interface ReverseSuggestionsResponse {
  suggestions: ReverseSuggestion[];
}

// ==================== SSE 事件帧 ====================

/** 连接建立后立即推送一次，无业务数据 */
export interface InterviewSseInitMessage {
  type: "init";
  message?: string;
}

/** 逐题反馈生成完成（主体考察阶段，先于 question 帧到达） */
export interface InterviewSseFeedbackMessage {
  type: "feedback";
  data: AnswerFeedback;
}

/**
 * 反问环节收尾：面试官告别语（先于评价报告生成推送）
 *
 * 报告生成可能耗时数分钟，前端收到该帧后应立即渲染告别语，
 * 并展示「正在生成面试评价报告」的等待状态，直到 finished 帧到达
 */
export interface InterviewSseClosingMessage {
  type: "closing";
  data: {
    farewell: string;
    round: number;
    phase?: InterviewPhase;
  };
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
  | InterviewSseFeedbackMessage
  | InterviewSseClosingMessage
  | InterviewSseQuestionMessage
  | InterviewSseFinishedMessage
  | InterviewSseErrorMessage;
