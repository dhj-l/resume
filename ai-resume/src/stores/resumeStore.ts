import { computed, ref, shallowRef, watch } from "vue";

import { defineStore } from "pinia";

import { createResumeAPI, getResumeDetailAPI, updateResumeAPI } from "@/api/resume/resume";
import BasicInfoForm from "@/views/editor/components/drawer/BasicInfoForm.vue";
import CampusExperienceForm from "@/views/editor/components/drawer/CampusExperienceForm.vue";
import CertificatesForm from "@/views/editor/components/drawer/CertificatesForm.vue";
import EducationForm from "@/views/editor/components/drawer/EducationForm.vue";
import InternshipExperienceForm from "@/views/editor/components/drawer/InternshipExperienceForm.vue";
import JobIntentionForm from "@/views/editor/components/drawer/JobIntentionForm.vue";
import ProjectExperienceForm from "@/views/editor/components/drawer/ProjectExperienceForm.vue";
import SelfEvaluationForm from "@/views/editor/components/drawer/SelfEvaluationForm.vue";
import SkillsForm from "@/views/editor/components/drawer/SkillsForm.vue";
import WorkExperienceForm from "@/views/editor/components/drawer/WorkExperienceForm.vue";
import CampusExperienceSection from "@/views/editor/components/preview/CampusExperienceSection.vue";
import CertificatesSection from "@/views/editor/components/preview/CertificatesSection.vue";
import EducationBackgroundSection from "@/views/editor/components/preview/EducationBackgroundSection.vue";
import InternshipExperienceSection from "@/views/editor/components/preview/InternshipExperienceSection.vue";
import ProjectExperienceSection from "@/views/editor/components/preview/ProjectExperienceSection.vue";
import SelfEvaluationSection from "@/views/editor/components/preview/SelfEvaluationSection.vue";
import SkillsSection from "@/views/editor/components/preview/SkillsSection.vue";
import type { templateType } from "@/views/editor/components/preview/type";
import WorkExperienceSection from "@/views/editor/components/preview/WorkExperienceSection.vue";
import { mockResumeData } from "@/views/editor/data/mockData";

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
  SortableModule,
} from "./type";

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
const MAX_GLOBAL_SORT = Number.MAX_SAFE_INTEGER;
const FIXED_MODULES = ["basicInfo", "jobIntention"] as const;

const isFixedModule = (moduleKey: string): boolean => {
  return FIXED_MODULES.includes(moduleKey as any);
};

