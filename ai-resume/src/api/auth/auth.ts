import { http } from "@/http/request";
import type { LoginParams, LoginResponse, RegisterParams } from "./type";

/**
 * 登录接口
 */
export const loginAPI = (params: LoginParams) => {
  return http.post<LoginResponse>("/user/login", params);
};
/**
 * 注册接口
 */
export const registerAPI = (params: RegisterParams) => {
  return http.post("/user/register", params);
};
