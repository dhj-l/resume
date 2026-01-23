<script setup lang="ts">
import { useResumeStore } from "@/stores/resumeStore";
import type { JobIntention } from "@/stores/type";

defineProps<{
  data?: JobIntention;
  label?: string;
}>();

const { setCurrentModel, setIsExpanded } = useResumeStore();
const handleClick = () => {
  setCurrentModel("jobIntention");
  setIsExpanded(true);
};
</script>

<template>
  <div
    class="resume-section p-4 mb-4 hover:bg-blue-50 hover:border-blue-300 border border-transparent rounded cursor-pointer transition-all duration-200"
    @click="handleClick"
  >
    <h3
      class="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3"
    >
      {{ label || "求职意向" }}
    </h3>
    <div class="flex gap-8 text-sm text-gray-700" v-if="data">
      <div>
        <span class="font-medium">期望职位：</span>
        <span>{{ data.jobIntention }}</span>
      </div>
      <div>
        <span class="font-medium">期望城市：</span>
        <span>{{ data.intentionCity }}</span>
      </div>
    </div>
    <div v-else class="text-gray-400 italic">暂无求职意向信息</div>
  </div>
</template>
