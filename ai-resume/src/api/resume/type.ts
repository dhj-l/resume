export interface CreateResumeParams {
  templateId?: string;
  title?: string;
  globalStyle?: any;
  basicInfo?: any;
  [key: string]: any;
}

export interface UserResumeListItem {
  _id: string;
  userId: string;
  title: string;
  isTemplate: boolean;
  createdAt: string;
  updatedAt?: string;
  cover?: string;
}

export interface DeleteResumeResult {
  _id: string;
  title: string;
}
