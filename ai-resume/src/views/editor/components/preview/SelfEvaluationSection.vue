<script setup lang="ts">
defineProps<{
  data?: string;
}>();

// TODO: 处理模块点击
const handleClick = () => {
  console.log('Self Evaluation clicked');
};
</script>

<template>
  <div 
    class="resume-section p-4 mb-4 hover:bg-blue-50 hover:border-blue-300 border border-transparent rounded cursor-pointer transition-all duration-200"
    @click="handleClick"
  >
    <h3 class="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3">自我评价</h3>
    <p v-if="data" class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
      {{ data }}
    </p>
    <div v-else class="text-gray-400 italic">
      暂无自我评价信息
    </div>
  </div>
</template>
