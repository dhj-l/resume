<template>
  <div class="relative mx-auto w-[210mm]">
    <!-- 计算层：用于计算每个模块的高度 -->
    <div
      ref="contentRef"
      class="absolute top-0 left-0 w-[210mm] opacity-0 -z-50 pointer-events-none box-border"
      :style="{
        padding: globalPageMargin,
        fontSize: globalFontSize,
        lineHeight: globalLineHeight,
      }"
    >
      <!-- 静态头部 -->
      <div class="flex items-center justify-between mb-6 border-b-4 border-[#8B5CF6] pb-2">
        <div class="flex items-end gap-4">
          <h1 class="text-4xl font-bold text-[#8B5CF6] leading-none">个人简历</h1>
          <div class="flex flex-col text-[#8B5CF6]">
            <span class="text-xs">细心从每一个细节开始</span>
            <span class="text-lg font-medium leading-none">Personal resume</span>
          </div>
        </div>
        <div class="flex gap-3">
          <div
            class="w-8 h-8 rounded-full bg-[#B45309] text-white flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <div
            class="w-8 h-8 rounded-full bg-[#B45309] text-white flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        v-for="item in activeModules"
        :key="item.moduleKey"
        :data-id="item.moduleKey"
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

    <!-- 展示层：分页渲染 -->
    <div
      v-for="(page, index) in pages"
      :key="index"
      class="resume-page w-[210mm] h-[1122px] bg-white shadow-lg mb-8 box-border relative"
      :style="{
        padding: globalPageMargin,
        fontSize: globalFontSize,
        lineHeight: globalLineHeight,
      }"
    >
      <!-- 每一页都显示头部？通常只有第一页显示 -->
      <!-- 如果只需要第一页显示头部，可以加 v-if="index === 0" -->
      <!-- 但在计算层中也必须存在头部占位 -->
      <!-- 这里假设每一页都有头部可能不太合适，通常简历只有第一页有大标题 -->
      <!-- 如果要第一页有，后续页没有，需要在计算层正确处理高度 -->
      <!-- 简单起见，我们在第一页渲染头部 -->

      <div
        v-if="index === 0"
        class="flex items-center justify-between mb-6 border-b-4 border-[#8B5CF6] pb-2"
      >
        <div class="flex items-end gap-4">
          <h1 class="text-4xl font-bold text-[#8B5CF6] leading-none">个人简历</h1>
          <div class="flex flex-col text-[#8B5CF6]">
            <span class="text-xs">细心从每一个细节开始</span>
            <span class="text-lg font-medium leading-none">Personal resume</span>
          </div>
        </div>
        <div class="flex gap-3">
          <div
            class="w-8 h-8 rounded-full bg-[#B45309] text-white flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <div
            class="w-8 h-8 rounded-full bg-[#B45309] text-white flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      <template v-for="moduleId in page" :key="moduleId">
        <div v-if="moduleByKey.get(moduleId)" :style="{ marginBottom: globalModuleMargin }">
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
  firstPageOffset: 100,
});
</script>

<style scoped></style>
