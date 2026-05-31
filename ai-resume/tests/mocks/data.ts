/** 测试用 Mock 数据 — 与后端 API 响应结构一致 */

import type { UserResumeListItem } from "../../src/api/resume/type";
import type { TemplateDetails } from "../../src/api/templates/type";

// --- 模板 ---
export const mockTemplates: TemplateDetails[] = [
  {
    _id: "tpl001default",
    name: "简洁风格",
    previewImage: "/images/template-default.png",
    category: "默认",
    usedCount: 1280,
    resumeId: "",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-01-15T00:00:00Z",
  },
  {
    _id: "tpl002modern",
    name: "现代风格",
    previewImage: "/images/template-modern.png",
    category: "现代",
    usedCount: 890,
    resumeId: "",
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-02-01T00:00:00Z",
  },
  {
    _id: "tpl003elegant",
    name: "优雅风格",
    previewImage: "/images/template-elegant.png",
    category: "优雅",
    usedCount: 567,
    resumeId: "",
    createdAt: "2025-03-10T00:00:00Z",
    updatedAt: "2025-03-10T00:00:00Z",
  },
];

// --- 用户简历 ---
export const mockResumes: UserResumeListItem[] = [
  {
    _id: "resume001",
    userId: "user001",
    title: "张三 - 前端开发工程师",
    isTemplate: false,
    createdAt: "2025-06-01T08:00:00Z",
    updatedAt: "2025-06-01T08:00:00Z",
  },
  {
    _id: "resume002",
    userId: "user001",
    title: "张三 - Java 后端开发",
    isTemplate: false,
    createdAt: "2025-05-20T10:30:00Z",
    updatedAt: "2025-05-28T14:20:00Z",
  },
  {
    _id: "resume003",
    userId: "user001",
    title: "张三 - 数据分析实习",
    isTemplate: false,
    createdAt: "2025-04-12T16:00:00Z",
    updatedAt: "2025-04-12T16:00:00Z",
  },
];

// --- 用户信息 ---
export const mockUserProfile = {
  _id: "user001",
  username: "张三",
  email: "zhangsan@example.com",
  avatar: "",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-06-01T08:00:00Z",
};

// --- 登录响应 ---
export const mockLoginResponse = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token",
  user: {
    _id: "user001",
    username: "张三",
    email: "zhangsan@example.com",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-06-01T08:00:00Z",
  },
};

// --- 创建的简历 ---
export const mockCreatedResume = {
  _id: "resume_new",
  title: "未命名简历",
  templateId: "tpl001default",
  createdAt: "2025-06-20T00:00:00Z",
  updatedAt: "2025-06-20T00:00:00Z",
};

// --- Gitee OAuth ---
export const mockGiteeAuthUrl = {
  authUrl: "https://gitee.com/oauth/authorize?client_id=mock",
  state: "mock-oauth-state",
};
