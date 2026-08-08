import { computed, type Ref } from "vue";

import {
  DEFAULT_MODULE_ORDER,
  getGlobalSortFromResumeData,
  isFixedModule,
} from "@/stores/resumeStore";
import type { ModuleItem, ResumeData } from "@/stores/type";
import type { templateType } from "@/views/editor/components/preview/type";

/**
 * 从简历数据派生预览所需的视图状态。
 *
 * 编辑器与对比页共用同一套模板组件渲染简历；
 * 当传入独立数据源（如对比页的 AI 草稿）时，模板样式与模块排序
 * 均以该数据为准，而不是全局 resumeStore。
 */
export interface ResumeView {
  moduleOrder: Ref<ModuleItem[]>;
  currentTemplateType: Ref<templateType>;
  globalPageMargin: Ref<string>;
  globalFontSize: Ref<string>;
  globalLineHeight: Ref<string>;
  globalModuleMargin: Ref<string>;
}

function buildModuleOrder(resumeData: ResumeData): ModuleItem[] {
  const order = DEFAULT_MODULE_ORDER.map((module) => ({ ...module }));
  for (const module of order) {
    module.globalSort = getGlobalSortFromResumeData(resumeData, module.moduleKey, {});
  }

  const basicInfoModule = order.find((m) => m.moduleKey === "basicInfo");
  const jobIntentionModule = order.find((m) => m.moduleKey === "jobIntention");
  const otherModules = order
    .filter((m) => !isFixedModule(m.moduleKey))
    .sort((a, b) => a.globalSort - b.globalSort);

  return [
    ...(basicInfoModule ? [basicInfoModule] : []),
    ...(jobIntentionModule ? [jobIntentionModule] : []),
    ...otherModules,
  ];
}

export function useResumeView(data: Ref<ResumeData>): ResumeView {
  const currentTemplateType = computed<templateType>(() => data.value.type || "default");
  const globalPageMargin = computed(() => data.value.globalStyle?.pageMargin || "12px");
  const globalFontSize = computed(() => data.value.globalStyle?.fontSize || "12px");
  const globalLineHeight = computed(() => data.value.globalStyle?.lineHeight || "1.5");
  const globalModuleMargin = computed(() => data.value.globalStyle?.moduleMargin || "12px");
  const moduleOrder = computed(() => buildModuleOrder(data.value));

  return {
    moduleOrder,
    currentTemplateType,
    globalPageMargin,
    globalFontSize,
    globalLineHeight,
    globalModuleMargin,
  };
}
