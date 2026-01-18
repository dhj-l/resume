<script setup lang="ts">
import type { BasicInfo } from '@/stores/type';

defineProps<{
  data: BasicInfo;
}>();

// TODO: 处理模块点击
const handleClick = () => {
  console.log('Basic Info clicked');
};
</script>

<template>
  <div 
    class="resume-section p-6 hover:bg-blue-50 hover:border-blue-300 border border-transparent rounded cursor-pointer transition-all duration-200"
    @click="handleClick"
  >
    <div class="flex items-start gap-6">
      <img :src="data.avatar" alt="avatar" class="w-24 h-24 rounded object-cover bg-gray-200" />
      <div class="flex-1">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ data.name }}</h1>
        <div class="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <span>工作年限：{{ data.workYear }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span>电话：{{ data.phone }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span>邮箱：{{ data.email }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span>政治面貌：{{ data.politicalStatus }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
