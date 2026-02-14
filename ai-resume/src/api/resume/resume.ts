import { http } from "@/http/request";
import type { ResumeData } from "@/stores/type";
import type { CreateResumeParams } from "./type";

export const createResumeAPI = (data: CreateResumeParams = {}) => {
  return http.post<ResumeData>("/resume", data);
};

export const updateResumeAPI = (id: string, data: ResumeData) => {
  return http.patch<ResumeData>(`/resume/${id}`, data);
};

export const getResumeDetailAPI = (id: string) => {
  return http.get<ResumeData>(`/resume/${id}`);
};

/**
 * 下载简历
 */
export const downloadResumeAPI = ({ html = "", css = "" }) => {
  return http.post(`/resume/download`, { html, css }, { responseType: "blob" });
};
