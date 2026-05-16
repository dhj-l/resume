import { http } from "@/http/request";

import type { AiPolishParams, AiPolishResult, GenerationRecordResponse } from "./type";

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
