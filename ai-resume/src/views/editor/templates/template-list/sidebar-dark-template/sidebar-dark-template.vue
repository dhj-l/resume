<template>
  <div class="relative mx-auto w-full max-w-[210mm]">
    <!-- 连续内容区：左深色侧栏 + 右白色主栏 -->
    <div
      ref="containerRef"
      class="w-full bg-white shadow-lg flex box-border min-h-[297mm]"
      :style="{
        lineHeight: globalLineHeight,
        fontSize: globalFontSize,
      }"
    >
      <!-- 左侧栏 34% -->
      <div
        class="w-[34%] bg-[#1f2d3d] flex flex-col shrink-0"
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
        <template v-for="item in sidebarModules" :key="item.moduleKey">
          <div
            class="outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-white/40"
          >
            <component
              :is="getComponent(item)"
              v-if="item.isShow && item.component"
              :data="resumeData?.[item.moduleKey]"
              :label="item.label"
              :template-type="currentTemplateType"
            />
          </div>
        </template>
      </div>

      <!-- 右主栏 66% -->
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
        <template v-for="item in mainModules" :key="item.moduleKey">
          <div>
            <component
              :is="getComponent(item)"
              v-if="item.isShow && item.component"
              :data="resumeData?.[item.moduleKey]"
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
import { computed, inject, ref, unref } from "vue";

import type { ModuleItem, ResumeData } from "@/stores/type";
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

const sidebarModuleKeys = ["skills", "certificates", "selfEvaluation"];
const mainModuleKeys = [
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

const getComponent = (item: ModuleItem) => {
  return item.component ? unref(item.component) : null;
};

const { activeModules } = useActiveModules(moduleOrder, resumeData);

const sidebarModules = computed(() => {
  return activeModules.value.filter((item) => sidebarModuleKeys.includes(item.moduleKey));
});

const mainModules = computed(() => {
  return activeModules.value.filter((item) => mainModuleKeys.includes(item.moduleKey));
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
