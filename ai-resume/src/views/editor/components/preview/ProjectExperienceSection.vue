<script setup lang="ts">
import { useResumeStore } from "@/stores/resumeStore";
import type { ProjectExperience } from "@/stores/type";

defineProps<{
  data?: ProjectExperience[];
  label?: string;
}>();

const { setCurrentModel, setIsExpanded } = useResumeStore();
const handleClick = () => {
  setCurrentModel("projectExperience");
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
      {{ label || "项目经历" }}
    </h3>
    <div class="space-y-4">
      <template v-if="data && data.length">
        <div v-for="(project, index) in data" :key="index">
          <div class="flex justify-between mb-1">
            <h4 class="font-bold text-gray-800">{{ project.title }}</h4>
            <span class="text-sm text-gray-600">
              {{ project.startTime }}
              <span v-if="project.endTime">- {{ project.endTime }}</span>
            </span>
          </div>
          <div class="text-sm text-gray-700 mb-1 font-medium">
            {{ project.description }}
          </div>
          <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {{ project.content }}
          </p>
        </div>
      </template>
      <div v-else class="text-gray-400 italic">暂无项目经历信息</div>
    </div>
  </div>
</template>
