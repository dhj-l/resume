import { http } from "@/http/request";
import type {
  TemplateDetails,
  TemplateListParams,
  TemplateListResponse,
} from "./type";

export const getTemplateListAPI = (params?: TemplateListParams) => {
  return http.get<TemplateListResponse>("/template", { params });
};

export const getTemplateByIdAPI = (id: string) => {
  return http.get<TemplateDetails>(`/template/${id}`);
};

export const createTemplateAPI = (data: {
  name: string;
  previewImage?: string;
  category: string;
  resumeId: string;
}) => {
  return http.post<TemplateDetails>("/template", data);
};
