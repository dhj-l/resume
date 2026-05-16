import { http } from "@/http/request";

import type { GenerationRecordResponse } from "./type";

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
