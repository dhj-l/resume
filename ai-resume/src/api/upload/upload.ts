import { http } from "@/http/request";
import type { UploadFileResponse } from "./type";

export const uploadFileAPI = async (file: FormData) => {
  return http.post<UploadFileResponse>("/upload/image", file);
};
