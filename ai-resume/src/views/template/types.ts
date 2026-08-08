import type { Template } from "@/api/templates/type";

// 页面props（如果从父组件接收数据）
export interface TemplateListProps {
  templates: Template[];
  loading?: boolean;
}

export interface AiCreateUserInfo {
  name: string;
  age?: number;
  education?: string;
  school: string;
  major: string;
  targetRole: string;
  yearsOfExperience?: number;
}

export interface AiCreateFormData {
  jd: string;
  userInfo: AiCreateUserInfo;
  supplementary: string;
  /** 本次要生成的模块 key 列表 */
  modules: string[];
}
