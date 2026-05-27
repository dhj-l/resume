import { http } from "@/http/request";

import type {
  GiteeAuthUrlResponse,
  GiteeCallbackParams,
  GiteeCallbackResponse,
  LoginParams,
  LoginResponse,
  RegisterParams,
} from "./type";

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
  return http.post("/user", params) as unknown as Promise<void>;
};

/**
 * 获取 Gitee OAuth 授权 URL
 * GET /auth/gitee
 */
export const getGiteeAuthUrlAPI = () => {
  return http.get<GiteeAuthUrlResponse>("/auth/gitee");
};

/**
 * Gitee OAuth 回调 —— 用 code + state 换取 JWT Token
 * GET /auth/gitee/callback
 */
export const giteeCallbackAPI = (params: GiteeCallbackParams) => {
  return http.get<GiteeCallbackResponse>("/auth/gitee/callback", { params });
};
