<script setup lang="ts">
defineProps<{
  data?: string[];
  label?: string;
}>();

// TODO: 处理模块点击
const handleClick = () => {
  console.log("Certificates clicked");
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
      {{ label || "荣誉证书" }}
    </h3>
    <ul
      v-if="data && data.length"
      class="list-disc list-inside text-sm text-gray-700 space-y-1"
    >
      <li v-for="(cert, index) in data" :key="index">
        {{ cert }}
      </li>
    </ul>
    <div v-else class="text-gray-400 italic">暂无荣誉证书信息</div>
  </div>
</template>
