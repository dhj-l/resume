<script setup lang="ts">
import type { WorkExperience } from '@/stores/type';

defineProps<{
  data?: WorkExperience[];
}>();

// TODO: 处理模块点击
const handleClick = () => {
  console.log('Work Experience clicked');
};
</script>

<template>
  <div 
    class="resume-section p-4 mb-4 hover:bg-blue-50 hover:border-blue-300 border border-transparent rounded cursor-pointer transition-all duration-200"
    @click="handleClick"
  >
    <h3 class="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3">工作经验</h3>
    <div class="space-y-4">
      <template v-if="data && data.length">
        <div v-for="(work, index) in data" :key="index">
          <div class="flex justify-between mb-1">
            <h4 class="font-bold text-gray-800">{{ work.companyName }}</h4>
            <span class="text-sm text-gray-600">
              {{ work.workTime }} 
              <span v-if="work.dismissalTime">- {{ work.dismissalTime }}</span>
            </span>
          </div>
          <div class="text-sm font-medium text-gray-700 mb-1">{{ work.position }}</div>
          <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{{ work.workDescription }}</p>
        </div>
      </template>
      <div v-else class="text-gray-400 italic">
        暂无工作经验信息
      </div>
    </div>
  </div>
</template>
