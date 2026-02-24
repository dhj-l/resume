import type { Component } from "vue";
import type { templateType } from "@/views/editor/components/preview/type";

export interface ModuleOrderConfig {
  moduleKey: keyof ResumeData;
  globalSort: number;
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
  skills?: string;
  certificates?: string;
  projectExperience?: ProjectExperience[];
  internshipExperience?: InternshipExperience[];
  selfEvaluation?: string;
  cover?: string;
  moduleOrderConfig?: ModuleOrderConfig[];
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
}

export interface ProjectExperience {
  startTime: string;
  endTime?: string;
  title: string;
  description: string;
  content: string;
}

export interface CampusExperience {
  startTime: string;
  endTime?: string;
  title: string;
  description: string;
  content: string;
}

export interface WorkExperience {
  companyName: string;
  position: string;
  workTime: string;
  dismissalTime?: string;
  workDescription: string;
}

export interface EducationBackground {
  schoolName: string;
  degree: string;
  major: string;
  enrollmentTime: string;
  graduationTime: string;
  content: string;
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