const getGlobalSortFromResumeData = (resumeData: ResumeData, moduleKey: string): number => {
  const moduleData = (resumeData as any)[moduleKey];

  if (moduleData === null || moduleData === undefined) {
    return MAX_GLOBAL_SORT;
  }

  if (Array.isArray(moduleData)) {
    if (moduleData.length === 0) {
      return MAX_GLOBAL_SORT;
    }
    return moduleData[0]?.globalSort ?? MAX_GLOBAL_SORT;
  }

  if (typeof moduleData === "object") {
    const keys = Object.keys(moduleData);
    if (keys.length === 0) {
      return MAX_GLOBAL_SORT;
    }
    return moduleData.globalSort ?? MAX_GLOBAL_SORT;
  }

  return MAX_GLOBAL_SORT;
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

  const initializeModuleOrder = () => {
    syncModuleOrderWithResumeData();
  };

  const syncModuleOrderWithResumeData = () => {
    moduleOrder.value.forEach((module) => {
      module.globalSort = getGlobalSortFromResumeData(resumeData.value, module.moduleKey);
    });

    const basicInfoModule = moduleOrder.value.find((m) => m.moduleKey === "basicInfo");
    const jobIntentionModule = moduleOrder.value.find((m) => m.moduleKey === "jobIntention");
    const otherModules = moduleOrder.value.filter((m) => !isFixedModule(m.moduleKey));

    otherModules.sort((a, b) => a.globalSort - b.globalSort);

    moduleOrder.value = [
      ...(basicInfoModule ? [basicInfoModule] : []),
      ...(jobIntentionModule ? [jobIntentionModule] : []),
      ...otherModules,
    ];
  };

  const getResumeDetail = async (id: string) => {
    const res = await getResumeDetailAPI(id);
    resumeData.value = res.data;
    initializeModuleOrder();
  };

  watch(
    () => [
      resumeData.value.educationBackground,
      resumeData.value.workExperience,
      resumeData.value.projectExperience,
      resumeData.value.campusExperience,
      resumeData.value.internshipExperience,
      resumeData.value.skills,
      resumeData.value.certificates,
      resumeData.value.selfEvaluation,
    ],
    () => {
      syncModuleOrderWithResumeData();
    },
    { deep: true },
  );

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

  const setSkills = (data: Partial<SortableModule>) => {
    resumeData.value.skills = {
      ...resumeData.value.skills,
      ...data,
    } as SortableModule;
  };

  const setCertificates = (data: Partial<SortableModule>) => {
    resumeData.value.certificates = {
      ...resumeData.value.certificates,
      ...data,
    } as SortableModule;
  };

  const setSelfEvaluation = (data: Partial<SortableModule>) => {
    resumeData.value.selfEvaluation = {
      ...resumeData.value.selfEvaluation,
      ...data,
    } as SortableModule;
  };

  const addEducation = () => {
    addItem("educationBackground", {
      schoolName: "",
      major: "",
      degree: "",
      enrollmentTime: "",
      graduationTime: "",
      content: "",
    });
  };

  const removeEducation = (index: number) => {
    removeItem("educationBackground", index);
  };

  const updateEducation = (index: number, data: Partial<EducationBackground>) => {
    updateItem("educationBackground", index, data);
  };

  const moveItem = (key: keyof ResumeData, index: number, direction: "up" | "down") => {
    const list = resumeData.value[key] as any;
    if (!list || list.length <= 1) return;

    let targetIndex: number;
    if (direction === "up") {
      if (index === 0) return;
      targetIndex = index - 1;
    } else {
      if (index === list.length - 1) return;
      targetIndex = index + 1;
    }

    const tempLocalSort = list[index]?.localSort ?? 0;
    list[index]!.localSort = list[targetIndex]?.localSort ?? 0;
    list[targetIndex]!.localSort = tempLocalSort;

    list.sort((a: any, b: any) => (a.localSort ?? 0) - (b.localSort ?? 0));
  };

  const removeItem = (key: keyof ResumeData, index: number) => {
    const list = resumeData.value[key] as any;
    if (!list || list.length === 0) return;
    if (index < 0 || index >= list.length) return;
    list.splice(index, 1);
  };

  const updateItem = (key: keyof ResumeData, index: number, data: any) => {
    const list = resumeData.value[key] as any;
    if (!list || !list[index]) return;
    list[index] = { ...list[index], ...data };
  };

  const addItem = (key: keyof ResumeData, initialData: any) => {
    let list = resumeData.value[key] as any;
    if (!list) {
      list = [];
      (resumeData.value as any)[key] = list;
    }

    const newLocalSort =
      list.length > 0 ? Math.max(...list.map((item: any) => item.localSort ?? 0)) + 1 : 0;

    const newItem = {
      ...initialData,
      localSort: newLocalSort,
    };

    if (list.length > 0 && list[0]?.globalSort !== undefined) {
      newItem.globalSort = list[0].globalSort;
    }

    list.push(newItem);
  };

  const moveEducation = (index: number, direction: "up" | "down") => {
    moveItem("educationBackground", index, direction);
  };

  const addWorkExperience = () => {
    addItem("workExperience", {
      companyName: "",
      position: "",
      workTime: "",
      dismissalTime: "",
      workDescription: "",
    });
  };

  const removeWorkExperience = (index: number) => {
    removeItem("workExperience", index);
  };

  const updateWorkExperience = (index: number, data: Partial<WorkExperience>) => {
    updateItem("workExperience", index, data);
  };

  const moveWorkExperience = (index: number, direction: "up" | "down") => {
    moveItem("workExperience", index, direction);
  };

  const addProjectExperience = () => {
    addItem("projectExperience", {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      content: "",
    });
  };

  const removeProjectExperience = (index: number) => {
    removeItem("projectExperience", index);
  };

  const updateProjectExperience = (index: number, data: Partial<ProjectExperience>) => {
    updateItem("projectExperience", index, data);
  };

  const moveProjectExperience = (index: number, direction: "up" | "down") => {
    moveItem("projectExperience", index, direction);
  };

  const addCampusExperience = () => {
    addItem("campusExperience", {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      content: "",
    });
  };

  const removeCampusExperience = (index: number) => {
    removeItem("campusExperience", index);
  };

  const updateCampusExperience = (index: number, data: Partial<CampusExperience>) => {
    updateItem("campusExperience", index, data);
  };

  const moveCampusExperience = (index: number, direction: "up" | "down") => {
    moveItem("campusExperience", index, direction);
  };

  const addInternshipExperience = () => {
    addItem("internshipExperience", {
      companyName: "",
      position: "",
      startTime: "",
      endTime: "",
      description: "",
    });
  };

  const removeInternshipExperience = (index: number) => {
    removeItem("internshipExperience", index);
  };

  const updateInternshipExperience = (index: number, data: Partial<InternshipExperience>) => {
    updateItem("internshipExperience", index, data);
  };

  const moveInternshipExperience = (index: number, direction: "up" | "down") => {
    moveItem("internshipExperience", index, direction);
  };

  const updateModuleContent = (
    key: keyof ResumeData,
    contentField: string,
    content: string,
    index?: number,
  ) => {
    const moduleData = resumeData.value[key];
    if (index !== undefined && Array.isArray(moduleData)) {
      const list = moduleData as any[];
      if (list[index]) {
        list[index] = { ...list[index], [contentField]: content };
      }
    } else if (typeof moduleData === "object" && moduleData !== null) {
      (moduleData as Record<string, any>)[contentField] = content;
    }
  };

  const changeGlobalSort = (moduleKeyA: string, moduleKeyB: string) => {
    const moduleA = (resumeData.value as any)[moduleKeyA];
    const moduleB = (resumeData.value as any)[moduleKeyB];

    const tempGlobalSortA = Array.isArray(moduleA)
      ? moduleA[0]?.globalSort || 0
      : moduleA?.globalSort || 0;
    const tempGlobalSortB = Array.isArray(moduleB)
      ? moduleB[0]?.globalSort || 0
      : moduleB?.globalSort || 0;
    if (Array.isArray(moduleA)) {
      moduleA.forEach((item) => {
        item.globalSort = tempGlobalSortB;
      });
    } else {
      moduleA.globalSort = tempGlobalSortB;
    }
    if (Array.isArray(moduleB)) {
      moduleB.forEach((item) => {
        item.globalSort = tempGlobalSortA;
      });
    } else {
      moduleB.globalSort = tempGlobalSortA;
    }
  };

  const swapModuleOrder = (moduleKeyA: string, moduleKeyB: string) => {
    if (isFixedModule(moduleKeyA) || isFixedModule(moduleKeyB)) {
      return false;
    }
    const indexA = moduleOrder.value.findIndex((m) => m.moduleKey === moduleKeyA);
    const indexB = moduleOrder.value.findIndex((m) => m.moduleKey === moduleKeyB);
    if (indexA === -1 || indexB === -1) return false;
    const tempGlobalSort = moduleOrder.value[indexA]?.globalSort;
    moduleOrder.value[indexA]!.globalSort = moduleOrder.value[indexB]?.globalSort || 0;
    moduleOrder.value[indexB]!.globalSort = tempGlobalSort || 0;
    moduleOrder.value.sort((a, b) => a.globalSort - b.globalSort);

    changeGlobalSort(moduleKeyA, moduleKeyB);
    syncModuleOrderWithResumeData();
    return true;
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
    setSkills,
    setCertificates,
    setSelfEvaluation,
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
    updateModuleContent,
  };
});
