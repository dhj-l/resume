import { http } from "@/http/request";

import type {
  AiPolishParams,
  AiPolishResult,
  AnalyzeParams,
  AnalysisDetailResult,
  AnalysisResult,
  GenerationRecordResponse,
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

export const getLatestAnalysisAPI = (resumeId: string) => {
  return http.get<AnalysisDetailResult>("/resume-ai/latest-analysis", { params: { resumeId } });
};

export const exportAnalysisAPI = (id: string) => {
  return http.get<Blob>(`/resume-ai/export-analysis/${id}`, { responseType: "blob" });
};
