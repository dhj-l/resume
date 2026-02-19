import type { ResumeData } from "@/stores/type";

export const mockResumeData: ResumeData = {
  _id: "1",
  userId: "user_123",
  type: "default",
  title: "我的个人简历",
  globalStyle: {
    fontSize: "14px",
    moduleMargin: "24px",
    pageMargin: "32px",
    lineHeight: "1.5",
  },
  basicInfo: {
    name: "张三",
    gender: "男",
    phone: "13800138000",
    email: "zhangsan@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    politicalStatus: "中共党员",
    workYear: "3年",
    age: "30",
  },
  jobIntention: {
    jobIntention: "前端开发工程师",
    intentionCity: "上海",
    expectationSalary: "12k",
    entryTime: "2023-01",
  },
  educationBackground: [
    {
      schoolName: "上海交通大学",
      degree: "本科",
      major: "软件工程",
      enrollmentTime: "2016-09",
      graduationTime: "2020-06",
      content: "专业排名 Top 10%，参与多个项目团队合作，获得项目负责人荣誉。",
    },
    {
      schoolName: "上海交通大学",
      degree: "硕士",
      major: "软件工程",
      enrollmentTime: "2020-09",
      graduationTime: "2022-06",
      content: "专业排名 Top 5%，参与多个项目团队合作，获得项目负责人荣誉。",
    },
  ],
  workExperience: [
    {
      companyName: "某知名互联网公司",
      position: "前端开发工程师",
      workTime: "2020-07",
      dismissalTime: "2022-08",
      workDescription:
        "负责公司核心产品的前端开发工作，使用Vue3+TS重构旧项目，提升性能30%。",
    },
  ],
  projectExperience: [
    {
      startTime: "2021-01",
      endTime: "2021-06",
      title: "企业级后台管理系统",
      description: "基于Vue3+Element Plus的大型后台管理系统",
      content: "负责系统架构设计，封装通用组件，实现权限管理模块。",
    },
  ],
  skills: "Vue3, TypeScript, Node.js, Webpack, Vite",
  certificates: "CET-6, 软考中级软件设计师",
  selfEvaluation: "热爱技术，善于钻研，具备良好的团队协作能力和抗压能力。",
  campusExperience: [
    {
      startTime: "2018-09",
      endTime: "2020-06",
      title: "上海交通大学",
      description: "软件学院",
      content: "参与多个项目团队合作，获得项目负责人荣誉。",
    },
  ],
  internshipExperience: [
    {
      startTime: "2020-07",
      endTime: "2020-08",
      companyName: "某知名互联网公司",
      position: "前端开发工程师",
      description:
        "负责公司核心产品的前端开发工作，使用Vue3+TS重构旧项目，提升性能30%。",
    },
  ],
};
