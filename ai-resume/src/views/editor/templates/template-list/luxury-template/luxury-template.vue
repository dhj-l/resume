<template>
  <div class="relative mx-auto w-full max-w-[210mm]">
    <div
      ref="contentRef"
      class="w-full shadow-xl flex box-border overflow-hidden min-h-[297mm]"
      :style="{
        lineHeight: globalLineHeight,
        fontSize: globalFontSize,
      }"
    >
      <!-- ═══════════════════════════════════════════ -->
      <!-- LEFT SIDEBAR — dark, gold accents          -->
      <!-- ═══════════════════════════════════════════ -->
      <div
        class="w-[35%] bg-[#1a1a1a] flex flex-col shrink-0"
        :style="{
          padding: globalPageMargin,
          gap: globalModuleMargin,
        }"
      >
        <!-- Decorative gold top bar -->
        <div class="h-[3px] bg-gradient-to-r from-[#c9a050] to-transparent w-2/3 mb-1"></div>

        <!-- BasicInfo -->
        <div
          class="outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300"
        >
          <component
            :is="getComponent(basicInfoModule)"
            v-if="basicInfoModule"
            :data="resumeData.basicInfo"
            :label="basicInfoModule.label"
            :template-type="currentTemplateType"
          />
        </div>

        <!-- Thin gold rule -->
        <div class="border-t border-[#c9a050]/20"></div>

        <!-- JobIntention -->
        <div
          class="outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300"
        >
          <component
            :is="getComponent(jobIntentionModule)"
            v-if="jobIntentionModule"
            :data="resumeData.jobIntention"
            :label="jobIntentionModule.label"
            :template-type="currentTemplateType"
          />
        </div>

        <!-- Sidebar modules -->
        <template v-for="item in sidebarModules" :key="item.moduleKey">
          <div
            class="border-t border-white/5 pt-0 outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300"
          >
            <component
              :is="getComponent(item)"
              v-if="item.component"
              :data="resumeData[item.moduleKey]"
              :label="item.label"
              :template-type="currentTemplateType"
            />
          </div>
        </template>

        <!-- Decorative gold bottom bar -->
        <div
          class="mt-auto h-[3px] bg-gradient-to-l from-[#c9a050] to-transparent w-2/3 self-end"
        ></div>
      </div>

      <!-- ═══════════════════════════════════════════ -->
      <!-- RIGHT CONTENT — cream, gold section titles -->
      <!-- ═══════════════════════════════════════════ -->
      <div
        class="flex-1 flex flex-col min-w-0 bg-[#fefdfb]"
        :style="{
          padding: globalPageMargin,
          gap: globalModuleMargin,
        }"
      >
        <template v-for="item in contentModules" :key="item.moduleKey">
          <div
            :class="{
              'outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300': !['workExperience', 'educationBackground', 'projectExperience', 'campusExperience', 'internshipExperience'].includes(item.moduleKey),
            }"
          >
            <component
              :is="getComponent(item)"
              v-if="item.component"
              :data="resumeData[item.moduleKey]"
              :label="item.label"
              :template-type="currentTemplateType"
            />
          </div>
        </template>
      </div>
    </div>

    <!-- Page markers -->
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

const getComponent = (item: ModuleItem | undefined) => {
  if (!item) return null;
  return item.component || componentMap[item.moduleKey];
};

const basicInfoModule = computed(() =>
  activeModules.value.find((m) => m.moduleKey === "basicInfo"),
);
const jobIntentionModule = computed(() =>
  activeModules.value.find((m) => m.moduleKey === "jobIntention"),
);

const sidebarKeys = ["skills", "certificates", "selfEvaluation"];

const sidebarModules = computed(() =>
  activeModules.value.filter(
    (item) =>
      sidebarKeys.includes(item.moduleKey) &&
      item.moduleKey !== "basicInfo" &&
      item.moduleKey !== "jobIntention",
  ),
);

const contentModules = computed(() =>
  activeModules.value.filter(
    (item) =>
      !sidebarKeys.includes(item.moduleKey) &&
      item.moduleKey !== "basicInfo" &&
      item.moduleKey !== "jobIntention",
  ),
);

// Page markers
const contentRef = ref<HTMLElement | null>(null);
const { markers } = usePageMarkers(contentRef);
</script>

<style scoped>
:deep(.resume-section) {
  margin-bottom: 0 !important;
}
</style>
