import { http } from "@/http/request";

import type {
  GiteeAuthUrlResponse,
  GitHubAuthUrlResponse,
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
 * 获取 GitHub OAuth 授权 URL
 * GET /auth/github
 */
export const getGitHubAuthUrlAPI = () => {
  return http.get<GitHubAuthUrlResponse>("/auth/github");
};
