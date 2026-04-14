import type { Component } from "vue";

import type { templateType } from "@/views/editor/components/preview/type";

/**
 * 可排序模块接口
 * 用于 skills、certificates、selfEvaluation 等简单模块
 */
export interface SortableModule {
  /** 模块内容 */
  content?: string;
  /** 全局排序字段，代表当前模块在简历内的排序位置 */
  globalSort?: number;
}

export interface ResumeData {
  _id: string;
  userId: string;
  type?: templateType;
  title: string;
  globalStyle: GlobalStyle;
  basicInfo: BasicInfo;
  jobIntention?: JobIntention;
  educationBackground: EducationBackground[];
  workExperience?: WorkExperience[];
  campusExperience?: CampusExperience[];
  skills?: SortableModule;
  certificates?: SortableModule;
  projectExperience?: ProjectExperience[];
  internshipExperience?: InternshipExperience[];
  selfEvaluation?: SortableModule;
  cover?: string;
}

export interface JobIntention {
  jobIntention: string;
  intentionCity: string;
  expectationSalary: string;
  entryTime: string;
}

export interface InternshipExperience {
  startTime: string;
  endTime?: string;
  companyName: string;
  position: string;
  description: string;
  /** 全局排序字段，代表当前模块在简历内的排序位置 */
  globalSort?: number;
  /** 局部排序字段，当模块为数组时，代表每一项在数组内的排序位置 */
  localSort?: number;
}

export interface ProjectExperience {
  startTime: string;
  endTime?: string;
  title: string;
  description: string;
  content: string;
  /** 全局排序字段，代表当前模块在简历内的排序位置 */
  globalSort?: number;
  /** 局部排序字段，当模块为数组时，代表每一项在数组内的排序位置 */
  localSort?: number;
}

export interface CampusExperience {
  startTime: string;
  endTime?: string;
  title: string;
  description: string;
  content: string;
  /** 全局排序字段，代表当前模块在简历内的排序位置 */
  globalSort?: number;
  /** 局部排序字段，当模块为数组时，代表每一项在数组内的排序位置 */
  localSort?: number;
}

export interface WorkExperience {
  companyName: string;
  position: string;
  workTime: string;
  dismissalTime?: string;
  workDescription: string;
  /** 全局排序字段，代表当前模块在简历内的排序位置 */
  globalSort?: number;
  /** 局部排序字段，当模块为数组时，代表每一项在数组内的排序位置 */
  localSort?: number;
}

export interface EducationBackground {
  schoolName: string;
  degree: string;
  major: string;
  enrollmentTime: string;
  graduationTime: string;
  content: string;
  /** 全局排序字段，代表当前模块在简历内的排序位置 */
  globalSort?: number;
  /** 局部排序字段，当模块为数组时，代表每一项在数组内的排序位置 */
  localSort?: number;
}

export interface BasicInfo {
  name: string;
  gender: string;
  phone: string;
  age: string;
  email: string;
  avatar: string;
  politicalStatus: string;
  workYear: string;
}

export interface GlobalStyle {
  fontSize: string;
  moduleMargin: string;
  pageMargin: string;
  lineHeight: string;
}

export interface ModuleItem<T = any, F = any> {
  moduleKey: keyof ResumeData;
  label: string;
  component: Component<T> | null;
  formComponent: Component<F>;
  isShow: boolean;
  globalSort: number;
}
