<template>
  <div class="relative mx-auto w-full max-w-[210mm]">
    <!-- 计算层：隐藏 -->
    <div class="absolute top-0 left-0 w-full opacity-0 -z-50 pointer-events-none">
      <!-- 左侧计算层 -->
      <div
        ref="leftContentRef"
        class="w-[32%] flex flex-col"
        :style="{
          padding: globalPageMargin,
          gap: globalModuleMargin,
          fontSize: globalFontSize,
          lineHeight: globalLineHeight,
        }"
      >
        <div data-id="basicInfo">
          <BasicInfoSection
            :data="resumeData!.basicInfo"
            :label="basicInfoModule?.label"
            :template-type="currentTemplateType"
          />
        </div>
        <div v-for="item in leftModules" :key="item.moduleKey" :data-id="item.moduleKey">
          <component
            :is="item.component"
            v-if="item.isShow && item.component"
            :data="resumeData?.[item.moduleKey]"
            :label="item.label"
            :template-type="currentTemplateType"
          />
        </div>
      </div>
      <!-- 右侧计算层 -->
      <div
        ref="rightContentRef"
        class="w-[68%] flex flex-col"
        :style="{
          padding: globalPageMargin,
          gap: globalModuleMargin,
          fontSize: globalFontSize,
          lineHeight: globalLineHeight,
        }"
      >
        <div data-id="jobIntention">
          <JobIntentionSection
            :data="resumeData!.jobIntention"
            :label="jobIntentionModule?.label"
            :template-type="currentTemplateType"
          />
        </div>
        <div v-for="item in rightModules" :key="item.moduleKey" :data-id="item.moduleKey">
          <component
            :is="item.component"
            v-if="item.isShow && item.component"
            :data="resumeData?.[item.moduleKey]"
            :label="item.label"
            :template-type="currentTemplateType"
          />
        </div>
      </div>
    </div>

    <!-- 展示层：分页 -->
    <div
      v-for="(page, index) in mergedPages"
      :key="index"
      class="resume-page w-full h-[1122px] bg-white shadow-lg mx-auto flex box-border overflow-hidden mb-8"
      :style="{
        fontSize: globalFontSize,
        lineHeight: globalLineHeight,
      }"
    >
      <!-- 左侧 -->
      <div
        class="w-[32%] bg-slate-50 flex flex-col shrink-0 border-r border-gray-100"
        :style="{
          padding: globalPageMargin,
          gap: globalModuleMargin,
        }"
      >
        <template v-for="moduleId in page.left" :key="moduleId">
          <BasicInfoSection
            v-if="moduleId === 'basicInfo'"
            :data="resumeData!.basicInfo"
            :label="basicInfoModule?.label"
            :template-type="currentTemplateType"
          />
          <component
            :is="leftModuleByKey.get(moduleId)!.component"
            v-else-if="leftModuleByKey.get(moduleId)"
            :data="(resumeData as any)[moduleId]"
            :label="leftModuleByKey.get(moduleId)!.label"
            :template-type="currentTemplateType"
            draggable="true"
          />
        </template>
      </div>

      <!-- 右侧 -->
      <div
        class="flex-1 flex flex-col min-w-0"
        :style="{
          padding: globalPageMargin,
          gap: globalModuleMargin,
        }"
      >
        <template v-for="moduleId in page.right" :key="moduleId">
          <JobIntentionSection
            v-if="moduleId === 'jobIntention'"
            :data="resumeData!.jobIntention"
            :label="jobIntentionModule?.label"
            :template-type="currentTemplateType"
          />
          <component
            :is="rightModuleByKey.get(moduleId)!.component"
            v-else-if="rightModuleByKey.get(moduleId)"
            :data="(resumeData as any)[moduleId]"
            :label="rightModuleByKey.get(moduleId)!.label"
            :template-type="currentTemplateType"
            draggable="true"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed, ref } from "vue";

import { storeToRefs } from "pinia";

import { useResumeStore } from "@/stores/resumeStore";
import type { ResumeData, ModuleItem } from "@/stores/type";
import BasicInfoSection from "@/views/editor/components/preview/BasicInfoSection.vue";
import JobIntentionSection from "@/views/editor/components/preview/JobIntentionSection.vue";
import { useActiveModules } from "@/views/editor/hooks/useActiveModules";
import { usePagination } from "@/views/editor/hooks/usePagination";

const {
  moduleOrder,
  currentTemplateType,
  globalPageMargin,
  globalFontSize,
  globalLineHeight,
  globalModuleMargin,
} = storeToRefs(useResumeStore());
const resumeData = ref(inject<ResumeData>("resumeData")!);

const leftModuleKeys = ["skills", "certificates", "selfEvaluation"];
const rightModuleKeys = [
  "educationBackground",
  "workExperience",
  "projectExperience",
  "campusExperience",
  "internshipExperience",
];

const basicInfoModule = computed(() => moduleOrder.value.find((m) => m.moduleKey === "basicInfo"));
const jobIntentionModule = computed(() =>
  moduleOrder.value.find((m) => m.moduleKey === "jobIntention"),
);

const { activeModules } = useActiveModules(moduleOrder, resumeData);

const leftModules = computed(() => {
  return activeModules.value.filter((item) => leftModuleKeys.includes(item.moduleKey));
});

const rightModules = computed(() => {
  return activeModules.value.filter((item) => rightModuleKeys.includes(item.moduleKey));
});

const leftModuleByKey = computed(() => {
  const map = new Map<string, ModuleItem>();
  for (const item of leftModules.value) {
    map.set(item.moduleKey, item);
  }
  return map;
});

const rightModuleByKey = computed(() => {
  const map = new Map<string, ModuleItem>();
  for (const item of rightModules.value) {
    map.set(item.moduleKey, item);
  }
  return map;
});

// 分页逻辑
const leftContentRef = ref<HTMLElement | null>(null);
const rightContentRef = ref<HTMLElement | null>(null);

const moduleGap = computed(() => {
  return parseFloat(globalModuleMargin.value) || 0;
});

const pagePadding = computed(() => {
  return (parseFloat(globalPageMargin.value) || 0) * 2;
});

const { pages: leftPages } = usePagination(leftContentRef, resumeData, {
  contentPadding: pagePadding,
  gap: moduleGap,
});
const { pages: rightPages } = usePagination(rightContentRef, resumeData, {
  contentPadding: pagePadding,
  gap: moduleGap,
});

const mergedPages = computed(() => {
  const maxLen = Math.max(leftPages.value.length, rightPages.value.length);
  const result = [];
  for (let i = 0; i < maxLen; i++) {
    const page = {
      left: leftPages.value[i] || [],
      right: rightPages.value[i] || [],
    };
    result.push(page);
  }
  return result.filter((page) => page.left.length > 0 || page.right.length > 0);
});
</script>

<style scoped>
/* 针对侧边栏的基本信息样式微调 */
:deep(.resume-section) {
  margin-bottom: 0 !important; /* 移除组件自带的 margin-bottom，由 flex gap 控制 */
}
</style>
