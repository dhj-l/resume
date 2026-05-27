<template>
  <div class="relative mx-auto w-full max-w-[210mm]">
    <div
      ref="contentRef"
      class="w-full bg-white shadow-lg box-border"
      :style="{
        padding: globalPageMargin,
        fontSize: globalFontSize,
        lineHeight: globalLineHeight,
      }"
    >
      <!-- ═══════════════════════════════════════════ -->
      <!-- HEADER — centered, oversized, stark        -->
      <!-- ═══════════════════════════════════════════ -->
      <div class="text-center mb-6">
        <h1 class="text-4xl font-light text-[#111] tracking-[0.04em] mb-2">
          {{ resumeData?.basicInfo?.name || "Your Name" }}
        </h1>
        <p
          v-if="resumeData?.jobIntention?.jobIntention"
          class="text-sm text-[#999] tracking-[0.15em] uppercase mb-2 font-light"
        >
          {{ resumeData.jobIntention.jobIntention }}
        </p>
        <div
          class="flex justify-center flex-wrap gap-x-5 gap-y-1 text-xs text-[#999] tracking-wide"
        >
          <span v-if="resumeData?.basicInfo?.phone">{{ resumeData.basicInfo.phone }}</span>
          <span
            v-if="resumeData?.basicInfo?.phone && resumeData?.basicInfo?.email"
            class="text-[#ddd]"
            >·</span
          >
          <span v-if="resumeData?.basicInfo?.email">{{ resumeData.basicInfo.email }}</span>
          <span
            v-if="
              (resumeData?.basicInfo?.phone || resumeData?.basicInfo?.email) &&
              (resumeData?.basicInfo?.age || resumeData?.basicInfo?.gender)
            "
            class="text-[#ddd]"
            >·</span
          >
          <span v-if="resumeData?.basicInfo?.age">{{ resumeData.basicInfo.age }} 岁</span>
          <span
            v-if="resumeData?.basicInfo?.age && resumeData?.basicInfo?.gender"
            class="text-[#ddd]"
            >·</span
          >
          <span v-if="resumeData?.basicInfo?.gender">{{ resumeData.basicInfo.gender }}</span>
          <span
            v-if="
              (resumeData?.basicInfo?.age || resumeData?.basicInfo?.gender) &&
              resumeData?.basicInfo?.workYear
            "
            class="text-[#ddd]"
            >·</span
          >
          <span v-if="resumeData?.basicInfo?.workYear">{{ resumeData.basicInfo.workYear }}</span>
        </div>
      </div>

      <!-- Thin rule -->
      <div class="border-t border-[#111] mb-6"></div>

      <!-- ═══════════════════════════════════════════ -->
      <!-- ALL MODULES — single column, sequential    -->
      <!-- ═══════════════════════════════════════════ -->
      <div
        v-for="item in activeModules"
        :key="item.moduleKey"
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
import { ref, inject } from "vue";

import { storeToRefs } from "pinia";

import { useResumeStore } from "@/stores/resumeStore";
import type { ResumeData, ModuleItem } from "@/stores/type";
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

// Page markers
const contentRef = ref<HTMLElement | null>(null);
const { markers } = usePageMarkers(contentRef);
</script>

<style scoped></style>
