<template>
  <div class="resume-section certificates p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border border-transparent hover:border-blue-200 rounded-sm" @click="handleClick">
    <div class="section-title border-b border-gray-300 pb-1 mb-3">
      <h3 class="text-base font-bold text-gray-800 border-l-4 border-blue-600 pl-2 leading-none">荣誉证书</h3>
    </div>

    <ul class="list-disc list-inside text-sm text-gray-700">
      <li v-for="(cert, index) in data" :key="index" class="mb-1">
        {{ cert }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: string[];
}

const props = defineProps<Props>();

const handleClick = () => {
  // TODO: 处理点击
  console.log('Certificates section clicked');
};
</script>
