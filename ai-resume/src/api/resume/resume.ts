import { http } from "@/http/request";
import type { ResumeData } from "@/stores/type";
import type {
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
  return http.post("/resume", data) as unknown as Promise<
    ApiResponse<ResumeData>
  >;
};

export const updateResumeAPI = (id: string, data: ResumeData) => {
  return http.patch(`/resume/${id}`, data) as unknown as Promise<
    ApiResponse<ResumeData>
  >;
};

export const getResumeDetailAPI = (id: string) => {
  return http.get(`/resume/${id}`) as unknown as Promise<
    ApiResponse<ResumeData>
  >;
};

export const getUserResumesAPI = () => {
  return http.get("/resume") as unknown as Promise<
    ApiResponse<UserResumeListItem[]>
  >;
};

export const deleteResumeAPI = (id: string) => {
  return http.delete(`/resume/${id}`) as unknown as Promise<
    ApiResponse<DeleteResumeResult>
  >;
};

/**
 * 下载简历
 */
export const downloadResumeAPI = ({ html = "", css = "" }) => {
  return http.post(`/resume/download`, { html, css }, { responseType: "blob" });
};
