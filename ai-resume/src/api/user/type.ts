export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileParams {
  name?: string;
  avatar?: string;
  oldPassword?: string;
  newPassword?: string;
}

export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
