import { http } from "@/http/request";
import type { TemplateListParams, TemplateListResponse } from "./type";

export const getTemplateListAPI = (params?: TemplateListParams) => {
  return http.get<TemplateListResponse>("/template", { params });
};
