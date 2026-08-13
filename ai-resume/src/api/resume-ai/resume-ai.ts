import type { AxiosRequestConfig } from "axios";

import { http } from "@/http/request";

import type {
  AiPolishParams,
  AiPolishResult,
  AnalyzeParams,
  AnalysisDetailResult,
  AnalysisResult,
  GenerationRecordResponse,
  PredictQuestionsParams,
  PredictQuestionsResult,
  QuestionRecordDetail,
  QuestionRecordResponse,
} from "./type";

export const getGenerationRecordsAPI = (
  query: {
    page?: number;
    pageSize?: number;
  } = {},
) => {
  return http.get<GenerationRecordResponse>("/resume-ai/records", {
    params: query,
  });
};

export const polishContentAPI = (data: AiPolishParams) => {
  return http.post<AiPolishResult>("/resume-ai/polish", data);
};

export const analyzeResumeAPI = (data: AnalyzeParams) => {
  return http.post<AnalysisResult>("/resume-ai/analyze", data);
};

export const getAnalysisDetailAPI = (id: string) => {
  return http.get<AnalysisDetailResult>("/resume-ai/analysis-detail", {
    params: { id },
  });
};

export const getLatestAnalysisAPI = (resumeId: string, config?: AxiosRequestConfig) => {
  return http.get<AnalysisDetailResult>("/resume-ai/latest-analysis", {
    params: { resumeId },
    ...config,
  });
};

export const predictQuestionsAPI = (data: PredictQuestionsParams) => {
  return http.post<PredictQuestionsResult>("/resume-ai/predict-questions", data);
};

export const getQuestionRecordsAPI = (
  query: {
    page?: number;
    pageSize?: number;
  } = {},
) => {
  return http.get<QuestionRecordResponse>("/resume-ai/question-records", {
    params: query,
  });
};

export const getQuestionDetailAPI = (id: string) => {
  return http.get<QuestionRecordDetail>("/resume-ai/question-detail", {
    params: { id },
  });
};

export const getLatestQuestionsAPI = (resumeId: string, config?: AxiosRequestConfig) => {
  return http.get<QuestionRecordDetail>("/resume-ai/latest-questions", {
    params: { resumeId },
    ...config,
  });
};

export const exportAnalysisAPI = (id: string) => {
  return http.get<Blob>(`/resume-ai/export-analysis/${id}`, { responseType: "blob" });
};
