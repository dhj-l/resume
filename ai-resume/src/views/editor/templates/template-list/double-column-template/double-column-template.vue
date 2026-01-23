<template>
  <div
    class="resume-preview w-full max-w-[210mm] min-h-[297mm] bg-white shadow-lg mx-auto flex box-border overflow-hidden"
  >
    <!-- 左侧侧边栏 -->
    <div
      class="w-[32%] bg-slate-50 p-6 flex flex-col gap-6 shrink-0 border-r border-gray-100"
    >
      <!-- 基本信息 -->
      <BasicInfoSection
        :data="resumeData!.basicInfo"
        :label="basicInfoModule?.label"
        :template-type="currentTemplate"
      />

      <!-- 侧边栏模块循环 -->
      <template v-for="item in leftModules" :key="item.moduleKey">
        <component
          draggable="true"
          :is="item.component"
          :data="resumeData?.[item.moduleKey]"
          :label="item.label"
          :template-type="currentTemplate"
          v-if="item.isShow && item.component"
        />
      </template>
    </div>

    <!-- 右侧主要内容 -->
    <div class="flex-1 p-8 flex flex-col gap-6 min-w-0">
      <!-- 求职意向 -->
      <JobIntentionSection
        :data="resumeData!.jobIntention"
        :label="jobIntentionModule?.label"
        :templateType="currentTemplate"
      />

      <!-- 主内容模块循环 -->
      <template v-for="item in rightModules" :key="item.moduleKey">
        <component
          draggable="true"
          :is="item.component"
          :data="resumeData?.[item.moduleKey]"
          :label="item.label"
          :templateType="currentTemplate"
          v-if="item.isShow && item.component"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import BasicInfoSection from "@/views/editor/components/preview/BasicInfoSection.vue";
import JobIntentionSection from "@/views/editor/components/preview/JobIntentionSection.vue";
import { useResumeStore } from "@/stores/resumeStore";
import type { ResumeData } from "@/stores/type";
import { storeToRefs } from "pinia";
import { inject, computed } from "vue";

const { moduleOrder, currentTemplate } = storeToRefs(useResumeStore());
const resumeData = inject<ResumeData>("resumeData");

// 定义左右分栏的模块 key
const leftModuleKeys = ["skills", "certificates", "selfEvaluation"];
const rightModuleKeys = [
  "educationBackground",
  "workExperience",
  "projectExperience",
];

// 获取基本信息和求职意向模块配置
const basicInfoModule = computed(() =>
  moduleOrder.value.find((m) => m.moduleKey === "basicInfo"),
);
const jobIntentionModule = computed(() =>
  moduleOrder.value.find((m) => m.moduleKey === "jobIntention"),
);

// 计算左侧模块列表 (保持 moduleOrder 中的相对顺序)
const leftModules = computed(() => {
  return moduleOrder.value.filter((item) =>
    leftModuleKeys.includes(item.moduleKey),
  );
});

// 计算右侧模块列表 (保持 moduleOrder 中的相对顺序)
const rightModules = computed(() => {
  return moduleOrder.value.filter((item) =>
    rightModuleKeys.includes(item.moduleKey),
  );
});
</script>

<style scoped>
/* A4纸张比例模拟 */
.resume-preview {
  aspect-ratio: 210/297;
}

/* 针对侧边栏的基本信息样式微调 */
:deep(.resume-section) {
  margin-bottom: 0 !important; /* 移除组件自带的 margin-bottom，由 flex gap 控制 */
}
</style>
