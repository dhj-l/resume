import { http } from "@/http/request";
import type {
  UserProfile,
  UpdateProfileParams,
  ChangePasswordParams,
} from "./type";

// 获取用户信息
export const getUserProfileAPI = () => {
  return http.get<UserProfile>("/user/profile");
};

// 更新用户信息
export const updateUserProfileAPI = (data: UpdateProfileParams) => {
  return http.patch<UserProfile>("/user/profile", data);
};

// 修改密码
export const changePasswordAPI = (data: ChangePasswordParams) => {
  return http.patch<void>("/user/change-password", data);
};
