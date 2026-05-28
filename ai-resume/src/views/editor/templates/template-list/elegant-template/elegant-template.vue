<template>
  <div class="relative mx-auto w-full max-w-[210mm]">
    <div
      ref="contentRef"
      class="w-full bg-[#fefdfb] shadow-xl box-border overflow-hidden"
      :style="{
        fontSize: globalFontSize,
        lineHeight: globalLineHeight,
      }"
    >
      <!-- ═══════════════════════════════════════════ -->
      <!-- HERO HEADER — dark navy with gold accents  -->
      <!-- ═══════════════════════════════════════════ -->
      <div class="relative bg-[#1a1a2e] overflow-hidden">
        <!-- Decorative geometric circles -->
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-[#c9a96e] opacity-[0.06] rounded-full translate-x-16 -translate-y-16"
        ></div>
        <div
          class="absolute bottom-0 left-1/4 w-48 h-48 bg-[#c9a96e] opacity-[0.04] rounded-full -translate-x-8 translate-y-8"
        ></div>

        <!-- BasicInfo inside hero -->
        <div :style="{ padding: globalPageMargin }" class="relative z-10">
          <component
            :is="getComponent(basicInfoModule)"
            :data="resumeData.basicInfo"
            :label="basicInfoModule?.label"
            :template-type="currentTemplateType"
          />
          <!-- Job title subtitle -->
          <p
            v-if="resumeData?.jobIntention?.jobIntention"
            class="text-[#c9a96e] text-base font-medium tracking-wider uppercase ml-[104px] -mt-2"
          >
            {{ resumeData.jobIntention.jobIntention }}
          </p>
        </div>

        <!-- Bottom gold gradient bar -->
        <div
          class="h-[4px] bg-gradient-to-r from-[#c9a96e] via-[#d4b97a] to-transparent w-3/4"
        ></div>
      </div>

      <!-- ═══════════════════════════════════════════ -->
      <!-- CONTENT BODY                               -->
      <!-- ═══════════════════════════════════════════ -->
      <div :style="{ padding: globalPageMargin }">
        <!-- Job Intention -->
        <div
          class="outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300"
          :style="{ marginBottom: globalModuleMargin }"
        >
          <component
            :is="getComponent(jobIntentionModule)"
            :data="resumeData.jobIntention"
            :label="jobIntentionModule?.label"
            :template-type="currentTemplateType"
          />
        </div>

        <!-- Two-column grid -->
        <div class="grid grid-cols-2 gap-x-8">
          <!-- LEFT COLUMN -->
          <div>
            <template v-for="item in leftModules" :key="item.moduleKey">
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

          <!-- RIGHT COLUMN -->
          <div>
            <template v-for="item in rightModules" :key="item.moduleKey">
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

        <!-- Full-width modules -->
        <template v-for="item in fullWidthModules" :key="item.moduleKey">
          <div
            class="outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300"
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

const leftModuleKeys = ["workExperience", "projectExperience"];
const rightModuleKeys = ["educationBackground", "internshipExperience", "campusExperience"];
const fullWidthModuleKeys = ["skills", "certificates", "selfEvaluation"];

const leftModules = computed(() =>
  activeModules.value.filter(
    (item) =>
      leftModuleKeys.includes(item.moduleKey) &&
      item.moduleKey !== "basicInfo" &&
      item.moduleKey !== "jobIntention",
  ),
);
const rightModules = computed(() =>
  activeModules.value.filter(
    (item) =>
      rightModuleKeys.includes(item.moduleKey) &&
      item.moduleKey !== "basicInfo" &&
      item.moduleKey !== "jobIntention",
  ),
);
const fullWidthModules = computed(() =>
  activeModules.value.filter(
    (item) =>
      fullWidthModuleKeys.includes(item.moduleKey) &&
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
