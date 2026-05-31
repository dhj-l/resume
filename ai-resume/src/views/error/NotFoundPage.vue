<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <div class="text-center space-y-6 animate-fade-in">
      <h1 class="text-9xl font-bold text-blue-600">404</h1>
      <h2 class="text-2xl font-semibold text-gray-900">页面未找到</h2>
      <p class="text-gray-500">抱歉，你访问的页面不存在或已被移除。</p>
      <a-button
        type="primary"
        size="large"
        class="!h-11 !rounded-lg !px-8 !bg-blue-600 hover:!bg-blue-700"
        @click="router.push('/')"
      >
        返回首页
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
</script>
