import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";
import type { ModuleItem, ResumeData } from "./type";
import { mockResumeData } from "@/views/editor/data/mockData";
import BasicInfoSection from "@/views/editor/components/preview/BasicInfoSection.vue";
import JobIntentionSection from "@/views/editor/components/preview/JobIntentionSection.vue";
import EducationBackgroundSection from "@/views/editor/components/preview/EducationBackgroundSection.vue";
import WorkExperienceSection from "@/views/editor/components/preview/WorkExperienceSection.vue";
import ProjectExperienceSection from "@/views/editor/components/preview/ProjectExperienceSection.vue";
import SkillsSection from "@/views/editor/components/preview/SkillsSection.vue";
import CertificatesSection from "@/views/editor/components/preview/CertificatesSection.vue";
import SelfEvaluationSection from "@/views/editor/components/preview/SelfEvaluationSection.vue";
import BasicInfoForm from "@/views/editor/components/drawer/BasicInfoForm.vue";
import EducationForm from "@/views/editor/components/drawer/EducationForm.vue";

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
      component: shallowRef(BasicInfoSection),
      formComponent: shallowRef(BasicInfoForm),
      isShow: true,
    },
    {
      index: 1,
      moduleKey: "jobIntention",
      label: "求职意向",
      component: shallowRef(JobIntentionSection),
      formComponent: shallowRef(null),
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
      formComponent: shallowRef(null),
      isShow: true,
    },
    {
      index: 4,
      moduleKey: "projectExperience",
      label: "项目经历",
      component: shallowRef(ProjectExperienceSection),
      formComponent: shallowRef(null),
      isShow: true,
    },
    {
      index: 5,
      moduleKey: "skills",
      label: "技能特长",
      component: shallowRef(SkillsSection),
      formComponent: shallowRef(null),
      isShow: true,
    },
    {
      index: 6,
      moduleKey: "certificates",
      label: "证书经历",
      component: shallowRef(CertificatesSection),
      formComponent: shallowRef(null),
      isShow: true,
    },
    {
      index: 7,
      moduleKey: "selfEvaluation",
      label: "自我评价",
      component: shallowRef(SelfEvaluationSection),
      formComponent: shallowRef(null),
      isShow: true,
    },
  ]);
  //控制抽屉展开/收起
  const isExpanded = ref(false);
  const currentTemplate = ref<string>("default");
  const setCurrentModel = (moduleKey: string) => {
    currentModule.value = moduleKey;
  };
  const setIsExpanded = (value: boolean) => {
    isExpanded.value = value;
  };
  return {
    resumeData,
    currentModule,
    moduleOrder,
    isExpanded,
    currentTemplate,
    setCurrentModel,
    setIsExpanded,
  };
});
