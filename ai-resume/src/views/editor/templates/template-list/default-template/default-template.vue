<template>
  <div
    class="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-lg mx-auto p-8 box-border"
  >
    <BasicInfoSection
      :data="resumeData!.basicInfo"
      :label="moduleOrder[0]?.label"
      :templateType="currentTemplate"
    />
    <JobIntentionSection
      :data="resumeData!.jobIntention"
      :label="moduleOrder[1]?.label"
      :templateType="currentTemplate"
    />
    <template v-for="item in moduleOrder" :key="item.moduleKey">
      <component
        draggable="true"
        :is="item.component"
        :data="resumeData?.[item.moduleKey]"
        :label="item.label"
        :templateType="currentTemplate"
        v-if="item.isShow"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import BasicInfoSection from "@/views/editor/components/preview/BasicInfoSection.vue";
import JobIntentionSection from "@/views/editor/components/preview/JobIntentionSection.vue";
import { useResumeStore } from "@/stores/resumeStore";
import type { ResumeData } from "@/stores/type";
import { storeToRefs } from "pinia";
import { inject } from "vue";
const { moduleOrder, currentTemplate } = storeToRefs(useResumeStore());
const resumeData = inject<ResumeData>("resumeData");
</script>

<style>
/* A4纸张比例模拟 */
.resume-preview {
  aspect-ratio: 210/297;
}
</style>
