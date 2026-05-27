<template>
  <div class="min-h-screen w-full flex bg-white font-sans">
    <!-- Left Section: Product Value -->
    <div
      class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#f5f5f7] to-white relative overflow-hidden p-12 flex-col justify-between"
    >
      <!-- Background Decorations -->
      <div
        class="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30 transform -translate-x-1/2 translate-y-1/2"
      ></div>

      <!-- Header -->
      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-8">
          <div
            class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">大学牲简历</h1>
        </div>
        <h2 class="text-4xl font-bold text-gray-900 mb-6 leading-tight">
          打造你的未来，<br />
          <span class="text-blue-600">从一份完美的简历开始</span>
        </h2>
      </div>

      <!-- Feature List -->
      <div class="relative z-10 space-y-8">
        <div
          class="flex items-start gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm transition-transform hover:-translate-y-1 duration-300"
        >
          <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <CheckCircleOutlined class="text-xl text-blue-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-1">免费制作</h3>
            <p class="text-gray-600">使用专业模板，完全免费地制作你的简历。</p>
          </div>
        </div>

        <div
          class="flex items-start gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm transition-transform hover:-translate-y-1 duration-300 delay-100"
        >
          <div class="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <DownloadOutlined class="text-xl text-green-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-1">免费导出</h3>
            <p class="text-gray-600">以 PDF 格式下载你的简历，无任何隐藏水印或费用。</p>
          </div>
        </div>

        <div
          class="flex items-start gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm transition-transform hover:-translate-y-1 duration-300 delay-200"
        >
          <div
            class="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0"
          >
            <ThunderboltOutlined class="text-xl text-purple-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-1">AI 赋能</h3>
            <p class="text-gray-600">提供先进的 AI 功能，定价简单透明。</p>
          </div>
        </div>
      </div>

      <!-- Footer Quote -->
      <div class="relative z-10 mt-12">
        <p class="text-lg text-gray-600 font-medium">
          "几分钟内制作一份专业简历，即刻开启你的职业之旅。"
        </p>
      </div>
    </div>

    <!-- Right Section: Auth Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
      <div class="w-full max-w-[440px]">
        <router-view v-slot="{ Component }">
          <!-- <transition name="fade" mode="out-in"> -->
          <component :is="Component" />
          <!-- </transition> -->
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleOutlined, DownloadOutlined, ThunderboltOutlined } from "@ant-design/icons-vue";
</script>

<style scoped>
/* .fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.15s ease;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.15s ease;
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  transition: all 0.15s ease;
} */
</style>
