<template>
  <div class="resume-section self-evaluation p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border border-transparent hover:border-blue-200 rounded-sm" @click="handleClick">
    <div class="section-title border-b border-gray-300 pb-1 mb-3">
      <h3 class="text-base font-bold text-gray-800 border-l-4 border-blue-600 pl-2 leading-none">自我评价</h3>
    </div>

    <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
      {{ data }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: string;
}

const props = defineProps<Props>();

const handleClick = () => {
  // TODO: 处理点击
  console.log('Self Evaluation section clicked');
};
</script>
