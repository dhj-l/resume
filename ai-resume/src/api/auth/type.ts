export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  password: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

/** OAuth 授权 URL 响应（Gitee / GitHub 通用） */
export interface OAuthAuthUrlResponse {
  authUrl: string;
  state: string;
}

/** GET /auth/gitee 响应 */
export type GiteeAuthUrlResponse = OAuthAuthUrlResponse;

/** GET /auth/github 响应 */
export type GitHubAuthUrlResponse = OAuthAuthUrlResponse;
