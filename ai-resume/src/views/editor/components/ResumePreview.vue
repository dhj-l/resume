<script setup lang="ts">
import { useResumeStore } from "@/stores/resumeStore";
import type { ResumeData } from "@/stores/type";
import { storeToRefs } from "pinia";
const { moduleOrder } = storeToRefs(useResumeStore());

defineProps<{
  resumeData: ResumeData;
}>();
const emit = defineEmits<{
  (e: "moduleClick", moduleKey: string): void;
}>();
</script>

<template>
  <div
    class="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-lg mx-auto p-8 box-border"
  >
    <template v-for="item in moduleOrder" :key="item.moduleKey">
      <component
        draggable="true"
        :is="item.component"
        :data="resumeData[item.moduleKey]"
        :label="item.label"
        @click="emit('moduleClick', item.moduleKey)"
        v-if="item.isShow"
      />
    </template>
  </div>
</template>

<style scoped>
/* A4纸张比例模拟 */
.resume-preview {
  aspect-ratio: 210/297;
}
</style>
