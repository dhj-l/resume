<template>
  <div class="resume-section project-experience p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border border-transparent hover:border-blue-200 rounded-sm" @click="handleClick">
    <div class="section-title border-b border-gray-300 pb-1 mb-3">
      <h3 class="text-base font-bold text-gray-800 border-l-4 border-blue-600 pl-2 leading-none">项目经历</h3>
    </div>

    <div v-for="(project, index) in data" :key="index" class="mb-4 last:mb-0">
      <div class="flex justify-between items-baseline mb-1">
        <div class="font-bold text-gray-800 text-sm">{{ project.title }}</div>
        <div class="text-xs text-gray-500 font-mono">{{ project.startTime }} - {{ project.endTime || '至今' }}</div>
      </div>
      <div class="text-sm text-gray-600 mb-1">
        <span class="font-medium text-gray-700">项目描述：</span>
        {{ project.description }}
      </div>
      <div class="text-sm text-gray-600">
        <span class="font-medium text-gray-700">项目内容：</span>
        {{ project.content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjectExperience } from '@/stores/type';

interface Props {
  data: ProjectExperience[];
}

const props = defineProps<Props>();

const handleClick = () => {
  // TODO: 处理点击
  console.log('Project Experience section clicked');
};
</script>
