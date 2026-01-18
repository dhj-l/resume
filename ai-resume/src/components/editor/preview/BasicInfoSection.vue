<template>
  <div class="resume-section basic-info p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border border-transparent hover:border-blue-200 rounded-sm" @click="handleClick">
    <div class="flex flex-col items-center">
      <h1 class="text-2xl font-bold mb-2 text-gray-900">{{ data.name }}</h1>
      <div class="text-sm text-gray-600 flex flex-wrap justify-center gap-x-4 gap-y-1">
        <span v-if="data.gender">{{ data.gender }}</span>
        <span v-if="data.workYear">{{ data.workYear }}经验</span>
        <span v-if="data.phone">{{ data.phone }}</span>
        <span v-if="data.email">{{ data.email }}</span>
        <span v-if="data.politicalStatus">{{ data.politicalStatus }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BasicInfo } from '@/stores/type';

interface Props {
  data: BasicInfo;
}

const props = defineProps<Props>();

const handleClick = () => {
  // TODO: 处理点击，激活对应编辑模块
  console.log('Basic Info section clicked');
};
</script>

<style scoped>
/* 可以在这里覆盖默认样式或添加特定样式 */
</style>
