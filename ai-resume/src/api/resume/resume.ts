import { http } from "@/http/request";
import type { ResumeData } from "@/stores/type";

export const createResumeAPI = () => {
  return http.post<ResumeData>("/resume");
};

export const getResumeInfoAPI = (id: string) => {
  return http.get<ResumeData>(`/resume/${id}`);
};

export const updateResumeAPI = (id: string, data: ResumeData) => {
  return http.patch<ResumeData>(`/resume/${id}`, data);
};

export const getResumeDetailAPI = (id: string) => {
  return http.get<ResumeData>(`/resume/${id}`);
};
