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
    resume: { _id: "resume_tpl1", userId: "user001", title: "默认模板简历", type: "default" },
    userId: "user001",
    user: { _id: "user001", username: "张三", email: "zhangsan@example.com" },
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
    resume: {
      _id: "resume_tpl2",
      userId: "user001",
      title: "现代模板简历",
      type: "double-column",
    },
    userId: "user001",
    user: { _id: "user001", username: "张三", email: "zhangsan@example.com" },
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
    resume: { _id: "resume_tpl3", userId: "user001", title: "优雅模板简历", type: "simple" },
    userId: "user001",
    user: { _id: "user001", username: "张三", email: "zhangsan@example.com" },
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

// --- AI 面试押题详情（扩展字段） ---
export const mockQuestionDetail = {
  _id: "qdetail001",
  resumeId: "resume001",
  jobDescription:
    "我们正在寻找一位拥有3年以上经验的前端开发工程师，精通Vue3、TypeScript与Node.js，具备大型中后台项目经验，熟悉性能优化与工程化实践。",
  questionCount: 10,
  candidateName: "张三",
  targetPosition: "前端开发工程师",
  workYears: "3年",
  status: "completed",
  overview:
    "综合押题说明：候选人核心优势在 Vue3 与中后台项目，需重点准备响应式原理、性能优化与工程化实践，并提前演练系统设计类追问。",
  focusAreas: [
    { area: "Vue3 原理", reason: "简历核心技能，面试官高频深挖" },
    { area: "性能优化", reason: "JD 明确要求，需准备量化数据" },
    { area: "工程化实践", reason: "3年经验层级的常见考察方向" },
  ],
  hotTopics: ["Vue3 响应式", "AI 工程化", "性能优化", "TypeScript 类型体操"],
  interviewTips: [
    "用 STAR 法则组织项目回答",
    "提前准备 2-3 个量化成果数据",
    "模拟演练一轮系统设计题",
  ],
  result: [
    {
      question: "请描述 Vue3 响应式原理的优化实践",
      answer:
        "答题要点：结合具体项目说明依赖收集、避免大对象深度响应、使用 shallowRef 与 computed 缓存，并给出可量化的优化效果。",
      category: "技术",
      difficulty: "进阶",
      keywords: ["Vue3 响应式", "性能优化"],
      followUp: "如果数据量继续增长，你会如何进一步优化？",
      evaluationPoint: "考察对响应式原理的理解深度",
    },
    {
      question: "介绍一个你主导的性能优化项目",
      answer:
        "答题要点：说明优化目标、定位手段（性能面板/埋点）、具体措施（懒加载、缓存、渲染优化）与量化收益。",
      category: "项目深挖",
      difficulty: "进阶",
      keywords: ["性能优化", "量化收益"],
      followUp: "如何验证优化效果并防止回归？",
      evaluationPoint: "考察项目深度与工程方法",
    },
  ],
  userId: "user001",
  createdAt: "2025-06-20T08:00:00Z",
  updatedAt: "2025-06-20T08:00:00Z",
};
