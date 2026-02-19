<template>
  <div class="relative mx-auto w-full max-w-[210mm]">
    <!-- 计算层：隐藏 -->
    <div
      class="absolute top-0 left-0 w-full opacity-0 -z-50 pointer-events-none"
    >
      <!-- 左侧计算层 -->
      <div
        ref="leftContentRef"
        class="w-[32%] flex flex-col"
        :style="{
          padding: resumeData.globalStyle.pageMargin,
          gap: resumeData.globalStyle.moduleMargin,
          fontSize: resumeData.globalStyle.fontSize,
          lineHeight: resumeData.globalStyle.lineHeight,
        }"
      >
        <div data-id="basicInfo">
          <BasicInfoSection
            :data="resumeData!.basicInfo"
            :label="basicInfoModule?.label"
            :template-type="currentTemplateType"
          />
        </div>
        <div
          v-for="item in leftModules"
          :key="item.moduleKey"
          :data-id="item.moduleKey"
        >
          <component
            :is="item.component"
            :data="resumeData?.[item.moduleKey]"
            :label="item.label"
            :template-type="currentTemplateType"
            v-if="item.isShow && item.component"
          />
        </div>
      </div>
      <!-- 右侧计算层 -->
      <div
        ref="rightContentRef"
        class="w-[68%] flex flex-col"
        :style="{
          padding: resumeData.globalStyle.pageMargin,
          gap: resumeData.globalStyle.moduleMargin,
          fontSize: resumeData.globalStyle.fontSize,
          lineHeight: resumeData.globalStyle.lineHeight,
        }"
      >
        <div data-id="jobIntention">
          <JobIntentionSection
            :data="resumeData!.jobIntention"
            :label="jobIntentionModule?.label"
            :templateType="currentTemplateType"
          />
        </div>
        <div
          v-for="item in rightModules"
          :key="item.moduleKey"
          :data-id="item.moduleKey"
        >
          <component
            :is="item.component"
            :data="resumeData?.[item.moduleKey]"
            :label="item.label"
            :templateType="currentTemplateType"
            v-if="item.isShow && item.component"
          />
        </div>
      </div>
    </div>

    <!-- 展示层：分页 -->
    <div
      v-for="(page, index) in mergedPages"
      :key="index"
      class="resume-page w-full min-h-[297mm] bg-white shadow-lg mx-auto flex box-border overflow-hidden mb-8"
      :style="{
        fontSize: resumeData.globalStyle.fontSize,
        lineHeight: resumeData.globalStyle.lineHeight,
      }"
    >
      <!-- 左侧 -->
      <div
        class="w-[32%] bg-slate-50 flex flex-col shrink-0 border-r border-gray-100"
        :style="{
          padding: resumeData.globalStyle.pageMargin,
          gap: resumeData.globalStyle.moduleMargin,
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
            v-else-if="getModuleByKey(moduleId)"
            :is="getModuleByKey(moduleId)!.component"
            :data="(resumeData as any)[moduleId]"
            :label="getModuleByKey(moduleId)!.label"
            :template-type="currentTemplateType"
            draggable="true"
          />
        </template>
      </div>

      <!-- 右侧 -->
      <div
        class="flex-1 flex flex-col min-w-0"
        :style="{
          padding: resumeData.globalStyle.pageMargin,
          gap: resumeData.globalStyle.moduleMargin,
        }"
      >
        <template v-for="moduleId in page.right" :key="moduleId">
          <JobIntentionSection
            v-if="moduleId === 'jobIntention'"
            :data="resumeData!.jobIntention"
            :label="jobIntentionModule?.label"
            :templateType="currentTemplateType"
          />
          <component
            v-else-if="getModuleByKey(moduleId)"
            :is="getModuleByKey(moduleId)!.component"
            :data="(resumeData as any)[moduleId]"
            :label="getModuleByKey(moduleId)!.label"
            :templateType="currentTemplateType"
            draggable="true"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BasicInfoSection from "@/views/editor/components/preview/BasicInfoSection.vue";
import JobIntentionSection from "@/views/editor/components/preview/JobIntentionSection.vue";
import { useResumeStore } from "@/stores/resumeStore";
import type { ResumeData } from "@/stores/type";
import { storeToRefs } from "pinia";
import { inject, computed, ref } from "vue";
import { usePagination } from "@/views/editor/hooks/usePagination";

const { moduleOrder, currentTemplateType } = storeToRefs(useResumeStore());
const resumeData = ref(inject<ResumeData>("resumeData")!);

// 定义左右分栏的模块 key
const leftModuleKeys = ["skills", "certificates", "selfEvaluation"];
const rightModuleKeys = [
  "educationBackground",
  "workExperience",
  "projectExperience",
];

// 获取基本信息和求职意向模块配置
const basicInfoModule = computed(() =>
  moduleOrder.value.find((m) => m.moduleKey === "basicInfo"),
);
const jobIntentionModule = computed(() =>
  moduleOrder.value.find((m) => m.moduleKey === "jobIntention"),
);

// 计算左侧模块列表 (保持 moduleOrder 中的相对顺序)
const leftModules = computed(() => {
  return moduleOrder.value.filter((item) =>
    leftModuleKeys.includes(item.moduleKey),
  );
});

// 计算右侧模块列表 (保持 moduleOrder 中的相对顺序)
const rightModules = computed(() => {
  return moduleOrder.value.filter((item) =>
    rightModuleKeys.includes(item.moduleKey),
  );
});

// 根据 ID 获取模块配置
const getModuleByKey = (key: string) => {
  return moduleOrder.value.find((item) => item.moduleKey === key);
};

// 分页逻辑
const leftContentRef = ref<HTMLElement | null>(null);
const rightContentRef = ref<HTMLElement | null>(null);

const moduleGap = computed(() => {
  return parseFloat(resumeData.value.globalStyle.moduleMargin) || 0;
});

const pagePadding = computed(() => {
  return (parseFloat(resumeData.value.globalStyle.pageMargin) || 0) * 2;
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
    result.push({
      left: leftPages.value[i] || [],
      right: rightPages.value[i] || [],
    });
  }
  return result;
});
</script>

<style scoped>
/* 针对侧边栏的基本信息样式微调 */
:deep(.resume-section) {
  margin-bottom: 0 !important; /* 移除组件自带的 margin-bottom，由 flex gap 控制 */
}
</style>
