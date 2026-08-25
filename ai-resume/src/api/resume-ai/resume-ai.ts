import type { AxiosRequestConfig } from "axios";

import { http } from "@/http/request";

import type {
  AiPolishParams,
  AiPolishResult,
  AnalyzeParams,
  AnalysisDetailResult,
  AnalysisRecordResponse,
  AnalysisResult,
  GenerationRecordResponse,
  PredictQuestionsParams,
  PredictQuestionsResult,
  QuestionRecordDetail,
  QuestionRecordResponse,
  RecordQueryParams,
} from "./type";

export const getGenerationRecordsAPI = (query: RecordQueryParams = {}) => {
  return http.get<GenerationRecordResponse>("/resume-ai/records", {
    params: query,
  });
};

export const deleteGenerationRecordAPI = (id: string) => {
  return http.delete<{ success: boolean }>(`/resume-ai/records/${id}`);
};

export const getAnalysisRecordsAPI = (query: RecordQueryParams = {}) => {
  return http.get<AnalysisRecordResponse>("/resume-ai/analysis-records", {
    params: query,
  });
};

export const deleteAnalysisRecordAPI = (id: string) => {
  return http.delete<{ success: boolean }>(`/resume-ai/analysis-records/${id}`);
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

export const getQuestionRecordsAPI = (query: RecordQueryParams = {}) => {
  return http.get<QuestionRecordResponse>("/resume-ai/question-records", {
    params: query,
  });
};

export const deleteQuestionRecordAPI = (id: string) => {
  return http.delete<{ success: boolean }>(`/resume-ai/question-records/${id}`);
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
