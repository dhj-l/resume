import { defineStore } from "pinia";
import { computed, ref, shallowRef } from "vue";
import type {
  ModuleItem,
  ResumeData,
  BasicInfo,
  JobIntention,
  EducationBackground,
  WorkExperience,
  ProjectExperience,
  CampusExperience,
  InternshipExperience,
  GlobalStyle,
  ModuleOrderConfig,
} from "./type";
import { mockResumeData } from "@/views/editor/data/mockData";

import EducationBackgroundSection from "@/views/editor/components/preview/EducationBackgroundSection.vue";
import WorkExperienceSection from "@/views/editor/components/preview/WorkExperienceSection.vue";
import ProjectExperienceSection from "@/views/editor/components/preview/ProjectExperienceSection.vue";
import CampusExperienceSection from "@/views/editor/components/preview/CampusExperienceSection.vue";
import InternshipExperienceSection from "@/views/editor/components/preview/InternshipExperienceSection.vue";
import SkillsSection from "@/views/editor/components/preview/SkillsSection.vue";
import CertificatesSection from "@/views/editor/components/preview/CertificatesSection.vue";
import SelfEvaluationSection from "@/views/editor/components/preview/SelfEvaluationSection.vue";
import BasicInfoForm from "@/views/editor/components/drawer/BasicInfoForm.vue";
import JobIntentionForm from "@/views/editor/components/drawer/JobIntentionForm.vue";
import EducationForm from "@/views/editor/components/drawer/EducationForm.vue";
import type { templateType } from "@/views/editor/components/preview/type";
import WorkExperienceForm from "@/views/editor/components/drawer/WorkExperienceForm.vue";
import ProjectExperienceForm from "@/views/editor/components/drawer/ProjectExperienceForm.vue";
import CampusExperienceForm from "@/views/editor/components/drawer/CampusExperienceForm.vue";
import InternshipExperienceForm from "@/views/editor/components/drawer/InternshipExperienceForm.vue";
import SkillsForm from "@/views/editor/components/drawer/SkillsForm.vue";
import CertificatesForm from "@/views/editor/components/drawer/CertificatesForm.vue";
import SelfEvaluationForm from "@/views/editor/components/drawer/SelfEvaluationForm.vue";
import {
  createResumeAPI,
  getResumeDetailAPI,
  updateResumeAPI,
} from "@/api/resume/resume";

const DEFAULT_MODULE_ORDER: ModuleItem[] = [
  {
    moduleKey: "basicInfo",
    label: "基本信息",
    component: null,
    formComponent: shallowRef(BasicInfoForm),
    isShow: true,
    globalSort: 0,
  },
  {
    moduleKey: "jobIntention",
    label: "求职意向",
    component: null,
    formComponent: shallowRef(JobIntentionForm),
    isShow: true,
    globalSort: 1,
  },
  {
    moduleKey: "educationBackground",
    label: "教育背景",
    component: shallowRef(EducationBackgroundSection),
    formComponent: shallowRef(EducationForm),
    isShow: true,
    globalSort: 2,
  },
  {
    moduleKey: "workExperience",
    label: "工作经验",
    component: shallowRef(WorkExperienceSection),
    formComponent: shallowRef(WorkExperienceForm),
    isShow: true,
    globalSort: 3,
  },
  {
    moduleKey: "projectExperience",
    label: "项目经历",
    component: shallowRef(ProjectExperienceSection),
    formComponent: shallowRef(ProjectExperienceForm),
    isShow: true,
    globalSort: 4,
  },
  {
    moduleKey: "campusExperience",
    label: "校园经历",
    component: shallowRef(CampusExperienceSection),
    formComponent: shallowRef(CampusExperienceForm),
    isShow: true,
    globalSort: 5,
  },
  {
    moduleKey: "internshipExperience",
    label: "实习经历",
    component: shallowRef(InternshipExperienceSection),
    formComponent: shallowRef(InternshipExperienceForm),
    isShow: true,
    globalSort: 6,
  },
  {
    moduleKey: "skills",
    label: "技能特长",
    component: shallowRef(SkillsSection),
    formComponent: shallowRef(SkillsForm),
    isShow: true,
    globalSort: 7,
  },
  {
    moduleKey: "certificates",
    label: "证书经历",
    component: shallowRef(CertificatesSection),
    formComponent: shallowRef(CertificatesForm),
    isShow: true,
    globalSort: 8,
  },
  {
    moduleKey: "selfEvaluation",
    label: "自我评价",
    component: shallowRef(SelfEvaluationSection),
    formComponent: shallowRef(SelfEvaluationForm),
    isShow: true,
    globalSort: 9,
  },
];

const FIXED_MODULES = ["basicInfo", "jobIntention"] as const;

const isFixedModule = (moduleKey: string): boolean => {
  return FIXED_MODULES.includes(moduleKey as any);
};

