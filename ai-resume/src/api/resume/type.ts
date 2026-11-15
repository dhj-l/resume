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
  aiStatus?: string;
}

export interface UserResumeListResponse {
  total: number;
  list: UserResumeListItem[];
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
  /** 需要生成的模块 key 列表（缺省/空数组 = 全部模块） */
  modules?: string[];
}

export interface AIResumeParams {
  templateType: string;
  templateId: string;
  resumeContent: string;
}
