<template>
  <div class="relative mx-auto w-full max-w-[210mm]">
    <!-- 连续内容区 -->
    <div
      ref="contentRef"
      class="w-full bg-white shadow-lg box-border"
      :style="{
        padding: globalPageMargin,
        fontSize: globalFontSize,
        lineHeight: globalLineHeight,
      }"
    >
      <!-- 首页 header -->
      <div class="mb-8">
        <div class="flex items-center justify-between pb-4 border-b-[3px] border-[#6D28D9]">
          <div class="flex items-end gap-4">
            <h1 class="text-4xl font-bold text-[#6D28D9] leading-none tracking-tight">
              个人简历
            </h1>
            <div class="flex flex-col text-gray-400">
              <span class="text-xs">细心从每一个细节开始</span>
              <span class="text-lg font-medium leading-none">Personal resume</span>
            </div>
          </div>
          <div class="flex gap-3">
            <div
              class="w-8 h-8 rounded-full bg-[#6D28D9] text-white flex items-center justify-center"
            >
              <Box class="h-4 w-4" />
            </div>
            <div
              class="w-8 h-8 rounded-full bg-[#6D28D9] text-white flex items-center justify-center"
            >
              <Mail class="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      <!-- 所有模块连续渲染 -->
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
import { ref, inject } from "vue";

import { Box, Mail } from "lucide-vue-next";
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

// 分页标记线
const contentRef = ref<HTMLElement | null>(null);
const { markers } = usePageMarkers(contentRef);
</script>

<style scoped></style>
