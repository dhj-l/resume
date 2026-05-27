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

/** GET /auth/gitee 响应 */
export interface GiteeAuthUrlResponse {
  authUrl: string;
  state: string;
}

/** GET /auth/gitee/callback 请求参数 */
export interface GiteeCallbackParams {
  code: string;
  state: string;
}

/** GET /auth/gitee/callback 响应中的用户对象（含 OAuth 信息） */
export interface GiteeUser {
  _id: string;
  username: string;
  email: string;
  oauthProviders?: {
    gitee?: {
      openId: string;
      accessToken: string;
    };
  };
}

/** GET /auth/gitee/callback 完整响应 */
export interface GiteeCallbackResponse {
  token: string;
  user: GiteeUser;
}
