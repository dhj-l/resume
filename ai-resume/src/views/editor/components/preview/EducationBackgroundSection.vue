<script setup lang="ts">
import type { EducationBackground } from '@/stores/type';

defineProps<{
  data: EducationBackground[];
}>();

// TODO: 处理模块点击
const handleClick = () => {
  console.log('Education Background clicked');
};
</script>

<template>
  <div 
    class="resume-section p-4 mb-4 hover:bg-blue-50 hover:border-blue-300 border border-transparent rounded cursor-pointer transition-all duration-200"
    @click="handleClick"
  >
    <h3 class="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3">教育背景</h3>
    <div class="space-y-4">
      <div v-for="(edu, index) in data" :key="index" class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex justify-between mb-1">
            <h4 class="font-bold text-gray-800">{{ edu.schoolName }}</h4>
            <span class="text-sm text-gray-600">{{ edu.enrollmentTime }} - {{ edu.graduationTime }}</span>
          </div>
          <div class="flex gap-4 text-sm text-gray-700">
            <span>{{ edu.degree }}</span>
            <span>{{ edu.major }}</span>
            <span v-if="edu.majorScore">成绩：{{ edu.majorScore }}</span>
          </div>
          <div v-if="edu.majorCourses && edu.majorCourses.length" class="mt-1 text-xs text-gray-500">
            主修课程：{{ edu.majorCourses.join('、') }}
          </div>
        </div>
      </div>
      <div v-if="data.length === 0" class="text-gray-400 italic">
        暂无教育背景信息
      </div>
    </div>
  </div>
</template>
