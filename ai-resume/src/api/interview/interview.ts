import { http } from "@/http/request";

import type {
  AnswerResult,
  CreateSessionParams,
  CurrentSessionResponse,
  GetSessionListParams,
  InterviewReport,
  InterviewSession,
  SessionListResponse,
} from "./type";

const BASE = "/interview/sessions";

/**
 * 创建面试会话（耗时较长：两次 AI 调用，调用方需做 loading）
 */
export const createSessionAPI = (data: CreateSessionParams) => {
  return http.post<InterviewSession>(BASE, data);
};

/**
 * 获取我的当前会话（若已超时会自动关闭并原样返回 cancelled 会话）
 */
export const getCurrentSessionAPI = () => {
  return http.get<CurrentSessionResponse>(`${BASE}/current`);
};

/**
 * 获取会话详情（含全部 messages 与 outline，已完成时含 report）
 */
export const getSessionDetailAPI = (id: string) => {
  return http.get<InterviewSession>(`${BASE}/${id}`);
};

/**
 * 分页获取我的面试记录列表（侧边栏用，不含对话历史与报告正文，按开始时间倒序）
 */
export const getSessionListAPI = (params?: GetSessionListParams) => {
  return http.get<SessionListResponse>(BASE, { params });
};

/**
 * 提交回答（同步，最后一轮回答会自动结束面试并生成报告，耗时较长）
 */
export const submitAnswerAPI = (id: string, data: { content: string; channel?: string }) => {
  return http.post<AnswerResult>(`${BASE}/${id}/answers`, data);
};

/**
 * 用户主动收尾并立即生成评价报告（耗时较长，调用方需做 loading）
 */
export const finishSessionAPI = (id: string) => {
  return http.post<InterviewSession>(`${BASE}/${id}/finish`);
};

/**
 * 强制中断面试（不调用 AI、不生成报告）
 */
export const cancelSessionAPI = (id: string) => {
  return http.post<InterviewSession>(`${BASE}/${id}/cancel`);
};

/**
 * 获取评价报告
 */
export const getReportAPI = (id: string) => {
  return http.get<InterviewReport>(`${BASE}/${id}/report`);
};

/**
 * 获取指定轮次面试官问题的语音（wav 二进制，responseType=blob 由拦截器直接透传）
 * 自动朗读与点击喇叭重播共用
 */
export const getQuestionTtsAPI = (id: string, round: number) => {
  return http.get<Blob>(`${BASE}/${id}/tts`, {
    params: { round },
    responseType: "blob",
    silent: true,
  });
};