export const useResumeStore = defineStore("resume", () => {
  const resumeData = ref<ResumeData>(mockResumeData);
  const currentModule = ref<string>("basicInfo");
  const moduleOrder = ref<ModuleItem[]>([...DEFAULT_MODULE_ORDER]);
  const isExpanded = ref(false);

  const currentTemplateType = computed(() => {
    return resumeData.value.type || "default";
  });

  const globalPageMargin = computed(() => {
    return resumeData.value.globalStyle?.pageMargin || "12px";
  });

  const globalFontSize = computed(() => {
    return resumeData.value.globalStyle?.fontSize || "12px";
  });

  const globalLineHeight = computed(() => {
    return resumeData.value.globalStyle?.lineHeight || "20px";
  });

  const globalModuleMargin = computed(() => {
    return resumeData.value.globalStyle?.moduleMargin || "12px";
  });

  const setCurrentModel = (moduleKey: string) => {
    currentModule.value = moduleKey;
  };

  const setIsExpanded = (value: boolean) => {
    isExpanded.value = value;
  };

  const setCurrentTemplate = (template: templateType) => {
    console.log(template);
    resumeData.value.type = template;
  };

  const setResumeDataString = (key: keyof ResumeData, value: any) => {
    if (typeof resumeData.value[key] === "string") {
      resumeData.value[key] = value;
    }
  };

  const createResume = async () => {
    const res = await createResumeAPI();
    resumeData.value = res.data;
  };

  const saveResume = async () => {
    const res = await updateResumeAPI(resumeData.value._id, resumeData.value);
    resumeData.value = res.data;
  };

  const initializeModuleOrder = (config?: ModuleOrderConfig[]) => {
    if (config && config.length > 0) {
      config.forEach((item) => {
        const module = moduleOrder.value.find(
          (m) => m.moduleKey === item.moduleKey,
        );
        if (module) {
          module.globalSort = item.globalSort;
        }
      });
    }
    moduleOrder.value.sort((a, b) => a.globalSort - b.globalSort);
  };

  const getResumeDetail = async (id: string) => {
    const res = await getResumeDetailAPI(id);
    resumeData.value = res.data;
    initializeModuleOrder(res.data.moduleOrderConfig);
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

  const addCampusExperience = () => {
    if (!resumeData.value.campusExperience)
      resumeData.value.campusExperience = [];
    resumeData.value.campusExperience.push({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      content: "",
    });
  };

  const removeCampusExperience = (index: number) => {
    if (resumeData.value.campusExperience) {
      resumeData.value.campusExperience.splice(index, 1);
    }
  };

  const updateCampusExperience = (
    index: number,
    data: Partial<CampusExperience>,
  ) => {
    if (
      resumeData.value.campusExperience &&
      resumeData.value.campusExperience[index]
    ) {
      resumeData.value.campusExperience[index] = {
        ...resumeData.value.campusExperience[index],
        ...data,
      };
    }
  };

  const moveCampusExperience = (index: number, direction: "up" | "down") => {
    console.log("move", index, direction);
  };

  const addInternshipExperience = () => {
    if (!resumeData.value.internshipExperience)
      resumeData.value.internshipExperience = [];
    resumeData.value.internshipExperience.push({
      companyName: "",
      position: "",
      startTime: "",
      endTime: "",
      description: "",
    });
  };

  const removeInternshipExperience = (index: number) => {
    if (resumeData.value.internshipExperience) {
      resumeData.value.internshipExperience.splice(index, 1);
    }
  };

  const updateInternshipExperience = (
    index: number,
    data: Partial<InternshipExperience>,
  ) => {
    if (
      resumeData.value.internshipExperience &&
      resumeData.value.internshipExperience[index]
    ) {
      resumeData.value.internshipExperience[index] = {
        ...resumeData.value.internshipExperience[index],
        ...data,
      };
    }
  };

  const moveInternshipExperience = (
    index: number,
    direction: "up" | "down",
  ) => {
    console.log("move", index, direction);
  };

  const swapModuleOrder = (moduleKeyA: string, moduleKeyB: string) => {
    // if (isFixedModule(moduleKeyA) || isFixedModule(moduleKeyB)) {
    //   return false;
    // }
    // const indexA = moduleOrder.value.findIndex(
    //   (m) => m.moduleKey === moduleKeyA,
    // );
    // const indexB = moduleOrder.value.findIndex(
    //   (m) => m.moduleKey === moduleKeyB,
    // );
    // if (indexA === -1 || indexB === -1) return false;
    // const tempGlobalSort = moduleOrder.value[indexA].globalSort;
    // moduleOrder.value[indexA].globalSort = moduleOrder.value[indexB].globalSort;
    // moduleOrder.value[indexB].globalSort = tempGlobalSort;
    // moduleOrder.value.sort((a, b) => a.globalSort - b.globalSort);
    // return true;
  };

  return {
    resumeData,
    currentModule,
    moduleOrder,
    isExpanded,
    currentTemplateType,
    globalPageMargin,
    globalFontSize,
    globalLineHeight,
    globalModuleMargin,
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
    addCampusExperience,
    removeCampusExperience,
    updateCampusExperience,
    moveCampusExperience,
    addInternshipExperience,
    removeInternshipExperience,
    updateInternshipExperience,
    moveInternshipExperience,
    setGlobalStyle,
    swapModuleOrder,
    initializeModuleOrder,
  };
});
