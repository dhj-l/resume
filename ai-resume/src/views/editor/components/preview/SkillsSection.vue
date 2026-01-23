<script setup lang="ts">
import { useResumeStore } from "@/stores/resumeStore";

defineProps<{
  data?: string[];
  label?: string;
}>();

const { setCurrentModel, setIsExpanded } = useResumeStore();
const handleClick = () => {
  setCurrentModel("skills");
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
      {{ label || "技能特长" }}
    </h3>
    <div v-if="data && data.length" class="flex flex-wrap gap-2">
      <span
        v-for="(skill, index) in data"
        :key="index"
        class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
      >
        {{ skill }}
      </span>
    </div>
    <div v-else class="text-gray-400 italic">暂无技能特长信息</div>
  </div>
</template>
