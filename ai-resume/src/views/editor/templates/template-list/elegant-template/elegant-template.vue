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
      <div
        class="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden"
      >
        <!-- Decorative geometric elements -->
        <div class="absolute inset-0">
          <div
            class="absolute top-0 right-0 w-72 h-72 bg-[#c9a96e] opacity-[0.05] rounded-full translate-x-20 -translate-y-20"
          ></div>
          <div
            class="absolute bottom-0 left-1/4 w-56 h-56 bg-[#c9a96e] opacity-[0.03] rounded-full -translate-x-12 translate-y-12"
          ></div>
          <div
            class="absolute top-1/2 right-1/3 w-32 h-32 bg-[#c9a96e] opacity-[0.04] rounded-full -translate-y-16"
          ></div>
          <!-- Subtle grid pattern -->
          <div
            class="absolute inset-0 opacity-[0.03]"
            style="
              background-image:
                linear-gradient(rgba(201, 169, 110, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(201, 169, 110, 0.3) 1px, transparent 1px);
              background-size: 40px 40px;
            "
          ></div>
        </div>

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
            class="text-[#c9a96e] text-base font-medium tracking-[0.2em] uppercase ml-[104px] mt-3 flex items-center gap-3"
          >
            <span class="w-8 h-[1px] bg-[#c9a96e]/50"></span>
            {{ resumeData.jobIntention.jobIntention }}
          </p>
        </div>

        <!-- Bottom gold gradient bar -->
        <div class="relative">
          <div
            class="h-[3px] bg-gradient-to-r from-[#c9a96e] via-[#d4b97a] to-[#c9a96e]/20 w-full"
          ></div>
          <div
            class="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c9a96e]/30 to-transparent"
          ></div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════ -->
      <!-- CONTENT BODY                               -->
      <!-- ═══════════════════════════════════════════ -->
      <div :style="{ padding: globalPageMargin }" class="relative">
        <!-- Subtle background decoration -->
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-[#c9a96e] opacity-[0.02] rounded-full -translate-y-32 translate-x-32 pointer-events-none"
        ></div>

        <!-- Job Intention -->
        <div
          class="pl-4 border-l-2 border-[#c9a96e]/30 outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300 relative z-10"
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
        <div class="grid grid-cols-2 gap-x-10 relative z-10">
          <!-- LEFT COLUMN -->
          <div class="border-r border-[#e8e0d4]/60 pr-10">
            <template v-for="item in leftModules" :key="item.moduleKey">
              <div :style="{ marginBottom: globalModuleMargin }">
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
              <div :style="{ marginBottom: globalModuleMargin }">
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

        <!-- Separator line before full-width modules -->
        <div
          class="w-full h-[1px] bg-gradient-to-r from-transparent via-[#c9a96e]/30 to-transparent my-6 relative z-10"
        ></div>

        <!-- Full-width modules -->
        <template v-for="item in fullWidthModules" :key="item.moduleKey">
          <div
            class="pl-4 border-l-2 border-[#c9a96e]/30 outline outline-2 outline-transparent outline-offset-2 transition-all duration-200 hover:outline-dashed hover:outline-gray-300 relative z-10"
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

      <!-- Footer decoration -->
      <div class="h-[2px] bg-gradient-to-r from-transparent via-[#c9a96e]/40 to-transparent"></div>
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

/* Elegant template custom styles */
:deep(.resume-section) {
  padding: 0.5rem 0;
}

/* Enhanced title styling with decorative line */
:deep(.resume-section .text-xs.tracking-\[0\.2em\]) {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

:deep(.resume-section .text-xs.tracking-\[0\.2em\])::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, #c9a96e40, transparent);
}

/* Smooth hover transitions for items */
:deep(.border-l-2.border-\[\#c9a96e\]\/30) {
  transition:
    border-color 0.3s ease,
    padding-left 0.3s ease;
}

:deep(.border-l-2.border-\[\#c9a96e\]\/30:hover) {
  border-color: rgba(201, 169, 110, 0.6);
}

/* Skills items hover effect */
:deep(.bg-gradient-to-r.from-\[\#f8f4ee\]) {
  transition: all 0.2s ease;
}

:deep(.bg-gradient-to-r.from-\[\#f8f4ee\]:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>
