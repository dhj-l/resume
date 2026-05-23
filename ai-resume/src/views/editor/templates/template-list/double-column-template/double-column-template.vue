<template>
  <div class="relative mx-auto w-full max-w-[210mm]">
    <!-- 连续内容区：双栏 -->
    <div
      ref="containerRef"
      class="w-full bg-white shadow-lg flex box-border"
      :style="{
        fontSize: globalFontSize,
        lineHeight: globalLineHeight,
      }"
    >
      <!-- 左栏 32% -->
      <div
        class="w-[32%] bg-slate-50 flex flex-col shrink-0 border-r border-gray-100"
        :style="{
          padding: globalPageMargin,
          gap: globalModuleMargin,
        }"
      >
        <BasicInfoSection
          :data="resumeData!.basicInfo"
          :label="basicInfoModule?.label"
          :template-type="currentTemplateType"
        />
        <template v-for="item in leftModules" :key="item.moduleKey">
          <component
            :is="item.component"
            v-if="item.isShow && item.component"
            :data="resumeData?.[item.moduleKey]"
            :label="item.label"
            :template-type="currentTemplateType"
          />
        </template>
      </div>

      <!-- 右栏 68% -->
      <div
        class="flex-1 flex flex-col min-w-0"
        :style="{
          padding: globalPageMargin,
          gap: globalModuleMargin,
        }"
      >
        <JobIntentionSection
          :data="resumeData!.jobIntention"
          :label="jobIntentionModule?.label"
          :template-type="currentTemplateType"
        />
        <template v-for="item in rightModules" :key="item.moduleKey">
          <component
            :is="item.component"
            v-if="item.isShow && item.component"
            :data="resumeData?.[item.moduleKey]"
            :label="item.label"
            :template-type="currentTemplateType"
          />
        </template>
      </div>
    </div>

    <!-- 分页标记线 -->
    <div
      v-for="marker in markers"
      :key="marker.pageNum"
      data-page-marker
      class="absolute left-0 w-full pointer-events-none"
      :style="{ top: `${marker.top}px` }"
    >
      <div class="border-t-2 border-dashed border-gray-300 relative">
        <span
          class="absolute right-0 -top-3 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded"
        >
          第{{ marker.pageNum }}页
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed, ref } from "vue";

import { storeToRefs } from "pinia";

import { useResumeStore } from "@/stores/resumeStore";
import type { ResumeData } from "@/stores/type";
import BasicInfoSection from "@/views/editor/components/preview/BasicInfoSection.vue";
import JobIntentionSection from "@/views/editor/components/preview/JobIntentionSection.vue";
import { useActiveModules } from "@/views/editor/hooks/useActiveModules";
import { usePageMarkers } from "@/views/editor/hooks/usePageMarkers";

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

// 分页标记线
const containerRef = ref<HTMLElement | null>(null);
const { markers } = usePageMarkers(containerRef);
</script>

<style scoped>
:deep(.resume-section) {
  margin-bottom: 0 !important;
}
</style>
