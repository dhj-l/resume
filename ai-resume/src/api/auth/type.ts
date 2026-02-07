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
