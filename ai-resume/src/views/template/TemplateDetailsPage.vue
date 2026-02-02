<template>
  <div class="container mx-auto px-4 py-12 text-center">
    <h1 class="text-2xl font-bold mb-4">模板详情</h1>
    <p class="text-gray-600 mb-8">正在开发中... ID: {{ route.params.id }}</p>
    <a-button type="primary" @click="$router.push('/templates')">返回列表</a-button>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
