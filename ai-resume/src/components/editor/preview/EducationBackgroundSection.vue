<template>
  <div class="resume-section education-background p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border border-transparent hover:border-blue-200 rounded-sm" @click="handleClick">
    <div class="section-title border-b border-gray-300 pb-1 mb-3">
      <h3 class="text-base font-bold text-gray-800 border-l-4 border-blue-600 pl-2 leading-none">教育背景</h3>
    </div>
    
    <div v-for="(edu, index) in data" :key="index" class="mb-3 last:mb-0">
      <div class="flex justify-between items-baseline mb-1">
        <div class="font-bold text-gray-800 text-sm">{{ edu.schoolName }}</div>
        <div class="text-xs text-gray-500 font-mono">{{ edu.enrollmentTime }} - {{ edu.graduationTime }}</div>
      </div>
      <div class="flex gap-4 text-sm mb-1">
        <div class="text-gray-700">{{ edu.major }}</div>
        <div class="text-gray-700">{{ edu.degree }}</div>
        <div v-if="edu.majorScore" class="text-gray-600">成绩：{{ edu.majorScore }}</div>
      </div>
      <div v-if="edu.majorCourses && edu.majorCourses.length" class="text-xs text-gray-500">
        <span class="mr-2">主修课程：</span>
        {{ Array.isArray(edu.majorCourses) ? edu.majorCourses.join('、') : edu.majorCourses }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EducationBackground } from '@/stores/type';

interface Props {
  data: EducationBackground[];
}

const props = defineProps<Props>();

const handleClick = () => {
  // TODO: 处理点击
  console.log('Education section clicked');
};
</script>
