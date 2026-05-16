<template>
  <div class="relative mx-auto w-full max-w-[210mm]">
    <!-- 计算层：用于计算每个模块的高度 -->
    <div
      ref="contentRef"
      class="absolute top-0 left-0 w-full opacity-0 -z-50 pointer-events-none box-border"
      :style="{
        padding: globalPageMargin,
        fontSize: globalFontSize,
        lineHeight: globalLineHeight,
      }"
    >
      <div
        v-for="item in activeModules"
        :key="item.moduleKey"
        :data-id="item.moduleKey"
        :style="{
          marginBottom: globalModuleMargin,
        }"
      >
        <component
          :is="getComponent(item)"
          :data="resumeData[item.moduleKey]"
          :label="item.label"
          :template-type="currentTemplateType"
        />
      </div>
    </div>

    <!-- 展示层：分页渲染 -->
    <div
      v-for="(page, index) in pages"
      :key="index"
      class="resume-page w-full h-[1122px] bg-white shadow-lg mb-8 box-border relative"
      :style="{
        padding: globalPageMargin,
        fontSize: globalFontSize,
        lineHeight: globalLineHeight,
      }"
    >
      <template v-for="moduleId in page" :key="moduleId">
        <div
          v-if="moduleByKey.get(moduleId)"
          :style="{
            marginBottom: globalModuleMargin,
          }"
        >
          <component
            :is="getComponent(moduleByKey.get(moduleId)!)"
            :data="(resumeData as any)[moduleId]"
            :label="moduleByKey.get(moduleId)!.label"
            :template-type="currentTemplateType"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from "vue";

import { storeToRefs } from "pinia";

import { useResumeStore } from "@/stores/resumeStore";
import type { ResumeData, ModuleItem } from "@/stores/type";

import BasicInfoSection from "@/views/editor/components/preview/BasicInfoSection.vue";
import JobIntentionSection from "@/views/editor/components/preview/JobIntentionSection.vue";
import { useActiveModules } from "@/views/editor/hooks/useActiveModules";
import { usePagination } from "@/views/editor/hooks/usePagination";

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

const { activeModules, moduleByKey } = useActiveModules(moduleOrder, resumeData);

const getComponent = (item: ModuleItem) => {
  return item.component || componentMap[item.moduleKey];
};

// 分页逻辑
const contentRef = ref<HTMLElement | null>(null);
const contentPadding = computed(() => {
  const marginStr = globalPageMargin.value;
  const margin = parseFloat(marginStr) || 0;
  return margin * 2;
});

const { pages } = usePagination(contentRef, resumeData, {
  contentPadding,
});
</script>

<style scoped>
/* A4纸张比例模拟 - 如果需要保持比例 */
/* .resume-preview {
  aspect-ratio: 210/297;
} */
</style>
