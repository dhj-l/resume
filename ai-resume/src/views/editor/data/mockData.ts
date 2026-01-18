import type { ResumeData } from '@/stores/type';

export const mockResumeData: ResumeData = {
  _id: '1',
  userId: 'user_123',
  title: '我的个人简历',
  globalStyle: {
    fontSize: '14px',
    moduleMargin: '24px',
    pageMargin: '32px',
    lineHeight: '1.5'
  },
  basicInfo: {
    name: '张三',
    gender: '男',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    politicalStatus: '中共党员',
    workYear: '3年',
  },
  jobIntention: {
    jobIntention: '前端开发工程师',
    intentionCity: '上海',
  },
  educationBackground: [
    {
      schoolName: '上海交通大学',
      degree: '本科',
      major: '软件工程',
      enrollmentTime: '2016-09',
      graduationTime: '2020-06',
      majorScore: 'Top 10%',
      majorCourses: ['数据结构', '算法设计', 'Web开发技术']
    }
  ],
  workExperience: [
    {
      companyName: '某知名互联网公司',
      position: '前端开发工程师',
      workTime: '2020-07 - 至今',
      workDescription: '负责公司核心产品的前端开发工作，使用Vue3+TS重构旧项目，提升性能30%。'
    }
  ],
  projectExperience: [
    {
      startTime: '2021-01',
      endTime: '2021-06',
      title: '企业级后台管理系统',
      description: '基于Vue3+Element Plus的大型后台管理系统',
      content: '负责系统架构设计，封装通用组件，实现权限管理模块。'
    }
  ],
  skills: ['Vue3', 'TypeScript', 'Node.js', 'Webpack', 'Vite'],
  certificates: ['CET-6', '软考中级软件设计师'],
  selfEvaluation: '热爱技术，善于钻研，具备良好的团队协作能力和抗压能力。',
  campusExperience: [],
  internshipExperience: []
};
