<template>
  <div class="relative mx-auto w-full max-w-[210mm]">
    <!-- 连续内容区 -->
    <div
      ref="contentRef"
      class="w-full bg-white shadow-lg box-border min-h-[297mm]"
      :style="{
        padding: globalPageMargin,
        lineHeight: globalLineHeight,
        fontSize: globalFontSize,
      }"
    >
      <!-- 所有模块连续渲染 -->
      <div
        v-for="item in activeModules"
        :key="item.moduleKey"
        :class="{
          'outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300':
            !listModules.includes(item.moduleKey),
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
import { ref, inject, unref } from "vue";

import type { ResumeData, ModuleItem } from "@/stores/type";
import BasicInfoSection from "@/views/editor/components/preview/BasicInfoSection.vue";
import JobIntentionSection from "@/views/editor/components/preview/JobIntentionSection.vue";
import { useActiveModules } from "@/views/editor/hooks/useActiveModules";
import { usePageMarkers } from "@/views/editor/hooks/usePageMarkers";
import { useResumeView } from "@/views/editor/hooks/useResumeView";

const resumeData = ref(inject<ResumeData>("resumeData")!);
const {
  moduleOrder,
  currentTemplateType,
  globalPageMargin,
  globalFontSize,
  globalLineHeight,
  globalModuleMargin,
} = useResumeView(resumeData);

const componentMap: Record<string, any> = {
  basicInfo: BasicInfoSection,
  jobIntention: JobIntentionSection,
};

const listModules = [
  "workExperience",
  "educationBackground",
  "projectExperience",
  "campusExperience",
  "internshipExperience",
];

const { activeModules } = useActiveModules(moduleOrder, resumeData);

const getComponent = (item: ModuleItem) => {
  return item.component ? unref(item.component) : componentMap[item.moduleKey];
};

// 分页标记线
const contentRef = ref<HTMLElement | null>(null);
const { markers } = usePageMarkers(contentRef);
</script>

<style scoped></style>
