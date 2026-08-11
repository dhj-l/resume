<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="status === 'generating'"
      class="ai-generating-overlay z-20 flex items-center gap-4 rounded-xl border border-primary-100 bg-white/95 px-5 py-3 shadow-card backdrop-blur-sm"
      :class="sticky ? 'sticky top-4' : ''"
      role="status"
      aria-live="polite"
    >
      <!-- Lottie 动画 + 呼吸光晕 -->
      <div class="ago-lottie-wrap relative shrink-0">
        <div class="ago-halo" aria-hidden="true"></div>
        <Vue3Lottie
          :animation-link="animationLink"
          :loop="true"
          autoplay
          :speed="1"
          :width="64"
          :height="64"
          class="relative"
        />
      </div>

      <!-- 进度信息 -->
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-neutral-700">AI 正在为你生成简历</p>
        <p class="mt-0.5 truncate text-xs text-neutral-500">
          AI 正在生成：{{ label || "初始化中" }}（{{ current }}/{{ total }}）
        </p>
        <Transition
          v-if="tips.length > 0"
          mode="out-in"
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <p :key="tipText" class="mt-0.5 truncate text-xs text-primary-500">
            {{ tipText }}
          </p>
        </Transition>
        <a-progress
          :percent="percent"
          size="small"
          status="active"
          :show-info="false"
          class="mt-1.5"
        />
      </div>

      <!-- 当前/总数 -->
      <div class="shrink-0 text-right">
        <span class="text-xl font-semibold text-primary-600">{{ current }}</span>
        <span class="text-sm text-neutral-400">/{{ total }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { Vue3Lottie } from "vue3-lottie";

import { AI_GENERATING_TIPS } from "@/utils/aiTips";
import { useRotatingText } from "@/utils/useRotatingText";

interface Props {
  status: "generating" | "completed" | "failed";
  current?: number;
  total?: number;
  label?: string;
  /** Lottie 动画资源链接，默认指向 public/lottie/ai-generating.json */
  animationLink?: string;
  /** 是否 sticky 跟随滚动（编辑页预览区用 true，对比页用 false） */
  sticky?: boolean;
  /** 轮播提示语，默认使用 AI 生成主题 */
  tips?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  current: 0,
  total: 0,
  label: "",
  animationLink: "/lottie/ai-generating.json",
  sticky: true,
  tips: () => AI_GENERATING_TIPS,
});

const percent = computed(() => {
  if (!props.total) return 0;
  return Math.round((props.current / props.total) * 100);
});

const tipText = useRotatingText(props.tips, 2400);
</script>

<style scoped>
.ai-generating-overlay :deep(.ant-progress) {
  margin: 0;
}

.ago-lottie-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.ago-halo {
  position: absolute;
  inset: -30%;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(22, 119, 255, 0.3), transparent 70%);
  animation: ago-pulse 2.4s ease-in-out infinite;
  pointer-events: none;
}
@keyframes ago-pulse {
  0%,
  100% {
    transform: scale(0.9);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}
</style>
