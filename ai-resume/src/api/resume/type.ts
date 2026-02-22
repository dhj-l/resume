export interface CreateResumeParams {
  templateId?: string;
  title?: string;
  type?: string;
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

export interface AiResumeParams {
  parseType: "upload" | "select" | "manual";
  jobDescription: string;
  templateType: string;
  resumeContent?: string;
  detailInfo?: any;
  resumeId?: string;
}
