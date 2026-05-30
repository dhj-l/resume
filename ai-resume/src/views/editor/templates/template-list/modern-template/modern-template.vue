<template>
  <div class="relative mx-auto w-full max-w-[210mm]">
    <div
      ref="contentRef"
      class="w-full bg-white shadow-lg box-border overflow-hidden"
      :style="{
        fontSize: globalFontSize,
        lineHeight: globalLineHeight,
      }"
    >
      <!-- Hero Header: 渐变背景 + 基本信息 + 求职意向 -->
      <div v-if="basicInfoModule" class="bg-primary-600 text-white" :style="{ padding: globalPageMargin }">
        <div class="flex items-start gap-6">
          <!-- BasicInfo via section component -->
          <component
            :is="getComponent(basicInfoModule)"
            :data="resumeData.basicInfo"
            :label="basicInfoModule.label"
            :template-type="currentTemplateType"
          />
          <!-- JobIntention via section component -->
          <component
            :is="getComponent(jobIntentionModule)"
            v-if="jobIntentionModule"
            :data="resumeData.jobIntention"
            :label="jobIntentionModule.label"
            :template-type="currentTemplateType"
          />
        </div>
      </div>

      <!-- 内容模块区 -->
      <div :style="{ padding: globalPageMargin }">
        <template v-for="item in contentModules" :key="item.moduleKey">
          <div
            :class="{
              'outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300': !['workExperience', 'educationBackground', 'projectExperience', 'campusExperience', 'internshipExperience'].includes(item.moduleKey),
            }"
            :style="{ marginBottom: globalModuleMargin }"
          >
            <component
              :is="getComponent(item)"
              :data="resumeData[item.moduleKey]"
              :label="item.label"
              :template-type="currentTemplateType"
            />
          </div>
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
      <div class="border-t-[3px] border-dashed border-red-400 relative">
        <span
          class="absolute right-0 -top-3.5 bg-red-500 text-white text-xs px-2.5 py-0.5 rounded shadow-sm"
        >
          第{{ marker.pageNum }}页
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from "vue";

import { storeToRefs } from "pinia";

import { useResumeStore } from "@/stores/resumeStore";
import type { ModuleItem, ResumeData } from "@/stores/type";
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

const componentMap: Record<string, any> = {
  basicInfo: BasicInfoSection,
  jobIntention: JobIntentionSection,
};

const { activeModules } = useActiveModules(moduleOrder, resumeData);

const getComponent = (item: ModuleItem) => {
  return item.component || componentMap[item.moduleKey];
};

const basicInfoModule = computed(() =>
  activeModules.value.find((m) => m.moduleKey === "basicInfo"),
);
const jobIntentionModule = computed(() =>
  activeModules.value.find((m) => m.moduleKey === "jobIntention"),
);

const contentModules = computed(() => {
  return activeModules.value.filter(
    (item) => item.moduleKey !== "basicInfo" && item.moduleKey !== "jobIntention",
  );
});

// 分页标记线
const contentRef = ref<HTMLElement | null>(null);
const { markers } = usePageMarkers(contentRef);
</script>

<style scoped>
:deep(.resume-section) {
  margin-bottom: 0 !important;
}
</style>
