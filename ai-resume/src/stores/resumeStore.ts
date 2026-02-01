import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";
import type {
  ModuleItem,
  ResumeData,
  BasicInfo,
  JobIntention,
  EducationBackground,
  WorkExperience,
  ProjectExperience,
  GlobalStyle,
} from "./type";
import { mockResumeData } from "@/views/editor/data/mockData";

import EducationBackgroundSection from "@/views/editor/components/preview/EducationBackgroundSection.vue";
import WorkExperienceSection from "@/views/editor/components/preview/WorkExperienceSection.vue";
import ProjectExperienceSection from "@/views/editor/components/preview/ProjectExperienceSection.vue";
import SkillsSection from "@/views/editor/components/preview/SkillsSection.vue";
import CertificatesSection from "@/views/editor/components/preview/CertificatesSection.vue";
import SelfEvaluationSection from "@/views/editor/components/preview/SelfEvaluationSection.vue";
import BasicInfoForm from "@/views/editor/components/drawer/BasicInfoForm.vue";
import JobIntentionForm from "@/views/editor/components/drawer/JobIntentionForm.vue";
import EducationForm from "@/views/editor/components/drawer/EducationForm.vue";
import type { templateType } from "@/views/editor/components/preview/type";
import WorkExperienceForm from "@/views/editor/components/drawer/WorkExperienceForm.vue";
import ProjectExperienceForm from "@/views/editor/components/drawer/ProjectExperienceForm.vue";
import SkillsForm from "@/views/editor/components/drawer/SkillsForm.vue";
import CertificatesForm from "@/views/editor/components/drawer/CertificatesForm.vue";
import SelfEvaluationForm from "@/views/editor/components/drawer/SelfEvaluationForm.vue";
import {
  createResumeAPI,
  getResumeDetailAPI,
  updateResumeAPI,
} from "@/api/resume/resume";

