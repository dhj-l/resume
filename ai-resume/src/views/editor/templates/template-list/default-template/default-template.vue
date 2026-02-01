<template>
  <div class="relative mx-auto w-full max-w-[210mm]">
    <!-- 计算层：用于计算每个模块的高度 -->
    <div
      ref="contentRef"
      class="absolute top-0 left-0 w-full opacity-0 -z-50 pointer-events-none box-border"
      :style="{
        padding: resumeData.globalStyle.pageMargin,
        fontSize: resumeData.globalStyle.fontSize,
        lineHeight: resumeData.globalStyle.lineHeight,
      }"
    >
      <div
        v-for="item in activeModules"
        :key="item.moduleKey"
        :data-id="item.moduleKey"
        :style="{ marginBottom: resumeData.globalStyle.moduleMargin }"
      >
        <component
          :is="getComponent(item)"
          :data="resumeData[item.moduleKey]"
          :label="item.label"
          :templateType="currentTemplate"
        />
      </div>
    </div>

    <!-- 展示层：分页渲染 -->
    <div
      v-for="(page, index) in pages"
      :key="index"
      class="w-full min-h-[297mm] bg-white shadow-lg mb-8 box-border relative"
      :style="{
        padding: resumeData.globalStyle.pageMargin,
        fontSize: resumeData.globalStyle.fontSize,
        lineHeight: resumeData.globalStyle.lineHeight,
      }"
    >
      <template v-for="moduleId in page" :key="moduleId">
        <div
          v-if="getModuleByKey(moduleId)"
          :style="{ marginBottom: resumeData.globalStyle.moduleMargin }"
        >
          <component
            :is="getComponent(getModuleByKey(moduleId)!)"
            :data="(resumeData as any)[moduleId]"
            :label="getModuleByKey(moduleId)!.label"
            :templateType="currentTemplate"
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
import { usePagination } from "@/views/editor/hooks/usePagination";

// 引入组件
import BasicInfoSection from "@/views/editor/components/preview/BasicInfoSection.vue";
import JobIntentionSection from "@/views/editor/components/preview/JobIntentionSection.vue";

const { moduleOrder, currentTemplate } = storeToRefs(useResumeStore());
const resumeData = ref(inject<ResumeData>("resumeData")!);

// 映射特殊组件
const componentMap: Record<string, any> = {
  basicInfo: BasicInfoSection,
  jobIntention: JobIntentionSection,
};

// 获取需要渲染的模块列表
const activeModules = computed(() => {
  return moduleOrder.value.filter((item) => item.isShow);
});

// 获取组件
const getComponent = (item: ModuleItem) => {
  return item.component || componentMap[item.moduleKey];
};

// 根据 ID 获取模块配置
const getModuleByKey = (key: string) => {
  return activeModules.value.find((item) => item.moduleKey === key);
};

// 分页逻辑
const contentRef = ref<HTMLElement | null>(null);
const contentPadding = computed(() => {
  const marginStr = resumeData.value.globalStyle.pageMargin;
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
