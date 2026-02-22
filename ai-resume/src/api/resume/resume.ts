import { http } from "@/http/request";
import type { ResumeData } from "@/stores/type";
import type {
  AiResumeParams,
  CreateResumeParams,
  DeleteResumeResult,
  UserResumeListItem,
} from "./type";

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export const createResumeAPI = (data: CreateResumeParams = {}) => {
  return http.post<ResumeData>("/resume", data);
};

export const updateResumeAPI = (id: string, data: ResumeData) => {
  return http.patch<ResumeData>(`/resume/${id}`, data);
};

export const getResumeDetailAPI = (id: string) => {
  return http.get<ResumeData>(`/resume/${id}`);
};

export const getUserResumesAPI = () => {
  return http.get<UserResumeListItem[]>("/resume");
};

export const deleteResumeAPI = (id: string) => {
  return http.delete(`/resume/${id}`) as unknown as Promise<
    ApiResponse<DeleteResumeResult>
  >;
};

/**
 * 复制简历
 * @param id 简历ID
 * @param title 新简历标题（可选）
 */
export const copyResumeAPI = (id: string, title?: string) => {
  return http.post<ResumeData>(`/resume/${id}/copy`, { title });
};

/**
 * 下载简历
 */
export const downloadResumeAPI = ({ html = "", css = "" }) => {
  return http.post(`/resume/download`, { html, css }, { responseType: "blob" });
};

/**
 * 解析简历
 * @param file 简历文件
 */
export const parseResumeAPI = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return http.post<string>("/upload/resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * AI 生成简历
 */
export const generateAiResumeAPI = (data: AiResumeParams) => {
  return http.post<{ _id: string }>("/resume-ai/generate", data);
};
