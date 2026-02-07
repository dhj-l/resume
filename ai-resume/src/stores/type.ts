import type { Component } from "vue";

/**
 * 简历数据接口
 */
export interface ResumeData {
  /**
   * 简历ID
   */
  _id: string;
  /**
   * userId
   */
  userId: string;
  /**
   * 简历标题
   */
  title: string;
  /**
   * 简历全局样式配置
   */
  globalStyle: GlobalStyle;
  /**
   * 基础信息
   */
  basicInfo: BasicInfo;
  /**
   * 求职意向
   */
  jobIntention?: JobIntention;
  /**
   * 教育背景
   */
  educationBackground: EducationBackground[];
  /**
   * 工作经验
   */
  workExperience?: WorkExperience[];
  /**
   * 校园经历
   */
  campusExperience?: CampusExperience[];
  /**
   * 技能特长
   */
  skills?: string;
  /**
   * 荣誉证书
   */
  certificates?: string;
  /**
   * 项目经历
   */
  projectExperience?: ProjectExperience[];
  /**
   * 实习经历
   */
  internshipExperience?: InternshipExperience[];
  /**
   * 自我评价
   */
  selfEvaluation?: string;
  /**
   * 简历封面
   */
  cover?: string;
}

export interface JobIntention {
  /**
   * 求职意向 例如：前端开发、后端开发、数据分析师等
   */
  jobIntention: string;
  /**
   * 意向城市
   */
  intentionCity: string;
  /**
   * 期望薪资
   */
  expectationSalary: string;
  /**
   * 入职时间
   */
  entryTime: string;
}

export interface InternshipExperience {
  /**
   * 实习开始时间
   */
  startTime: string;
  /**
   * 实习结束时间
   */
  endTime?: string;
  /**
   * 公司名称
   */
  companyName: string;
  /**
   * 职位
   */
  position: string;
  /**
   * 实习描述
   */
  description: string;
}

export interface ProjectExperience {
  /**
   * 项目开始时间
   */
  startTime: string;
  /**
   * 项目结束时间
   */
  endTime?: string;
  /**
   * 项目名称
   */
  title: string;
  /**
   * 项目描述
   */
  description: string;
  /**
   * 项目内容
   */
  content: string;
}

export interface CampusExperience {
  /**
   * 经历开始时间
   */
  startTime: string;
  /**
   * 经历结束时间
   */
  endTime?: string;
  /**
   * 经历名称
   */
  title: string;
  /**
   * 经历描述
   */
  description: string;
  /**
   * 经历内容
   */
  content: string;
}

export interface WorkExperience {
  /**
   * 公司名称
   */
  companyName: string;
  /**
   * 职位
   */
  position: string;
  /**
   * 入职时间
   */
  workTime: string;
  /**
   * 离职时间
   */
  dismissalTime?: string;
  /**
   * 工作描述
   */
  workDescription: string;
}

export interface EducationBackground {
  /**
   * 学校名称
   */
  schoolName: string;
  /**
   * 学历层次
   */
  degree: string;
  /**
   * 专业
   */
  major: string;
  /**
   * 入学时间
   */
  enrollmentTime: string;
  /**
   * 毕业时间
   */
  graduationTime: string;
  /**
   * 详细内容
   */
  content: string;
}

export interface BasicInfo {
  /**
   * 姓名
   */
  name: string;
  /**
   * 性别
   */
  gender: string;
  /**
   * 手机号
   */
  phone: string;
  /**
   * 年龄
   */
  age: string;
  /**
   * 邮箱
   */
  email: string;
  /**
   * 头像
   */
  avatar: string;
  /**
   * 政治面貌
   */
  politicalStatus: string;
  /**
   * 工作年限
   */
  workYear: string;
}

export interface GlobalStyle {
  /**
   * 字体
   */
  fontSize: string;
  /**
   *模块上下间距
   */
  moduleMargin: string;
  /**
   * 页面左右间距
   */
  pageMargin: string;
  /**
   * 行高
   */
  lineHeight: string;
}

export interface ModuleItem<T = any, F = any> {
  index: number;
  moduleKey: keyof ResumeData;
  label: string;
  component: Component<T> | null;
  formComponent: Component<F>;
  /**
   * 是否展示
   */
  isShow: boolean;
}