export const useResumeStore = defineStore("resume", () => {
  // 初始化简历数据
  const resumeData = ref<ResumeData>(mockResumeData);
  //当前模块
  const currentModule = ref<string>("basicInfo");
  //控制模块排序数组
  const moduleOrder = ref<ModuleItem[]>([
    {
      index: 0,
      moduleKey: "basicInfo",
      label: "基本信息",
      /**
       * null代表是固定模块，不能删除
       */
      component: null,
      formComponent: shallowRef(BasicInfoForm),
      isShow: true,
    },
    {
      index: 1,
      moduleKey: "jobIntention",
      label: "求职意向",
      component: null,
      formComponent: shallowRef(JobIntentionForm),
      isShow: true,
    },
    {
      index: 2,
      moduleKey: "educationBackground",
      label: "教育背景",
      component: shallowRef(EducationBackgroundSection),
      formComponent: shallowRef(EducationForm),
      isShow: true,
    },
    {
      index: 3,
      moduleKey: "workExperience",
      label: "工作经验",
      component: shallowRef(WorkExperienceSection),
      formComponent: shallowRef(WorkExperienceForm),
      isShow: true,
    },
    {
      index: 4,
      moduleKey: "projectExperience",
      label: "项目经历",
      component: shallowRef(ProjectExperienceSection),
      formComponent: shallowRef(ProjectExperienceForm),
      isShow: true,
    },
    {
      index: 5,
      moduleKey: "skills",
      label: "技能特长",
      component: shallowRef(SkillsSection),
      formComponent: shallowRef(SkillsForm),
      isShow: true,
    },
    {
      index: 6,
      moduleKey: "certificates",
      label: "证书经历",
      component: shallowRef(CertificatesSection),
      formComponent: shallowRef(CertificatesForm),
      isShow: true,
    },
    {
      index: 7,
      moduleKey: "selfEvaluation",
      label: "自我评价",
      component: shallowRef(SelfEvaluationSection),
      formComponent: shallowRef(SelfEvaluationForm),
      isShow: true,
    },
  ]);
  //控制抽屉展开/收起
  const isExpanded = ref(false);
  //当前选中的模板
  const currentTemplate = ref<templateType>("default");
  /**
   * 设置当前选中的模块
   * @param moduleKey 模块键值
   */
  const setCurrentModel = (moduleKey: string) => {
    currentModule.value = moduleKey;
  };
  /**
   * 设置抽屉展开/收起状态
   * @param value 展开状态值
   */
  const setIsExpanded = (value: boolean) => {
    isExpanded.value = value;
  };
  /**
   * 设置当前选中的模板
   * @param template 模板类型
   */
  const setCurrentTemplate = (template: templateType) => {
    currentTemplate.value = template;
  };
  /**
   * 修改简历字符串类型数据
   * @param key 数据键值
   * @param value 数据值
   */
  const setResumeDataString = (key: keyof ResumeData, value: any) => {
    if (typeof resumeData.value[key] === "string") {
      resumeData.value[key] = value;
    }
  };
  /**
   * 创建简历
   */
  const createResume = async () => {
    const res = await createResumeAPI();
    resumeData.value = res.data;
  };
  /**
   * 保存简历(修改)
   */
  const saveResume = async (id: string) => {
    const res = await updateResumeAPI(id, resumeData.value);
    resumeData.value = res.data;
  };

  /**
   * 获取简历详情
   */
  const getResumeDetail = async (id: string) => {
    const res = await getResumeDetailAPI(id);
    resumeData.value = res.data;
  };

  const setGlobalStyle = (data: Partial<GlobalStyle>) => {
    resumeData.value.globalStyle = {
      ...resumeData.value.globalStyle,
      ...data,
    };
  };

  const setBasicInfo = (data: Partial<BasicInfo>) => {
    resumeData.value.basicInfo = { ...resumeData.value.basicInfo, ...data };
  };

  const setJobIntention = (data: Partial<JobIntention>) => {
    resumeData.value.jobIntention = {
      ...resumeData.value.jobIntention,
      ...data,
    } as JobIntention;
  };

  // Education
  const addEducation = () => {
    resumeData.value.educationBackground.push({
      schoolName: "",
      major: "",
      degree: "",
      enrollmentTime: "",
      graduationTime: "",
      content: "",
    });
  };

  const removeEducation = (index: number) => {
    resumeData.value.educationBackground.splice(index, 1);
  };

  const updateEducation = (
    index: number,
    data: Partial<EducationBackground>,
  ) => {
    const item = resumeData.value.educationBackground[index];
    if (item) {
      resumeData.value.educationBackground[index] = { ...item, ...data };
    }
  };

  const moveEducation = (index: number, direction: "up" | "down") => {
    console.log("move", index, direction);
  };

  // Work Experience
  const addWorkExperience = () => {
    if (!resumeData.value.workExperience) resumeData.value.workExperience = [];
    resumeData.value.workExperience.push({
      companyName: "",
      position: "",
      workTime: "",
      dismissalTime: "",
      workDescription: "",
    });
  };

  const removeWorkExperience = (index: number) => {
    if (resumeData.value.workExperience) {
      resumeData.value.workExperience.splice(index, 1);
    }
  };

  const updateWorkExperience = (
    index: number,
    data: Partial<WorkExperience>,
  ) => {
    if (
      resumeData.value.workExperience &&
      resumeData.value.workExperience[index]
    ) {
      resumeData.value.workExperience[index] = {
        ...resumeData.value.workExperience[index],
        ...data,
      };
    }
  };

  const moveWorkExperience = (index: number, direction: "up" | "down") => {
    console.log("move", index, direction);
  };

  // Project Experience
  const addProjectExperience = () => {
    if (!resumeData.value.projectExperience)
      resumeData.value.projectExperience = [];
    resumeData.value.projectExperience.push({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      content: "",
    });
  };

  const removeProjectExperience = (index: number) => {
    if (resumeData.value.projectExperience) {
      resumeData.value.projectExperience.splice(index, 1);
    }
  };

  const updateProjectExperience = (
    index: number,
    data: Partial<ProjectExperience>,
  ) => {
    if (
      resumeData.value.projectExperience &&
      resumeData.value.projectExperience[index]
    ) {
      resumeData.value.projectExperience[index] = {
        ...resumeData.value.projectExperience[index],
        ...data,
      };
    }
  };

  const moveProjectExperience = (index: number, direction: "up" | "down") => {
    console.log("move", index, direction);
  };

  return {
    resumeData,
    currentModule,
    moduleOrder,
    isExpanded,
    currentTemplate,
    setCurrentModel,
    setIsExpanded,
    setCurrentTemplate,
    setResumeDataString,
    createResume,
    saveResume,
    getResumeDetail,
    setBasicInfo,
    setJobIntention,
    addEducation,
    removeEducation,
    updateEducation,
    moveEducation,
    addWorkExperience,
    removeWorkExperience,
    updateWorkExperience,
    moveWorkExperience,
    addProjectExperience,
    removeProjectExperience,
    updateProjectExperience,
    moveProjectExperience,
    setGlobalStyle,
  };
});
